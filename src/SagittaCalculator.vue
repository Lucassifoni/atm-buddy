<template>
  <div>
    <div class="card-title justify-center mb-3">
      <div class="badge badge-outline badge-sm">{{ $t('sagittaCalc.formula') }}</div>
    </div>
    <OpticalPieceSelector @optical-piece-selected="onOpticalPieceSelected" />
    <div class="alert alert-success mt-4 py-2">
      <span class="text-sm font-semibold"
        >{{ $t('sagittaCalc.sagittaLabel') }} <strong>{{ sagitta.toFixed(3) }}</strong> {{ $t('common.mm') }}</span
      >
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{ $t('sagittaCalc.mirrorRadius') }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="r"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="set('r', $event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{ $t('sagittaCalc.rocLabel') }}</label>
      <input
        class="input input-bordered input-sm w-full"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        :value="roc"
        @input="set('roc', $event.target.value)"
      />
    </div>
  </div>
</template>

<script>
import { get, set, normalize } from "./utils";
import { sagitta as sagittaFormula } from "./formulas";
import OpticalPieceSelector from "./OpticalPieceSelector.vue";

const toN = (a) => Number(normalize(a));

export default {
  name: "SagittaCalculator",
  data() {
    return {
      r: get("__sagitta", "r", "100"),
      roc: get("__sagitta", "roc", "2000"),
    };
  },
  components: {
    OpticalPieceSelector,
  },
  methods: {
    set(key, value) {
      set(this, "__sagitta", { r: this.r, roc: this.roc }, key, value);
    },
    normalize,
    onOpticalPieceSelected(piece) {
      this.set("r", piece.radius.toString());
      this.set("roc", piece.radiusOfCurvature.toString());
    },
  },
  computed: {
    sagitta() {
      return sagittaFormula({
        mirrorRadius: toN(this.r),
        radiusOfCurvature: toN(this.roc),
      });
    },
  },
};
</script>
