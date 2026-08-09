<template>
  <div>
    <div class="card-title justify-center mb-3">
      <div class="badge badge-outline badge-sm">
        {{ $t("spherometerFeetRadius.title") }}
      </div>
    </div>
    <div class="alert mb-3 py-1">
      <div class="text-xs">
        <p>{{ $t("spherometerFeetRadius.formula") }}</p>
      </div>
    </div>
    <SpherometerSelector @spherometer-selected="onSpherometerSelected" />
    <div v-if="isValid" class="alert alert-success mt-4 py-2">
      <div class="text-sm">
        <p class="font-semibold">
          {{ $t("spherometerFeetRadius.feetRadiusLabel") }}
          <strong>{{ feetRadius.toFixed(4) }}</strong>
          {{ $t("common.mm") }}
        </p>
        <p class="mt-1 text-xs">
          {{ $t("spherometerFeetRadius.sensitivityLabel") }}
          <strong>{{ sensitivity.toFixed(4) }}</strong>
          {{ $t("common.mm") }}
        </p>
      </div>
    </div>
    <div v-else class="alert alert-warning mt-4 py-2">
      <div class="text-xs">
        {{ $t("spherometerFeetRadius.invalidTriangle") }}
      </div>
    </div>
    <div class="alert alert-info mt-2 py-1">
      <div class="text-xs">
        <p>{{ $t("spherometerFeetRadius.precisionHint") }}</p>
      </div>
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{
        $t("spherometerFeetRadius.outsideA")
      }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="outsideA"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="onInput('outsideA', $event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{
        $t("spherometerFeetRadius.outsideB")
      }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="outsideB"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="onInput('outsideB', $event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{
        $t("spherometerFeetRadius.outsideC")
      }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="outsideC"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="onInput('outsideC', $event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{
        $t("spherometerFeetRadius.ballDiameter")
      }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="ballDiameter"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="onInput('ballDiameter', $event.target.value)"
      />
    </div>
    <p class="text-xs opacity-70 -mt-1 mb-2">
      {{ $t("spherometerFeetRadius.measurementHint") }}
    </p>
    <div class="alert mt-3 py-1">
      <div class="text-xs">
        <p>
          {{ $t("spherometerFeetRadius.hardwareHint") }}
          <router-link to="/hardware" class="link">{{
            $t("common.hardware")
          }}</router-link>
          {{ $t("selectors.tabSuffixManage") }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { get, set, parseFloat } from "./utils";
import { spherometerTriangle } from "./formulas";
import SpherometerSelector from "./SpherometerSelector.vue";

const STORAGE_KEY = "__spherometer_feet_radius";
const MEASUREMENT_PRECISION = 0.001;

export default {
  name: "SpherometerFeetRadius",
  components: {
    SpherometerSelector,
  },
  data() {
    return {
      outsideA: get(STORAGE_KEY, "outsideA", "142.564"),
      outsideB: get(STORAGE_KEY, "outsideB", "142.564"),
      outsideC: get(STORAGE_KEY, "outsideC", "142.564"),
      ballDiameter: get(STORAGE_KEY, "ballDiameter", "4"),
    };
  },
  methods: {
    onInput(key, value) {
      set(
        this,
        STORAGE_KEY,
        {
          outsideA: this.outsideA,
          outsideB: this.outsideB,
          outsideC: this.outsideC,
          ballDiameter: this.ballDiameter,
        },
        key,
        value,
      );
    },
    onSpherometerSelected(spherometer) {
      this.onInput("ballDiameter", spherometer.ballRadius2.toString());
    },
  },
  computed: {
    measurements() {
      return {
        outsideA: parseFloat(this.outsideA),
        outsideB: parseFloat(this.outsideB),
        outsideC: parseFloat(this.outsideC),
        ballDiameter: parseFloat(this.ballDiameter),
      };
    },
    centers() {
      return spherometerTriangle.footCenterDistances(this.measurements);
    },
    feetRadius() {
      return spherometerTriangle.circumradius(this.centers);
    },
    sensitivity() {
      return spherometerTriangle.sensitivity({
        ...this.measurements,
        delta: MEASUREMENT_PRECISION,
      });
    },
    isValid() {
      return !isNaN(this.feetRadius) && isFinite(this.feetRadius);
    },
  },
};
</script>
