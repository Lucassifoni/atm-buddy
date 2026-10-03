import { describe, it, expect } from "vitest";
import iconMap from "./iconMap.js";
import iconSprite from "./icons.svg?raw";
import iconReference from "./icon_map.svg?raw";
import { routes } from "../routes.js";

const ICON_SIZE = 24;

const [, spriteWidth, spriteHeight] = iconSprite
  .match(/viewBox="0 0 (\d+) (\d+)"/)
  .map(Number);
const COLUMNS = spriteWidth / ICON_SIZE;
const ROWS = spriteHeight / ICON_SIZE;

const flatten = (list) =>
  list.flatMap((route) => [route, ...flatten(route.children || [])]);

const placeholders = [
  ...iconSprite.matchAll(/<g id="(\w+)">\s*<rect x="([\d.]+)" y="([\d.]+)"/g),
].map(([, name, x, y]) => ({
  name,
  cell: [
    Math.floor(Number(x) / ICON_SIZE) + 1,
    Math.floor(Number(y) / ICON_SIZE) + 1,
  ],
}));

describe("iconMap", () => {
  it("keeps every icon inside the sprite grid", () => {
    Object.entries(iconMap).forEach(([name, [column, row]]) => {
      expect(column, name).toBeGreaterThanOrEqual(1);
      expect(column, name).toBeLessThanOrEqual(COLUMNS);
      expect(row, name).toBeGreaterThanOrEqual(1);
      expect(row, name).toBeLessThanOrEqual(ROWS);
    });
  });

  it("gives each icon its own cell", () => {
    const cells = Object.values(iconMap).map(
      ([column, row]) => `${column},${row}`,
    );
    expect(new Set(cells).size).toBe(cells.length);
  });

  it("has an icon for every route shown in the navigation", () => {
    const icons = flatten(routes).map((route) => route.meta.icon);
    icons.forEach((icon) => expect(iconMap, icon).toHaveProperty(icon));
  });

  it("gives each route its own icon", () => {
    const icons = flatten(routes).map((route) => route.meta.icon);
    expect(new Set(icons).size).toBe(icons.length);
  });
});

describe("icons.svg placeholders", () => {
  it("sit in the cell their icon is mapped to", () => {
    placeholders.forEach(({ name, cell }) => {
      expect(iconMap[name], name).toEqual(cell);
    });
  });
});

describe("icon_map.svg", () => {
  it("labels every mapped cell", () => {
    const labels = [
      ...iconReference.matchAll(
        /\[(\d),(\d)\]<\/text>\s*<text[^>]*>(.*?)<\/text>/g,
      ),
    ].map(([, column, row, tspans]) => ({
      cell: [Number(column), Number(row)],
      name: [...tspans.matchAll(/>([^<]+)</g)]
        .map(([, part]) => part)
        .join("_"),
    }));
    Object.entries(iconMap).forEach(([name, cell]) => {
      expect(labels, name).toContainEqual({ cell, name });
    });
  });
});
