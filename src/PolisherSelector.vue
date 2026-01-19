<template>
  <div>
    <div v-if="savedPolishers.length > 0" class="mb-3">
      <label class="label text-xs font-medium mb-1">Load polisher:</label>
      <div class="flex flex-wrap gap-1">
        <button
          v-for="polisher in savedPolishers"
          :key="polisher.name"
          class="btn btn-info btn-xs"
          @click="loadPolisher(polisher)"
        >
          {{ polisher.name }}
        </button>
      </div>
    </div>
    <div class="alert mb-3 py-1">
      <div class="text-xs">
        <p v-if="savedPolishers.length === 0">
          💡 Create polishers in the
          <router-link to="/hardware" class="link">Hardware</router-link>
          tab to quickly load their dimensions here.
        </p>
        <p v-else>
          💡 Manage polishers in the
          <router-link to="/hardware" class="link">Hardware</router-link>
          tab.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { getPolishers } from "./utils";

export default {
  name: "PolisherSelector",
  data() {
    return {
      savedPolishers: [],
    };
  },
  mounted() {
    this.savedPolishers = getPolishers();
  },
  methods: {
    loadPolisher(polisher) {
      if (polisher) {
        this.$emit("polisher-selected", polisher);
      }
    },
  },
};
</script>
