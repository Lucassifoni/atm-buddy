<template>
  <div>
    <div v-if="savedSpherometers.length > 0" class="mb-3">
      <label class="label text-xs font-medium mb-1">{{
        $t("selectors.loadSpherometer")
      }}</label>
      <div class="flex flex-wrap gap-1">
        <button
          v-for="sphero in savedSpherometers"
          :key="sphero.name"
          class="btn btn-info btn-xs"
          @click="loadSpherometer(sphero)"
        >
          {{ sphero.name }}
        </button>
      </div>
    </div>
    <div class="alert mb-3 py-1">
      <div class="text-xs">
        <p v-if="savedSpherometers.length === 0">
          {{ $t("selectors.createSpherometersHint") }}
          <router-link to="/hardware" class="link">{{
            $t("common.hardware")
          }}</router-link>
          {{ $t("selectors.tabSuffix") }}
        </p>
        <p v-else>
          {{ $t("selectors.manageSpherometersHint") }}
          <router-link to="/hardware" class="link">{{
            $t("common.hardware")
          }}</router-link>
          {{ $t("selectors.tabSuffixManage") }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { getSpherometers } from "./utils";

export default {
  name: "SpherometerSelector",
  data() {
    return {
      savedSpherometers: [],
    };
  },
  mounted() {
    this.savedSpherometers = getSpherometers();
  },
  methods: {
    loadSpherometer(spherometer) {
      if (spherometer) {
        this.$emit("spherometer-selected", spherometer);
      }
    },
  },
};
</script>
