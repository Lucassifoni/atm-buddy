<template>
  <div id="app" class="min-h-screen bg-gray-100">
    <div class="text-center pt-2">
      <select
        v-model="currentLang"
        @change="changeLanguage"
        class="select select-bordered select-xs"
      >
        <option value="en">English</option>
        <option value="fr">Français</option>
      </select>
    </div>
    <div class="container mx-auto px-2 py-3">
      <div class="card bg-white shadow-lg max-w-2xl mx-auto">
        <div class="card-body p-4 pb-24">
          <div class="text-center mb-4">
            <router-link to="/"
              ><h1 class="text-xl font-light text-gray-500 tracking-wide">
                {{ $t("app.title") }}
              </h1></router-link
            >
          </div>
          <router-view></router-view>
        </div>
      </div>
      <p class="text-center text-xs max-w-[45ch] mx-auto my-2">
        <span v-html="$t(`app.credits`)" /><br />{{ $t("app.contributeOn") }}
        <a class="underline" href="https://github.com/lucassifoni/atm-buddy">{{
          $t("app.github")
        }}</a
        >.
      </p>
      <p class="text-xs text-center max-w-[45ch] mx-auto my-2">
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
        <Icon name="menu" class="w-6 h-6" />
      </div>

      <div
        v-show="isMenuOpen"
        ref="dropdown"
        class="menu-grid bg-white rounded-box shadow-xl p-3 mb-2 absolute bottom-full left-0"
      >
        <router-link
          v-for="route in routes"
          :key="route.path"
          :to="route.path"
          :class="{ 'menu-item-active': route.path === $route.path }"
          class="menu-item"
          @click="closeMenu"
        >
          <Icon :name="route.meta.icon" class="menu-icon" />
          <span class="menu-label">{{ getRouteTitle(route) }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from "./components/Icon.vue";

export default {
  components: {
    Icon,
  },
  data() {
    return {
      isMenuOpen: false,
      analyticsOptedOut: false,
      currentLang: this.$i18n.currentLanguage,
    };
  },
  computed: {
    routes() {
      return this.$router.getRoutes();
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
    getRouteTitle(route) {
      if (route.meta && route.meta.titleKey) {
        return this.$t(route.meta.titleKey);
      }
      return route.name;
    },
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
.menu-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  width: 250px;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #f3f4f6;
  text-decoration: none;
  transition: background-color 0.15s;
}

.menu-item:hover {
  background-color: #e5e7eb;
}

.menu-item-active {
  background-color: rgba(59, 130, 246, 0.15);
}

.menu-icon {
  width: 1.5rem;
  height: 1.5rem;
  margin-bottom: 0.25rem;
}

.menu-label {
  font-size: 0.55rem;
  text-align: center;
  color: #374151;
  line-height: 1.1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
