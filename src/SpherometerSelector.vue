<template>
    <div>
        <div v-if="savedSpherometers.length > 0">
            <label class="label is-small">Load spherometer: </label>
            <div class="buttons">
                <button
                    v-for="sphero in savedSpherometers"
                    :key="sphero.name"
                    class="button is-small is-info is-rounded"
                    @click="loadSpherometer(sphero)"
                >
                    {{ sphero.name }}
                </button>
            </div>
        </div>
        <p
            v-if="savedSpherometers.length === 0"
            class="has-text-grey is-size-7 mb-3"
        >
            💡 Create spherometers in the
            <router-link to="/hardware">Hardware</router-link> tab to quickly
            load their dimensions here.
        </p>
        <p v-else class="has-text-grey is-size-7 mb-3">
            💡 Manage spherometers in the
            <router-link to="/hardware">Hardware</router-link> tab.
        </p>
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
