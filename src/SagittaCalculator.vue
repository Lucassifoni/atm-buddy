<template>
    <div>
        <h3 class="subtitle" style="margin-bottom: 0">
            Sagitta = r² / (2 × ROC)
        </h3>
        <hr />
        <OpticalPieceSelector @optical-piece-selected="onOpticalPieceSelected" />
        <div class="field is-horizontal">
            <label for="" class="label is-small"
                >Mirror radius (in mm):
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
            <label for="" class="label is-small">ROC (in mm): </label>
            <input
                class="input is-small"
                inputmode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                :value="roc"
                @input="set('roc', $event.target.value)"
            />
        </div>
        <div class="button is-primary" style="white-space: normal">
            <span
                >Sagitta: &nbsp; <strong>&nbsp;{{ sagitta.toFixed(3) }}</strong></span
            >
        </div>
    </div>
</template>

<script>
import { get, set, normalize } from "./utils";
import OpticalPieceSelector from "./OpticalPieceSelector.vue";

const toN = (a) => Number(normalize(a));

export default {
    name: "SagittaCalculator",
    data() {
        return {
            r: get("__sagitta", "r", "100"),
            roc: get("__sagitta", "roc", "2000"),
        };
    },
    components: {
        OpticalPieceSelector,
    },
    methods: {
        set(key, value) {
            set(
                this,
                "__sagitta",
                { r: this.r, roc: this.roc },
                key,
                value,
            );
        },
        normalize,
        onOpticalPieceSelected(piece) {
            this.set('r', piece.radius.toString());
            this.set('roc', piece.radiusOfCurvature.toString());
        },
    },
    computed: {
        sagitta() {
            const r = toN(this.r);
            const roc = toN(this.roc);
            
            // Using the equation: sagitta = r² / (2 × ROC)
            // where r is the mirror radius and ROC is the radius of curvature
            
            if (roc === 0) return 0;
            return (r * r) / (2 * roc);
        },
    },
};
</script>