import { describe, it, expect } from "vitest";
import {
  ballSpherometerROC,
  reverseBallSpherometerSagitta,
  sagitta,
  sineTableAngle,
  focalRatio,
  mpccCorrection,
  mpccUndercorrection,
  mpccTargetConic,
  circleArea,
  pressure,
  comaFree,
  annularRing,
  sagittaFringes,
  foucault,
  spraySilvering,
} from "./formulas.js";

describe("ballSpherometerROC", () => {
  it("calculates ROC for concave surface with default test values", () => {
    const result = ballSpherometerROC({
      feetRadius: 40,
      sagitta: 3,
      ballDiameter: 3,
      curve: "concave",
    });
    expect(result).toBeCloseTo(269.67, 1);
  });

  it("calculates ROC for convex surface", () => {
    const result = ballSpherometerROC({
      feetRadius: 40,
      sagitta: 3,
      ballDiameter: 3,
      curve: "convex",
    });
    expect(result).toBeCloseTo(266.67, 1);
  });

  it("handles zero ball diameter", () => {
    const result = ballSpherometerROC({
      feetRadius: 40,
      sagitta: 3,
      ballDiameter: 0,
      curve: "concave",
    });
    expect(result).toBeCloseTo(268.17, 1);
  });

  it("is unit-agnostic (same ratio with different units)", () => {
    const mmResult = ballSpherometerROC({
      feetRadius: 40,
      sagitta: 3,
      ballDiameter: 3,
      curve: "concave",
    });
    const inchResult = ballSpherometerROC({
      feetRadius: 40 / 25.4,
      sagitta: 3 / 25.4,
      ballDiameter: 3 / 25.4,
      curve: "concave",
    });
    expect(mmResult / inchResult).toBeCloseTo(25.4, 3);
  });
});

describe("reverseBallSpherometerSagitta", () => {
  it("calculates sagitta for concave surface", () => {
    const result = reverseBallSpherometerSagitta({
      feetRadius: 35,
      targetROC: 2500,
      ballDiameter: 3,
      curve: "concave",
    });
    expect(result).toBeCloseTo(0.2452, 3);
  });

  it("calculates sagitta for convex surface", () => {
    const result = reverseBallSpherometerSagitta({
      feetRadius: 35,
      targetROC: 2500,
      ballDiameter: 3,
      curve: "convex",
    });
    expect(result).toBeCloseTo(0.2447, 3);
  });

  it("is inverse of ballSpherometerROC for concave", () => {
    const feetRadius = 40;
    const ballDiameter = 3;
    const curve = "concave";
    const originalSagitta = 3;

    const roc = ballSpherometerROC({
      feetRadius,
      sagitta: originalSagitta,
      ballDiameter,
      curve,
    });

    const recoveredSagitta = reverseBallSpherometerSagitta({
      feetRadius,
      targetROC: roc,
      ballDiameter,
      curve,
    });

    expect(recoveredSagitta).toBeCloseTo(originalSagitta, 5);
  });
});

describe("sagitta", () => {
  it("calculates sagitta from mirror radius and ROC", () => {
    const result = sagitta({ mirrorRadius: 100, radiusOfCurvature: 2000 });
    expect(result).toBeCloseTo(2.5, 5);
  });

  it("returns 0 when ROC is 0", () => {
    const result = sagitta({ mirrorRadius: 100, radiusOfCurvature: 0 });
    expect(result).toBe(0);
  });

  it("follows the formula r²/(2R)", () => {
    const mirrorRadius = 150;
    const roc = 3000;
    const expected = (mirrorRadius * mirrorRadius) / (2 * roc);
    const result = sagitta({ mirrorRadius, radiusOfCurvature: roc });
    expect(result).toBe(expected);
  });
});

