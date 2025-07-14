<template>
    <div>
        <h3 class="subtitle" style="margin-bottom: 0">
            Sagitta = ROC ± b/2 - sqrt((ROC ± b/2)² - r²)
        </h3>
        <hr />
        <SpherometerSelector @spherometer-selected="onSpherometerSelected" />
        <div class="field is-horizontal">
            <label for="" class="label is-small"
                >Radius of feet (in mm):
            </label>
            <input
                class="input is-small"
                inputmode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                :value="r"
@input="r = Number(normalize($event.target.value))"
            />
        </div>
        <div class="field is-horizontal">
            <label for="" class="label is-small">Desired ROC (in mm): </label>
            <input
                class="input is-small"
                inputmode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                :value="R"
@input="R = Number(normalize($event.target.value))"
            />
        </div>
        <div class="field is-horizontal">
            <label for="" class="label is-small">Ball diameter (in mm): </label>
            <input
                class="input is-small"
                inputmode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                :value="b"
@input="b = Number(normalize($event.target.value))"
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
import { normalize } from "./utils";
import SpherometerSelector from "./SpherometerSelector.vue";


export default {
    name: "App",
    data() {
        return {
            R: 2500,
            r: 35,
            b: 3,
            curve: "concave",
        };
    },
    components: {
        SpherometerSelector,
    },
    methods: {
        normalize,
        onSpherometerSelected(spherometer) {
            this.r = spherometer.feetRadius;
            this.b = spherometer.ballRadius2;
        },
    },
    computed: {
        sag() {
            const r = this.r;
            const R = this.R;
            const b = this.curve === "convex" ? this.b : -this.b;
            const aR = R + b / 2;
            const sag = aR - Math.sqrt(aR * aR - r * r);
            return sag;
        },
    },
};
</script>
