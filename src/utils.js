export const get = (storage_key, key, default_value) => {
    try {
        return JSON.parse(localStorage.getItem(storage_key))[key] || default_value;
    } catch (e) {
        return default_value;
    }
};

export const set = (component, storage_key, obj, key, value) => {
    try {
        component[key] = value;
        const n_obj = { ...obj, key: value };
        localStorage.setItem(storage_key, JSON.stringify(n_obj));
        return value;
    } catch (e) {
        return value;
    }
};

export const normalize = n => n.toString().replace(",", ".");