describe("sineTableAngle", () => {
  it("calculates angle for sine table test", () => {
    const result = sineTableAngle({ cupRadius: 125, targetROC: 2500 });
    expect(result).toBeCloseTo(2.866, 2);
  });

  it("returns 90 degrees when cup radius equals ROC", () => {
    const result = sineTableAngle({ cupRadius: 100, targetROC: 100 });
    expect(result).toBeCloseTo(90, 5);
  });

  it("returns 30 degrees for 1:2 ratio", () => {
    const result = sineTableAngle({ cupRadius: 50, targetROC: 100 });
    expect(result).toBeCloseTo(30, 5);
  });
});

describe("focalRatio", () => {
  it("calculates f-ratio", () => {
    const result = focalRatio({ focalLength: 1200, diameter: 300 });
    expect(result).toBe(4);
  });

  it("handles f/2 fast telescopes", () => {
    const result = focalRatio({ focalLength: 400, diameter: 200 });
    expect(result).toBe(2);
  });
});

describe("MPCC calculations", () => {
  describe("mpccCorrection", () => {
    it("calculates correction factor", () => {
      const result = mpccCorrection({ diameter: 300, focalLength: 1200 });
      expect(result).toBeCloseTo(4.16, 1);
    });
  });

  describe("mpccUndercorrection", () => {
    it("calculates undercorrection", () => {
      const result = mpccUndercorrection({ focalLength: 1200, diameter: 300 });
      expect(result).toBeCloseTo(0.81, 2);
    });

    it("increases rapidly for faster f-ratios", () => {
      const f4 = mpccUndercorrection({ focalLength: 800, diameter: 200 });
      const f5 = mpccUndercorrection({ focalLength: 1000, diameter: 200 });
      expect(f4).toBeGreaterThan(f5);
    });
  });

  describe("mpccTargetConic", () => {
    it("calculates target conic constant", () => {
      const result = mpccTargetConic({ diameter: 300, focalLength: 1200 });
      expect(result).toBeCloseTo(-1.195, 2);
    });

    it("is more negative than -1 (hyperbolic)", () => {
      const result = mpccTargetConic({ diameter: 300, focalLength: 1200 });
      expect(result).toBeLessThan(-1);
    });
  });
});

describe("circleArea", () => {
  it("calculates area of circle", () => {
    const result = circleArea(10);
    expect(result).toBeCloseTo(Math.PI * 100, 10);
  });

  it("returns 0 for radius 0", () => {
    expect(circleArea(0)).toBe(0);
  });
});

describe("pressure calculations", () => {
  describe("totalMassForPressure", () => {
    it("calculates total mass needed for target pressure", () => {
      const result = pressure.totalMassForPressure({
        radius: 10,
        targetPressure: 30,
      });
      expect(result).toBeCloseTo(9424.78, 0);
    });

    it("is unit-agnostic (works with any consistent units)", () => {
      const cmResult = pressure.totalMassForPressure({
        radius: 10,
        targetPressure: 30,
      });
      const mmResult = pressure.totalMassForPressure({
        radius: 100,
        targetPressure: 0.3,
      });
      expect(cmResult).toBeCloseTo(mmResult, 5);
    });
  });

  describe("weightToAdd", () => {
    it("calculates weight to add when polisher is lighter", () => {
      const result = pressure.weightToAdd({
        radius: 10,
        polisherWeight: 500,
        targetPressure: 30,
      });
      expect(result).toBeCloseTo(8924.78, 0);
    });

    it("returns 0 when polisher is already heavy enough", () => {
      const result = pressure.weightToAdd({
        radius: 10,
        polisherWeight: 20000,
        targetPressure: 30,
      });
      expect(result).toBe(0);
    });
  });

  describe("actualPressure", () => {
    it("calculates actual pressure from polisher weight", () => {
      const result = pressure.actualPressure({
        radius: 10,
        polisherWeight: 9424.78,
      });
      expect(result).toBeCloseTo(30, 1);
    });

    it("returns 0 for zero radius", () => {
      const result = pressure.actualPressure({
        radius: 0,
        polisherWeight: 500,
      });
      expect(result).toBe(0);
    });
  });
});

