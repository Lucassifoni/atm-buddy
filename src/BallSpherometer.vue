<template>
    <div>
        <h3 class="subtitle" style="margin-bottom: 0">
            ROC = (r² + s²) / 2s ± b/2
        </h3>
        <hr />
        <SpherometerSelector @spherometer-selected="onSpherometerSelected" />
        <div class="field is-horizontal">
            <label for="" class="label is-small"
                >Radius of feet (in mm):
            </label>
            <input
                class="input is-small"
                :value="r"
                inputmode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                @input="set('r', $event.target.value)"
            />
        </div>
        <div class="field is-horizontal">
            <label for="" class="label is-small">Sagitta (in mm): </label>
            <input
                class="input is-small"
                inputmode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                :value="s"
                @input="set('s', $event.target.value)"
            />
        </div>
        <div class="field is-horizontal">
            <label for="" class="label is-small">Ball diameter (in mm): </label>
            <input
                class="input is-small"
                :value="b"
                inputmode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
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
                >ROC: &nbsp; <strong>&nbsp;{{ roc.toFixed(2) }}</strong></span
            >
        </div>
    </div>
</template>

<script>
import { fr as langpack_fr, en as langpack_en } from "./lang";
import { get, set, normalize } from "./utils";
import SpherometerSelector from "./SpherometerSelector.vue";

const toN = (a) => Number(normalize(a));

export default {
    name: "App",
    data() {
        return {
            r: get("__sphero", "r", "40"),
            s: get("__sphero", "s", "3"),
            b: get("__sphero", "b", "3"),
            curve: "concave",
        };
    },
    components: {
        SpherometerSelector,
    },
    methods: {
        set(key, value) {
            set(
                this,
                "__sphero",
                { b: this.b, s: this.s, r: this.r, curve: this.curve },
                key,
                value,
            );
        },
        normalize,
        onSpherometerSelected(spherometer) {
            this.set("r", spherometer.feetRadius.toString());
            this.set("b", (spherometer.ballRadius * 2).toString());
        },
    },
    computed: {
        roc() {
            const r = toN(this.r);
            const s = toN(this.s);
            const b = this.curve === "concave" ? toN(this.b) : -toN(this.b);
            const roc = (r * r + s * s) / (2 * s) + b / 2;
            return roc;
        },
    },
};
</script>
