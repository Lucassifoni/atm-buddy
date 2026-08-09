<template>
  <div id="app" class="min-h-screen bg-gray-100">
    <div class="container mx-auto px-2 py-3">
      <div class="max-w-2xl mx-auto flex items-baseline gap-3 mb-2">
        <h1 class="text-sm leading-tight grow">
          <router-link to="/" class="font-medium text-gray-700">{{
            $t("app.title")
          }}</router-link>
          <span class="text-gray-500 ml-1.5">{{ $t("app.subtitle") }}</span>
        </h1>
        <select
          v-model="currentLang"
          @change="changeLanguage"
          class="select select-bordered select-xs shrink-0"
        >
          <option value="en">English</option>
          <option value="fr">Français</option>
        </select>
      </div>
      <div class="card bg-white shadow-lg max-w-2xl mx-auto">
        <div class="card-body p-4 pb-24">
          <router-view></router-view>
        </div>
      </div>
      <p class="text-center text-xs mt-2">
        <span v-html="$t(`app.credits`)" /><br />
        {{ $t("app.contributeOn") }}
        <a class="underline" href="https://github.com/lucassifoni/atm-buddy">{{
          $t("app.github")
        }}</a
        >.
      </p>
      <p class="text-xs text-center mt-1">
        {{ $t("app.analyticsNote") }}
        <a href="https://plausible.io">Plausible.io</a>
        {{ $t("app.analyticsExplain") }}
        <button class="bg-gray-300 rounded-sm px-1" @click="toggleAnalytics">
          {{ analyticsOptedOut ? $t("app.optIn") : $t("app.optOut") }}</button
        >.
      </p>
    </div>

    <div class="fixed bottom-4 left-4 z-50">
      <div
        tabindex="0"
        role="button"
        class="btn btn-circle btn-primary shadow-lg"
        @click="toggleMenu"
      >
        Menu
      </div>

      <div
        v-show="isMenuOpen"
        ref="dropdown"
        class="menu-panel bg-white rounded-box shadow-xl p-3 mb-2 absolute bottom-full left-0"
      >
        <ToolList
          :sections="sections"
          :active-path="$route.path"
          dense
          @navigate="closeMenu"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ToolList from "./components/ToolList.vue";
import { CATEGORIES } from "./categories.js";
import { routes } from "./routes.js";
import { groupRoutesByCategory } from "./utils.js";

export default {
  components: {
    ToolList,
  },
  data() {
    return {
      isMenuOpen: false,
      analyticsOptedOut: false,
      currentLang: this.$i18n.currentLanguage,
    };
  },
  computed: {
    sections() {
      return groupRoutesByCategory(routes, CATEGORIES, this.$t);
    },
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
    this.$router.afterEach(() => {
      this.closeMenu();
      this.trackPageview();
    });
    this.analyticsOptedOut =
      typeof window !== "undefined" &&
      localStorage.getItem("atm-buddy-analytics-opt-out") === "true";
    if (!this.analyticsOptedOut) {
      this.mountAnalyticsScript();
    }
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    changeLanguage() {
      this.$i18n.setLanguage(this.currentLang);
      this.$forceUpdate();
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    closeMenu() {
      this.isMenuOpen = false;
    },
    toggleAnalytics() {
      this.analyticsOptedOut = !this.analyticsOptedOut;
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "atm-buddy-analytics-opt-out",
          this.analyticsOptedOut.toString(),
        );
      }
      if (this.analyticsOptedOut) {
        this.unmountAnalyticsScript();
      } else {
        this.mountAnalyticsScript();
      }
    },
    mountAnalyticsScript() {
      if (document.getElementById("plausible-script")) {
        return;
      }
      const script = document.createElement("script");
      script.id = "plausible-script";
      script.defer = true;
      script.dataset.domain = "atm-buddy.app";
      script.src = "https://stats.documents.design/js/script.manual.js";
      script.onload = () => this.trackPageview();
      document.head.appendChild(script);
    },
    unmountAnalyticsScript() {
      const script = document.getElementById("plausible-script");
      if (script) {
        script.remove();
      }
    },
    trackPageview() {
      if (this.analyticsOptedOut || typeof window.plausible !== "function") {
        return;
      }
      window.plausible("pageview", { u: location.href });
    },
    handleClickOutside(event) {
      const button = this.$el.querySelector(".btn-circle");
      const dropdown = this.$refs.dropdown;

      if (
        dropdown &&
        !dropdown.contains(event.target) &&
        button &&
        !button.contains(event.target)
      ) {
        this.closeMenu();
      }
    },
  },
};
</script>

<style scoped>
.menu-panel {
  width: 15rem;
  max-height: 70vh;
  overflow-y: auto;
  overscroll-behavior: contain;
}
</style>
