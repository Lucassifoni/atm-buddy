<template>
  <div>
    <div class="card-title justify-center mb-3">
      <div class="badge badge-outline badge-sm">
        {{ formulaDisplay }}
      </div>
    </div>
    <OpticalPieceSelector @optical-piece-selected="onOpticalPieceSelected" />
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{
        $t("foucault.mirrorDiameter")
      }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="mirrorDiameter"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="set('mirrorDiameter', $event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{
        $t("foucault.paraxialRoc")
      }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="roc"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="set('roc', $event.target.value)"
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
        @input="set('conic', $event.target.value)"
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
              v-model="sourceConfig"
              @change="set('sourceConfig', 'fixed')"
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
              v-model="sourceConfig"
              @change="set('sourceConfig', 'moving')"
              class="radio radio-primary radio-sm"
            />
          </div>
          <span class="text-xs">{{ $t("foucault.movingSource") }}</span>
        </label>
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
                v-model="dividingMode"
                @change="set('dividingMode', 'linear')"
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
                v-model="dividingMode"
                @change="set('dividingMode', 'equal_area')"
                class="radio radio-primary radio-sm"
              />
            </div>
            <span class="text-xs">{{ $t("foucault.equalArea") }}</span>
          </label>
        </div>
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
          @input="set('numZones', $event.target.value)"
        />
      </div>
      <div class="overflow-x-auto mt-2">
        <table class="table table-xs w-full">
          <thead>
            <tr>
              <th class="text-xs">{{ $t("common.zone") }}</th>
              <th class="text-xs">{{ $t("foucault.radiusMm") }}</th>
              <th class="text-xs">{{ $t("foucault.hmMm") }}</th>
              <th class="text-xs">Hm²/R</th>
              <th class="text-xs">Hm/2R</th>
              <th class="text-xs">{{ $t("foucault.laMm") }}</th>
              <th class="text-xs">{{ $t("foucault.relativeLa") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="zone in customZones" :key="zone.index">
              <td class="text-xs">{{ zone.normalized.toFixed(3) }}</td>
              <td class="text-xs">{{ zone.radiusMm.toFixed(1) }}</td>
              <td class="text-xs">{{ zone.hm.toFixed(1) }}</td>
              <td class="text-xs">{{ zone.hmSqOverR.toFixed(3) }}</td>
              <td class="text-xs">{{ zone.hmOverTwoR.toFixed(5) }}</td>
              <td class="text-xs">{{ zone.la.toFixed(3) }}</td>
              <td class="text-xs">{{ zone.relativeLa.toFixed(3) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Couder mask section hidden (WIP) -->

    <div class="card bg-base-200 p-3 mt-3">
      <h4 class="text-sm font-semibold mb-2">{{ $t("foucault.summary") }}</h4>
      <p class="text-xs">
        {{ $t("foucault.totalLa") }}
        <strong>{{ totalLA.toFixed(3) }} {{ $t("common.mm") }}</strong>
      </p>
      <p class="text-xs">
        {{ $t("foucault.conic") }} <strong>{{ conicDescription }}</strong>
      </p>
      <p class="text-xs text-gray-500 mt-1">{{ sourceConfigDescription }}</p>
    </div>
  </div>
</template>

<script>
import { get, set, normalize } from "./utils";
import { foucault } from "./formulas";
import OpticalPieceSelector from "./OpticalPieceSelector.vue";

const toN = (a) => Number(normalize(a));

export default {
  name: "FoucaultLA",
  components: {
    OpticalPieceSelector,
  },
  data() {
    return {
      mirrorDiameter: get("__foucault_la", "mirrorDiameter", "200"),
      roc: get("__foucault_la", "roc", "1600"),
      conic: get("__foucault_la", "conic", "-1"),
      numZones: get("__foucault_la", "numZones", "10"),
      sourceConfig: get("__foucault_la", "sourceConfig", "moving"),
      dividingMode: get("__foucault_la", "dividingMode", "equal_area"),
    };
  },
  methods: {
    set(key, value) {
      set(
        this,
        "__foucault_la",
        {
          mirrorDiameter: this.mirrorDiameter,
          roc: this.roc,
          conic: this.conic,
          numZones: this.numZones,
          sourceConfig: this.sourceConfig,
          dividingMode: this.dividingMode,
        },
        key,
        value,
      );
    },
    normalize,
    onOpticalPieceSelected(piece) {
      this.set("mirrorDiameter", (piece.radius * 2).toString());
      this.set("roc", piece.radiusOfCurvature.toString());
    },
    downloadMaskSvg() {
      const svg = this.maskSvg;
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `couder-mask-${toN(this.mirrorDiameter)}mm.svg`;
      a.click();
      URL.revokeObjectURL(url);
    },
    calculateLA(radiusMm) {
      return foucault.longitudinalAberration({
        zoneRadius: radiusMm,
        radiusOfCurvature: toN(this.roc),
        conicConstant: toN(this.conic),
        sourceConfig: this.sourceConfig,
      });
    },
  },
  computed: {
    mirrorRadius() {
      return toN(this.mirrorDiameter) / 2;
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
    customZones() {
      return foucault.generateZones({
        mirrorRadius: this.mirrorRadius,
        radiusOfCurvature: toN(this.roc),
        conicConstant: toN(this.conic),
        sourceConfig: this.sourceConfig,
        numZones: toN(this.numZones),
        dividingMode: this.dividingMode,
      });
    },
    totalLA() {
      return this.calculateLA(this.mirrorRadius);
    },
    maskSvg() {
      return foucault.generateMaskSvg({
        mirrorDiameter: toN(this.mirrorDiameter),
        zones: this.customZones,
      });
    },
    maskSvgPreview() {
      return this.maskSvg
        .replace(/width="[^"]*"/, 'width="100%"')
        .replace(/height="[^"]*"/, 'height="auto"');
    },
    conicDescription() {
      const k = toN(this.conic);
      if (k === 0) return this.$t("foucault.sphere");
      if (k === -1) return this.$t("foucault.parabola");
      if (k > 0) return this.$t("foucault.oblateEllipsoid");
      if (k > -1) return this.$t("foucault.prolateEllipsoid");
      return this.$t("foucault.hyperbola");
    },
  },
};
</script>
