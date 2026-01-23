<template>
  <div>
    <div v-if="savedPolishers.length > 0" class="mb-3">
      <label class="label text-xs font-medium mb-1">{{ $t('selectors.loadPolisher') }}</label>
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
          {{ $t('selectors.createPolishersHint') }}
          <router-link to="/hardware" class="link">{{ $t('common.hardware') }}</router-link>
          {{ $t('selectors.tabSuffix') }}
        </p>
        <p v-else>
          {{ $t('selectors.managePolishersHint') }}
          <router-link to="/hardware" class="link">{{ $t('common.hardware') }}</router-link>
          {{ $t('selectors.tabSuffixManage') }}
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
