// Vitest conversion of the app's spec/javascript/poster_order_client_test.mjs
// (node:test → describe/it/expect), running against the vendored shim whose
// error strings are local English text instead of i18n keys.
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { submitPrintOrder } from './ui/order_client';

class FakeXhr {
  static instances = [];

  constructor() {
    FakeXhr.instances.push(this);
    this.listeners = {};
    this.uploadListeners = {};
    this.responseType = '';
    this.upload = {
      addEventListener: (type, handler) => {
        this.uploadListeners[type] = handler;
      },
    };
  }

  open(method, url) {
    this.method = method;
    this.url = url;
  }

  addEventListener(type, handler) {
    this.listeners[type] = handler;
  }

  send(body) {
    this.body = body;
  }

  respond(status, response) {
    this.status = status;
    this.response = response;
    this.listeners.load();
  }

  failNetwork() {
    this.listeners.error();
  }

  emitUploadProgress(loaded, total) {
    this.uploadListeners.progress?.({ lengthComputable: true, loaded, total });
  }
}

const realXhr = globalThis.XMLHttpRequest;

beforeEach(() => {
  FakeXhr.instances = [];
  globalThis.XMLHttpRequest = FakeXhr;
});

afterEach(() => {
  globalThis.XMLHttpRequest = realXhr;
});

const orderParams = () => ({
  url: 'https://prints.example.com/api/orders',
  blob: new Blob(['%PDF-fake'], { type: 'application/pdf' }),
  sku: 'print-30x40',
  title: 'Berlin',
  themeBase: 'blueprint',
  layoutId: 'print-30x40',
});

describe('submitPrintOrder', () => {
  it('posts the order form and resolves token + checkout url', async () => {
    const promise = submitPrintOrder(orderParams());
    const xhr = FakeXhr.instances[0];

    expect(xhr.method).toBe('POST');
    expect(xhr.url).toBe('https://prints.example.com/api/orders');
    expect(xhr.body).toBeInstanceOf(FormData);
    expect(xhr.body.get('sku')).toBe('print-30x40');
    expect(xhr.body.get('title')).toBe('Berlin');
    expect(xhr.body.get('theme_base')).toBe('blueprint');
    expect(xhr.body.get('layout_id')).toBe('print-30x40');
    expect(xhr.body.get('file').name).toBe('poster.pdf');

    xhr.respond(201, { token: 'tok123', checkout_url: 'https://stripe.example.com/session' });
    await expect(promise).resolves.toEqual({
      token: 'tok123',
      checkoutUrl: 'https://stripe.example.com/session',
    });
  });

  it('reports upload progress fractions', async () => {
    const fractions = [];
    const promise = submitPrintOrder({
      ...orderParams(),
      onProgress: (fraction) => fractions.push(fraction),
    });
    const xhr = FakeXhr.instances[0];

    xhr.emitUploadProgress(5, 10);
    xhr.emitUploadProgress(10, 10);
    xhr.respond(201, { token: 't', checkout_url: 'u' });
    await promise;

    expect(fractions).toEqual([0.5, 1]);
  });

  it('maps known error codes to friendly messages', async () => {
    const promise = submitPrintOrder(orderParams());
    FakeXhr.instances[0].respond(422, { error: 'too_large' });

    await expect(promise).rejects.toThrow(/50 MB max/);
  });

  it('falls back to a generic message for unknown errors', async () => {
    const promise = submitPrintOrder(orderParams());
    FakeXhr.instances[0].respond(500, null);

    await expect(promise).rejects.toThrow(/Order upload failed/);
  });

  it('rejects with a connection message on network failure', async () => {
    const promise = submitPrintOrder(orderParams());
    FakeXhr.instances[0].failNetwork();

    await expect(promise).rejects.toThrow(/Could not reach the order service/);
  });
});
