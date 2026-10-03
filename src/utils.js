const isBrowser = typeof window !== "undefined";

export const get = (storage_key, key, default_value) => {
  if (!isBrowser) return default_value;
  try {
    return JSON.parse(localStorage.getItem(storage_key))[key] || default_value;
  } catch (e) {
    return default_value;
  }
};

export const set = (component, storage_key, obj, key, value) => {
  try {
    component[key] = value;
    if (isBrowser) {
      const n_obj = { ...obj, [key]: value };
      localStorage.setItem(storage_key, JSON.stringify(n_obj));
    }
    return value;
  } catch (e) {
    return value;
  }
};

/**
 * @doc Display title of a route: its translated `titleKey` when it has one,
 * its name otherwise. `t` is the translation function.
 */
export const routeTitle = (route, t) => {
  if (route && route.meta && route.meta.titleKey) return t(route.meta.titleKey);
  return (route && route.name) || "";
};

export const normalize = (n) => n.toString().replace(",", ".");

export const parseFloat = (value) => {
  const normalized = normalize(value);
  const parsed = Number(normalized);
  return isNaN(parsed) ? 0 : parsed;
};

export const getHardware = () => {
  if (!isBrowser) {
    return { spherometers: [], opticalPieces: [], polishers: [] };
  }
  try {
    const storage = JSON.parse(localStorage.getItem("__hardware")) || {};
    return {
      spherometers: storage.spherometers || [],
      opticalPieces: storage.opticalPieces || [],
      polishers: storage.polishers || [],
    };
  } catch (e) {
    return {
      spherometers: [],
      opticalPieces: [],
      polishers: [],
    };
  }
};

export const getSpherometers = () => {
  return getHardware().spherometers;
};

export const getOpticalPieces = () => {
  return getHardware().opticalPieces;
};

export const getPolishers = () => {
  return getHardware().polishers;
};

/**
 * Renders an apparent size given in arcseconds, switching to arcminutes above
 * two arcminutes so that deep-sky targets stay readable.
 */
export const formatArcSize = (arcsec) => {
  if (!isFinite(arcsec)) return "-";
  if (arcsec >= 120) return `${(arcsec / 60).toFixed(1)}\u2032`;
  return `${arcsec.toFixed(1)}\u2033`;
};
