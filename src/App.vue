<template>
  <div id="app" class="min-h-screen bg-gray-100">
    <div class="container mx-auto px-2 py-3">
      <div class="card bg-white shadow-lg max-w-2xl mx-auto">
        <div class="card-body p-4 pb-24">
          <div class="text-center mb-4">
            <router-link to="/"
              ><h1 class="text-xl font-light text-gray-500 tracking-wide">
                ATM Buddy
              </h1></router-link
            >
          </div>
          <router-view></router-view>
        </div>
      </div>
      <p class="text-center text-sm mt-2">
        Contribute on
        <a class="underline" href="https://github.com/lucassifoni/atm-buddy"
          >github</a
        >.
      </p>
      <p class="text-xs text-center max-w-[45ch] mx-auto my-2">
        Note : I use reasonably private analytics powered by
        <a href="https://plausible.io">Plausible.io</a> only to know which tools
        are or aren't used. If you do not want that, you can use an adblocker or
        <button class="bg-gray-300 rounded-sm px-1" @click="toggleAnalytics">
          {{ analyticsOptedOut ? 'opt back in' : 'click here to opt-out' }}
        </button>.
      </p>
    </div>

    <!-- Floating Menu Button -->
    <div class="fixed bottom-4 left-4 z-50">
      <div
        tabindex="0"
        role="button"
        class="btn btn-circle btn-primary shadow-lg"
        @click="toggleMenu"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
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
          <img
            :src="icons[route.meta.icon]"
            :alt="route.name"
            class="menu-icon"
          />
          <span class="menu-label">{{ route.name }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import sphero from "./assets/icons/sphero.svg";
import reverse_sphero from "./assets/icons/reverse_sphero.svg";
import sagitta from "./assets/icons/sagitta.svg";
import sine_table from "./assets/icons/sine_table.svg";
import mpcc_hyperbolic from "./assets/icons/mpcc_hyperbolic.svg";
import spray_silvering from "./assets/icons/spray_silvering.svg";
import stig from "./assets/icons/stig.svg";
import annular_ring from "./assets/icons/annular_ring.svg";
import sagitta_fringes from "./assets/icons/sagitta_fringes.svg";
import pressure from "./assets/icons/pressure.svg";
import coma_free from "./assets/icons/coma_free.svg";
import foucault_la from "./assets/icons/foucault_la.svg";
import hardware from "./assets/icons/hardware.svg";
import home from "./assets/icons/home.svg";

export default {
  data() {
    return {
      isMenuOpen: false,
      analyticsOptedOut: false,
      icons: {
        sphero,
        reverse_sphero,
        sagitta,
        sine_table,
        mpcc_hyperbolic,
        spray_silvering,
        stig,
        annular_ring,
        sagitta_fringes,
        pressure,
        coma_free,
        foucault_la,
        hardware,
        home,
      },
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
    });
    this.analyticsOptedOut = localStorage.getItem("atm-buddy-analytics-opt-out") === "true";
    if (!this.analyticsOptedOut) {
      this.mountAnalyticsScript();
    }
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    closeMenu() {
      this.isMenuOpen = false;
    },
    toggleAnalytics() {
      this.analyticsOptedOut = !this.analyticsOptedOut;
      localStorage.setItem("atm-buddy-analytics-opt-out", this.analyticsOptedOut.toString());
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
      script.src = "https://stats.documents.design/js/script.js";
      document.head.appendChild(script);
    },
    unmountAnalyticsScript() {
      const script = document.getElementById("plausible-script");
      if (script) {
        script.remove();
      }
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
