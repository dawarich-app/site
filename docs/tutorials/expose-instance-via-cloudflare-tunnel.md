With a couple of edits to the docker-compose.yml file, we can expose Dawarich to the internet utilizing CloudFlare and their Zero Trust Tunnel service. This will not require any firewall configuration nor ports being opened at the firewall level. 

This guide will assume you already have a public domain, and are using CloudFlare DNS nameservers.

Login to CloudFlare, and navigate to "Zero Trust" on the left hand menu. https://one.dash.cloudflare.com/

Click on Networks, and then the submenu "Tunnels".
Create your tunnel.

![image](https://github.com/user-attachments/assets/d763cc01-c489-495a-94cf-251a2f2e2e25)

Select cloudflared for the tunnel type on the next page. 

Give your tunnel a name, and click "save tunnel". 

On the next page - we are provided with the token needed to run our connector. Click on the copy button to copy this to your clipboard. 

![image](https://github.com/user-attachments/assets/66ae10a7-8142-4183-9e14-dec65672c674)

Paste this into a text editor to clean this up. We can remove the install commands, we don't need them. We just want the tunnel token. We will come back to the token in just a moment. Let's finish CloudFlare's configuration.

Click on the Public Hostname tab, and click "add a public hostname"
You can use any subdomain you'd like. Make sure to configure the IP address and port Dawarich is running on.

![image](https://github.com/user-attachments/assets/a960a1bd-986e-40ad-9fa9-165df5923560)

Click on "additional application settings" -> and set a custom HTTP host header. 

![image](https://github.com/user-attachments/assets/d3b914bf-922f-4e33-a960-70f77ce3fa38)

Paste this into that box:

```
content_type text/css text/plain text/xml text/x-component text/javascript application/x-javascript application/javascript application/json application/manifest+json application/vnd.api+json application/xml application/xhtml+xml application/rss+xml application/atom+xml application/vnd.ms-fontobject application/x-font-ttf application/x-font-opentype application/x-font-truetype image/svg+xml image/x-icon image/vnd.microsoft.icon font/ttf font/eot font/otf font/opentype
```
Finally, click save hostname

We are going to store the CloudFlare tunnel token in an .env file. 

Create a tunnel.env file, and use the following format:

```
TUNNEL_TOKEN=CLOUDFLARE_TUNNEL_TOKEN
```

![image](https://github.com/user-attachments/assets/d2ec3205-f2a5-45dc-b966-364f00f93efb)

Now - we are ready to modify our docker-compose file. 

Add this line at row 56:
```
      RAILS_APPLICATION_CONFIG_HOSTS: ""
```

Replace localhost on line 62 with ``` "" ```
Replace localhost on line 63 with ``` "subdomain.your.tld,''" ```

Add this line to row 112:
```
      RAILS_APPLICATION_CONFIG_HOSTS: ""
```

Replace localhost on line 118 with ``` "subdomain.your.tld,''" ```
Replace localhost on line 119 with ``` "subdomain.your.tld,''" ```


Add the following towards the end of the dockerfile, right above where the volumes are defined:

```
  tunnel:
   image: cloudflare/cloudflared:latest
   command: tunnel --no-autoupdate run
   networks: 
    - dawarich
   env_file: tunnel.env
   restart: always
   container_name: tunnel
   depends_on:
    - dawarich_app
```


Finally - execute a 

```
docker compose up -d
```

Your instance should now be accessible via your public host name.

You can connect applications on mobile devices to utilize the API while away from home for better tracking. Tested on Android using OwnTracks. 
