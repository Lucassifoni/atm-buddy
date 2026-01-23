<template>
  <div>
    <div class="card-title justify-center mb-3">
      <div class="badge badge-outline badge-sm">
        {{ formulaDisplay }}
      </div>
    </div>
    <OpticalPieceSelector @optical-piece-selected="onOpticalPieceSelected" />
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{ $t('foucault.mirrorDiameter') }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="mirrorDiameter"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="set('mirrorDiameter', $event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{ $t('foucault.paraxialRoc') }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="roc"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="set('roc', $event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{ $t('foucault.conicConstant') }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="conic"
        inputmode="decimal"
        pattern="-?[0-9]*[.,]?[0-9]*"
        @input="set('conic', $event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{ $t('foucault.sourceConfig') }}</label>
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
          <span class="text-xs">{{ $t('foucault.fixedSource') }}</span>
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
          <span class="text-xs">{{ $t('foucault.movingSource') }}</span>
        </label>
      </div>
    </div>

    <div class="card bg-base-200 p-3 mt-3">
      <h4 class="text-sm font-semibold mb-2">{{ $t('foucault.standardZones') }}</h4>
      <div class="overflow-x-auto">
        <table class="table table-xs w-full">
          <thead>
            <tr>
              <th class="text-xs">{{ $t('common.zone') }}</th>
              <th class="text-xs">{{ $t('foucault.radiusMm') }}</th>
              <th class="text-xs">{{ $t('foucault.laMm') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="zone in standardZones" :key="zone.normalized">
              <td class="text-xs">{{ zone.normalized }}</td>
              <td class="text-xs">{{ zone.radiusMm.toFixed(1) }}</td>
              <td class="text-xs">{{ zone.la.toFixed(3) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card bg-base-200 p-3 mt-3">
      <h4 class="text-sm font-semibold mb-2">{{ $t('foucault.customZones') }}</h4>
      <div class="field-horizontal">
        <label class="label text-xs font-medium">{{ $t('foucault.dividingMode') }}</label>
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
            <span class="text-xs">{{ $t('foucault.linear') }}</span>
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
            <span class="text-xs">{{ $t('foucault.equalArea') }}</span>
          </label>
        </div>
      </div>
      <div class="field-horizontal">
        <label class="label text-xs font-medium">{{ $t('foucault.inputMode') }}</label>
        <div class="flex gap-3">
          <label class="cursor-pointer flex items-center gap-1">
            <div>
              <input
                type="radio"
                value="normalized"
                v-model="inputMode"
                @change="set('inputMode', 'normalized')"
                class="radio radio-primary radio-sm"
              />
            </div>
            <span class="text-xs">{{ $t('foucault.normalized') }}</span>
          </label>
          <label class="cursor-pointer flex items-center gap-1">
            <div>
              <input
                type="radio"
                value="mm"
                v-model="inputMode"
                @change="set('inputMode', 'mm')"
                class="radio radio-primary radio-sm"
              />
            </div>
            <span class="text-xs">{{ $t('foucault.millimeters') }}</span>
          </label>
        </div>
      </div>
      <div class="field-horizontal">
        <label class="label text-xs font-medium">
          {{ $t('foucault.startZone') }} ({{ inputMode === "normalized" ? $t('foucault.normalized') : $t('common.mm') }}):
        </label>
        <input
          class="input input-bordered input-sm w-full"
          :value="startZone"
          inputmode="decimal"
          pattern="[0-9]*[.,]?[0-9]*"
          @input="set('startZone', $event.target.value)"
        />
      </div>
      <div class="field-horizontal">
        <label class="label text-xs font-medium">
          {{ $t('foucault.endZone') }} ({{ inputMode === "normalized" ? $t('foucault.normalized') : $t('common.mm') }}):
        </label>
        <input
          class="input input-bordered input-sm w-full"
          :value="endZone"
          inputmode="decimal"
          pattern="[0-9]*[.,]?[0-9]*"
          @input="set('endZone', $event.target.value)"
        />
      </div>
      <div class="field-horizontal">
        <label class="label text-xs font-medium">{{ $t('foucault.numZones') }}</label>
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
              <th class="text-xs">{{ $t('common.zone') }}</th>
              <th class="text-xs">{{ $t('foucault.radiusMm') }}</th>
              <th class="text-xs">{{ $t('foucault.laMm') }}</th>
              <th class="text-xs">{{ $t('foucault.relativeLa') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="zone in customZones" :key="zone.index">
              <td class="text-xs">{{ zone.normalized.toFixed(3) }}</td>
              <td class="text-xs">{{ zone.radiusMm.toFixed(1) }}</td>
              <td class="text-xs">{{ zone.la.toFixed(3) }}</td>
              <td class="text-xs">{{ zone.relativeLa.toFixed(3) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card bg-base-200 p-3 mt-3">
      <h4 class="text-sm font-semibold mb-2">{{ $t('foucault.summary') }}</h4>
      <p class="text-xs">
        {{ $t('foucault.totalLa') }} <strong>{{ totalLA.toFixed(3) }} {{ $t('common.mm') }}</strong>
      </p>
      <p class="text-xs">
        {{ $t('foucault.conic') }} <strong>{{ conicDescription }}</strong>
      </p>
      <p class="text-xs text-gray-500 mt-1">{{ sourceConfigDescription }}</p>
    </div>
  </div>
</template>

<script>
import { get, set, normalize } from "./utils";
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
      startZone: get("__foucault_la", "startZone", "0"),
      endZone: get("__foucault_la", "endZone", "1"),
      numZones: get("__foucault_la", "numZones", "10"),
      inputMode: get("__foucault_la", "inputMode", "normalized"),
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
          startZone: this.startZone,
          endZone: this.endZone,
          numZones: this.numZones,
          inputMode: this.inputMode,
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
    calculateLA(radiusMm) {
      const rocVal = toN(this.roc);
      const k = toN(this.conic);
      if (rocVal === 0) return 0;
      const divisor = this.sourceConfig === "moving" ? 2 * rocVal : rocVal;
      return (-k * radiusMm * radiusMm) / divisor;
    },
  },
  computed: {
    mirrorRadius() {
      return toN(this.mirrorDiameter) / 2;
    },
    formulaDisplay() {
      return this.sourceConfig === "moving"
        ? this.$t('foucault.formulaMoving')
        : this.$t('foucault.formulaFixed');
    },
    sourceConfigDescription() {
      return this.sourceConfig === "moving"
        ? this.$t('foucault.movingDesc')
        : this.$t('foucault.fixedDesc');
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
      if (this.inputMode === "normalized") {
        return this.mirrorRadius * toN(this.startZone);
      }
      return toN(this.startZone);
    },
    endZoneMm() {
      if (this.inputMode === "normalized") {
        return this.mirrorRadius * toN(this.endZone);
      }
      return toN(this.endZone);
    },
    customZones() {
      const n = Math.max(2, Math.min(50, Math.floor(toN(this.numZones))));
      const start = this.startZoneMm;
      const end = this.endZoneMm;
      const baseLa = this.calculateLA(start);

      const result = [];
      for (let i = 0; i < n; i++) {
        let radiusMm;
        if (this.dividingMode === "equal_area") {
          const startSq = start * start;
          const endSq = end * end;
          radiusMm = Math.sqrt(startSq + (i * (endSq - startSq)) / (n - 1));
        } else {
          radiusMm = start + (i * (end - start)) / (n - 1);
        }
        const normalized =
          this.mirrorRadius > 0 ? radiusMm / this.mirrorRadius : 0;
        const la = this.calculateLA(radiusMm);
        result.push({
          index: i,
          normalized,
          radiusMm,
          la,
          relativeLa: la - baseLa,
        });
      }
      return result;
    },
    totalLA() {
      return this.calculateLA(this.mirrorRadius);
    },
    conicDescription() {
      const k = toN(this.conic);
      if (k === 0) return this.$t('foucault.sphere');
      if (k === -1) return this.$t('foucault.parabola');
      if (k > 0) return this.$t('foucault.oblateEllipsoid');
      if (k > -1) return this.$t('foucault.prolateEllipsoid');
      return this.$t('foucault.hyperbola');
    },
  },
};
</script>
