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

/**
 * @doc Groups routes into the ordered sections a tool list renders. Section
 * order follows `categories`, item order follows the route table, and empty
 * sections are dropped. Routes without a known category are left out.
 */
export const groupRoutesByCategory = (routes, categories, t) =>
  (categories || [])
    .map((category) => ({
      id: category.id,
      title: t(category.titleKey),
      items: (routes || [])
        .filter((route) => route.meta && route.meta.category === category.id)
        .map((route) => ({ path: route.path, title: routeTitle(route, t) })),
    }))
    .filter((section) => section.items.length > 0);

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
