<template>
  <div>
    <div class="card-title justify-center mb-3">
      <div class="badge badge-outline badge-sm">
        {{ $t("pressure.formula") }}
      </div>
    </div>
    <PolisherSelector @polisher-selected="onPolisherSelected" />
    <div class="alert alert-success mt-4 py-2">
      <span class="text-sm font-semibold"
        >{{ $t("pressure.weightToAdd") }}
        <strong>{{ weightToAddDisplay }}</strong> {{ massUnit }}</span
      >
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium"
        >{{ $t("pressure.polisherDiameter") }} ({{ lengthUnit }}):</label
      >
      <input
        class="input input-bordered input-sm w-full"
        :value="displayDiameter"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="setDiameter($event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium"
        >{{ $t("pressure.polisherWeight") }} ({{ massUnit }}):</label
      >
      <input
        class="input input-bordered input-sm w-full"
        :value="displayPolisherWeight"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="setPolisherWeight($event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium"
        >{{ $t("pressure.targetPressure") }} ({{ pressureUnit }}):</label
      >
      <input
        class="input input-bordered input-sm w-full"
        :value="displayTargetPressure"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="setTargetPressure($event.target.value)"
      />
    </div>
    <div class="alert alert-info mt-4 py-2">
      <span class="text-xs">
        {{ $t("pressure.totalMass") }} <strong>{{ totalMassDisplay }}</strong>
        {{ massUnit }}
      </span>
    </div>
    <div v-if="polisherTooHeavy" class="alert alert-warning mt-4 py-2">
      <span class="text-xs">
        {{ $t("pressure.exceedsPressure") }} ({{ actualPressureDisplay }}
        {{ pressureUnit }})
      </span>
    </div>
  </div>
</template>

<script>
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
      diameterMm: 200,
      polisherWeightG: 500,
      targetPressureGcm2: 30,
    };
  },
  methods: {
    onPolisherSelected(polisher) {
      this.diameterMm = polisher.diameter;
      this.polisherWeightG = polisher.weight;
    },
    setDiameter(value) {
      this.diameterMm = this.$units.convert.lengthFromDisplay(
        parseFloat(value) || 0,
      );
    },
    setPolisherWeight(value) {
      this.polisherWeightG = this.$units.convert.massFromDisplay(
        parseFloat(value) || 0,
      );
    },
    setTargetPressure(value) {
      this.targetPressureGcm2 = this.$units.convert.pressureFromDisplay(
        parseFloat(value) || 0,
      );
    },
  },
  computed: {
    displayDiameter() {
      return this.$units.convert.lengthToDisplay(this.diameterMm);
    },
    displayPolisherWeight() {
      return this.$units.convert.massToDisplay(this.polisherWeightG);
    },
    displayTargetPressure() {
      return this.$units.convert.pressureToDisplay(this.targetPressureGcm2);
    },
    lengthUnit() {
      return this.$units.convert.lengthUnit();
    },
    massUnit() {
      return this.$units.convert.massUnit();
    },
    pressureUnit() {
      return this.$units.convert.pressureUnit();
    },
    radiusCm() {
      return (this.diameterMm * MM_TO_CM) / 2;
    },
    totalMass() {
      return pressure.totalMassForPressure({
        radius: this.radiusCm,
        targetPressure: this.targetPressureGcm2,
      });
    },
    totalMassDisplay() {
      return this.$units.convert.formatMass(this.totalMass);
    },
    weightToAdd() {
      return pressure.weightToAdd({
        radius: this.radiusCm,
        polisherWeight: this.polisherWeightG,
        targetPressure: this.targetPressureGcm2,
      });
    },
    weightToAddDisplay() {
      return this.$units.convert.formatMass(this.weightToAdd);
    },
    polisherTooHeavy() {
      return this.polisherWeightG > this.totalMass;
    },
    actualPressure() {
      return pressure.actualPressure({
        radius: this.radiusCm,
        polisherWeight: this.polisherWeightG,
      });
    },
    actualPressureDisplay() {
      return this.$units.convert.formatPressure(this.actualPressure);
    },
  },
};
</script>
