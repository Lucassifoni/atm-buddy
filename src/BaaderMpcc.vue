<template>
  <div>
    <div class="card-title justify-center mb-3">
      <div class="badge badge-outline badge-sm">
        {{ $t("mpcc.title") }}
      </div>
    </div>
    <div class="alert alert mb-3 py-1">
      <div class="text-xs">
        <p v-html="$t('mpcc.explanation')"></p>
      </div>
    </div>
    <OpticalPieceSelector @optical-piece-selected="onOpticalPieceSelected" />
    <div class="alert alert-success mt-4 py-2">
      <div class="text-xs">
        <p>
          <strong>{{ $t("mpcc.focalRatio") }}</strong> {{ ratio.toFixed(2) }}
        </p>
        <p>
          <strong>{{ $t("mpcc.parabolaCorrection") }}</strong>
          {{ correction.toFixed(2) }}
        </p>
        <p>
          <strong>{{ $t("mpcc.mpccUndercorrection") }}</strong>
          {{ undercorrection.toFixed(2) }}
        </p>
        <p>
          <strong>{{ $t("mpcc.targetConic") }}</strong> {{ target.toFixed(3) }}
        </p>
      </div>
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium"
        >{{ $t("mpcc.diameter") }} ({{ lengthUnit }}):</label
      >
      <input
        class="input input-bordered input-sm w-full"
        :value="displayD"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="setD($event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium"
        >{{ $t("mpcc.focalLength") }} ({{ lengthUnit }}):</label
      >
      <input
        class="input input-bordered input-sm w-full"
        :value="displayF"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="setF($event.target.value)"
      />
    </div>
  </div>
</template>

<script>
import { normalize } from "./utils";
import {
  focalRatio,
  mpccCorrection,
  mpccUndercorrection,
  mpccTargetConic,
} from "./formulas";
import OpticalPieceSelector from "./OpticalPieceSelector.vue";

export default {
  name: "BaaderMpcc",
  data() {
    return {
      fMm: 1200,
      dMm: 300,
    };
  },
  components: {
    OpticalPieceSelector,
  },
  methods: {
    normalize,
    onOpticalPieceSelected(piece) {
      this.dMm = piece.radius * 2;
      this.fMm = piece.radiusOfCurvature / 2;
    },
    setD(value) {
      this.dMm = this.$units.convert.lengthFromDisplay(parseFloat(value) || 0);
    },
    setF(value) {
      this.fMm = this.$units.convert.lengthFromDisplay(parseFloat(value) || 0);
    },
  },
  computed: {
    displayD() {
      return this.$units.convert.lengthToDisplay(this.dMm);
    },
    displayF() {
      return this.$units.convert.lengthToDisplay(this.fMm);
    },
    lengthUnit() {
      return this.$units.convert.lengthUnit();
    },
    ratio() {
      return focalRatio({
        focalLength: this.fMm,
        diameter: this.dMm,
      });
    },
    correction() {
      return mpccCorrection({
        diameter: this.dMm,
        focalLength: this.fMm,
      });
    },
    undercorrection() {
      return mpccUndercorrection({
        focalLength: this.fMm,
        diameter: this.dMm,
      });
    },
    target() {
      return mpccTargetConic({
        diameter: this.dMm,
        focalLength: this.fMm,
      });
    },
  },
};
</script>
