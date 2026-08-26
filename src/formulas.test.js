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
  glassSlabSphericalAberration,
  bathAstigmatism,
  sphericalAberration,
  sphericalCapVolume,
  mirrorBlank,
  fieldConverter,
  spherometerTriangle,
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

describe("sphericalAberration", () => {
  it("has no residual aberration for a perfect parabola", () => {
    const result = sphericalAberration({
      diameter: 300,
      focalLength: 1200,
      conic: -1,
    });
    expect(result.relativeToParabola).toBe(0);
  });

  it("reports the full sphere-to-parabola correction regardless of conic", () => {
    const total = sphericalAberration({
      diameter: 300,
      focalLength: 1200,
      conic: -1,
      wavelengthNm: 550,
    }).totalCorrection;
    expect(total).toBeCloseTo(4.16, 1);
  });

  it("matches the total correction at the current conic for a parabola", () => {
    const result = sphericalAberration({
      diameter: 300,
      focalLength: 1200,
      conic: -1,
    });
    expect(result.toCurrentConic).toBeCloseTo(result.totalCorrection, 6);
  });

  it("has no correction from a sphere when the conic is a sphere", () => {
    const result = sphericalAberration({
      diameter: 300,
      focalLength: 1200,
      conic: 0,
    });
    expect(result.toCurrentConic).toBe(0);
  });

  it("scales the current-conic correction with |conic|", () => {
    const hyper = sphericalAberration({
      diameter: 300,
      focalLength: 1200,
      conic: -2,
    });
    const para = sphericalAberration({
      diameter: 300,
      focalLength: 1200,
      conic: -1,
    });
    expect(hyper.toCurrentConic).toBeCloseTo(2 * para.toCurrentConic, 6);
  });

  it("matches the total correction for a sphere's residual at 550nm", () => {
    const sphere = sphericalAberration({
      diameter: 300,
      focalLength: 1200,
      conic: 0,
      wavelengthNm: 550,
    });
    expect(sphere.relativeToParabola).toBeCloseTo(sphere.totalCorrection, 6);
    expect(sphere.relativeToParabola).toBeCloseTo(4.16, 1);
  });

  it("decreases for longer wavelengths", () => {
    const green = sphericalAberration({
      diameter: 300,
      focalLength: 1200,
      conic: 0,
      wavelengthNm: 550,
    });
    const red = sphericalAberration({
      diameter: 300,
      focalLength: 1200,
      conic: 0,
      wavelengthNm: 650,
    });
    expect(red.relativeToParabola).toBeCloseTo(
      green.relativeToParabola * (550 / 650),
      4,
    );
    expect(red.totalCorrection).toBeCloseTo(
      green.totalCorrection * (550 / 650),
      4,
    );
    expect(red.relativeToParabola).toBeLessThan(green.relativeToParabola);
  });

  it("uses the magnitude of the deviation from a parabola", () => {
    const under = sphericalAberration({
      diameter: 300,
      focalLength: 1200,
      conic: 0,
    });
    const over = sphericalAberration({
      diameter: 300,
      focalLength: 1200,
      conic: -2,
    });
    expect(over.relativeToParabola).toBeCloseTo(under.relativeToParabola, 6);
  });

  it("defaults conic to -1 and wavelength to 550", () => {
    const result = sphericalAberration({ diameter: 300, focalLength: 1200 });
    expect(result.relativeToParabola).toBe(0);
    expect(result.totalCorrection).toBeCloseTo(4.16, 1);
    expect(result.toCurrentConic).toBeCloseTo(4.16, 1);
  });

  it("returns zeroes for degenerate inputs", () => {
    expect(
      sphericalAberration({ diameter: 0, focalLength: 1200, conic: 0 }),
    ).toEqual({ relativeToParabola: 0, totalCorrection: 0, toCurrentConic: 0 });
    expect(
      sphericalAberration({
        diameter: 300,
        focalLength: 1200,
        conic: 0,
        wavelengthNm: 0,
      }),
    ).toEqual({ relativeToParabola: 0, totalCorrection: 0, toCurrentConic: 0 });
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

  describe("surfacePercentage", () => {
    it("calculates the coma-free share of the eyepiece field area", () => {
      const result = comaFree.surfacePercentage({
        focalLength: 1200,
        diameter: 300,
        eyepieceFocalLength: 10,
        apparentFOV: 82,
      });
      expect(result).toBeCloseTo(0.968, 2);
    });

    it("is the square of the linear share of the field", () => {
      const args = {
        focalLength: 1200,
        diameter: 300,
        eyepieceFocalLength: 10,
        apparentFOV: 82,
      };
      const linearShare = comaFree.inEyepiece(args) / args.apparentFOV;
      expect(comaFree.surfacePercentage(args)).toBeCloseTo(
        linearShare * linearShare * 100,
        6,
      );
    });

    it("caps at 100% when the coma-free field overflows the eyepiece field", () => {
      const result = comaFree.surfacePercentage({
        focalLength: 3000,
        diameter: 150,
        eyepieceFocalLength: 40,
        apparentFOV: 50,
      });
      expect(result).toBe(100);
    });

    it("returns NaN for a degenerate eyepiece field", () => {
      const result = comaFree.surfacePercentage({
        focalLength: 1200,
        diameter: 300,
        eyepieceFocalLength: 10,
        apparentFOV: 0,
      });
      expect(result).toBeNaN();
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
    const defaultParams = {
      mirrorRadius: 100,
      radiusOfCurvature: 1600,
      conicConstant: -1,
      sourceConfig: "moving",
      numZones: 10,
      dividingMode: "equal_area",
    };

    it("numZones means intervals, so n zones produces n+1 boundary points", () => {
      const zones = foucault.generateZones(defaultParams);
      expect(zones).toHaveLength(11);
    });

    it("caps at 50 zones (51 boundary points)", () => {
      const zones = foucault.generateZones({ ...defaultParams, numZones: 100 });
      expect(zones).toHaveLength(51);
    });

    it("requires minimum 1 zone (2 boundary points)", () => {
      const zones = foucault.generateZones({ ...defaultParams, numZones: 1 });
      expect(zones).toHaveLength(2);
    });

    it("first zone has relativeLa of 0", () => {
      const zones = foucault.generateZones(defaultParams);
      expect(zones[0].relativeLa).toBe(0);
    });

    it("relativeLa is the difference between consecutive zones", () => {
      const zones = foucault.generateZones(defaultParams);
      for (let i = 1; i < zones.length; i++) {
        expect(zones[i].relativeLa).toBeCloseTo(zones[i].la - zones[i - 1].la);
      }
    });

    it("zones span from 0 to mirrorRadius", () => {
      const zones = foucault.generateZones(defaultParams);
      expect(zones[0].radiusMm).toBe(0);
      expect(zones[zones.length - 1].radiusMm).toBe(100);
    });

    it("hm is the midpoint between consecutive zone radii", () => {
      const zones = foucault.generateZones(defaultParams);
      expect(zones[0].hm).toBe(zones[0].radiusMm / 2);
      for (let i = 1; i < zones.length; i++) {
        expect(zones[i].hm).toBeCloseTo(
          (zones[i - 1].radiusMm + zones[i].radiusMm) / 2,
        );
      }
    });

    it("computes hmSqOverR and hmOverTwoR from hm and ROC", () => {
      const zones = foucault.generateZones(defaultParams);
      const R = defaultParams.radiusOfCurvature;
      for (const zone of zones) {
        expect(zone.hmSqOverR).toBeCloseTo((zone.hm * zone.hm) / R);
        expect(zone.hmOverTwoR).toBeCloseTo(zone.hm / (2 * R));
      }
    });
  });

  describe("generateMaskSvg", () => {
    const zones = foucault.generateZones({
      mirrorRadius: 100,
      radiusOfCurvature: 1600,
      conicConstant: -1,
      sourceConfig: "moving",
      numZones: 5,
      dividingMode: "equal_area",
    });

    it("returns valid SVG wrapper", () => {
      const svg = foucault.generateMaskSvg({ mirrorDiameter: 200, zones });
      expect(svg).toMatch(/^<svg xmlns/);
      expect(svg).toMatch(/<\/svg>$/);
      expect(svg).toContain('width="');
      expect(svg).toContain('mm"');
    });

    it("contains mirror outline circle at correct radius", () => {
      const svg = foucault.generateMaskSvg({ mirrorDiameter: 200, zones });
      expect(svg).toContain('r="100"');
    });

    it("contains three cut lines with inward red guides on top/bottom only", () => {
      const svg = foucault.generateMaskSvg({ mirrorDiameter: 200, zones });
      const allLines = svg.match(/<line /g);
      expect(allLines).toHaveLength(6);
      const redLines = svg.match(/<line [^>]*stroke="red"/g);
      expect(redLines).toHaveLength(2);
    });

    it("draws central zone as polygon with dotted circle and red guides", () => {
      const svg = foucault.generateMaskSvg({ mirrorDiameter: 200, zones });
      const redPaths = svg.match(/<path [^>]*stroke="red"/g);
      expect(redPaths).toHaveLength(1);
      const nonZeroZones = zones.filter((z) => z.radiusMm > 0);
      const dottedCircles = svg.match(
        /stroke="#000"[^/]*stroke-dasharray="[^"]*"\/>/g,
      );
      expect(dottedCircles.length).toBe(nonZeroZones.length);
    });

    it("central zone has outward red circle, other zones have both red circles", () => {
      const svg = foucault.generateMaskSvg({ mirrorDiameter: 200, zones });
      const nonZeroZones = zones.filter((z) => z.radiusMm > 0);
      const redCircles = svg.match(/<circle [^>]*stroke="red"/g);
      expect(redCircles.length).toBe(1 + (nonZeroZones.length - 1) * 2);
    });

    it("offset lines are tangent to first zone hm circle", () => {
      const svg = foucault.generateMaskSvg({ mirrorDiameter: 200, zones });
      const firstHm = zones.find((z) => z.hm > 0).hm;
      const margin = 200 * 0.08;
      const cy = (200 + margin * 2) / 2;
      const expectedY1 = cy - firstHm;
      const expectedY2 = cy + firstHm;
      expect(svg).toContain(`y1="${expectedY1}"`);
      expect(svg).toContain(`y1="${expectedY2}"`);
    });
  });
});

describe("glassSlabSphericalAberration", () => {
  it("calculates spherical aberration for known values", () => {
    const result = glassSlabSphericalAberration({
      thickness: 7,
      refractiveIndex: 1.51,
      fNumber: 7.8,
    });
    expect(result).toBeCloseTo(-5.493165898557691e-6, 10);
  });

  it("returns 0 for zero thickness", () => {
    const result = glassSlabSphericalAberration({
      thickness: 0,
      refractiveIndex: 1.51,
      fNumber: 7.8,
    });
    expect(result).toBeCloseTo(0, 10);
  });

  it("is always negative (overcorrection)", () => {
    const result = glassSlabSphericalAberration({
      thickness: 10,
      refractiveIndex: 1.5,
      fNumber: 5,
    });
    expect(result).toBeLessThan(0);
  });

  it("scales linearly with thickness", () => {
    const single = glassSlabSphericalAberration({
      thickness: 5,
      refractiveIndex: 1.5,
      fNumber: 6,
    });
    const double = glassSlabSphericalAberration({
      thickness: 10,
      refractiveIndex: 1.5,
      fNumber: 6,
    });
    expect(double / single).toBeCloseTo(2, 10);
  });
});

describe("bathAstigmatism", () => {
  it("matches DFTFringe reference implementation", () => {
    const result = bathAstigmatism({
      mirrorDiameter: 300,
      beamSeparation: 5,
      radiusOfCurvature: 3000,
      wavelengthNm: 550,
    });
    const valMm = (300 * 300 * 5 * 5) / (32 * 3000 * 3000 * 3000);
    const expected = (valMm * 1e6) / 550;
    expect(result).toBeCloseTo(expected, 10);
  });

  it("returns 0 for zero ROC", () => {
    const result = bathAstigmatism({
      mirrorDiameter: 300,
      beamSeparation: 20,
      radiusOfCurvature: 0,
      wavelengthNm: 550,
    });
    expect(result).toBe(0);
  });

  it("returns 0 for zero beam separation", () => {
    const result = bathAstigmatism({
      mirrorDiameter: 300,
      beamSeparation: 0,
      radiusOfCurvature: 3000,
      wavelengthNm: 550,
    });
    expect(result).toBe(0);
  });

  it("scales with square of beam separation", () => {
    const single = bathAstigmatism({
      mirrorDiameter: 300,
      beamSeparation: 10,
      radiusOfCurvature: 3000,
      wavelengthNm: 550,
    });
    const double = bathAstigmatism({
      mirrorDiameter: 300,
      beamSeparation: 20,
      radiusOfCurvature: 3000,
      wavelengthNm: 550,
    });
    expect(double / single).toBeCloseTo(4, 10);
  });

  it("returns 0 for zero wavelength", () => {
    const result = bathAstigmatism({
      mirrorDiameter: 300,
      beamSeparation: 20,
      radiusOfCurvature: 3000,
      wavelengthNm: 0,
    });
    expect(result).toBe(0);
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

describe("sphericalCapVolume", () => {
  it("is zero for a flat surface (no sagitta)", () => {
    expect(sphericalCapVolume({ baseRadius: 100, sagitta: 0 })).toBe(0);
  });

  it("matches the closed form for a hemisphere", () => {
    const R = 50;
    const hemisphere = (2 / 3) * Math.PI * R * R * R;
    expect(sphericalCapVolume({ baseRadius: R, sagitta: R })).toBeCloseTo(
      hemisphere,
      6,
    );
  });

  it("approaches half the enclosing cylinder for a shallow cap", () => {
    const a = 150;
    const R = 3000;
    const h = R - Math.sqrt(R * R - a * a);
    const cap = sphericalCapVolume({ baseRadius: a, sagitta: h });
    const cylinder = Math.PI * a * a * h;
    expect(cap / cylinder).toBeCloseTo(0.5, 1);
  });
});

describe("mirrorBlank", () => {
  describe("exactSagitta", () => {
    it("returns 0 for a flat surface", () => {
      expect(
        mirrorBlank.exactSagitta({ diameter: 200, radiusOfCurvature: 0 }),
      ).toBe(0);
    });

    it("computes the sagitta of a spherical surface", () => {
      const R = 2400;
      const r = 150;
      const expected = R - Math.sqrt(R * R - r * r);
      expect(
        mirrorBlank.exactSagitta({ diameter: 300, radiusOfCurvature: R }),
      ).toBeCloseTo(expected, 9);
    });

    it("is sign-agnostic on the radius of curvature", () => {
      const positive = mirrorBlank.exactSagitta({
        diameter: 300,
        radiusOfCurvature: 2400,
      });
      const negative = mirrorBlank.exactSagitta({
        diameter: 300,
        radiusOfCurvature: -2400,
      });
      expect(positive).toBeCloseTo(negative, 12);
    });

    it("returns NaN when the radius is smaller than the mirror radius", () => {
      expect(
        mirrorBlank.exactSagitta({ diameter: 300, radiusOfCurvature: 100 }),
      ).toBeNaN();
    });
  });

  describe("frontRadiusOfCurvature", () => {
    it("is twice the focal length regardless of sign", () => {
      expect(mirrorBlank.frontRadiusOfCurvature({ focalLength: 1200 })).toBe(
        2400,
      );
      expect(mirrorBlank.frontRadiusOfCurvature({ focalLength: -300 })).toBe(
        600,
      );
    });
  });

  describe("volume", () => {
    it("is a plain cylinder when both faces are flat", () => {
      const r = 100;
      const t = 25;
      expect(
        mirrorBlank.volume({
          diameter: 200,
          edgeThickness: 25,
          focalLength: 0,
          backRadius: 0,
        }),
      ).toBeCloseTo(Math.PI * r * r * t, 6);
    });

    it("removes glass for a concave front (positive focal length)", () => {
      const flat = mirrorBlank.volume({
        diameter: 300,
        edgeThickness: 30,
        focalLength: 0,
        backRadius: 0,
      });
      const concave = mirrorBlank.volume({
        diameter: 300,
        edgeThickness: 30,
        focalLength: 1200,
        backRadius: 0,
      });
      expect(concave).toBeLessThan(flat);
    });

    it("adds glass for a convex front (negative focal length)", () => {
      const flat = mirrorBlank.volume({
        diameter: 300,
        edgeThickness: 30,
        focalLength: 0,
        backRadius: 0,
      });
      const convex = mirrorBlank.volume({
        diameter: 300,
        edgeThickness: 30,
        focalLength: -1200,
        backRadius: 0,
      });
      expect(convex).toBeGreaterThan(flat);
    });

    it("removes exactly the dished cap volume for a concave front", () => {
      const r = 150;
      const t = 30;
      const R = 2400;
      const sf = R - Math.sqrt(R * R - r * r);
      const cap = sphericalCapVolume({ baseRadius: r, sagitta: sf });
      const cylinder = Math.PI * r * r * t;
      expect(
        mirrorBlank.volume({
          diameter: 300,
          edgeThickness: 30,
          focalLength: 1200,
          backRadius: 0,
        }),
      ).toBeCloseTo(cylinder - cap, 6);
    });

    it("treats a convex back (positive radius) as added glass", () => {
      const flat = mirrorBlank.volume({
        diameter: 300,
        edgeThickness: 30,
        focalLength: 0,
        backRadius: 0,
      });
      const convexBack = mirrorBlank.volume({
        diameter: 300,
        edgeThickness: 30,
        focalLength: 0,
        backRadius: 3000,
      });
      const concaveBack = mirrorBlank.volume({
        diameter: 300,
        edgeThickness: 30,
        focalLength: 0,
        backRadius: -3000,
      });
      expect(convexBack).toBeGreaterThan(flat);
      expect(concaveBack).toBeLessThan(flat);
    });
  });

  describe("centerThickness", () => {
    it("equals edge thickness for a flat blank", () => {
      expect(
        mirrorBlank.centerThickness({
          diameter: 300,
          edgeThickness: 30,
          focalLength: 0,
          backRadius: 0,
        }),
      ).toBeCloseTo(30, 9);
    });

    it("thins the center for a concave front", () => {
      const r = 150;
      const R = 2400;
      const sf = R - Math.sqrt(R * R - r * r);
      expect(
        mirrorBlank.centerThickness({
          diameter: 300,
          edgeThickness: 30,
          focalLength: 1200,
          backRadius: 0,
        }),
      ).toBeCloseTo(30 - sf, 9);
    });
  });

  describe("weight", () => {
    it("computes grams from volume and density", () => {
      const density = 2.23;
      const volumeMm3 = mirrorBlank.volume({
        diameter: 300,
        edgeThickness: 30,
        focalLength: 1200,
        backRadius: 0,
      });
      expect(
        mirrorBlank.weight({
          diameter: 300,
          edgeThickness: 30,
          focalLength: 1200,
          backRadius: 0,
          density,
        }),
      ).toBeCloseTo((volumeMm3 / 1000) * density, 6);
    });

    it("gives a sensible mass for a classic 300mm f/4 Pyrex blank", () => {
      const grams = mirrorBlank.weight({
        diameter: 300,
        edgeThickness: 30,
        focalLength: 1200,
        backRadius: 0,
        density: 2.23,
      });
      expect(grams).toBeGreaterThan(3500);
      expect(grams).toBeLessThan(5000);
    });
  });
});

describe("spherometerTriangle", () => {
  const measured = {
    outsideA: 170.995,
    outsideB: 63.975,
    outsideC: 171.035,
    ballDiameter: 4,
  };

  describe("footCenterDistances", () => {
    it("removes one ball diameter from each outside-to-outside measurement", () => {
      expect(spherometerTriangle.footCenterDistances(measured)).toEqual({
        a: 166.995,
        b: 59.975,
        c: 167.035,
      });
    });
  });

  describe("area", () => {
    it("computes the triangle area from the foot center distances", () => {
      const result = spherometerTriangle.area({
        a: 166.995,
        b: 59.975,
        c: 167.035,
      });
      expect(result).toBeCloseTo(4926.97, 2);
    });

    it("matches the closed form for an equilateral triangle", () => {
      const side = 100;
      const result = spherometerTriangle.area({ a: side, b: side, c: side });
      expect(result).toBeCloseTo((Math.sqrt(3) / 4) * side * side, 9);
    });

    it("returns NaN for a degenerate triangle", () => {
      expect(spherometerTriangle.area({ a: 100, b: 50, c: 50 })).toBeNaN();
    });

    it("returns NaN when a distance is not positive", () => {
      expect(spherometerTriangle.area({ a: 100, b: 60, c: 0 })).toBeNaN();
    });
  });

  describe("circumradius", () => {
    it("returns half the hypotenuse for a right triangle", () => {
      expect(
        spherometerTriangle.circumradius({ a: 3, b: 4, c: 5 }),
      ).toBeCloseTo(2.5, 12);
    });

    it("returns side / sqrt(3) for an equilateral triangle", () => {
      const side = 138.564;
      expect(
        spherometerTriangle.circumradius({ a: side, b: side, c: side }),
      ).toBeCloseTo(side / Math.sqrt(3), 9);
    });
  });

  describe("feetRadius", () => {
    it("reproduces the reference spreadsheet result", () => {
      expect(spherometerTriangle.feetRadius(measured)).toBeCloseTo(84.88703, 5);
    });

    it("is insensitive to the ordering of the three measurements", () => {
      const reference = spherometerTriangle.feetRadius(measured);
      const permuted = spherometerTriangle.feetRadius({
        outsideA: measured.outsideC,
        outsideB: measured.outsideA,
        outsideC: measured.outsideB,
        ballDiameter: measured.ballDiameter,
      });
      expect(permuted).toBeCloseTo(reference, 12);
    });

    it("agrees with the equilateral case used by the spherometer calculators", () => {
      const feetRadius = 80;
      const side = feetRadius * Math.sqrt(3);
      const ballDiameter = 4;
      const result = spherometerTriangle.feetRadius({
        outsideA: side + ballDiameter,
        outsideB: side + ballDiameter,
        outsideC: side + ballDiameter,
        ballDiameter,
      });
      expect(result).toBeCloseTo(feetRadius, 9);
    });

    it("returns NaN when the three feet are aligned", () => {
      expect(
        spherometerTriangle.feetRadius({
          outsideA: 104,
          outsideB: 54,
          outsideC: 54,
          ballDiameter: 4,
        }),
      ).toBeNaN();
    });
  });

  describe("sensitivity", () => {
    it("reports the worst-case radius deviation for a measurement error", () => {
      const result = spherometerTriangle.sensitivity({
        ...measured,
        delta: 0.001,
      });
      expect(result).toBeCloseTo(0.000538, 6);
    });

    it("grows as the triangle flattens", () => {
      const flat = spherometerTriangle.sensitivity({
        outsideA: 103,
        outsideB: 54,
        outsideC: 54,
        ballDiameter: 4,
        delta: 0.001,
      });
      const balanced = spherometerTriangle.sensitivity({
        outsideA: 104,
        outsideB: 104,
        outsideC: 104,
        ballDiameter: 4,
        delta: 0.001,
      });
      expect(flat).toBeGreaterThan(balanced);
    });

    it("returns NaN for a degenerate triangle", () => {
      expect(
        spherometerTriangle.sensitivity({
          outsideA: 104,
          outsideB: 54,
          outsideC: 54,
          ballDiameter: 4,
          delta: 0.001,
        }),
      ).toBeNaN();
    });
  });
});

describe("fieldConverter", () => {
  describe("tfovFromHeight", () => {
    it("converts a field height to a true field of view angle", () => {
      const result = fieldConverter.tfovFromHeight({
        fieldHeightMm: 27,
        focalLength: 1200,
      });
      expect(result).toBeCloseTo(1.2887, 3);
    });

    it("matches the small-angle approximation (height / F in radians)", () => {
      const focalLength = 2000;
      const fieldHeightMm = 5;
      const exact = fieldConverter.tfovFromHeight({
        fieldHeightMm,
        focalLength,
      });
      const approx = (fieldHeightMm / focalLength) * (180 / Math.PI);
      expect(exact).toBeCloseTo(approx, 3);
    });

    it("returns 0 for a non-positive focal length", () => {
      expect(
        fieldConverter.tfovFromHeight({ fieldHeightMm: 27, focalLength: 0 }),
      ).toBe(0);
    });
  });

  describe("heightFromTfov", () => {
    it("converts a true field of view angle to a field height", () => {
      const result = fieldConverter.heightFromTfov({
        tfovDegrees: 1.288732,
        focalLength: 1200,
      });
      expect(result).toBeCloseTo(27, 1);
    });

    it("returns 0 for a non-positive focal length", () => {
      expect(
        fieldConverter.heightFromTfov({ tfovDegrees: 1.5, focalLength: 0 }),
      ).toBe(0);
    });
  });

  describe("round-trip", () => {
    it("is its own inverse across the two directions", () => {
      const focalLength = 1500;
      const fieldHeightMm = 22;
      const tfov = fieldConverter.tfovFromHeight({
        fieldHeightMm,
        focalLength,
      });
      const back = fieldConverter.heightFromTfov({
        tfovDegrees: tfov,
        focalLength,
      });
      expect(back).toBeCloseTo(fieldHeightMm, 6);
    });
  });
});
