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
      const n_obj = { ...obj, key: value };
      localStorage.setItem(storage_key, JSON.stringify(n_obj));
    }
    return value;
  } catch (e) {
    return value;
  }
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
