import { createApp } from "vue";
import App from "./App.vue";
import { createWebHashHistory, createRouter } from "vue-router";
import "./style.css";

// Enforce light theme
document.documentElement.setAttribute('data-theme', 'light');
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
import Hardware from "./Hardware.vue";
import Home from "./Home.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "🏠 Home",
      component: Home,
    },
    {
      path: "/sphero",
      name: "📏 Spherometer to ROC",
      component: BallSpherometer,
    },
    {
      path: "/reverse_sphero",
      name: "🔄 ROC to Spherometer",
      component: ReverseBallSpherometer,
    },
    {
      path: "/sagitta",
      name: "📐 Sagitta Calculator",
      component: SagittaCalculator,
    },
    {
      path: "/sine_table",
      name: "📊 Sine table",
      component: SineTableEquation,
    },
    {
      path: "/mpcc_hyperbolic",
      name: "🔭 Baader MPCCIII Hyperbola",
      component: BaaderMpcc,
    },
    {
      path: "/spray_silvering",
      name: "🪞 Spray Silvering calculations",
      component: SpraySilvering,
    },
    {
      path: "/stig",
      name: "👁️ Stig Correction Reminder",
      component: StigReminder,
    },
    {
      path: "/annular_ring",
      name: "⭕ Annular Ring Calculator",
      component: AnnularRing,
    },
    {
      path: "/sagitta_fringes",
      name: "🌊 ROC Fringes",
      component: SagittaFringes,
    },
    {
      path: "/pressure",
      name: "⚖️ Pressure Calculator",
      component: PressureCalculator,
    },
    {
      path: "/coma_free",
      name: "☄️ Coma-free Radius",
      component: ComaFreeRadius,
    },
    {
      path: "/hardware",
      name: "🔧 Hardware",
      component: Hardware,
    },
  ],
});

createApp(App).use(router).mount("#app");

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/atm-buddy/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
