<template>
  <div>
    <div class="card-title justify-center mb-3">
      <div class="badge badge-outline badge-sm">
        {{ $t("sineTable.formula") }}
      </div>
    </div>
    <div class="alert mb-3 py-2">
      <div>
        <p class="text-xs" v-html="$t('sineTable.explanation')"></p>
      </div>
    </div>
    <OpticalPieceSelector @optical-piece-selected="onOpticalPieceSelected" />
    <div class="alert alert-success mt-4 py-2">
      <span class="text-sm font-semibold"
        >{{ $t("sineTable.angleLabel") }}
        <strong>{{ x.toFixed(2) }}{{ $t("common.degrees") }}</strong></span
      >
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium"
        >{{ $t("sineTable.cupRadius") }} ({{ lengthUnit }}):</label
      >
      <input
        class="input input-bordered input-sm w-full"
        :value="displayR"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="setR($event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium"
        >{{ $t("sineTable.desiredRoc") }} ({{ lengthUnit }}):</label
      >
      <input
        class="input input-bordered input-sm w-full"
        :value="displayROC"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="setROC($event.target.value)"
      />
    </div>
  </div>
</template>

<script>
import { normalize } from "./utils";
import { sineTableAngle } from "./formulas";
import OpticalPieceSelector from "./OpticalPieceSelector.vue";

export default {
  name: "SineTableEquation",
  components: {
    OpticalPieceSelector,
  },
  data() {
    return {
      rMm: 125,
      rocMm: 2500,
    };
  },
  methods: {
    normalize,
    setR(value) {
      this.rMm = this.$units.convert.lengthFromDisplay(parseFloat(value) || 0);
    },
    setROC(value) {
      this.rocMm = this.$units.convert.lengthFromDisplay(
        parseFloat(value) || 0,
      );
    },
    onOpticalPieceSelected(piece) {
      this.rocMm = piece.radiusOfCurvature;
    },
  },
  computed: {
    displayR() {
      return this.$units.convert.lengthToDisplay(this.rMm);
    },
    displayROC() {
      return this.$units.convert.lengthToDisplay(this.rocMm);
    },
    lengthUnit() {
      return this.$units.convert.lengthUnit();
    },
    x() {
      return sineTableAngle({
        cupRadius: this.rMm,
        targetROC: this.rocMm,
      });
    },
  },
};
</script>
