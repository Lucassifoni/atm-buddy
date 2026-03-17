import { ViteSSG } from "vite-ssg";
import App from "./App.vue";
import "./style.css";
import { i18n } from "./useI18n.js";

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
import LittleCalculators from "./LittleCalculators.vue";
import GlassSlabAberration from "./GlassSlabAberration.vue";
import BathAstigmatism from "./BathAstigmatism.vue";
import Home from "./Home.vue";

export const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: { icon: "home", titleKey: "routes.home", isHome: true },
  },
  {
    path: "/sphero",
    name: "spherometer",
    component: BallSpherometer,
    meta: { icon: "sphero", titleKey: "routes.spherometer", isHome: true },
  },
  {
    path: "/reverse_sphero",
    name: "reverseSpherometer",
    component: ReverseBallSpherometer,
    meta: {
      icon: "reverse_sphero",
      titleKey: "routes.reverseSpherometer",
      isHome: true,
    },
  },
  {
    path: "/sagitta",
    name: "sagitta",
    component: SagittaCalculator,
    meta: { icon: "sagitta", titleKey: "routes.sagitta", isHome: true },
  },
  {
    path: "/sine_table",
    name: "sineTable",
    component: SineTableEquation,
    meta: { icon: "sine_table", titleKey: "routes.sineTable", isHome: true },
  },
  {
    path: "/little_calculators",
    name: "littleCalculators",
    component: LittleCalculators,
    meta: {
      icon: "coma_free",
      titleKey: "routes.littleCalculators",
      isHome: true,
    },
    children: [
      {
        path: "mpcc",
        name: "mpcc",
        component: BaaderMpcc,
        meta: { icon: "mpcc_hyperbolic", titleKey: "routes.mpcc" },
      },
      {
        path: "stig",
        name: "stig",
        component: StigReminder,
        meta: { icon: "stig", titleKey: "routes.stig" },
      },
      {
        path: "annular_ring",
        name: "annularRing",
        component: AnnularRing,
        meta: { icon: "annular_ring", titleKey: "routes.annularRing" },
      },
      {
        path: "coma_free",
        name: "comaFree",
        component: ComaFreeRadius,
        meta: { icon: "coma_free", titleKey: "routes.comaFree" },
      },
      {
        path: "glass_slab",
        name: "glassSlab",
        component: GlassSlabAberration,
        meta: { icon: "glass_slab", titleKey: "routes.glassSlab" },
      },
      {
        path: "bath_astigmatism",
        name: "bathAstigmatism",
        component: BathAstigmatism,
        meta: { icon: "bath_astigmatism", titleKey: "routes.bathAstigmatism" },
      },
    ],
  },
  {
    path: "/spray_silvering",
    name: "spraySilvering",
    component: SpraySilvering,
    meta: {
      icon: "spray_silvering",
      titleKey: "routes.spraySilvering",
      isHome: true,
    },
  },
  {
    path: "/sagitta_fringes",
    name: "sagittaFringes",
    component: SagittaFringes,
    meta: {
      icon: "sagitta_fringes",
      titleKey: "routes.sagittaFringes",
      isHome: true,
    },
  },
  {
    path: "/pressure",
    name: "pressure",
    component: PressureCalculator,
    meta: { icon: "pressure", titleKey: "routes.pressure", isHome: true },
  },
  {
    path: "/foucault_la",
    name: "foucaultLA",
    component: FoucaultLA,
    meta: { icon: "foucault_la", titleKey: "routes.foucaultLA", isHome: true },
  },
  {
    path: "/hardware",
    name: "hardware",
    component: Hardware,
    meta: { icon: "hardware", titleKey: "routes.hardware", isHome: true },
  },
  {
    path: "/color_splitter",
    name: "colorSplitter",
    component: ColorChannelSplitter,
    meta: {
      icon: "color_splitter",
      titleKey: "routes.colorSplitter",
      isHome: true,
    },
  },
];

export const createApp = ViteSSG(App, { routes }, ({ app, isClient }) => {
  app.config.globalProperties.$t = i18n.t;
  app.config.globalProperties.$i18n = i18n;

  if (isClient) {
    document.documentElement.setAttribute("data-theme", "light");

    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("SW registered: ", registration);
          })
          .catch((registrationError) => {
            console.log("SW registration failed: ", registrationError);
          });
      });
    }
  }
});