describe("comaFree calculations", () => {
  describe("linearRadius", () => {
    it("calculates coma-free linear radius", () => {
      const result = comaFree.linearRadius({
        focalLength: 1200,
        diameter: 300,
      });
      expect(result).toBeCloseTo(1.408, 2);
    });

    it("scales with cube of f-ratio", () => {
      const f4 = comaFree.linearRadius({ focalLength: 800, diameter: 200 });
      const f8 = comaFree.linearRadius({ focalLength: 1600, diameter: 200 });
      expect(f8 / f4).toBeCloseTo(8, 1);
    });
  });

  describe("apparentField", () => {
    it("calculates apparent coma-free field", () => {
      const result = comaFree.apparentField({
        focalLength: 1200,
        diameter: 300,
      });
      expect(result).toBeCloseTo(0.0672, 3);
    });
  });

  describe("magnification", () => {
    it("calculates magnification", () => {
      const result = comaFree.magnification({
        focalLength: 1200,
        eyepieceFocalLength: 10,
      });
      expect(result).toBe(120);
    });
  });

  describe("trueFieldOfView", () => {
    it("calculates true FOV", () => {
      const result = comaFree.trueFieldOfView({
        focalLength: 1200,
        eyepieceFocalLength: 10,
        apparentFOV: 82,
      });
      expect(result).toBeCloseTo(0.683, 2);
    });
  });

  describe("inEyepiece", () => {
    it("calculates percentage of eyepiece FOV that is coma-free", () => {
      const result = comaFree.inEyepiece({
        focalLength: 1200,
        diameter: 300,
        eyepieceFocalLength: 10,
        apparentFOV: 82,
      });
      expect(result).toBeCloseTo(8.07, 1);
    });
  });
});

describe("annularRing calculations", () => {
  describe("surfaceArea", () => {
    it("calculates annular ring area", () => {
      const result = annularRing.surfaceArea({
        outerRadius: 100,
        innerRadius: 80,
      });
      const expected = Math.PI * (100 * 100 - 80 * 80);
      expect(result).toBeCloseTo(expected, 5);
    });

    it("returns 0 when radii are equal", () => {
      const result = annularRing.surfaceArea({
        outerRadius: 100,
        innerRadius: 100,
      });
      expect(result).toBe(0);
    });
  });

  describe("percentageOfTotal", () => {
    it("calculates percentage of total mirror area", () => {
      const result = annularRing.percentageOfTotal({
        outerRadius: 100,
        innerRadius: 80,
        mirrorRadius: 100,
      });
      expect(result).toBeCloseTo(36, 0);
    });
  });

  describe("percentageOfUnobstructed", () => {
    it("calculates percentage of unobstructed area", () => {
      const result = annularRing.percentageOfUnobstructed({
        outerRadius: 100,
        innerRadius: 80,
        mirrorRadius: 100,
        obstructionRadius: 20,
      });
      expect(result).toBeCloseTo(37.5, 0);
    });

    it("returns 0 when obstruction equals mirror", () => {
      const result = annularRing.percentageOfUnobstructed({
        outerRadius: 100,
        innerRadius: 80,
        mirrorRadius: 100,
        obstructionRadius: 100,
      });
      expect(result).toBe(0);
    });
  });

  describe("normalizedToMm", () => {
    it("converts normalized radius to mm", () => {
      const result = annularRing.normalizedToMm(0.95, 100);
      expect(result).toBe(95);
    });
  });
});

