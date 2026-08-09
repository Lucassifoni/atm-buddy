import BallSpherometer from "./BallSpherometer.vue";
import ReverseBallSpherometer from "./ReverseBallSpherometer.vue";
import SineTableEquation from "./SineTableEquation.vue";
import BaaderMpcc from "./BaaderMpcc.vue";
import SpraySilvering from "./SpraySilvering.vue";
import StigReminder from "./StigReminder.vue";
import SagittaCalculator from "./SagittaCalculator.vue";
import AnnularRing from "./AnnularRing.vue";
import SagittaFringes from "./SagittaFringes.vue";
import PressureCalculator from "./PressureCalculator.vue";
import ComaFreeRadius from "./ComaFreeRadius.vue";
import FoucaultLA from "./FoucaultLA.vue";
import Hardware from "./Hardware.vue";
import ColorChannelSplitter from "./ColorChannelSplitter.vue";
import GlassSlabAberration from "./GlassSlabAberration.vue";
import BathAstigmatism from "./BathAstigmatism.vue";
import SphericalAberration from "./SphericalAberration.vue";
import MirrorWeight from "./MirrorWeight.vue";
import FieldConverter from "./FieldConverter.vue";
import SpherometerFeetRadius from "./SpherometerFeetRadius.vue";
import Home from "./Home.vue";

export const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: { icon: "home", titleKey: "routes.home" },
  },
  {
    path: "/sphero",
    name: "spherometer",
    component: BallSpherometer,
    meta: {
      icon: "sphero",
      titleKey: "routes.spherometer",
      category: "measuring",
    },
  },
  {
    path: "/reverse_sphero",
    name: "reverseSpherometer",
    component: ReverseBallSpherometer,
    meta: {
      icon: "reverse_sphero",
      titleKey: "routes.reverseSpherometer",
      category: "measuring",
    },
  },
  {
    path: "/sagitta",
    name: "sagitta",
    component: SagittaCalculator,
    meta: {
      icon: "sagitta",
      titleKey: "routes.sagitta",
      category: "measuring",
    },
  },
  {
    path: "/sagitta_fringes",
    name: "sagittaFringes",
    component: SagittaFringes,
    meta: {
      icon: "sagitta_fringes",
      titleKey: "routes.sagittaFringes",
      category: "measuring",
    },
  },
  {
    path: "/little_calculators/spherometer_feet_radius",
    name: "spherometerFeetRadius",
    component: SpherometerFeetRadius,
    meta: {
      icon: "sphero",
      titleKey: "routes.spherometerFeetRadius",
      category: "measuring",
    },
  },
  {
    path: "/foucault_la",
    name: "foucaultLA",
    component: FoucaultLA,
    meta: {
      icon: "foucault_la",
      titleKey: "routes.foucaultLA",
      category: "testing",
    },
  },
  {
    path: "/little_calculators/bath_astigmatism",
    name: "bathAstigmatism",
    component: BathAstigmatism,
    meta: {
      icon: "bath_astigmatism",
      titleKey: "routes.bathAstigmatism",
      category: "testing",
    },
  },
  {
    path: "/little_calculators/spherical_aberration",
    name: "sphericalAberration",
    component: SphericalAberration,
    meta: {
      icon: "spherical_aberration",
      titleKey: "routes.sphericalAberration",
      category: "testing",
    },
  },
  {
    path: "/little_calculators/glass_slab",
    name: "glassSlab",
    component: GlassSlabAberration,
    meta: {
      icon: "glass_slab",
      titleKey: "routes.glassSlab",
      category: "testing",
    },
  },
  {
    path: "/little_calculators/stig",
    name: "stig",
    component: StigReminder,
    meta: { icon: "stig", titleKey: "routes.stig", category: "testing" },
  },
  {
    path: "/color_splitter",
    name: "colorSplitter",
    component: ColorChannelSplitter,
    meta: {
      icon: "color_splitter",
      titleKey: "routes.colorSplitter",
      category: "testing",
    },
  },
  {
    path: "/sine_table",
    name: "sineTable",
    component: SineTableEquation,
    meta: {
      icon: "sine_table",
      titleKey: "routes.sineTable",
      category: "grinding",
    },
  },
  {
    path: "/pressure",
    name: "pressure",
    component: PressureCalculator,
    meta: {
      icon: "pressure",
      titleKey: "routes.pressure",
      category: "grinding",
    },
  },
  {
    path: "/little_calculators/annular_ring",
    name: "annularRing",
    component: AnnularRing,
    meta: {
      icon: "annular_ring",
      titleKey: "routes.annularRing",
      category: "grinding",
    },
  },
  {
    path: "/little_calculators/mpcc",
    name: "mpcc",
    component: BaaderMpcc,
    meta: {
      icon: "mpcc_hyperbolic",
      titleKey: "routes.mpcc",
      category: "design",
    },
  },
  {
    path: "/little_calculators/coma_free",
    name: "comaFree",
    component: ComaFreeRadius,
    meta: {
      icon: "coma_free",
      titleKey: "routes.comaFree",
      category: "design",
    },
  },
  {
    path: "/little_calculators/field_converter",
    name: "fieldConverter",
    component: FieldConverter,
    meta: {
      icon: "coma_free",
      titleKey: "routes.fieldConverter",
      category: "design",
    },
  },
  {
    path: "/little_calculators/mirror_weight",
    name: "mirrorWeight",
    component: MirrorWeight,
    meta: {
      icon: "glass_slab",
      titleKey: "routes.mirrorWeight",
      category: "blanks",
    },
  },
  {
    path: "/spray_silvering",
    name: "spraySilvering",
    component: SpraySilvering,
    meta: {
      icon: "spray_silvering",
      titleKey: "routes.spraySilvering",
      category: "blanks",
    },
  },
  {
    path: "/hardware",
    name: "hardware",
    component: Hardware,
    meta: { icon: "hardware", titleKey: "routes.hardware", category: "gear" },
  },
  {
    path: "/little_calculators",
    name: "legacyLittleCalculators",
    component: Home,
  },
];
