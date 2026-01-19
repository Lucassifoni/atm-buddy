import { createApp } from "vue";
import App from "./App.vue";
import { createWebHashHistory, createRouter } from "vue-router";
import "./style.css";

// Enforce light theme
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
      name: "Home",
      component: Home,
      meta: { icon: "home" },
    },
    {
      path: "/sphero",
      name: "Spherometer to ROC",
      component: BallSpherometer,
      meta: { icon: "sphero" },
    },
    {
      path: "/reverse_sphero",
      name: "ROC to Spherometer",
      component: ReverseBallSpherometer,
      meta: { icon: "reverse_sphero" },
    },
    {
      path: "/sagitta",
      name: "Sagitta Calculator",
      component: SagittaCalculator,
      meta: { icon: "sagitta" },
    },
    {
      path: "/sine_table",
      name: "Sine table",
      component: SineTableEquation,
      meta: { icon: "sine_table" },
    },
    {
      path: "/mpcc_hyperbolic",
      name: "Baader MPCCIII Hyperbola",
      component: BaaderMpcc,
      meta: { icon: "mpcc_hyperbolic" },
    },
    {
      path: "/spray_silvering",
      name: "Spray Silvering",
      component: SpraySilvering,
      meta: { icon: "spray_silvering" },
    },
    {
      path: "/stig",
      name: "Stig Correction",
      component: StigReminder,
      meta: { icon: "stig" },
    },
    {
      path: "/annular_ring",
      name: "Annular Ring",
      component: AnnularRing,
      meta: { icon: "annular_ring" },
    },
    {
      path: "/sagitta_fringes",
      name: "ROC Fringes",
      component: SagittaFringes,
      meta: { icon: "sagitta_fringes" },
    },
    {
      path: "/pressure",
      name: "Pressure Calculator",
      component: PressureCalculator,
      meta: { icon: "pressure" },
    },
    {
      path: "/coma_free",
      name: "Coma-free Radius",
      component: ComaFreeRadius,
      meta: { icon: "coma_free" },
    },
    {
      path: "/foucault_la",
      name: "Foucault LA",
      component: FoucaultLA,
      meta: { icon: "foucault_la" },
    },
    {
      path: "/hardware",
      name: "Hardware",
      component: Hardware,
      meta: { icon: "hardware" },
    },
  ],
});

createApp(App).use(router).mount("#app");

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
