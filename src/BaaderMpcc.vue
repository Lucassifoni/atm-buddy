<template>
    <div>
        <div class="card-title justify-center mb-3">
            <div class="badge badge-outline badge-sm">
                Baader MPCC Conic calculator
            </div>
        </div>
        <div class="alert alert mb-3 py-1">
            <div class="text-xs">
                <p>
                    In waves @550nm:<br />Correction of a parabola: D (mm) /
                    (1.1264 * (F/D)^3)<br />MPCC S.A. undercorrection: (4 /
                    (F/D))^4 * 0.81
                </p>
            </div>
        </div>
        <OpticalPieceSelector
            @optical-piece-selected="onOpticalPieceSelected"
        />
        <div class="alert alert-success mt-4 py-2">
            <div class="text-xs">
                <p><strong>Focal ratio:</strong> {{ ratio.toFixed(2) }}</p>
                <p>
                    <strong>Parabola correction:</strong>
                    {{ correction.toFixed(2) }}
                </p>
                <p>
                    <strong>MPCC Undercorrection:</strong>
                    {{ undercorrection.toFixed(2) }}
                </p>
                <p><strong>Target conic:</strong> {{ target.toFixed(3) }}</p>
            </div>
        </div>
        <div class="field-horizontal">
            <label class="label text-xs font-medium">Diameter (mm):</label>
            <input
                class="input input-bordered input-sm w-full"
                :value="d"
                inputmode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                @input="d = $event.target.value"
            />
        </div>
        <div class="field-horizontal">
            <label class="label text-xs font-medium">Focal length (mm):</label>
            <input
                class="input input-bordered input-sm w-full"
                :value="f"
                inputmode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                @input="f = $event.target.value"
            />
        </div>
    </div>
</template>

<script>
import { fr as langpack_fr, en as langpack_en } from "./lang";
import { normalize, parseFloat } from "./utils";
import OpticalPieceSelector from "./OpticalPieceSelector.vue";

export default {
    name: "App",
    data() {
        return {
            f: "1200",
            d: "300",
        };
    },
    components: {
        OpticalPieceSelector,
    },
    methods: {
        normalize,
        onOpticalPieceSelected(piece) {
            this.d = (piece.radius * 2).toString(); // diameter = 2 * radius
            this.f = (piece.radiusOfCurvature / 2).toString(); // focal length = ROC / 2
        },
    },
    computed: {
        ratio() {
            const f = parseFloat(this.f);
            const d = parseFloat(this.d);
            return f / d;
        },
        correction() {
            const d = parseFloat(this.d);
            return d / (1.1264 * (this.ratio * this.ratio * this.ratio));
        },
        undercorrection() {
            const c = 4 / this.ratio;
            return c * c * c * c * 0.81;
        },
        target() {
            return -1 - this.undercorrection / this.correction;
        },
    },
};
</script>
