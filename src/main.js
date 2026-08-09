import { ViteSSG } from "vite-ssg";
import App from "./App.vue";
import "./style.css";
import { i18n } from "./useI18n.js";
import { routes } from "./routes.js";

export { routes };

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
