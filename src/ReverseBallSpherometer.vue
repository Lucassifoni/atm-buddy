<template>
  <div>
    <div class="card-title justify-center mb-3">
      <div class="badge badge-outline badge-sm">
        {{ $t('reverseSpherometer.formula') }}
      </div>
    </div>
    <SpherometerSelector @spherometer-selected="onSpherometerSelected" />
    <div class="alert alert-success mt-4 py-2">
      <span class="text-sm font-semibold"
        >{{ $t('reverseSpherometer.sagittaLabel') }} <strong>{{ sag.toFixed(3) }}</strong> {{ $t('common.mm') }}</span
      >
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{ $t('reverseSpherometer.feetRadius') }}</label>
      <input
        class="input input-bordered input-sm w-full"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        :value="r"
        @input="r = $event.target.value"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{ $t('reverseSpherometer.desiredRoc') }}</label>
      <input
        class="input input-bordered input-sm w-full"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        :value="R"
        @input="R = $event.target.value"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{ $t('reverseSpherometer.ballDiameter') }}</label>
      <input
        class="input input-bordered input-sm w-full"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        :value="b"
        @input="b = $event.target.value"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{ $t('reverseSpherometer.curveLabel') }}</label>
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
          <span class="text-xs">{{ $t('common.concave') }}</span>
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
          <span class="text-xs">{{ $t('common.convex') }}</span>
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
      return reverseBallSpherometerSagitta({
        feetRadius: parseFloat(this.r),
        targetROC: parseFloat(this.R),
        ballDiameter: parseFloat(this.b),
        curve: this.curve,
      });
    },
  },
};
</script>