describe("sagittaFringes", () => {
  describe("rocFromFringes", () => {
    it("calculates ROC from fringe count", () => {
      const result = sagittaFringes.rocFromFringes({
        wavelengthNm: 550,
        contactDiameter: 200,
        concaveROC: 2000,
        fringeCount: 5,
        relativeShape: 1,
      });
      expect(result).not.toBeNaN();
      expect(result).toBeGreaterThan(0);
    });

    it("returns NaN for zero contact diameter", () => {
      const result = sagittaFringes.rocFromFringes({
        wavelengthNm: 550,
        contactDiameter: 0,
        concaveROC: 2000,
        fringeCount: 5,
        relativeShape: 1,
      });
      expect(result).toBeNaN();
    });

    it("returns NaN for zero concave ROC", () => {
      const result = sagittaFringes.rocFromFringes({
        wavelengthNm: 550,
        contactDiameter: 200,
        concaveROC: 0,
        fringeCount: 5,
        relativeShape: 1,
      });
      expect(result).toBeNaN();
    });

    it("differs for concave vs convex relative shape", () => {
      const concave = sagittaFringes.rocFromFringes({
        wavelengthNm: 550,
        contactDiameter: 200,
        concaveROC: 2000,
        fringeCount: 5,
        relativeShape: 1,
      });
      const convex = sagittaFringes.rocFromFringes({
        wavelengthNm: 550,
        contactDiameter: 200,
        concaveROC: 2000,
        fringeCount: 5,
        relativeShape: -1,
      });
      expect(concave).not.toEqual(convex);
    });
  });
});

describe("foucault calculations", () => {
  describe("longitudinalAberration", () => {
    it("calculates LA for parabola (k=-1) with moving source", () => {
      const result = foucault.longitudinalAberration({
        zoneRadius: 100,
        radiusOfCurvature: 1600,
        conicConstant: -1,
        sourceConfig: "moving",
      });
      expect(result).toBeCloseTo(3.125, 3);
    });

    it("doubles LA for fixed source vs moving", () => {
      const moving = foucault.longitudinalAberration({
        zoneRadius: 100,
        radiusOfCurvature: 1600,
        conicConstant: -1,
        sourceConfig: "moving",
      });
      const fixed = foucault.longitudinalAberration({
        zoneRadius: 100,
        radiusOfCurvature: 1600,
        conicConstant: -1,
        sourceConfig: "fixed",
      });
      expect(fixed).toBeCloseTo(moving * 2, 5);
    });

    it("returns 0 for sphere (k=0)", () => {
      const result = foucault.longitudinalAberration({
        zoneRadius: 100,
        radiusOfCurvature: 1600,
        conicConstant: 0,
        sourceConfig: "moving",
      });
      expect(result).toBeCloseTo(0, 10);
    });

    it("returns 0 for zero ROC", () => {
      const result = foucault.longitudinalAberration({
        zoneRadius: 100,
        radiusOfCurvature: 0,
        conicConstant: -1,
        sourceConfig: "moving",
      });
      expect(result).toBe(0);
    });
  });

  describe("equalAreaZoneRadius", () => {
    it("generates equal area zones", () => {
      const r1 = foucault.equalAreaZoneRadius({
        startRadius: 0,
        endRadius: 100,
        zoneIndex: 0,
        totalZones: 5,
      });
      const r5 = foucault.equalAreaZoneRadius({
        startRadius: 0,
        endRadius: 100,
        zoneIndex: 4,
        totalZones: 5,
      });
      expect(r1).toBe(0);
      expect(r5).toBe(100);
    });

    it("has equal area between consecutive zones", () => {
      const zones = [0, 1, 2, 3, 4].map((i) =>
        foucault.equalAreaZoneRadius({
          startRadius: 0,
          endRadius: 100,
          zoneIndex: i,
          totalZones: 5,
        }),
      );
      const areas = zones
        .slice(1)
        .map((r, i) => Math.PI * (r * r - zones[i] * zones[i]));
      const firstArea = areas[0];
      areas.forEach((area) => {
        expect(area).toBeCloseTo(firstArea, 5);
      });
    });
  });

  describe("linearZoneRadius", () => {
    it("generates linearly spaced zones", () => {
      const r1 = foucault.linearZoneRadius({
        startRadius: 0,
        endRadius: 100,
        zoneIndex: 0,
        totalZones: 5,
      });
      const r3 = foucault.linearZoneRadius({
        startRadius: 0,
        endRadius: 100,
        zoneIndex: 2,
        totalZones: 5,
      });
      const r5 = foucault.linearZoneRadius({
        startRadius: 0,
        endRadius: 100,
        zoneIndex: 4,
        totalZones: 5,
      });
      expect(r1).toBe(0);
      expect(r3).toBe(50);
      expect(r5).toBe(100);
    });
  });

  describe("generateZones", () => {
    it("generates correct number of zones", () => {
      const zones = foucault.generateZones({
        mirrorRadius: 100,
        radiusOfCurvature: 1600,
        conicConstant: -1,
        sourceConfig: "moving",
        startRadius: 0,
        endRadius: 100,
        numZones: 10,
        dividingMode: "equal_area",
      });
      expect(zones).toHaveLength(10);
    });

    it("caps zones at 50", () => {
      const zones = foucault.generateZones({
        mirrorRadius: 100,
        radiusOfCurvature: 1600,
        conicConstant: -1,
        sourceConfig: "moving",
        startRadius: 0,
        endRadius: 100,
        numZones: 100,
        dividingMode: "equal_area",
      });
      expect(zones).toHaveLength(50);
    });

    it("requires minimum 2 zones", () => {
      const zones = foucault.generateZones({
        mirrorRadius: 100,
        radiusOfCurvature: 1600,
        conicConstant: -1,
        sourceConfig: "moving",
        startRadius: 0,
        endRadius: 100,
        numZones: 1,
        dividingMode: "equal_area",
      });
      expect(zones).toHaveLength(2);
    });

    it("first zone has relativeLa of 0", () => {
      const zones = foucault.generateZones({
        mirrorRadius: 100,
        radiusOfCurvature: 1600,
        conicConstant: -1,
        sourceConfig: "moving",
        startRadius: 25,
        endRadius: 100,
        numZones: 10,
        dividingMode: "equal_area",
      });
      expect(zones[0].relativeLa).toBe(0);
    });
  });
});

