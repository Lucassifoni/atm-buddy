import { describe, it, expect, beforeEach } from "vitest";
import {
  units,
  MM_PER_INCH,
  GRAMS_PER_POUND,
  G_CM2_PER_PSI,
} from "./useUnits.js";

describe("useUnits", () => {
  beforeEach(() => {
    units.setUnit("metric");
  });

  describe("unit switching", () => {
    it("defaults to metric", () => {
      expect(units.current).toBe("metric");
      expect(units.isMetric).toBe(true);
    });

    it("switches to imperial", () => {
      units.setUnit("imperial");
      expect(units.current).toBe("imperial");
      expect(units.isMetric).toBe(false);
    });

    it("ignores invalid units", () => {
      units.setUnit("invalid");
      expect(units.current).toBe("metric");
    });
  });

  describe("length conversion", () => {
    it("returns mm rounded to 2 decimals in metric mode", () => {
      expect(units.convert.lengthToDisplay(25.4)).toBe(25.4);
      expect(units.convert.lengthToDisplay(25.456)).toBe(25.46);
      expect(units.convert.lengthFromDisplay(25.4)).toBe(25.4);
    });

    it("converts mm to inches rounded to 3 decimals in imperial mode", () => {
      units.setUnit("imperial");
      expect(units.convert.lengthToDisplay(25.4)).toBe(1);
      expect(units.convert.lengthToDisplay(50.8)).toBe(2);
    });

    it("converts inches to mm in imperial mode", () => {
      units.setUnit("imperial");
      expect(units.convert.lengthFromDisplay(1)).toBeCloseTo(25.4, 5);
      expect(units.convert.lengthFromDisplay(2)).toBeCloseTo(50.8, 5);
    });

    it("round-trips correctly within rounding precision", () => {
      units.setUnit("imperial");
      const original = 100;
      const displayed = units.convert.lengthToDisplay(original);
      const recovered = units.convert.lengthFromDisplay(displayed);
      expect(recovered).toBeCloseTo(original, 1);
    });

    it("returns correct unit label", () => {
      expect(units.convert.lengthUnit()).toBe("mm");
      units.setUnit("imperial");
      expect(units.convert.lengthUnit()).toBe("in");
    });
  });

  describe("mass conversion", () => {
    it("returns grams rounded to 0 decimals in metric mode", () => {
      expect(units.convert.massToDisplay(453.592)).toBe(454);
      expect(units.convert.massToDisplay(100)).toBe(100);
      expect(units.convert.massFromDisplay(453.592)).toBe(453.592);
    });

    it("converts grams to pounds rounded to 2 decimals in imperial mode", () => {
      units.setUnit("imperial");
      expect(units.convert.massToDisplay(453.592)).toBe(1);
      expect(units.convert.massToDisplay(907.184)).toBe(2);
    });

    it("converts pounds to grams in imperial mode", () => {
      units.setUnit("imperial");
      expect(units.convert.massFromDisplay(1)).toBeCloseTo(453.592, 3);
      expect(units.convert.massFromDisplay(2)).toBeCloseTo(907.184, 3);
    });

    it("returns correct unit label", () => {
      expect(units.convert.massUnit()).toBe("g");
      units.setUnit("imperial");
      expect(units.convert.massUnit()).toBe("lb");
    });
  });

  describe("pressure conversion", () => {
    it("returns g/cm² rounded to 1 decimal in metric mode", () => {
      expect(units.convert.pressureToDisplay(30)).toBe(30);
      expect(units.convert.pressureToDisplay(30.55)).toBe(30.6);
      expect(units.convert.pressureFromDisplay(30)).toBe(30);
    });

    it("converts g/cm² to psi rounded to 2 decimals in imperial mode", () => {
      units.setUnit("imperial");
      expect(units.convert.pressureToDisplay(70.307)).toBe(1);
      expect(units.convert.pressureToDisplay(140.614)).toBe(2);
    });

    it("converts psi to g/cm² in imperial mode", () => {
      units.setUnit("imperial");
      expect(units.convert.pressureFromDisplay(1)).toBeCloseTo(70.307, 3);
      expect(units.convert.pressureFromDisplay(2)).toBeCloseTo(140.614, 3);
    });

    it("returns correct unit label", () => {
      expect(units.convert.pressureUnit()).toBe("g/cm²");
      units.setUnit("imperial");
      expect(units.convert.pressureUnit()).toBe("psi");
    });
  });

  describe("formatting", () => {
    it("formats length with 2 decimals in metric", () => {
      expect(units.convert.formatLength(123.456)).toBe("123.46");
    });

    it("formats length with 3 decimals in imperial", () => {
      units.setUnit("imperial");
      expect(units.convert.formatLength(25.4)).toBe("1.000");
    });

    it("formats mass with 0 decimals in metric", () => {
      expect(units.convert.formatMass(123.456)).toBe("123");
    });

    it("formats mass with 2 decimals in imperial", () => {
      units.setUnit("imperial");
      expect(units.convert.formatMass(453.592)).toBe("1.00");
    });

    it("formats pressure with 1 decimal in metric", () => {
      expect(units.convert.formatPressure(30.55)).toBe("30.6");
    });

    it("formats pressure with 2 decimals in imperial", () => {
      units.setUnit("imperial");
      expect(units.convert.formatPressure(70.307)).toBe("1.00");
    });
  });

  describe("conversion constants", () => {
    it("exports correct conversion factors", () => {
      expect(MM_PER_INCH).toBe(25.4);
      expect(GRAMS_PER_POUND).toBe(453.592);
      expect(G_CM2_PER_PSI).toBeCloseTo(70.307, 3);
    });
  });
});
