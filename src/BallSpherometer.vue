<template>
  <div>
    <div class="card-title justify-center mb-3">
      <div class="badge badge-outline badge-sm">{{ $t('spherometer.formula') }}</div>
    </div>
    <SpherometerSelector @spherometer-selected="onSpherometerSelected" />
    <div class="alert alert-success mt-4 py-2">
      <span class="text-sm font-semibold"
        >{{ $t('spherometer.rocLabel') }} <strong>{{ roc.toFixed(2) }}</strong> {{ $t('common.mm') }}</span
      >
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{ $t('spherometer.feetRadius') }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="r"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="r = $event.target.value"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{ $t('spherometer.sagitta') }}</label>
      <input
        class="input input-bordered input-sm w-full"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        :value="s"
        @input="s = $event.target.value"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{ $t('spherometer.ballDiameter') }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="b"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="b = $event.target.value"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{ $t('spherometer.curveLabel') }}</label>
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
import SpherometerSelector from "./SpherometerSelector.vue";

export default {
  name: "BallSpherometer",
  data() {
    return {
      r: "40",
      s: "3",
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
    roc() {
      const r = parseFloat(this.r);
      const s = parseFloat(this.s);
      const b =
        this.curve === "concave" ? parseFloat(this.b) : -parseFloat(this.b);
      const roc = (r * r + s * s) / (2 * s) + b / 2;
      return roc;
    },
  },
};
</script>
