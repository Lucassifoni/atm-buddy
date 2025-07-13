<template>
  <div>
    <div class="field is-horizontal" v-if="savedSpherometers.length > 0">
      <label for="" class="label is-small">Load spherometer: </label>
      <div class="field has-addons">
        <div class="control">
          <div class="select is-small">
            <select v-model="selectedSpherometer">
              <option value="">Select...</option>
              <option v-for="sphero in savedSpherometers" :key="sphero.name" :value="sphero.name">
                {{ sphero.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="control">
          <button class="button is-small is-info" @click="loadSpherometer" :disabled="!selectedSpherometer">
            Load
          </button>
        </div>
      </div>
    </div>
    <p v-if="savedSpherometers.length === 0" class="has-text-grey is-size-7 mb-3">
      💡 Create spherometers in the <router-link to="/hardware">Hardware</router-link> tab to quickly load their dimensions here.
    </p>
    <p v-else class="has-text-grey is-size-7 mb-3">
      💡 Manage spherometers in the <router-link to="/hardware">Hardware</router-link> tab.
    </p>
  </div>
</template>

<script>
import { getSpherometers } from './utils';

export default {
  name: 'SpherometerSelector',
  data() {
    return {
      savedSpherometers: [],
      selectedSpherometer: "",
    };
  },
  mounted() {
    this.savedSpherometers = getSpherometers();
  },
  methods: {
    loadSpherometer() {
      if (this.selectedSpherometer) {
        const spherometer = this.savedSpherometers.find(
          s => s.name === this.selectedSpherometer
        );
        if (spherometer) {
          this.$emit('spherometer-selected', spherometer);
          this.selectedSpherometer = "";
        }
      }
    },
  },
};
</script>