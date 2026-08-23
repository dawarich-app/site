import { describe, it, expect } from 'vitest';
import { chooseBitrate, pickSupportedCodec } from './codecNegotiation';

describe('chooseBitrate', () => {
  it('scales with resolution and clamps to a sane range', () => {
    const portrait = chooseBitrate(1080, 1920, 30);
    expect(portrait).toBeGreaterThan(4_000_000);
    expect(portrait).toBeLessThan(16_000_000);
    expect(chooseBitrate(320, 240, 30)).toBe(4_000_000);
    expect(chooseBitrate(7680, 4320, 60)).toBe(16_000_000);
  });
});

describe('pickSupportedCodec', () => {
  const dims = { width: 1080, height: 1920, fps: 30 };

  it('prefers H.264 when everything is supported', async () => {
    const picked = await pickSupportedCodec({
      ...dims,
      isConfigSupported: async () => ({ supported: true }),
    });
    expect(picked.muxerCodec).toBe('avc');
    expect(picked.config.codec).toMatch(/^avc1\./);
    expect(picked.config.width).toBe(1080);
    expect(picked.config.height).toBe(1920);
    expect(picked.config.avc).toEqual({ format: 'avc' });
    expect(picked.config.bitrate).toBeGreaterThan(0);
  });

  it('falls through to VP9 when H.264 is unavailable', async () => {
    const picked = await pickSupportedCodec({
      ...dims,
      isConfigSupported: async (config) => ({
        supported: config.codec.startsWith('vp09'),
      }),
    });
    expect(picked.muxerCodec).toBe('vp9');
    expect(picked.config.avc).toBeUndefined();
  });

  it('treats a throwing probe as unsupported and keeps going', async () => {
    const picked = await pickSupportedCodec({
      ...dims,
      isConfigSupported: async (config) => {
        if (config.codec.startsWith('avc1')) throw new Error('bad codec string');
        return { supported: config.codec.startsWith('av01') };
      },
    });
    expect(picked.muxerCodec).toBe('av1');
  });

  it('returns null when no codec is supported', async () => {
    const picked = await pickSupportedCodec({
      ...dims,
      isConfigSupported: async () => ({ supported: false }),
    });
    expect(picked).toBeNull();
  });
});
