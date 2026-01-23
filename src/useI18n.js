import { ref, computed, reactive } from "vue";
import en from "./strings.en.js";
import fr from "./strings.fr.js";

const STORAGE_KEY = "atm-buddy-language";
const DEFAULT_LANGUAGE = "en";
const AVAILABLE_LANGUAGES = { en, fr };
const isBrowser = typeof window !== "undefined";

const currentLanguage = ref(
  isBrowser ? localStorage.getItem(STORAGE_KEY) || DEFAULT_LANGUAGE : DEFAULT_LANGUAGE
);

function setLanguage(lang) {
  if (AVAILABLE_LANGUAGES[lang]) {
    currentLanguage.value = lang;
    if (isBrowser) {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  }
}

function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}

function t(key, params = {}) {
  const strings = AVAILABLE_LANGUAGES[currentLanguage.value] || AVAILABLE_LANGUAGES[DEFAULT_LANGUAGE];
  let value = getNestedValue(strings, key);

  if (value === undefined) {
    const fallback = AVAILABLE_LANGUAGES[DEFAULT_LANGUAGE];
    value = getNestedValue(fallback, key);
  }

  if (value === undefined) {
    return key;
  }

  if (params && typeof value === "string") {
    Object.keys(params).forEach((param) => {
      value = value.replace(new RegExp(`\\{${param}\\}`, "g"), params[param]);
    });
  }

  return value;
}

export function useI18n() {
  return {
    t,
    currentLanguage: computed(() => currentLanguage.value),
    setLanguage,
    availableLanguages: Object.keys(AVAILABLE_LANGUAGES),
  };
}

export const i18n = reactive({
  t,
  get currentLanguage() {
    return currentLanguage.value;
  },
  setLanguage,
  availableLanguages: Object.keys(AVAILABLE_LANGUAGES),
});
