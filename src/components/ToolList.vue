<template>
  <nav class="tool-nav" :class="{ 'tool-nav--dense': dense }">
    <section v-for="section in sections" :key="section.id" class="tool-section">
      <h2 class="tool-section__title">{{ section.title }}</h2>
      <div class="tool-section__items">
        <router-link
          v-for="item in section.items"
          :key="item.path"
          :to="item.path"
          class="tool-item"
          :class="{ 'tool-item--active': item.path === activePath }"
          @click="$emit('navigate')"
        >
          {{ item.title }}
        </router-link>
      </div>
    </section>
  </nav>
</template>

<script>
export default {
  name: "ToolList",
  emits: ["navigate"],
  props: {
    sections: {
      type: Array,
      required: true,
    },
    dense: {
      type: Boolean,
      default: false,
    },
    activePath: {
      type: String,
      default: "",
    },
  },
};
</script>

<style scoped>
.tool-section + .tool-section {
  margin-top: 0.6rem;
}

.tool-section__title {
  font-size: 0.8125rem;
  font-weight: 600;
  color: oklch(var(--bc));
  margin-bottom: 0.25rem;
}

.tool-section__items {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.25rem;
}

@media (max-width: 22rem) {
  .tool-section__items {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 48rem) {
  .tool-section__items {
    grid-template-columns: repeat(3, 1fr);
  }
}

.tool-item {
  display: block;
  padding: 0.3rem 0.5rem;
  border-radius: 0.375rem;
  background-color: oklch(var(--b2));
  color: oklch(var(--bc));
  font-size: 0.8125rem;
  line-height: 1.25;
  text-decoration: none;
  transition: background-color 0.15s;
}

.tool-item:hover {
  background-color: oklch(var(--b3));
}

.tool-item--active {
  background-color: oklch(var(--p) / 0.15);
  font-weight: 500;
}

.tool-nav--dense .tool-section + .tool-section {
  margin-top: 0.5rem;
}

.tool-nav--dense .tool-section__items {
  grid-template-columns: 1fr;
  gap: 0;
}

.tool-nav--dense .tool-section__title {
  font-size: 0.75rem;
  margin-bottom: 0.15rem;
}

.tool-nav--dense .tool-item {
  background-color: transparent;
  font-size: 0.6875rem;
  padding: 0.25rem 0.4rem;
}
</style>
