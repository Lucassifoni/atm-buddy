<template>
    <div>
        <div class="card-title justify-center mb-3">
            <div class="badge badge-outline badge-sm">
                Sagitta = ROC ± b/2 - sqrt((ROC ± b/2)² - r²)
            </div>
        </div>
        <SpherometerSelector @spherometer-selected="onSpherometerSelected" />
        <div class="alert alert-success mt-4 py-2">
            <span class="text-sm font-semibold"
                >Sagitta: <strong>{{ sag.toFixed(3) }}</strong> mm</span
            >
        </div>
        <div class="field-horizontal">
            <label class="label text-xs font-medium"
                >Radius of feet (mm):</label
            >
            <input
                class="input input-bordered input-sm w-full"
                inputmode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                :value="r"
                @input="r = $event.target.value"
            />
        </div>
        <div class="field-horizontal">
            <label class="label text-xs font-medium">Desired ROC (mm):</label>
            <input
                class="input input-bordered input-sm w-full"
                inputmode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                :value="R"
                @input="R = $event.target.value"
            />
        </div>
        <div class="field-horizontal">
            <label class="label text-xs font-medium">Ball diameter (mm):</label>
            <input
                class="input input-bordered input-sm w-full"
                inputmode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                :value="b"
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
            R: "2500",
            r: "35",
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
        sag() {
            const r = parseFloat(this.r);
            const R = parseFloat(this.R);
            const b =
                this.curve === "convex"
                    ? parseFloat(this.b)
                    : -parseFloat(this.b);
            const aR = R + b / 2;
            const sag = aR - Math.sqrt(aR * aR - r * r);
            return sag;
        },
    },
};
</script>
