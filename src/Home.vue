<template>
  <div>
    <div class="text-center mb-6">
      <p class="text-base text-gray-600">
        {{ $t("home.subtitle") }}
      </p>
    </div>

    <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
      <router-link
        v-for="route in toolRoutes"
        :key="route.path"
        :to="route.path"
        class="tool-card"
      >
        <Icon :name="route.meta.icon" class="tool-icon" />
        <span class="tool-name">{{ getRouteTitle(route) }}</span>
      </router-link>
    </div>

    <div class="card bg-base-200 p-4 mt-6">
      <h2 class="text-base font-semibold mb-2">{{ $t("home.aboutTitle") }}</h2>
      <p class="text-sm text-gray-600">
        {{ $t("home.aboutText") }}
      </p>
    </div>
  </div>
</template>
<script>
import Icon from "./components/Icon.vue";

export default {
  components: {
    Icon,
  },
  computed: {
    routes() {
      return this.$router.getRoutes();
    },
    toolRoutes() {
      return this.routes.filter((r) => r.path !== "/");
    },
  },
  methods: {
    getRouteTitle(route) {
      if (route.meta && route.meta.titleKey) {
        return this.$t(route.meta.titleKey);
      }
      return route.name;
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
