<template>
  <div>
    <div class="card-title justify-center mb-3">
      <div class="badge badge-outline badge-sm">{{ $t('sineTable.formula') }}</div>
    </div>
    <div class="alert mb-3 py-2">
      <div>
        <p class="text-xs" v-html="$t('sineTable.explanation')"></p>
      </div>
    </div>
    <OpticalPieceSelector @optical-piece-selected="onOpticalPieceSelected" />
    <div class="alert alert-success mt-4 py-2">
      <span class="text-sm font-semibold"
        >{{ $t('sineTable.angleLabel') }} <strong>{{ x.toFixed(2) }}{{ $t('common.degrees') }}</strong></span
      >
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{ $t('sineTable.cupRadius') }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="r"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="r = $event.target.value"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{ $t('sineTable.desiredRoc') }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="R"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="R = $event.target.value"
      />
    </div>
  </div>
</template>

<script>
import { normalize, parseFloat } from "./utils";
import { sineTableAngle } from "./formulas";
import OpticalPieceSelector from "./OpticalPieceSelector.vue";

export default {
  name: "SineTableEquation",
  components: {
    OpticalPieceSelector,
  },
  data() {
    return {
      r: "125",
      R: "2500",
    };
  },
  methods: {
    normalize,
    onOpticalPieceSelected(piece) {
      this.R = piece.radiusOfCurvature.toString();
    },
  },
  computed: {
    x() {
      return sineTableAngle({
        cupRadius: parseFloat(this.r),
        targetROC: parseFloat(this.R),
      });
    },
  },
};
</script>
