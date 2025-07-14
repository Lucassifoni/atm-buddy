<template>
    <div>
        <div class="card-title justify-center mb-3">
            <div class="badge badge-outline badge-sm">
                ROC = (r² + s²) / 2s ± b/2
            </div>
        </div>
        <SpherometerSelector @spherometer-selected="onSpherometerSelected" />
        <div class="alert alert-success mt-4 py-2">
            <span class="text-sm font-semibold"
                >ROC: <strong>{{ roc.toFixed(2) }}</strong> mm</span
            >
        </div>
        <div class="field-horizontal">
            <label class="label text-xs font-medium"
                >Radius of feet (mm):</label
            >
            <input
                class="input input-bordered input-sm w-full"
                :value="r"
                inputmode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                @input="r = $event.target.value"
            />
        </div>
        <div class="field-horizontal">
            <label class="label text-xs font-medium">Sagitta (mm):</label>
            <input
                class="input input-bordered input-sm w-full"
                inputmode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                :value="s"
                @input="s = $event.target.value"
            />
        </div>
        <div class="field-horizontal">
            <label class="label text-xs font-medium">Ball diameter (mm):</label>
            <input
                class="input input-bordered input-sm w-full"
                :value="b"
                inputmode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                @input="b = $event.target.value"
            />
        </div>
        <div class="field-horizontal">
            <label class="label text-xs font-medium">Curve:</label>
            <div class="flex gap-3">
                <label class="cursor-pointer flex items-center gap-1">
                    <input
                        type="radio"
                        value="concave"
                        v-model="curve"
                        class="radio radio-primary radio-sm"
                    />
                    <span class="text-xs">Concave</span>
                </label>
                <label class="cursor-pointer flex items-center gap-1">
                    <input
                        type="radio"
                        value="convex"
                        v-model="curve"
                        class="radio radio-primary radio-sm"
                    />
                    <span class="text-xs">Convex</span>
                </label>
            </div>
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
            const b =
                this.curve === "concave"
                    ? parseFloat(this.b)
                    : -parseFloat(this.b);
            const roc = (r * r + s * s) / (2 * s) + b / 2;
            return roc;
        },
    },
};
</script>
