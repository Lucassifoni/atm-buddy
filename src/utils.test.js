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
  heatHue,
  heatDarkness,
  steps,
  toggleIn,
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

describe("heatHue", () => {
  const scale = { yellowAt: 9, redAt: 11 };

  it("is green at zero and below", () => {
    expect(heatHue(0, scale)).toBe(120);
    expect(heatHue(-3, scale)).toBe(120);
  });

  it("is yellow at the yellow threshold", () => {
    expect(heatHue(9, scale)).toBe(60);
  });

  it("goes linearly from green to yellow", () => {
    expect(heatHue(4.5, scale)).toBe(90);
  });

  it("goes linearly from yellow to red", () => {
    expect(heatHue(10, scale)).toBe(30);
  });

  it("is red from the red threshold on", () => {
    expect(heatHue(11, scale)).toBe(0);
    expect(heatHue(19, scale)).toBe(0);
  });

  it("has no hue for non-finite values", () => {
    expect(heatHue(NaN, scale)).toBeNull();
  });
});

describe("heatDarkness", () => {
  const scale = { darkenFrom: 12.5, darkestAt: 25 };

  it("stays at zero up to the darkening threshold", () => {
    expect(heatDarkness(0, scale)).toBe(0);
    expect(heatDarkness(12.5, scale)).toBe(0);
  });

  it("rises linearly past the threshold", () => {
    expect(heatDarkness(18.75, scale)).toBe(0.5);
  });

  it("is capped at one", () => {
    expect(heatDarkness(25, scale)).toBe(1);
    expect(heatDarkness(64, scale)).toBe(1);
  });

  it("is zero for non-finite values", () => {
    expect(heatDarkness(NaN, scale)).toBe(0);
  });
});

describe("steps", () => {
  it("includes both ends", () => {
    expect(steps({ from: 100, to: 300, step: 50 })).toEqual([
      100, 150, 200, 250, 300,
    ]);
  });

  it("counts down with a negative step", () => {
    expect(steps({ from: 3, to: 2, step: -0.25 })).toEqual([
      3, 2.75, 2.5, 2.25, 2,
    ]);
  });

  it("does not drift with decimal steps", () => {
    expect(steps({ from: 0, to: 1, step: 0.1 })).toEqual([
      0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1,
    ]);
  });

  it("stops before overshooting the end", () => {
    expect(steps({ from: 0, to: 10, step: 4 })).toEqual([0, 4, 8]);
  });
});

describe("toggleIn", () => {
  const sameId = (a, b) => a.id === b.id;

  it("appends a missing item", () => {
    expect(toggleIn([{ id: 1 }], { id: 2 }, sameId)).toEqual([
      { id: 1 },
      { id: 2 },
    ]);
  });

  it("removes an item already present", () => {
    expect(toggleIn([{ id: 1 }, { id: 2 }], { id: 1 }, sameId)).toEqual([
      { id: 2 },
    ]);
  });

  it("does not mutate the list", () => {
    const list = [{ id: 1 }];
    toggleIn(list, { id: 2 }, sameId);
    expect(list).toEqual([{ id: 1 }]);
  });
});
