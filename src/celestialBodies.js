/**
 * A short ladder of observing targets, from a planetary disc to the Moon,
 * used to give a sense of scale to a coma-free field. Sizes are
 * apparent diameters along the largest axis, in arcseconds.
 *
 * `minArcsec` / `maxArcsec` are only present for the solar system bodies,
 * whose apparent size varies over the synodic cycle. Deep-sky sizes are the
 * usual visual extents, which depend more on the sky and the aperture than on
 * anything this tool knows about.
 *
 * `key` indexes into `celestialBodies.*` in the string files.
 */
export const CELESTIAL_BODIES = [
  { key: "jupiter", arcsec: 39.4, minArcsec: 29.8, maxArcsec: 49.1 },
  { key: "m27", arcsec: 480 },
  { key: "m13", arcsec: 1200 },
  { key: "moon", arcsec: 1866, minArcsec: 1762, maxArcsec: 2011 },
];
