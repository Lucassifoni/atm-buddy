<template>
  <div>
    <div class="card-title justify-center mb-3">
      <div class="badge badge-outline badge-sm">
        {{ $t('mpcc.title') }}
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
        <p><strong>{{ $t('mpcc.focalRatio') }}</strong> {{ ratio.toFixed(2) }}</p>
        <p>
          <strong>{{ $t('mpcc.parabolaCorrection') }}</strong>
          {{ correction.toFixed(2) }}
        </p>
        <p>
          <strong>{{ $t('mpcc.mpccUndercorrection') }}</strong>
          {{ undercorrection.toFixed(2) }}
        </p>
        <p><strong>{{ $t('mpcc.targetConic') }}</strong> {{ target.toFixed(3) }}</p>
      </div>
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{ $t('mpcc.diameter') }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="d"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="d = $event.target.value"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{ $t('mpcc.focalLength') }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="f"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="f = $event.target.value"
      />
    </div>
  </div>
</template>

<script>
import { normalize, parseFloat } from "./utils";
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
      f: "1200",
      d: "300",
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
      return focalRatio({
        focalLength: parseFloat(this.f),
        diameter: parseFloat(this.d),
      });
    },
    correction() {
      return mpccCorrection({
        diameter: parseFloat(this.d),
        focalLength: parseFloat(this.f),
      });
    },
    undercorrection() {
      return mpccUndercorrection({
        focalLength: parseFloat(this.f),
        diameter: parseFloat(this.d),
      });
    },
    target() {
      return mpccTargetConic({
        diameter: parseFloat(this.d),
        focalLength: parseFloat(this.f),
      });
    },
  },
};
</script>
