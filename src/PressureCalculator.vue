<template>
  <div>
    <div class="card-title justify-center mb-3">
      <div class="badge badge-outline badge-sm">{{ $t('pressure.formula') }}</div>
    </div>
    <PolisherSelector @polisher-selected="onPolisherSelected" />
    <div class="alert alert-success mt-4 py-2">
      <span class="text-sm font-semibold"
        >{{ $t('pressure.weightToAdd') }} <strong>{{ weightToAdd.toFixed(0) }}</strong> {{ $t('common.grams') }}</span
      >
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{ $t('pressure.polisherDiameter') }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="diameter"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="diameter = $event.target.value"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{ $t('pressure.polisherWeight') }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="polisherWeight"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="polisherWeight = $event.target.value"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{ $t('pressure.targetPressure') }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="targetPressure"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="targetPressure = $event.target.value"
      />
    </div>
    <div class="alert alert-info mt-4 py-2">
      <span class="text-xs">
        {{ $t('pressure.totalMass') }} <strong>{{ totalMass.toFixed(0) }}</strong> {{ $t('common.grams') }}
      </span>
    </div>
    <div v-if="polisherTooHeavy" class="alert alert-warning mt-4 py-2">
      <span class="text-xs">
        {{ $t('pressure.exceedsPressure') }} ({{ actualPressure.toFixed(1) }}
        {{ $t('pressure.pressureUnit') }})
      </span>
    </div>
  </div>
</template>

<script>
import { parseFloat } from "./utils";
import { pressure } from "./formulas";
import PolisherSelector from "./PolisherSelector.vue";

const MM_TO_CM = 0.1;

export default {
  name: "PressureCalculator",
  components: {
    PolisherSelector,
  },
  data() {
    return {
      diameter: "200",
      polisherWeight: "500",
      targetPressure: "30",
    };
  },
  methods: {
    onPolisherSelected(polisher) {
      this.diameter = polisher.diameter.toString();
      this.polisherWeight = polisher.weight.toString();
    },
  },
  computed: {
    radiusCm() {
      return (parseFloat(this.diameter) * MM_TO_CM) / 2;
    },
    totalMass() {
      return pressure.totalMassForPressure({
        radius: this.radiusCm,
        targetPressure: parseFloat(this.targetPressure),
      });
    },
    weightToAdd() {
      return pressure.weightToAdd({
        radius: this.radiusCm,
        polisherWeight: parseFloat(this.polisherWeight),
        targetPressure: parseFloat(this.targetPressure),
      });
    },
    polisherTooHeavy() {
      return parseFloat(this.polisherWeight) > this.totalMass;
    },
    actualPressure() {
      return pressure.actualPressure({
        radius: this.radiusCm,
        polisherWeight: parseFloat(this.polisherWeight),
      });
    },
  },
};
</script>
