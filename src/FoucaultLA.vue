<template>
  <div>
    <div class="card-title justify-center mb-3">
      <div class="badge badge-outline badge-sm">
        {{ formulaDisplay }}
      </div>
    </div>
    <OpticalPieceSelector @optical-piece-selected="onOpticalPieceSelected" />
    <div class="field-horizontal">
      <label class="label text-xs font-medium"
        >{{ $t("foucault.mirrorDiameter") }} ({{ lengthUnit }}):</label
      >
      <input
        class="input input-bordered input-sm w-full"
        :value="displayMirrorDiameter"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="setMirrorDiameter($event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium"
        >{{ $t("foucault.paraxialRoc") }} ({{ lengthUnit }}):</label
      >
      <input
        class="input input-bordered input-sm w-full"
        :value="displayRoc"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="setRoc($event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{
        $t("foucault.conicConstant")
      }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="conic"
        inputmode="decimal"
        pattern="-?[0-9]*[.,]?[0-9]*"
        @input="setConic($event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{
        $t("foucault.sourceConfig")
      }}</label>
      <div class="flex gap-3">
        <label class="cursor-pointer flex items-center gap-1">
          <div>
            <input
              type="radio"
              value="fixed"
              :checked="sourceConfig === 'fixed'"
              @change="setSourceConfig('fixed')"
              class="radio radio-primary radio-sm"
            />
          </div>
          <span class="text-xs">{{ $t("foucault.fixedSource") }}</span>
        </label>
        <label class="cursor-pointer flex items-center gap-1">
          <div>
            <input
              type="radio"
              value="moving"
              :checked="sourceConfig === 'moving'"
              @change="setSourceConfig('moving')"
              class="radio radio-primary radio-sm"
            />
          </div>
          <span class="text-xs">{{ $t("foucault.movingSource") }}</span>
        </label>
      </div>
    </div>

    <div class="card bg-base-200 p-3 mt-3">
      <h4 class="text-sm font-semibold mb-2">
        {{ $t("foucault.standardZones") }}
      </h4>
      <div class="overflow-x-auto">
        <table class="table table-xs w-full">
          <thead>
            <tr>
              <th class="text-xs">{{ $t("common.zone") }}</th>
              <th class="text-xs">
                {{ $t("foucault.radius") }} ({{ lengthUnit }})
              </th>
              <th class="text-xs">
                {{ $t("foucault.la") }} ({{ lengthUnit }})
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="zone in standardZones" :key="zone.normalized">
              <td class="text-xs">{{ zone.normalized }}</td>
              <td class="text-xs">
                {{ $units.convert.formatLength(zone.radiusMm) }}
              </td>
              <td class="text-xs">
                {{ $units.convert.formatLength(zone.la) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card bg-base-200 p-3 mt-3">
      <h4 class="text-sm font-semibold mb-2">
        {{ $t("foucault.customZones") }}
      </h4>
      <div class="field-horizontal">
        <label class="label text-xs font-medium">{{
          $t("foucault.dividingMode")
        }}</label>
        <div class="flex gap-3">
          <label class="cursor-pointer flex items-center gap-1">
            <div>
              <input
                type="radio"
                value="linear"
                :checked="dividingMode === 'linear'"
                @change="setDividingMode('linear')"
                class="radio radio-primary radio-sm"
              />
            </div>
            <span class="text-xs">{{ $t("foucault.linear") }}</span>
          </label>
          <label class="cursor-pointer flex items-center gap-1">
            <div>
              <input
                type="radio"
                value="equal_area"
                :checked="dividingMode === 'equal_area'"
                @change="setDividingMode('equal_area')"
                class="radio radio-primary radio-sm"
              />
            </div>
            <span class="text-xs">{{ $t("foucault.equalArea") }}</span>
          </label>
        </div>
      </div>
      <div class="field-horizontal">
        <label class="label text-xs font-medium">{{
          $t("foucault.inputMode")
        }}</label>
        <div class="flex gap-3">
          <label class="cursor-pointer flex items-center gap-1">
            <div>
              <input
                type="radio"
                value="normalized"
                :checked="inputMode === 'normalized'"
                @change="setInputMode('normalized')"
                class="radio radio-primary radio-sm"
              />
            </div>
            <span class="text-xs">{{ $t("foucault.normalized") }}</span>
          </label>
          <label class="cursor-pointer flex items-center gap-1">
            <div>
              <input
                type="radio"
                value="mm"
                :checked="inputMode === 'mm'"
                @change="setInputMode('mm')"
                class="radio radio-primary radio-sm"
              />
            </div>
            <span class="text-xs">{{ $t("foucault.millimeters") }}</span>
          </label>
        </div>
      </div>
      <div class="field-horizontal">
        <label class="label text-xs font-medium">
          {{ $t("foucault.startZone") }} ({{
            inputMode === "normalized" ? $t("foucault.normalized") : lengthUnit
          }}):
        </label>
        <input
          class="input input-bordered input-sm w-full"
          :value="displayStartZone"
          inputmode="decimal"
          pattern="[0-9]*[.,]?[0-9]*"
          @input="setStartZone($event.target.value)"
        />
      </div>
      <div class="field-horizontal">
        <label class="label text-xs font-medium">
          {{ $t("foucault.endZone") }} ({{
            inputMode === "normalized" ? $t("foucault.normalized") : lengthUnit
          }}):
        </label>
        <input
          class="input input-bordered input-sm w-full"
          :value="displayEndZone"
          inputmode="decimal"
          pattern="[0-9]*[.,]?[0-9]*"
          @input="setEndZone($event.target.value)"
        />
      </div>
      <div class="field-horizontal">
        <label class="label text-xs font-medium">{{
          $t("foucault.numZones")
        }}</label>
        <input
          class="input input-bordered input-sm w-full"
          :value="numZones"
          inputmode="numeric"
          pattern="[0-9]*"
          @input="setNumZones($event.target.value)"
        />
      </div>
      <div class="overflow-x-auto mt-2">
        <table class="table table-xs w-full">
          <thead>
            <tr>
              <th class="text-xs">{{ $t("common.zone") }}</th>
              <th class="text-xs">
                {{ $t("foucault.radius") }} ({{ lengthUnit }})
              </th>
              <th class="text-xs">
                {{ $t("foucault.la") }} ({{ lengthUnit }})
              </th>
              <th class="text-xs">{{ $t("foucault.relativeLa") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="zone in customZones" :key="zone.index">
              <td class="text-xs">{{ zone.normalized.toFixed(3) }}</td>
              <td class="text-xs">
                {{ $units.convert.formatLength(zone.radiusMm) }}
              </td>
              <td class="text-xs">
                {{ $units.convert.formatLength(zone.la) }}
              </td>
              <td class="text-xs">{{ zone.relativeLa.toFixed(3) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card bg-base-200 p-3 mt-3">
      <h4 class="text-sm font-semibold mb-2">{{ $t("foucault.summary") }}</h4>
      <p class="text-xs">
        {{ $t("foucault.totalLa") }}
        <strong>{{ totalLADisplay }} {{ lengthUnit }}</strong>
      </p>
      <p class="text-xs">
        {{ $t("foucault.conic") }} <strong>{{ conicDescription }}</strong>
      </p>
      <p class="text-xs text-gray-500 mt-1">{{ sourceConfigDescription }}</p>
    </div>
  </div>
</template>

<script>
import { normalize } from "./utils";
import { foucault } from "./formulas";
import OpticalPieceSelector from "./OpticalPieceSelector.vue";

export default {
  name: "FoucaultLA",
  components: {
    OpticalPieceSelector,
  },
  data() {
    return {
      mirrorDiameterMm: 200,
      rocMm: 1600,
      conic: -1,
      startZoneNorm: 0,
      endZoneNorm: 1,
      numZones: 10,
      inputMode: "normalized",
      sourceConfig: "moving",
      dividingMode: "equal_area",
    };
  },
  methods: {
    normalize,
    setMirrorDiameter(value) {
      this.mirrorDiameterMm = this.$units.convert.lengthFromDisplay(
        parseFloat(value) || 0,
      );
    },
    setRoc(value) {
      this.rocMm = this.$units.convert.lengthFromDisplay(
        parseFloat(value) || 0,
      );
    },
    setConic(value) {
      this.conic = parseFloat(value) || 0;
    },
    setStartZone(value) {
      const parsed = parseFloat(value) || 0;
      if (this.inputMode === "normalized") {
        this.startZoneNorm = parsed;
      } else {
        this.startZoneNorm =
          this.$units.convert.lengthFromDisplay(parsed) / this.mirrorRadius;
      }
    },
    setEndZone(value) {
      const parsed = parseFloat(value) || 0;
      if (this.inputMode === "normalized") {
        this.endZoneNorm = parsed;
      } else {
        this.endZoneNorm =
          this.$units.convert.lengthFromDisplay(parsed) / this.mirrorRadius;
      }
    },
    setNumZones(value) {
      this.numZones = parseInt(value) || 1;
    },
    setInputMode(value) {
      this.inputMode = value;
    },
    setSourceConfig(value) {
      this.sourceConfig = value;
    },
    setDividingMode(value) {
      this.dividingMode = value;
    },
    onOpticalPieceSelected(piece) {
      this.mirrorDiameterMm = piece.radius * 2;
      this.rocMm = piece.radiusOfCurvature;
    },
    calculateLA(radiusMm) {
      return foucault.longitudinalAberration({
        zoneRadius: radiusMm,
        radiusOfCurvature: this.rocMm,
        conicConstant: this.conic,
        sourceConfig: this.sourceConfig,
      });
    },
  },
  computed: {
    displayMirrorDiameter() {
      return this.$units.convert.lengthToDisplay(this.mirrorDiameterMm);
    },
    displayRoc() {
      return this.$units.convert.lengthToDisplay(this.rocMm);
    },
    displayStartZone() {
      if (this.inputMode === "normalized") {
        return this.startZoneNorm;
      }
      return this.$units.convert.lengthToDisplay(
        this.startZoneNorm * this.mirrorRadius,
      );
    },
    displayEndZone() {
      if (this.inputMode === "normalized") {
        return this.endZoneNorm;
      }
      return this.$units.convert.lengthToDisplay(
        this.endZoneNorm * this.mirrorRadius,
      );
    },
    lengthUnit() {
      return this.$units.convert.lengthUnit();
    },
    mirrorRadius() {
      return this.mirrorDiameterMm / 2;
    },
    formulaDisplay() {
      return this.sourceConfig === "moving"
        ? this.$t("foucault.formulaMoving")
        : this.$t("foucault.formulaFixed");
    },
    sourceConfigDescription() {
      return this.sourceConfig === "moving"
        ? this.$t("foucault.movingDesc")
        : this.$t("foucault.fixedDesc");
    },
    standardZones() {
      const normalizedValues = [0.25, 0.5, 0.75, 1];
      return normalizedValues.map((n) => {
        const radiusMm = this.mirrorRadius * n;
        return {
          normalized: n,
          radiusMm,
          la: this.calculateLA(radiusMm),
        };
      });
    },
    startZoneMm() {
      return this.mirrorRadius * this.startZoneNorm;
    },
    endZoneMm() {
      return this.mirrorRadius * this.endZoneNorm;
    },
    customZones() {
      return foucault.generateZones({
        mirrorRadius: this.mirrorRadius,
        radiusOfCurvature: this.rocMm,
        conicConstant: this.conic,
        sourceConfig: this.sourceConfig,
        startRadius: this.startZoneMm,
        endRadius: this.endZoneMm,
        numZones: this.numZones,
        dividingMode: this.dividingMode,
      });
    },
    totalLA() {
      return this.calculateLA(this.mirrorRadius);
    },
    totalLADisplay() {
      return this.$units.convert.formatLength(this.totalLA);
    },
    conicDescription() {
      const k = this.conic;
      if (k === 0) return this.$t("foucault.sphere");
      if (k === -1) return this.$t("foucault.parabola");
      if (k > 0) return this.$t("foucault.oblateEllipsoid");
      if (k > -1) return this.$t("foucault.prolateEllipsoid");
      return this.$t("foucault.hyperbola");
    },
  },
};
</script>
