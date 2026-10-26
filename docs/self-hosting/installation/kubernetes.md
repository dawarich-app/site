---
sidebar_position: 5
title: Kubernetes
description: Install Dawarich on Kubernetes with plain YAML manifests, or with the community Helm chart.
---

# Kubernetes

> An **unofficial Helm chart** is available [here](https://github.com/Cogitri/charts/tree/master/charts/dawarich). For a manual installation using YAML manifests, see below.

## Prerequisites

- Kubernetes cluster and basic kubectl knowledge.
- Some persistent storage class prepared, in this example, Longhorn.
- Working Postgres and Redis instances. In this example Postgres lives in 'db' namespace and Redis in 'redis' namespace.
- Nginx ingress controller with Let's Encrypt integration.
- This example uses 'example.com' as a domain name, you want to change it to your own.
- This will work on IPv4 and IPv6 Single Stack clusters, as well as Dual Stack deployments.

## Installation

### Namespace

```bash
kubectl create namespace dawarich
```

### Secret key base

Production requires `SECRET_KEY_BASE`. Generate a random value and store it as a secret. Keep it afterwards: changing it signs everyone out and can make archived data unreadable.

```bash
kubectl create secret generic dawarich --namespace dawarich --from-literal=secret-key-base="$(openssl rand -hex 64)"
```

### Persistent volume claims

```yaml
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  namespace: dawarich
  name: public
  labels:
    storage.k8s.io/name: longhorn
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: longhorn
  resources:
    requests:
      storage: 1Gi
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  namespace: dawarich
  name: watched
  labels:
    storage.k8s.io/name: longhorn
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: longhorn
  resources:
    requests:
      storage: 1Gi
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  namespace: dawarich
  name: storage
  labels:
    storage.k8s.io/name: longhorn
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: longhorn
  resources:
    requests:
      storage: 10Gi
```

### Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: dawarich
  namespace: dawarich
  labels:
    app: dawarich
spec:
  selector:
    matchLabels:
      app: dawarich
  template:
    metadata:
      labels:
        app: dawarich
    spec:
      containers:
        - name: dawarich
          env:
            - name: TIME_ZONE
              value: "Europe/Prague"
            - name: RAILS_ENV
              value: production
            - name: SECRET_KEY_BASE
              valueFrom:
                secretKeyRef:
                  name: dawarich
                  key: secret-key-base
            - name: REDIS_URL
              value: redis://redis-master.redis.svc.cluster.local:6379/10
            - name: DATABASE_HOST
              value: postgres-postgresql.db.svc.cluster.local
            - name: DATABASE_PORT
              value: "5432"
            - name: DATABASE_USERNAME
              value: postgres
            - name: DATABASE_PASSWORD
              value: Password123!
            - name: DATABASE_NAME
              value: dawarich
            - name: APPLICATION_HOST
              value: localhost
            - name: APPLICATION_HOSTS
              value: "dawarich.example.com, localhost"
            - name: APPLICATION_PROTOCOL
              value: http
            - name: PHOTON_API_HOST
              value: photon.komoot.io
            - name: PHOTON_API_USE_HTTPS
              value: "true"
            - name: RAILS_MIN_THREADS
              value: "5"
            - name: RAILS_MAX_THREADS
              value: "10"
          image: freikin/dawarich:latest
          imagePullPolicy: Always
          volumeMounts:
            - mountPath: /var/app/public
              name: public
            - mountPath: /var/app/tmp/imports/watched
              name: watched
            - mountPath: /var/app/storage
              name: storage
          command:
            - "web-entrypoint.sh"
          args:
            - "bin/rails server -p 3000 -b ::"
          resources:
            requests:
              memory: "1Gi"
              cpu: "250m"
            limits:
              memory: "3Gi"
              cpu: "2000m"
          ports:
          - containerPort: 3000
          startupProbe:
            httpGet:
              path: /api/v1/health
              port: 3000
            periodSeconds: 10
            failureThreshold: 180
          livenessProbe:
            httpGet:
              path: /api/v1/health
              port: 3000
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 3
          readinessProbe:
            httpGet:
              path: /api/v1/health
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 10
            timeoutSeconds: 3
            failureThreshold: 3
        - name: dawarich-sidekiq
          env:
            - name: RAILS_ENV
              value: production
            - name: SECRET_KEY_BASE
              valueFrom:
                secretKeyRef:
                  name: dawarich
                  key: secret-key-base
            - name: REDIS_URL
              value: redis://redis-master.redis.svc.cluster.local:6379/10
            - name: DATABASE_HOST
              value: postgres-postgresql.db.svc.cluster.local
            - name: DATABASE_PORT
              value: "5432"
            - name: DATABASE_USERNAME
              value: postgres
            - name: DATABASE_PASSWORD
              value: Password123!
            - name: DATABASE_NAME
              value: dawarich
            - name: RAILS_MIN_THREADS
              value: "5"
            - name: RAILS_MAX_THREADS
              value: "10"
            - name: BACKGROUND_PROCESSING_CONCURRENCY
              value: "20"
            - name: APPLICATION_HOST
              value: localhost
            - name: APPLICATION_HOSTS
              value: "dawarich.example.com, localhost"
            - name: APPLICATION_PROTOCOL
              value: http
            - name: PHOTON_API_HOST
              value: photon.komoot.io
            - name: PHOTON_API_USE_HTTPS
              value: "true"
          image: freikin/dawarich:latest
          imagePullPolicy: Always
          volumeMounts:
            - mountPath: /var/app/public
              name: public
            - mountPath: /var/app/tmp/imports/watched
              name: watched
            - mountPath: /var/app/storage
              name: storage
          command:
            - "sidekiq-entrypoint.sh"
          args:
            - "bundle exec sidekiq"
          resources:
            requests:
              memory: "1Gi"
              cpu: "250m"
            limits:
              memory: "3Gi"
              cpu: "1500m"
      volumes:
        - name: public
          persistentVolumeClaim:
            claimName: public
        - name: watched
          persistentVolumeClaim:
            claimName: watched
        - name: storage
          persistentVolumeClaim:
            claimName: storage
```

### Service and Ingress

```yaml
---
apiVersion: v1
kind: Service
metadata:
  namespace: dawarich
  labels:
    service: dawarich
  name: dawarich
spec:
  ports:
    - protocol: TCP
      port: 3000
      targetPort: 3000
  selector:
    app: dawarich
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  namespace: dawarich
  name: dawarich-ingress
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/proxy-body-size: 1000m
spec:
  tls:
    - hosts:
        - dawarich.example.com
      secretName: letsencrypt-prod
  rules:
    - host: dawarich.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: dawarich
                port:
                  number: 3000
```

## Running without root

Dawarich doesn't need root. You can run both containers as an unprivileged user, with a read-only root filesystem and every Linux capability dropped. You don't need `PUID`/`PGID` for this: Kubernetes sets the volume ownership itself through `fsGroup`.

Make these changes to the Deployment above.

Add a pod-level security context:

```yaml
spec:
  template:
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        runAsGroup: 1000
        fsGroup: 1000
        fsGroupChangePolicy: OnRootMismatch
        seccompProfile:
          type: RuntimeDefault
```

Add this to **both** containers, `dawarich` and `dawarich-sidekiq`:

```yaml
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities:
              drop: [ALL]
```

With a read-only root filesystem, Dawarich still needs two scratch directories: `/var/app/tmp` for the PID file, cache, and import/export working files, and `/tmp`. Add them as `emptyDir` volumes and mount them in **both** containers, next to the existing mounts:

```yaml
          volumeMounts:
            # ...existing public, watched and storage mounts...
            - mountPath: /var/app/tmp
              name: app-tmp
            - mountPath: /tmp
              name: tmp
      volumes:
        # ...existing public, watched and storage volumes...
        - name: app-tmp
          emptyDir: {}
        - name: tmp
          emptyDir: {}
```

Nothing else under `/var/app` is written at runtime. Database migrations and seeds work with a read-only root filesystem too.

Notes:

- **`/var/app/public` must stay writable.** On every start, the web entrypoint copies the static assets from the image into it. The `public` PVC above does the job; an `emptyDir` works as well.
- **Set `runAsUser` explicitly.** The image doesn't declare a non-root `USER`, so `runAsNonRoot: true` only works together with `runAsUser`.
- **Keep `/var/app/tmp` on disk.** Large imports and exports are unpacked there. Don't set `medium: Memory` on that `emptyDir`, or a big import will count against the pod's memory limit.
- **Moving an existing installation.** Volumes written by a container that ran as root are owned by root. With `fsGroup`, Kubernetes changes their group ownership on the first mount for volume types that support it (most CSI drivers do). `OnRootMismatch` skips that step on later starts.
- **Docker and Docker Compose.** Docker has no equivalent of `fsGroup`. A new named volume takes over root ownership from the image, so a container started with `user:` can't write to it. On Docker, use the `PUID`/`PGID` variables from the default `docker-compose.yml` instead.