describe("spraySilvering calculations", () => {
  describe("cleaningTimeMinutes", () => {
    it("calculates cleaning time", () => {
      const result = spraySilvering.cleaningTimeMinutes(150);
      expect(result).toBeCloseTo(Math.pow(10, 1.4), 2);
    });

    it("increases with diameter", () => {
      const small = spraySilvering.cleaningTimeMinutes(100);
      const large = spraySilvering.cleaningTimeMinutes(200);
      expect(large).toBeGreaterThan(small);
    });
  });

  describe("chemical quantities scale linearly with base quantity", () => {
    it("silverNitrate scales correctly", () => {
      expect(spraySilvering.silverNitrate(150)).toBeCloseTo(1.6, 5);
      expect(spraySilvering.silverNitrate(300)).toBeCloseTo(3.2, 5);
    });

    it("sodiumHydroxide scales correctly", () => {
      expect(spraySilvering.sodiumHydroxide(150)).toBeCloseTo(2.5, 5);
      expect(spraySilvering.sodiumHydroxide(300)).toBeCloseTo(5.0, 5);
    });

    it("sugarWater scales correctly", () => {
      expect(spraySilvering.sugarWater(150)).toBeCloseTo(300, 5);
      expect(spraySilvering.sugarWater(300)).toBeCloseTo(600, 5);
    });

    it("glucose scales correctly", () => {
      expect(spraySilvering.glucose(150)).toBeCloseTo(12, 5);
      expect(spraySilvering.glucose(300)).toBeCloseTo(24, 5);
    });

    it("firstQuantity scales correctly", () => {
      expect(spraySilvering.firstQuantity(150)).toBeCloseTo(100, 5);
      expect(spraySilvering.firstQuantity(300)).toBeCloseTo(200, 5);
    });
  });
});
