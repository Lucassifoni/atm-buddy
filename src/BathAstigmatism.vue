<template>
  <div>
    <div class="card-title justify-center mb-3">
      <div class="badge badge-outline badge-sm">
        {{ $t("bathAstigmatism.formula") }}
      </div>
    </div>
    <div class="alert alert-success mt-4 py-2">
      <span class="text-sm font-semibold"
        >{{ $t("bathAstigmatism.resultLabel") }}
        <strong>{{ result.toFixed(4) }}</strong>
        {{ $t("bathAstigmatism.waves") }}
        <span v-if="result > 0"> (1/{{ Math.round(1 / result) }} wave)</span>
      </span>
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{
        $t("bathAstigmatism.mirrorDiameter")
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
        $t("bathAstigmatism.beamSeparation")
      }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="beamSeparation"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="set('beamSeparation', $event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{
        $t("bathAstigmatism.roc")
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
        $t("bathAstigmatism.wavelength")
      }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="wavelength"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="set('wavelength', $event.target.value)"
      />
    </div>
  </div>
</template>

<script>
import { get, set, normalize } from "./utils";
import { bathAstigmatism as bathAstigmatismFormula } from "./formulas";

const toN = (a) => Number(normalize(a));

export default {
  name: "BathAstigmatism",
  data() {
    return {
      mirrorDiameter: get("__bath_astig", "mirrorDiameter", "300"),
      beamSeparation: get("__bath_astig", "beamSeparation", "5"),
      roc: get("__bath_astig", "roc", "3000"),
      wavelength: get("__bath_astig", "wavelength", "550"),
    };
  },
  methods: {
    set(key, value) {
      set(
        this,
        "__bath_astig",
        {
          mirrorDiameter: this.mirrorDiameter,
          beamSeparation: this.beamSeparation,
          roc: this.roc,
          wavelength: this.wavelength,
        },
        key,
        value,
      );
    },
  },
  computed: {
    result() {
      return bathAstigmatismFormula({
        mirrorDiameter: toN(this.mirrorDiameter),
        beamSeparation: toN(this.beamSeparation),
        radiusOfCurvature: toN(this.roc),
        wavelengthNm: toN(this.wavelength),
      });
    },
  },
};
</script>
