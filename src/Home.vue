<template>
  <div>
    <ToolList :sections="sections" />

    <p class="text-xs text-gray-600 mt-4">
      {{ $t("home.aboutText") }}
    </p>
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
  computed: {
    sections() {
      return groupRoutesByCategory(routes, CATEGORIES, this.$t);
    },
  },
};
</script>
