<template>
  <div>
    <div class="card-title justify-center mb-3">
      <div class="badge badge-outline badge-sm">
        {{ $t("reverseSpherometer.formula") }}
      </div>
    </div>
    <SpherometerSelector @spherometer-selected="onSpherometerSelected" />
    <div class="alert alert-success mt-4 py-2">
      <span class="text-sm font-semibold"
        >{{ $t("reverseSpherometer.sagittaLabel") }}
        <strong>{{ sagDisplay }}</strong> {{ lengthUnit }}</span
      >
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium"
        >{{ $t("reverseSpherometer.feetRadius") }} ({{ lengthUnit }}):</label
      >
      <input
        class="input input-bordered input-sm w-full"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        :value="displayR"
        @input="setR($event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium"
        >{{ $t("reverseSpherometer.desiredRoc") }} ({{ lengthUnit }}):</label
      >
      <input
        class="input input-bordered input-sm w-full"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        :value="displayROC"
        @input="setROC($event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium"
        >{{ $t("reverseSpherometer.ballDiameter") }} ({{ lengthUnit }}):</label
      >
      <input
        class="input input-bordered input-sm w-full"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        :value="displayB"
        @input="setB($event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{
        $t("reverseSpherometer.curveLabel")
      }}</label>
      <div class="flex gap-3">
        <label class="cursor-pointer flex items-center gap-1">
          <div>
            <input
              type="radio"
              value="concave"
              v-model="curve"
              class="radio radio-primary radio-sm"
            />
          </div>
          <span class="text-xs">{{ $t("common.concave") }}</span>
        </label>
        <label class="cursor-pointer flex items-center gap-1">
          <div>
            <input
              type="radio"
              value="convex"
              v-model="curve"
              class="radio radio-primary radio-sm"
            />
          </div>
          <span class="text-xs">{{ $t("common.convex") }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import { normalize, parseFloat } from "./utils";
import { reverseBallSpherometerSagitta } from "./formulas";
import SpherometerSelector from "./SpherometerSelector.vue";

export default {
  name: "ReverseBallSpherometer",
  data() {
    return {
      rocMm: 2500,
      rMm: 35,
      bMm: 3,
      curve: "concave",
    };
  },
  components: {
    SpherometerSelector,
  },
  methods: {
    normalize,
    onSpherometerSelected(spherometer) {
      this.rMm = spherometer.feetRadius;
      this.bMm = spherometer.ballRadius2;
    },
    setR(value) {
      this.rMm = this.$units.convert.lengthFromDisplay(parseFloat(value) || 0);
    },
    setROC(value) {
      this.rocMm = this.$units.convert.lengthFromDisplay(
        parseFloat(value) || 0,
      );
    },
    setB(value) {
      this.bMm = this.$units.convert.lengthFromDisplay(parseFloat(value) || 0);
    },
  },
  computed: {
    displayR() {
      return this.$units.convert.lengthToDisplay(this.rMm);
    },
    displayROC() {
      return this.$units.convert.lengthToDisplay(this.rocMm);
    },
    displayB() {
      return this.$units.convert.lengthToDisplay(this.bMm);
    },
    lengthUnit() {
      return this.$units.convert.lengthUnit();
    },
    sag() {
      return reverseBallSpherometerSagitta({
        feetRadius: this.rMm,
        targetROC: this.rocMm,
        ballDiameter: this.bMm,
        curve: this.curve,
      });
    },
    sagDisplay() {
      return this.$units.convert.formatLength(this.sag);
    },
  },
};
</script>
