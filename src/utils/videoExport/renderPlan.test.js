import { describe, it, expect } from 'vitest';
import { buildRenderPlan, frameFraction } from './renderPlan';

describe('buildRenderPlan', () => {
  it('derives frame counts from duration and fps', () => {
    const plan = buildRenderPlan({ durationSec: 15, fps: 30 });
    expect(plan.totalFrames).toBe(450);
    expect(plan.fps).toBe(30);
    expect(plan.introFrames + plan.outroFrames).toBeLessThan(plan.totalFrames);
  });

  it('holds the summary frame for the last three seconds by default', () => {
    const plan = buildRenderPlan({ durationSec: 15, fps: 30 });
    expect(plan.outroFrames).toBe(90);
  });

  it('shrinks the holds when the video is too short to fit them', () => {
    const plan = buildRenderPlan({ durationSec: 1, fps: 30, introHoldSec: 0.6, outroHoldSec: 1.8 });
    expect(plan.totalFrames).toBe(30);
    expect(plan.introFrames + plan.outroFrames).toBeLessThan(30);
    expect(frameFraction(plan, 29)).toBe(1);
  });
});

describe('frameFraction', () => {
  const plan = buildRenderPlan({ durationSec: 15, fps: 30, introHoldSec: 1, outroHoldSec: 2 });

  it('holds at zero through the intro', () => {
    expect(frameFraction(plan, 0)).toBe(0);
    expect(frameFraction(plan, plan.introFrames - 1)).toBe(0);
  });

  it('holds at one through the outro and the final frame', () => {
    expect(frameFraction(plan, plan.totalFrames - plan.outroFrames)).toBe(1);
    expect(frameFraction(plan, plan.totalFrames - 1)).toBe(1);
  });

  it('reaches one half at the middle of the draw phase', () => {
    const drawFrames = plan.totalFrames - plan.introFrames - plan.outroFrames;
    const mid = plan.introFrames + drawFrames / 2;
    expect(frameFraction(plan, mid)).toBeCloseTo(0.5, 5);
  });

  it('never decreases from one frame to the next', () => {
    let last = -1;
    for (let i = 0; i < plan.totalFrames; i += 1) {
      const f = frameFraction(plan, i);
      expect(f).toBeGreaterThanOrEqual(last);
      last = f;
    }
  });

  it('clamps frame indexes outside the plan', () => {
    expect(frameFraction(plan, -5)).toBe(0);
    expect(frameFraction(plan, plan.totalFrames + 5)).toBe(1);
  });
});
