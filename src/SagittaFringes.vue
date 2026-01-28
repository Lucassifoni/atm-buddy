<template>
  <div>
    <div class="card-title justify-center mb-3">
      <div class="badge badge-outline badge-sm">{{ $t('sagittaFringes.title') }}</div>
    </div>
    <OpticalPieceSelector @optical-piece-selected="onOpticalPieceSelected" />
    <div class="alert alert-success mt-4 py-2" v-if="!isNaN(rocTestFace)">
      <span class="text-sm font-semibold"
        >{{ $t('sagittaFringes.rocLabel') }}
        <strong>{{ rocTestFace.toFixed(2) }}</strong> {{ $t('common.mm') }}</span
      >
    </div>
    <div class="alert alert-error mt-4 py-2" v-else>
      <span class="text-sm font-semibold">{{ $t('sagittaFringes.invalidInput') }}</span>
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{ $t('sagittaFringes.lambda') }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="lambda"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="set('lambda', $event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{ $t('sagittaFringes.contactDiameter') }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="contactDiameter"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="set('contactDiameter', $event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{ $t('sagittaFringes.concaveRoc') }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="concaveRoc"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="set('concaveRoc', $event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{ $t('sagittaFringes.nbFringes') }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="nbFringes"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="set('nbFringes', $event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{ $t('sagittaFringes.relativeShape') }}</label>
      <div class="flex gap-3">
        <label class="cursor-pointer flex items-center gap-1">
          <input
            type="radio"
            name="relativeShape"
            value="1"
            :checked="relativeShape === '1'"
            @change="set('relativeShape', '1')"
            class="radio radio-primary radio-sm"
          />
          <span class="text-xs">{{ $t('sagittaFringes.concavity') }}</span>
        </label>
        <label class="cursor-pointer flex items-center gap-1">
          <input
            type="radio"
            name="relativeShape"
            value="-1"
            :checked="relativeShape === '-1'"
            @change="set('relativeShape', '-1')"
            class="radio radio-primary radio-sm"
          />
          <span class="text-xs">{{ $t('sagittaFringes.convexity') }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import { get, set, normalize } from "./utils.js";
import { sagittaFringes } from "./formulas";
import OpticalPieceSelector from "./OpticalPieceSelector.vue";

const key = "__sagittaFringes";
const toN = (a) => Number(normalize(a));

export default {
  name: "SagittaFringes",
  components: {
    OpticalPieceSelector,
  },
  data() {
    return {
      lambda: get(key, "lambda", "550"),
      contactDiameter: get(key, "contactDiameter", ""),
      concaveRoc: get(key, "concaveRoc", ""),
      nbFringes: get(key, "nbFringes", ""),
      relativeShape: get(key, "relativeShape", "1"),
    };
  },
  methods: {
    set(field, value) {
      set(this, key, this, field, value);
    },
    onOpticalPieceSelected(piece) {
      this.set("concaveRoc", piece.radiusOfCurvature);
      this.set("contactDiameter", piece.radius * 2);
    },
  },
  computed: {
    rocTestFace() {
      return sagittaFringes.rocFromFringes({
        wavelengthNm: toN(this.lambda),
        contactDiameter: toN(this.contactDiameter),
        concaveROC: toN(this.concaveRoc),
        fringeCount: toN(this.nbFringes),
        relativeShape: toN(this.relativeShape),
      });
    },
  },
};
</script>
