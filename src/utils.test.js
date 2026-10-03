import { describe, it, expect, beforeEach } from "vitest";

const store = new Map();

globalThis.window = globalThis.window || {};
globalThis.localStorage = {
  getItem: (key) => (store.has(key) ? store.get(key) : null),
  setItem: (key, value) => store.set(key, String(value)),
  removeItem: (key) => store.delete(key),
  clear: () => store.clear(),
};

const {
  get,
  set,
  normalize,
  parseFloat,
  getHardware,
  getSpherometers,
  routeTitle,
  formatArcSize,
} = await import("./utils.js");

const stored = (storageKey) => JSON.parse(localStorage.getItem(storageKey));

describe("normalize", () => {
  it("turns a decimal comma into a decimal point", () => {
    expect(normalize("12,5")).toBe("12.5");
  });

  it("accepts numbers", () => {
    expect(normalize(12.5)).toBe("12.5");
  });
});

describe("parseFloat", () => {
  it("parses comma-separated decimals", () => {
    expect(parseFloat("12,5")).toBe(12.5);
  });

  it("returns 0 for unparseable input", () => {
    expect(parseFloat("abc")).toBe(0);
  });
});

describe("get / set", () => {
  beforeEach(() => {
    store.clear();
  });

  it("assigns the value on the component", () => {
    const component = { diameter: "300" };
    set(component, "__test", { diameter: "300" }, "diameter", "250");
    expect(component.diameter).toBe("250");
  });

  it("persists the new value under the edited key", () => {
    const component = { diameter: "300" };
    set(component, "__test", { diameter: "300" }, "diameter", "250");
    expect(stored("__test").diameter).toBe("250");
  });

  it("does not persist a literal `key` entry", () => {
    const component = { diameter: "300" };
    set(component, "__test", { diameter: "300" }, "diameter", "250");
    expect(stored("__test")).not.toHaveProperty("key");
  });

  it("keeps the other keys of the snapshot", () => {
    const component = { diameter: "300", thickness: "25" };
    set(
      component,
      "__test",
      { diameter: "300", thickness: "25" },
      "diameter",
      "250",
    );
    expect(stored("__test")).toEqual({ diameter: "250", thickness: "25" });
  });

  it("reads back a persisted value", () => {
    const component = { diameter: "300" };
    set(component, "__test", { diameter: "300" }, "diameter", "250");
    expect(get("__test", "diameter", "300")).toBe("250");
  });

  it("survives successive edits of different keys", () => {
    const component = { diameter: "300", thickness: "25" };
    const snapshot = () => ({
      diameter: component.diameter,
      thickness: component.thickness,
    });
    set(component, "__test", snapshot(), "diameter", "250");
    set(component, "__test", snapshot(), "thickness", "19");
    expect(stored("__test")).toEqual({ diameter: "250", thickness: "19" });
  });

  it("returns the default for an unknown storage key", () => {
    expect(get("__missing", "diameter", "300")).toBe("300");
  });

  it("returns the default for a malformed payload", () => {
    localStorage.setItem("__test", "not json");
    expect(get("__test", "diameter", "300")).toBe("300");
  });

  it("returns the default for an unknown key of a known payload", () => {
    localStorage.setItem("__test", JSON.stringify({ thickness: "25" }));
    expect(get("__test", "diameter", "300")).toBe("300");
  });
});

describe("getHardware", () => {
  beforeEach(() => {
    store.clear();
  });

  it("returns empty collections when nothing is stored", () => {
    expect(getHardware()).toEqual({
      spherometers: [],
      opticalPieces: [],
      polishers: [],
    });
  });

  it("returns the stored spherometers", () => {
    const spherometers = [{ name: "big", feetRadius: 80, ballRadius2: 4 }];
    localStorage.setItem("__hardware", JSON.stringify({ spherometers }));
    expect(getSpherometers()).toEqual(spherometers);
  });

  it("falls back to empty collections on a malformed payload", () => {
    localStorage.setItem("__hardware", "not json");
    expect(getHardware()).toEqual({
      spherometers: [],
      opticalPieces: [],
      polishers: [],
    });
  });
});

describe("routeTitle", () => {
  const t = (key) => `translated:${key}`;

  it("translates the titleKey when the route has one", () => {
    expect(
      routeTitle({ name: "sagitta", meta: { titleKey: "routes.sagitta" } }, t),
    ).toBe("translated:routes.sagitta");
  });

  it("falls back to the route name without a titleKey", () => {
    expect(routeTitle({ name: "sagitta", meta: {} }, t)).toBe("sagitta");
    expect(routeTitle({ name: "sagitta" }, t)).toBe("sagitta");
  });

  it("returns an empty string for a missing route", () => {
    expect(routeTitle(undefined, t)).toBe("");
  });
});

describe("formatArcSize", () => {
  it("keeps small sizes in arcseconds", () => {
    expect(formatArcSize(39.4)).toBe("39.4″");
  });

  it("switches to arcminutes at two arcminutes", () => {
    expect(formatArcSize(120)).toBe("2.0′");
    expect(formatArcSize(1866)).toBe("31.1′");
  });

  it("renders non-finite sizes as a dash", () => {
    expect(formatArcSize(NaN)).toBe("-");
  });
});
