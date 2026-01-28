<template>
  <div>
    <div class="card-title justify-center mb-3">
      <div class="badge badge-outline badge-sm">
        {{ $t("sagittaCalc.formula") }}
      </div>
    </div>
    <OpticalPieceSelector @optical-piece-selected="onOpticalPieceSelected" />
    <div class="alert alert-success mt-4 py-2">
      <span class="text-sm font-semibold"
        >{{ $t("sagittaCalc.sagittaLabel") }}
        <strong>{{ sagittaDisplay }}</strong> {{ lengthUnit }}</span
      >
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium"
        >{{ $t("sagittaCalc.mirrorRadius") }} ({{ lengthUnit }}):</label
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
        >{{ $t("sagittaCalc.rocLabel") }} ({{ lengthUnit }}):</label
      >
      <input
        class="input input-bordered input-sm w-full"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        :value="displayRoc"
        @input="setRoc($event.target.value)"
      />
    </div>
  </div>
</template>

<script>
import { normalize } from "./utils";
import { sagitta as sagittaFormula } from "./formulas";
import OpticalPieceSelector from "./OpticalPieceSelector.vue";

export default {
  name: "SagittaCalculator",
  data() {
    return {
      rMm: 100,
      rocMm: 2000,
    };
  },
  components: {
    OpticalPieceSelector,
  },
  methods: {
    normalize,
    setR(value) {
      this.rMm = this.$units.convert.lengthFromDisplay(parseFloat(value) || 0);
    },
    setRoc(value) {
      this.rocMm = this.$units.convert.lengthFromDisplay(
        parseFloat(value) || 0,
      );
    },
    onOpticalPieceSelected(piece) {
      this.rMm = piece.radius;
      this.rocMm = piece.radiusOfCurvature;
    },
  },
  computed: {
    displayR() {
      return this.$units.convert.lengthToDisplay(this.rMm);
    },
    displayRoc() {
      return this.$units.convert.lengthToDisplay(this.rocMm);
    },
    lengthUnit() {
      return this.$units.convert.lengthUnit();
    },
    sagitta() {
      return sagittaFormula({
        mirrorRadius: this.rMm,
        radiusOfCurvature: this.rocMm,
      });
    },
    sagittaDisplay() {
      return this.$units.convert.formatLength(this.sagitta);
    },
  },
};
</script>
