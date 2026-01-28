<template>
  <div>
    <div class="card-title justify-center mb-3">
      <div class="badge badge-outline badge-sm">
        {{ $t("spherometer.formula") }}
      </div>
    </div>
    <SpherometerSelector @spherometer-selected="onSpherometerSelected" />
    <div class="alert alert-success mt-4 py-2">
      <span class="text-sm font-semibold"
        >{{ $t("spherometer.rocLabel") }} <strong>{{ rocDisplay }}</strong>
        {{ lengthUnit }}</span
      >
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium"
        >{{ $t("spherometer.feetRadius") }} ({{ lengthUnit }}):</label
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
        >{{ $t("spherometer.sagitta") }} ({{ lengthUnit }}):</label
      >
      <input
        class="input input-bordered input-sm w-full"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        :value="displayS"
        @input="setS($event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium"
        >{{ $t("spherometer.ballDiameter") }} ({{ lengthUnit }}):</label
      >
      <input
        class="input input-bordered input-sm w-full"
        :value="displayB"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="setB($event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{
        $t("spherometer.curveLabel")
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
import { ballSpherometerROC } from "./formulas";
import SpherometerSelector from "./SpherometerSelector.vue";

export default {
  name: "BallSpherometer",
  data() {
    return {
      rMm: 40,
      sMm: 3,
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
    setS(value) {
      this.sMm = this.$units.convert.lengthFromDisplay(parseFloat(value) || 0);
    },
    setB(value) {
      this.bMm = this.$units.convert.lengthFromDisplay(parseFloat(value) || 0);
    },
  },
  computed: {
    displayR() {
      return this.$units.convert.lengthToDisplay(this.rMm);
    },
    displayS() {
      return this.$units.convert.lengthToDisplay(this.sMm);
    },
    displayB() {
      return this.$units.convert.lengthToDisplay(this.bMm);
    },
    lengthUnit() {
      return this.$units.convert.lengthUnit();
    },
    roc() {
      return ballSpherometerROC({
        feetRadius: this.rMm,
        sagitta: this.sMm,
        ballDiameter: this.bMm,
        curve: this.curve,
      });
    },
    rocDisplay() {
      return this.$units.convert.formatLength(this.roc);
    },
  },
};
</script>
