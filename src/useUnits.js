import { ref, reactive } from "vue";

const STORAGE_KEY = "atm-buddy-units";
const DEFAULT_UNIT = "metric";
const isBrowser = typeof window !== "undefined";

const currentUnit = ref(
  isBrowser ? localStorage.getItem(STORAGE_KEY) || DEFAULT_UNIT : DEFAULT_UNIT,
);

export const MM_PER_INCH = 25.4;
export const GRAMS_PER_POUND = 453.592;
export const G_CM2_PER_PSI = 70.307;

function setUnit(unit) {
  if (unit === "metric" || unit === "imperial") {
    currentUnit.value = unit;
    if (isBrowser) {
      localStorage.setItem(STORAGE_KEY, unit);
    }
  }
}

function isMetric() {
  return currentUnit.value === "metric";
}

function roundTo(value, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

const convert = {
  lengthToDisplay: (mm) => {
    const raw = isMetric() ? mm : mm / MM_PER_INCH;
    return roundTo(raw, isMetric() ? 2 : 3);
  },
  lengthFromDisplay: (val) => (isMetric() ? val : val * MM_PER_INCH),
  lengthUnit: () => (isMetric() ? "mm" : "in"),

  massToDisplay: (g) => {
    const raw = isMetric() ? g : g / GRAMS_PER_POUND;
    return roundTo(raw, isMetric() ? 0 : 2);
  },
  massFromDisplay: (val) => (isMetric() ? val : val * GRAMS_PER_POUND),
  massUnit: () => (isMetric() ? "g" : "lb"),

  pressureToDisplay: (gcm2) => {
    const raw = isMetric() ? gcm2 : gcm2 / G_CM2_PER_PSI;
    return roundTo(raw, isMetric() ? 1 : 2);
  },
  pressureFromDisplay: (val) => (isMetric() ? val : val * G_CM2_PER_PSI),
  pressureUnit: () => (isMetric() ? "g/cm²" : "psi"),

  formatLength: (mm) => {
    const val = convert.lengthToDisplay(mm);
    return isMetric() ? val.toFixed(2) : val.toFixed(3);
  },
  formatMass: (g) => {
    const val = convert.massToDisplay(g);
    return isMetric() ? val.toFixed(0) : val.toFixed(2);
  },
  formatPressure: (gcm2) => {
    const val = convert.pressureToDisplay(gcm2);
    return isMetric() ? val.toFixed(1) : val.toFixed(2);
  },
};

export const units = reactive({
  get current() {
    return currentUnit.value;
  },
  get isMetric() {
    return isMetric();
  },
  setUnit,
  convert,
});

export function useUnits() {
  return { units };
}
