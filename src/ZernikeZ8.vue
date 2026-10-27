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
        {{ $t("zernikeZ8.compareHint") }}
      </p>
      <div class="overflow-x-auto">
        <table class="table table-xs w-full text-center">
          <thead>
            <tr>
              <th class="text-xs sticky left-0 z-10 bg-white">
                {{ $t("zernikeZ8.tableCorner") }}
              </th>
              <th v-for="d in diameters" :key="d" class="text-xs text-center">
                {{ d }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in table" :key="row.fRatio">
              <th class="text-xs sticky left-0 z-10 bg-white">
                {{ row.fRatio }}
              </th>
              <td
                v-for="(value, i) in row.values"
                :key="diameters[i]"
                class="text-xs tabular-nums cursor-pointer"
                :class="{
                  'font-bold outline outline-2 -outline-offset-2 outline-primary':
                    isSelected({ diameter: diameters[i], fRatio: row.fRatio }),
                }"
                :style="cellStyle(value)"
                role="button"
                tabindex="0"
                @click="toggle({ diameter: diameters[i], fRatio: row.fRatio })"
                @keydown.enter="
                  toggle({ diameter: diameters[i], fRatio: row.fRatio })
                "
              >
                {{ format(value, 1) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="mt-4">
      <div class="flex flex-wrap items-center gap-2 mb-1">
        <h4 class="text-sm font-semibold mr-auto">
          {{ $t("zernikeZ8.compareTitle") }}
        </h4>
        <button
          class="btn btn-outline btn-xs"
          :disabled="!currentMirror || isSelected(currentMirror)"
          @click="toggle(currentMirror)"
        >
          {{ $t("zernikeZ8.addCurrent") }}
        </button>
        <button
          class="btn btn-outline btn-xs"
          :disabled="selected.length === 0"
          @click="set('selected', [])"
        >
          {{ $t("zernikeZ8.clear") }}
        </button>
      </div>
      <p v-if="comparison.length === 0" class="text-xs opacity-70">
        {{ $t("zernikeZ8.compareEmpty") }}
      </p>
      <div v-else class="overflow-x-auto">
        <table class="table table-xs w-full">
          <thead>
            <tr>
              <th class="text-xs">{{ $t("zernikeZ8.compareMirror") }}</th>
              <th class="text-xs text-right">Z8</th>
              <th class="text-xs text-right">
                {{ $t("zernikeZ8.compareRelative") }}
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in comparison"
              :key="row.diameter + '@' + row.fRatio"
            >
              <td class="text-xs whitespace-nowrap">
                {{ row.diameter }} mm f/{{ Number(row.fRatio.toFixed(2)) }}
              </td>
              <td
                class="text-xs text-right tabular-nums"
                :style="cellStyle(row.coefficient)"
              >
                {{ format(row.coefficient, 2) }}
              </td>
              <td class="text-xs text-right tabular-nums">
                ×{{ format(row.relative, 1) }}
              </td>
              <td class="text-right">
                <button
                  class="btn btn-ghost btn-xs"
                  :aria-label="$t('zernikeZ8.remove')"
                  @click="toggle(row)"
                >
                  ✕
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import {
  get,
  set,
  normalize,
  heatHue,
  heatDarkness,
  steps,
  toggleIn,
} from "./utils";
import {
  zernikeZ8,
  zernikeZ8Table,
  zernikeZ8MinimumWavelength,
  shortestLaserAbove,
  zernikeZ8Comparison,
} from "./formulas";
import OpticalPieceSelector from "./OpticalPieceSelector.vue";

const STORAGE_KEY = "__zernike_z8";
const F_RATIOS = [
  ...steps({ from: 6, to: 4, step: -0.5 }),
  ...steps({ from: 3.75, to: 2, step: -0.25 }),
];
const DIAMETERS = steps({ from: 100, to: 1000, step: 50 });
const SCALE = { yellowAt: 9, redAt: 11, darkenFrom: 12.5, darkestAt: 25 };
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

const sameMirror = (a, b) => a.diameter === b.diameter && a.fRatio === b.fRatio;

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
      selected: get(STORAGE_KEY, "selected", []),
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
          selected: this.selected,
        },
        key,
        value,
      );
    },
    isSelected(mirror) {
      return this.selected.some((other) => sameMirror(other, mirror));
    },
    toggle(mirror) {
      this.set(
        "selected",
        toggleIn(
          this.selected,
          { diameter: mirror.diameter, fRatio: mirror.fRatio },
          sameMirror,
        ),
      );
    },
    format(value, digits) {
      return isFinite(value) ? value.toFixed(digits) : "-";
    },
    cellStyle(value) {
      const hue = heatHue(value, SCALE);
      if (hue === null) return {};
      const darkness = heatDarkness(value, SCALE);
      return {
        backgroundColor: `hsl(${hue} 85% ${50 - 25 * darkness}% / ${0.35 + 0.55 * darkness})`,
        color: darkness > 0.4 ? "white" : undefined,
      };
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
    currentMirror() {
      const diameter = toN(this.diameter);
      const fRatio = toN(this.roc) / (2 * diameter);
      return diameter > 0 && fRatio > 0 && isFinite(fRatio)
        ? { diameter, fRatio }
        : null;
    },
    comparison() {
      return zernikeZ8Comparison({
        mirrors: this.selected,
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
