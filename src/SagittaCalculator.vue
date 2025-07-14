<template>
    <div>
        <div class="card-title justify-center mb-3">
            <div class="badge badge-outline badge-sm">
                Sagitta = r² / (2 × ROC)
            </div>
        </div>
        <OpticalPieceSelector
            @optical-piece-selected="onOpticalPieceSelected"
        />
        <div class="alert alert-success mt-4 py-2">
            <span class="text-sm font-semibold"
                >Sagitta: <strong>{{ sagitta.toFixed(3) }}</strong> mm</span
            >
        </div>
        <div class="field-horizontal">
            <label class="label text-xs font-medium">Mirror radius (mm):</label>
            <input
                class="input input-bordered input-sm w-full"
                :value="r"
                inputmode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                @input="set('r', $event.target.value)"
            />
        </div>
        <div class="field-horizontal">
            <label class="label text-xs font-medium">ROC (mm):</label>
            <input
                class="input input-bordered input-sm w-full"
                inputmode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                :value="roc"
                @input="set('roc', $event.target.value)"
            />
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
            set(this, "__sagitta", { r: this.r, roc: this.roc }, key, value);
        },
        normalize,
        onOpticalPieceSelected(piece) {
            this.set("r", piece.radius.toString());
            this.set("roc", piece.radiusOfCurvature.toString());
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
