import { describe, it, expect } from "vitest";
import { CELESTIAL_BODIES } from "./celestialBodies.js";

describe("CELESTIAL_BODIES", () => {
  it("keeps every mean diameter inside its own min/max range", () => {
    CELESTIAL_BODIES.filter((body) => body.minArcsec !== undefined).forEach(
      (body) => {
        expect(body.arcsec).toBeGreaterThanOrEqual(body.minArcsec);
        expect(body.arcsec).toBeLessThanOrEqual(body.maxArcsec);
      },
    );
  });

  it("is sorted from the smallest to the largest apparent diameter", () => {
    const sizes = CELESTIAL_BODIES.map((body) => body.arcsec);
    expect(sizes).toEqual([...sizes].sort((a, b) => a - b));
  });

  it("uses unique keys", () => {
    const keys = CELESTIAL_BODIES.map((body) => body.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
