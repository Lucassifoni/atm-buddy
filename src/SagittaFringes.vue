<template>
    <div>
        <div class="card-title justify-center mb-3">
            <div class="badge badge-outline badge-sm">
                ROC Fringes Calculator
            </div>
        </div>
        <OpticalPieceSelector
            @optical-piece-selected="onOpticalPieceSelected"
        />
        <div class="alert alert-success mt-4 py-2" v-if="!isNaN(rocTestFace)">
            <span class="text-sm font-semibold"
                >RoC of face under test:
                <strong>{{ rocTestFace.toFixed(2) }}</strong> mm</span
            >
        </div>
        <div class="alert alert-error mt-4 py-2" v-else>
            <span class="text-sm font-semibold">Invalid input values</span>
        </div>
        <div class="field-horizontal">
            <label class="label text-xs font-medium">Lambda (nm):</label>
            <input
                class="input input-bordered input-sm w-full"
                :value="lambda"
                inputmode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                @input="set('lambda', $event.target.value)"
            />
        </div>
        <div class="field-horizontal">
            <label class="label text-xs font-medium"
                >Contact diameter (mm):</label
            >
            <input
                class="input input-bordered input-sm w-full"
                :value="contactDiameter"
                inputmode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                @input="set('contactDiameter', $event.target.value)"
            />
        </div>
        <div class="field-horizontal">
            <label class="label text-xs font-medium"
                >Concave caliber RoC (mm):</label
            >
            <input
                class="input input-bordered input-sm w-full"
                :value="concaveRoc"
                inputmode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                @input="set('concaveRoc', $event.target.value)"
            />
        </div>
        <div class="field-horizontal">
            <label class="label text-xs font-medium">Number of fringes:</label>
            <input
                class="input input-bordered input-sm w-full"
                :value="nbFringes"
                inputmode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                @input="set('nbFringes', $event.target.value)"
            />
        </div>
        <div class="field-horizontal">
            <label class="label text-xs font-medium">Relative shape:</label>
            <div class="flex gap-3">
                <label class="cursor-pointer flex items-center gap-1">
                    <input
                        type="radio"
                        name="relativeShape"
                        value="1"
                        :checked="relativeShape === '1'"
                        @change="set('relativeShape', '1')"
                        class="radio radio-primary radio-sm"
                    />
                    <span class="text-xs">Concavity (+1)</span>
                </label>
                <label class="cursor-pointer flex items-center gap-1">
                    <input
                        type="radio"
                        name="relativeShape"
                        value="-1"
                        :checked="relativeShape === '-1'"
                        @change="set('relativeShape', '-1')"
                        class="radio radio-primary radio-sm"
                    />
                    <span class="text-xs">Convexity (-1)</span>
                </label>
            </div>
        </div>
    </div>
</template>

<script>
import { get, set } from "./utils.js";
import OpticalPieceSelector from "./OpticalPieceSelector.vue";

const key = "__sagittaFringes";

export default {
    name: "SagittaFringes",
    components: {
        OpticalPieceSelector,
    },
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
        onOpticalPieceSelected(piece) {
            this.set("concaveRoc", piece.radiusOfCurvature); // ROC directly
            this.set("contactDiameter", piece.radius * 2); // diameter = 2 * radius
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
