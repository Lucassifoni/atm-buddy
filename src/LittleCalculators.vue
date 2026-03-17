<template>
  <div>
    <router-link v-if="isIndex" to="/" class="btn btn-ghost btn-xs mb-3">
      ← {{ $t("littleCalculators.backToHome") }}
    </router-link>
    <div v-if="isIndex" class="grid grid-cols-3 sm:grid-cols-3 gap-3">
      <router-link
        v-for="child in children"
        :key="child.path"
        :to="child.path"
        class="tool-card"
      >
        <Icon :name="child.meta.icon" class="tool-icon" />
        <span class="tool-name">{{ getTitle(child) }}</span>
      </router-link>
    </div>
    <div v-else>
      <router-link to="/little_calculators" class="btn btn-ghost btn-xs mb-3">
        ← {{ $t("littleCalculators.backToList") }}
      </router-link>
      <router-view />
    </div>
  </div>
</template>

<script>
import Icon from "./components/Icon.vue";

export default {
  components: {
    Icon,
  },
  name: "LittleCalculators",
  computed: {
    isIndex() {
      return this.$route.path === "/little_calculators";
    },
    children() {
      const parent = this.$router
        .getRoutes()
        .find((r) => r.name === "littleCalculators");
      if (!parent || !parent.children) return [];
      return parent.children.map((child) => ({
        ...child,
        path: `/little_calculators/${child.path}`,
      }));
    },
  },
  methods: {
    getTitle(route) {
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

.tool-name {
  font-size: 0.75rem;
  text-align: center;
  color: oklch(var(--bc));
  line-height: 1.2;
}
</style>
