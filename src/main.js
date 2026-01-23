import { createApp } from "vue";
import App from "./App.vue";
import { createWebHashHistory, createRouter } from "vue-router";
import "./style.css";
import { i18n } from "./useI18n.js";

document.documentElement.setAttribute("data-theme", "light");
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
import Home from "./Home.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
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
      meta: { icon: "sphero", titleKey: "routes.spherometer" },
    },
    {
      path: "/reverse_sphero",
      name: "reverseSpherometer",
      component: ReverseBallSpherometer,
      meta: { icon: "reverse_sphero", titleKey: "routes.reverseSpherometer" },
    },
    {
      path: "/sagitta",
      name: "sagitta",
      component: SagittaCalculator,
      meta: { icon: "sagitta", titleKey: "routes.sagitta" },
    },
    {
      path: "/sine_table",
      name: "sineTable",
      component: SineTableEquation,
      meta: { icon: "sine_table", titleKey: "routes.sineTable" },
    },
    {
      path: "/mpcc_hyperbolic",
      name: "mpcc",
      component: BaaderMpcc,
      meta: { icon: "mpcc_hyperbolic", titleKey: "routes.mpcc" },
    },
    {
      path: "/spray_silvering",
      name: "spraySilvering",
      component: SpraySilvering,
      meta: { icon: "spray_silvering", titleKey: "routes.spraySilvering" },
    },
    {
      path: "/stig",
      name: "stig",
      component: StigReminder,
      meta: { icon: "stig", titleKey: "routes.stig" },
    },
    {
      path: "/annular_ring",
      name: "annularRing",
      component: AnnularRing,
      meta: { icon: "annular_ring", titleKey: "routes.annularRing" },
    },
    {
      path: "/sagitta_fringes",
      name: "sagittaFringes",
      component: SagittaFringes,
      meta: { icon: "sagitta_fringes", titleKey: "routes.sagittaFringes" },
    },
    {
      path: "/pressure",
      name: "pressure",
      component: PressureCalculator,
      meta: { icon: "pressure", titleKey: "routes.pressure" },
    },
    {
      path: "/coma_free",
      name: "comaFree",
      component: ComaFreeRadius,
      meta: { icon: "coma_free", titleKey: "routes.comaFree" },
    },
    {
      path: "/foucault_la",
      name: "foucaultLA",
      component: FoucaultLA,
      meta: { icon: "foucault_la", titleKey: "routes.foucaultLA" },
    },
    {
      path: "/hardware",
      name: "hardware",
      component: Hardware,
      meta: { icon: "hardware", titleKey: "routes.hardware" },
    },
  ],
});

const app = createApp(App);
app.config.globalProperties.$t = i18n.t;
app.config.globalProperties.$i18n = i18n;
app.use(router).mount("#app");

// Register service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/atm-buddy/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}
