<template>
  <div>
    <div class="card-title justify-center mb-3">
      <div class="badge badge-outline badge-sm">
        {{ $t('comaFree.title') }}
      </div>
    </div>
    <div class="alert alert mb-3 py-1">
      <div class="text-xs">
        <p>{{ $t('comaFree.formula') }}</p>
      </div>
    </div>
    <OpticalPieceSelector @optical-piece-selected="onOpticalPieceSelected" />
    <div class="alert alert-success mt-4 py-2">
      <div class="text-xs">
        <p><strong>{{ $t('comaFree.focalRatio') }}</strong> {{ $t('comaFree.fPrefix') }}{{ ratio.toFixed(2) }}</p>
        <p>
          <strong>{{ $t('comaFree.comaFreeLinear') }}</strong>
          {{ comaFreeLinear.toFixed(3) }} {{ $t('common.mm') }}
        </p>
        <p>
          <strong>{{ $t('comaFree.comaFreeApparent') }}</strong>
          {{ comaFreeApparent.toFixed(4) }}{{ $t('common.degrees') }}
        </p>
        <p>
          <strong>{{ $t('comaFree.comaFreeEyepiece') }}</strong>
          {{ comaFreeInEyepiece.toFixed(1) }}{{ $t('comaFree.ofAfov') }} {{ afov }}{{ $t('common.degrees') }} {{ $t('comaFree.afov') }}
        </p>
      </div>
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{ $t('comaFree.diameter') }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="d"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="d = $event.target.value"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{ $t('comaFree.focalLength') }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="f"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="f = $event.target.value"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{ $t('comaFree.eyepieceFl') }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="eyepieceFl"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="eyepieceFl = $event.target.value"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{ $t('comaFree.eyepieceAfov') }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="afov"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="afov = $event.target.value"
      />
    </div>
  </div>
</template>

<script>
import { normalize, parseFloat } from "./utils";
import OpticalPieceSelector from "./OpticalPieceSelector.vue";

export default {
  name: "ComaFreeRadius",
  data() {
    return {
      f: "1200",
      d: "300",
      afov: "82",
      eyepieceFl: "10",
    };
  },
  components: {
    OpticalPieceSelector,
  },
  methods: {
    normalize,
    onOpticalPieceSelected(piece) {
      this.d = (piece.radius * 2).toString();
      this.f = (piece.radiusOfCurvature / 2).toString();
    },
  },
  computed: {
    ratio() {
      const f = parseFloat(this.f);
      const d = parseFloat(this.d);
      return f / d;
    },
    comaFreeLinear() {
      const r = this.ratio;
      return 0.022 * r * r * r;
    },
    comaFreeApparent() {
      const f = parseFloat(this.f);
      return 2 * Math.atan(this.comaFreeLinear / (2 * f)) * (180 / Math.PI);
    },
    magnification() {
      const f = parseFloat(this.f);
      const eyepieceFl = parseFloat(this.eyepieceFl);
      return f / eyepieceFl;
    },
    trueFov() {
      const afov = parseFloat(this.afov);
      return afov / this.magnification;
    },
    comaFreeInEyepiece() {
      const afov = parseFloat(this.afov);
      return (this.comaFreeApparent / this.trueFov) * afov;
    },
  },
};
</script>
