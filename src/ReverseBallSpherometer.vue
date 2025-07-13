<template>
    <div>
        <h3 class="subtitle" style="margin-bottom: 0">
            Sagitta = ROC ± b/2 - sqrt((ROC ± b/2)² - r²)
        </h3>
        <hr />
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
        <div class="field is-horizontal">
            <label for="" class="label is-small"
                >Radius of feet (in mm):
            </label>
            <input
                class="input is-small"
                inputmode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                :value="r"
                @input="set('r', $event.target.value)"
            />
        </div>
        <div class="field is-horizontal">
            <label for="" class="label is-small">Desired ROC (in mm): </label>
            <input
                class="input is-small"
                inputmode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                :value="R"
                @input="set('R', $event.target.value)"
            />
        </div>
        <div class="field is-horizontal">
            <label for="" class="label is-small">Ball diameter (in mm): </label>
            <input
                class="input is-small"
                inputmode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                :value="b"
                @input="set('b', $event.target.value)"
            />
        </div>
        <div class="field is-horizontal">
            <label for="" class="label is-small">Curve : </label>
            <div class="control">
                <label class="radio">
                    <input type="radio" value="concave" v-model="curve" />
                    Concave
                </label>
                <label class="radio">
                    <input type="radio" value="convex" v-model="curve" />
                    Convex
                </label>
            </div>
        </div>
        <div class="button is-primary" style="white-space: normal">
            <span
                >Sagitta: &nbsp;
                <strong>&nbsp;{{ sag.toFixed(3) }}</strong></span
            >
        </div>
    </div>
</template>

<script>
import { fr as langpack_fr, en as langpack_en } from "./lang";
import { get, set, normalize, getSpherometers } from "./utils";

const toN = (a) => Number(normalize(a));

export default {
    name: "App",
    data() {
        return {
            R: get("__rsphero", "R", "2500"),
            r: get("__rsphero", "r", "35"),
            b: get("__rsphero", "b", "3"),
            curve: "concave",
            savedSpherometers: [],
            selectedSpherometer: "",
        };
    },
    mounted() {
        this.savedSpherometers = getSpherometers();
    },
    methods: {
        set(key, value) {
            set(
                this,
                "__rsphero",
                { R: this.R, r: this.r, curve: this.curve, b: this.b },
                key,
                value,
            );
        },
        normalize,
        loadSpherometer() {
            if (this.selectedSpherometer) {
                const spherometer = this.savedSpherometers.find(
                    s => s.name === this.selectedSpherometer
                );
                if (spherometer) {
                    this.set('r', spherometer.feetRadius.toString());
                    this.set('b', (spherometer.ballRadius * 2).toString());
                }
            }
        },
    },
    computed: {
        sag() {
            const r = toN(this.r);
            const R = toN(this.R);
            const b = this.curve === "convex" ? toN(this.b) : -toN(this.b);
            const aR = R + b / 2;
            const sag = aR - Math.sqrt(aR * aR - r * r);
            return sag;
        },
    },
};
</script>
