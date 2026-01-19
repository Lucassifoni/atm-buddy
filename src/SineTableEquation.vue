<template>
  <div>
    <div class="card-title justify-center mb-3">
      <div class="badge badge-outline badge-sm">Sine table: sin(x) = r / R</div>
    </div>
    <div class="alert mb-3 py-2">
      <div>
        <p class="text-xs">
          Where x is the angle between the two planes.<br />
          r is the cup radius<br />(measure outside for a concave curve, inside
          for a convex curve !)
        </p>
      </div>
    </div>
    <OpticalPieceSelector @optical-piece-selected="onOpticalPieceSelected" />
    <div class="alert alert-success mt-4 py-2">
      <span class="text-sm font-semibold"
        >Angle x in degrees: <strong>{{ x.toFixed(2) }}°</strong></span
      >
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">Cup radius (mm):</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="r"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="r = $event.target.value"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">Desired ROC (mm):</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="R"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="R = $event.target.value"
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
  components: {
    OpticalPieceSelector,
  },
  data() {
    return {
      r: "125",
      R: "2500",
    };
  },
  methods: {
    normalize,
    onOpticalPieceSelected(piece) {
      this.R = piece.radiusOfCurvature.toString(); // ROC directly
    },
  },
  computed: {
    x() {
      const r = parseFloat(this.r);
      const R = parseFloat(this.R);
      const sinx = r / R;
      const rad = Math.asin(sinx);
      const deg = rad * (180 / Math.PI);
      return deg;
    },
  },
};
</script>
