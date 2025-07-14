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
@input="r = $event.target.value"
            />
        </div>
        <div class="field is-horizontal">
            <label for="" class="label is-small">Sagitta (in mm): </label>
            <input
                class="input is-small"
                inputmode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                :value="s"
@input="s = $event.target.value"
            />
        </div>
        <div class="field is-horizontal">
            <label for="" class="label is-small">Ball diameter (in mm): </label>
            <input
                class="input is-small"
                :value="b"
                inputmode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
@input="b = $event.target.value"
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
import { normalize, parseFloat } from "./utils";
import SpherometerSelector from "./SpherometerSelector.vue";


export default {
    name: "App",
    data() {
        return {
            r: "40",
            s: "3",
            b: "3",
            curve: "concave",
        };
    },
    components: {
        SpherometerSelector,
    },
    methods: {
        normalize,
        onSpherometerSelected(spherometer) {
            this.r = spherometer.feetRadius.toString();
            this.b = spherometer.ballRadius2.toString();
        },
    },
    computed: {
        roc() {
            const r = parseFloat(this.r);
            const s = parseFloat(this.s);
            const b = this.curve === "concave" ? parseFloat(this.b) : -parseFloat(this.b);
            const roc = (r * r + s * s) / (2 * s) + b / 2;
            return roc;
        },
    },
};
</script>
