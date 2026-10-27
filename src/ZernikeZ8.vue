<template>
  <div>
    <div class="card-title justify-center mb-3">
      <div class="badge badge-outline badge-sm">
        {{ $t("zernikeZ8.formula") }}
      </div>
    </div>
    <p class="text-xs opacity-70 text-center mb-3">
      {{ $t("zernikeZ8.source") }}
      <br />
      {{ $t("zernikeZ8.sources") }}
      <template v-for="(source, i) in sources" :key="source.url">
        <span v-if="i > 0"> · </span>
        <a
          class="underline"
          :href="source.url"
          target="_blank"
          rel="noopener noreferrer"
          >{{ source.label }}</a
        >
      </template>
    </p>
    <OpticalPieceSelector @optical-piece-selected="onOpticalPieceSelected" />
    <div class="alert alert-success mt-4 py-2">
      <div class="text-sm">
        <p class="font-semibold">
          {{ $t("zernikeZ8.coefficientLabel") }}
          <strong>{{ format(result.coefficient, 3) }}</strong>
          {{ $t("zernikeZ8.waves") }}
        </p>
        <p class="mt-1">
          {{ $t("zernikeZ8.peakToValleyLabel") }}
          <strong>{{ format(result.peakToValley, 3) }}</strong>
          {{ $t("zernikeZ8.waves") }}
        </p>
      </div>
    </div>
    <div v-if="tooHigh" class="alert alert-warning mt-2 py-2">
      <div class="text-sm">
        <p>
          {{
            $t("zernikeZ8.tooHigh", {
              limit: SCALE.yellowAt,
              minimum: format(minimumWavelength, 0),
            })
          }}
        </p>
        <p v-if="suggestion" class="mt-1">
          {{
            $t(
              suggestion.found
                ? "zernikeZ8.suggestLaser"
                : "zernikeZ8.noLaserLongEnough",
              {
                laser: $t("zernikeZ8.lasers." + suggestion.laser.key),
                z8: format(suggestion.z8, 2),
              },
            )
          }}
          <button
            v-if="suggestion.found"
            class="btn btn-warning btn-xs ml-1"
            @click="set('wavelength', suggestion.laser.nm.toString())"
          >
            {{ $t("zernikeZ8.useLaser") }}
          </button>
        </p>
      </div>
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{
        $t("zernikeZ8.diameter")
      }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="diameter"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="set('diameter', $event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{ $t("zernikeZ8.roc") }}</label>
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
        $t("zernikeZ8.wavelength")
      }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="wavelength"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="set('wavelength', $event.target.value)"
      />
    </div>
    <div class="flex flex-wrap items-center gap-1 mt-1">
      <span class="text-xs opacity-70">{{ $t("zernikeZ8.laserPresets") }}</span>
      <button
        v-for="laser in lasers"
        :key="laser.key"
        :title="$t('zernikeZ8.lasers.' + laser.key)"
        class="btn btn-xs"
        :class="wavelengthNm === laser.nm ? 'btn-primary' : 'btn-outline'"
        @click="set('wavelength', laser.nm.toString())"
      >
        {{ laser.nm }}
      </button>
    </div>
    <div class="mt-4">
      <h4 class="text-sm font-semibold mb-1">
        {{ $t("zernikeZ8.tableTitle") }}
      </h4>
      <p class="text-xs opacity-70 mb-2">
        {{ $t("zernikeZ8.tableHint", { wavelength: format(wavelengthNm, 1) }) }}
      </p>
      <div class="overflow-x-auto">
        <table class="table table-xs w-full text-center">
          <thead>
            <tr>
              <th class="text-xs">{{ $t("zernikeZ8.tableCorner") }}</th>
              <th v-for="d in diameters" :key="d" class="text-xs text-center">
                {{ d }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in table" :key="row.fRatio">
              <th class="text-xs">{{ row.fRatio.toFixed(1) }}</th>
              <td
                v-for="(value, i) in row.values"
                :key="diameters[i]"
                class="text-xs tabular-nums"
                :style="cellStyle(value)"
              >
                {{ format(value, 1) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { get, set, normalize, heatHue } from "./utils";
import {
  zernikeZ8,
  zernikeZ8Table,
  zernikeZ8MinimumWavelength,
  shortestLaserAbove,
} from "./formulas";
import OpticalPieceSelector from "./OpticalPieceSelector.vue";

const STORAGE_KEY = "__zernike_z8";
const F_RATIOS = Array.from({ length: 9 }, (_, i) => 6 - i * 0.5);
const DIAMETERS = Array.from({ length: 10 }, (_, i) => (i + 1) * 100);
const SCALE = { yellowAt: 9, redAt: 11 };
const LASERS = [
  { key: "violet", nm: 405 },
  { key: "greenPointer", nm: 518 },
  { key: "green", nm: 532 },
  { key: "hene", nm: 632.8 },
  { key: "red", nm: 650 },
];

const SOURCES = [
  {
    label: "GAP47 – Interféromètre de Bath",
    url: "https://gap47.astrosurf.com/index.php/technique/optique-instruments/controles-optiques/interferometre-de-bath/",
  },
  {
    label: "DFTFringe – mirrordlg.cpp",
    url: "https://github.com/githubdoe/DFTFringe/blob/ed91d93c946be6cc27246d264709695107155aef/mirrordlg.cpp#L552",
  },
];

const toN = (a) => Number(normalize(a));

export default {
  name: "ZernikeZ8",
  components: {
    OpticalPieceSelector,
  },
  data() {
    return {
      diameter: get(STORAGE_KEY, "diameter", "300"),
      roc: get(STORAGE_KEY, "roc", "2400"),
      wavelength: get(STORAGE_KEY, "wavelength", "632.8"),
      diameters: DIAMETERS,
      lasers: LASERS,
      sources: SOURCES,
      SCALE,
    };
  },
  methods: {
    onOpticalPieceSelected(piece) {
      this.set("diameter", (piece.radius * 2).toString());
      this.set("roc", piece.radiusOfCurvature.toString());
    },
    set(key, value) {
      set(
        this,
        STORAGE_KEY,
        {
          diameter: this.diameter,
          roc: this.roc,
          wavelength: this.wavelength,
        },
        key,
        value,
      );
    },
    format(value, digits) {
      return isFinite(value) ? value.toFixed(digits) : "-";
    },
    cellStyle(value) {
      const hue = heatHue(value, SCALE);
      return hue === null
        ? {}
        : { backgroundColor: `hsl(${hue} 85% 50% / 0.35)` };
    },
  },
  computed: {
    wavelengthNm() {
      return toN(this.wavelength);
    },
    result() {
      return zernikeZ8({
        diameter: toN(this.diameter),
        radiusOfCurvature: toN(this.roc),
        wavelengthNm: this.wavelengthNm,
      });
    },
    tooHigh() {
      return this.result.coefficient > SCALE.yellowAt;
    },
    minimumWavelength() {
      return zernikeZ8MinimumWavelength({
        diameter: toN(this.diameter),
        radiusOfCurvature: toN(this.roc),
        maxCoefficient: SCALE.yellowAt,
      });
    },
    suggestion() {
      const found = shortestLaserAbove({
        lasers: LASERS,
        minimumNm: this.minimumWavelength,
      });
      const laser = found || LASERS[LASERS.length - 1];
      if (!found && laser.nm <= this.wavelengthNm) return null;
      return {
        found: Boolean(found),
        laser,
        z8: zernikeZ8({
          diameter: toN(this.diameter),
          radiusOfCurvature: toN(this.roc),
          wavelengthNm: laser.nm,
        }).coefficient,
      };
    },
    table() {
      return zernikeZ8Table({
        fRatios: F_RATIOS,
        diameters: DIAMETERS,
        wavelengthNm: this.wavelengthNm,
      });
    },
  },
};
</script>
