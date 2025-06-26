<template>
    <div class="section">
        <h3 class="subtitle" style="margin-bottom: 0">
            ROC Fringes Calculator
        </h3>
        <hr />
        <div class="field is-horizontal">
            <label for="" class="label is-small">Lambda (nm): </label>
            <input
                class="input is-small"
                :value="lambda"
                inputmode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                @input="set('lambda', $event.target.value)"
            />
        </div>
        <div class="field is-horizontal">
            <label for="" class="label is-small">Contact diameter (mm): </label>
            <input
                class="input is-small"
                :value="contactDiameter"
                inputmode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                @input="set('contactDiameter', $event.target.value)"
            />
        </div>
        <div class="field is-horizontal">
            <label for="" class="label is-small"
                >Concave caliber RoC (mm):
            </label>
            <input
                class="input is-small"
                :value="concaveRoc"
                inputmode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                @input="set('concaveRoc', $event.target.value)"
            />
        </div>
        <div class="field is-horizontal">
            <label for="" class="label is-small">Number of fringes: </label>
            <input
                class="input is-small"
                :value="nbFringes"
                inputmode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                @input="set('nbFringes', $event.target.value)"
            />
        </div>
        <div class="field is-horizontal">
            <label for="" class="label is-small"
                >Relative shape:
            </label>
            <div class="control">
                <label class="radio">
                    <input
                        type="radio"
                        name="relativeShape"
                        value="1"
                        :checked="relativeShape === '1'"
                        @change="set('relativeShape', '1')"
                    />
                    Concavity (+1)
                </label>
                <label class="radio" style="margin-left: 1rem">
                    <input
                        type="radio"
                        name="relativeShape"
                        value="-1"
                        :checked="relativeShape === '-1'"
                        @change="set('relativeShape', '-1')"
                    />
                    Convexity (-1)
                </label>
            </div>
        </div>
        <hr />
        <div
            class="button is-primary"
            style="white-space: normal"
            v-if="!isNaN(rocTestFace)"
        >
            <span
                >RoC of face under test: &nbsp;
                <strong>&nbsp;{{ rocTestFace.toFixed(2) }} mm</strong></span
            >
        </div>
        <div class="button is-danger" style="white-space: normal" v-else>
            <span>Invalid input values</span>
        </div>
    </div>
</template>

<script>
import { get, set } from "./utils.js";

const key = "__sagittaFringes";

export default {
    name: "SagittaFringes",
    data() {
        return {
            lambda: get(key, "lambda", "550"),
            contactDiameter: get(key, "contactDiameter", ""),
            concaveRoc: get(key, "concaveRoc", ""),
            nbFringes: get(key, "nbFringes", ""),
            relativeShape: get(key, "relativeShape", "1"),
        };
    },
    methods: {
        set(field, value) {
            set(this, key, this, field, value);
        },
    },
    computed: {
        rocTestFace() {
            const normalize = (a) => (a || "").replace(",", ".");
            const toN = (a) => Number(normalize(a));

            const f9 = toN(this.lambda);
            const f10 = toN(this.contactDiameter);
            const f11 = toN(this.concaveRoc);
            const f15 = toN(this.nbFringes);
            const f16 = toN(this.relativeShape);

            if (f10 === 0 || f11 === 0) return NaN;

            const halfDiameter = f10 / 2;
            const sqrtTerm = Math.sqrt(f11 * f11 - halfDiameter * halfDiameter);

            if (isNaN(sqrtTerm)) return NaN;

            const term1 = f11 - sqrtTerm;
            const term2 = (f16 * f15 * f9) / 2000000;
            const numerator = term1 - term2;

            const result = numerator / 2 + (f10 * f10) / (8 * numerator);

            return result;
        },
    },
};
</script>
