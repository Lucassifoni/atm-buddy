<template>
  <div>
    <div class="card-title justify-center mb-3">
      <div class="badge badge-outline badge-sm">
        {{ $t("sphericalAberration.formula") }}
      </div>
    </div>
    <div class="alert alert-success mt-4 py-2">
      <div class="text-sm">
        <p class="font-semibold">
          {{ $t("sphericalAberration.resultLabel") }}
          <strong>{{ result.relativeToParabola.toFixed(4) }}</strong>
          {{ $t("sphericalAberration.waves") }}
        </p>
        <p class="mt-1">
          {{ $t("sphericalAberration.totalCorrectionLabel") }}
          <strong>{{ result.totalCorrection.toFixed(4) }}</strong>
          {{ $t("sphericalAberration.waves") }}
        </p>
        <p class="mt-1">
          {{ $t("sphericalAberration.toCurrentConicLabel") }}
          <strong>{{ result.toCurrentConic.toFixed(4) }}</strong>
          {{ $t("sphericalAberration.waves") }}
        </p>
      </div>
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{
        $t("sphericalAberration.diameter")
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
      <label class="label text-xs font-medium">{{
        $t("sphericalAberration.focalLength")
      }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="focalLength"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="set('focalLength', $event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{
        $t("sphericalAberration.conic")
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
        $t("sphericalAberration.wavelength")
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
import { sphericalAberration as sphericalAberrationFormula } from "./formulas";

const toN = (a) => Number(normalize(a));

export default {
  name: "SphericalAberration",
  data() {
    return {
      diameter: get("__spherical_aberration", "diameter", "300"),
      focalLength: get("__spherical_aberration", "focalLength", "1200"),
      conic: get("__spherical_aberration", "conic", "-1"),
      wavelength: get("__spherical_aberration", "wavelength", "550"),
    };
  },
  methods: {
    set(key, value) {
      set(
        this,
        "__spherical_aberration",
        {
          diameter: this.diameter,
          focalLength: this.focalLength,
          conic: this.conic,
          wavelength: this.wavelength,
        },
        key,
        value,
      );
    },
  },
  computed: {
    result() {
      return sphericalAberrationFormula({
        diameter: toN(this.diameter),
        focalLength: toN(this.focalLength),
        conic: toN(this.conic),
        wavelengthNm: toN(this.wavelength),
      });
    },
  },
};
</script>
