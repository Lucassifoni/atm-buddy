<template>
  <div>
    <div class="text-center mb-6">
      <p class="text-base text-gray-600">
        Mobile-friendly collection of tools for Amateur Telescope Makers
      </p>
    </div>

    <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
      <router-link
        v-for="route in toolRoutes"
        :key="route.path"
        :to="route.path"
        class="tool-card"
      >
        <img
          :src="icons[route.meta.icon]"
          :alt="route.name"
          class="tool-icon"
        />
        <span class="tool-name">{{ route.name }}</span>
      </router-link>
    </div>

    <div class="card bg-base-200 p-4 mt-6">
      <h2 class="text-base font-semibold mb-2">About</h2>
      <p class="text-sm text-gray-600">
        This application provides specialized calculators and reference tools
        for Amateur Telescope Makers (ATMs). All calculations are performed
        client-side and work offline after initial load.
      </p>
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
    toolRoutes() {
      return this.routes.filter((r) => r.path !== "/");
    },
  },
};
</script>
<style scoped>
.tool-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  padding: 0.75rem;
  border-radius: 0.75rem;
  background-color: oklch(var(--b2));
  border: 1px solid oklch(var(--b3));
  text-decoration: none;
  transition:
    background-color 0.15s,
    transform 0.15s;
}

.tool-card:hover {
  background-color: oklch(var(--b3));
  transform: scale(1.02);
}

.tool-icon {
  width: 2.5rem;
  height: 2.5rem;
  margin-bottom: 0.5rem;
}

.tool-name {
  font-size: 0.75rem;
  text-align: center;
  color: oklch(var(--bc));
  line-height: 1.2;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
