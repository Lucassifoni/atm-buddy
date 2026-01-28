<template>
  <div>
    <div class="card-title justify-center mb-3">
      <div class="badge badge-outline badge-sm">
        {{ $t("comaFree.title") }}
      </div>
    </div>
    <div class="alert alert mb-3 py-1">
      <div class="text-xs">
        <p>{{ $t("comaFree.formula") }}</p>
      </div>
    </div>
    <OpticalPieceSelector @optical-piece-selected="onOpticalPieceSelected" />
    <div class="alert alert-success mt-4 py-2">
      <div class="text-xs">
        <p>
          <strong>{{ $t("comaFree.focalRatio") }}</strong>
          {{ $t("comaFree.fPrefix") }}{{ ratio.toFixed(2) }}
        </p>
        <p>
          <strong>{{ $t("comaFree.comaFreeLinear") }}</strong>
          {{ comaFreeLinearDisplay }} {{ lengthUnit }}
        </p>
        <p>
          <strong>{{ $t("comaFree.comaFreeApparent") }}</strong>
          {{ comaFreeApparent.toFixed(4) }}{{ $t("common.degrees") }}
        </p>
        <p>
          <strong>{{ $t("comaFree.comaFreeEyepiece") }}</strong>
          {{ comaFreeInEyepiece.toFixed(1) }}{{ $t("comaFree.ofAfov") }}
          {{ displayAfov }}{{ $t("common.degrees") }} {{ $t("comaFree.afov") }}
        </p>
      </div>
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium"
        >{{ $t("comaFree.diameter") }} ({{ lengthUnit }}):</label
      >
      <input
        class="input input-bordered input-sm w-full"
        :value="displayD"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="setD($event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium"
        >{{ $t("comaFree.focalLength") }} ({{ lengthUnit }}):</label
      >
      <input
        class="input input-bordered input-sm w-full"
        :value="displayF"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="setF($event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium"
        >{{ $t("comaFree.eyepieceFl") }} ({{ lengthUnit }}):</label
      >
      <input
        class="input input-bordered input-sm w-full"
        :value="displayEyepieceFl"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="setEyepieceFl($event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{
        $t("comaFree.eyepieceAfov")
      }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="displayAfov"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="setAfov($event.target.value)"
      />
    </div>
  </div>
</template>

<script>
import { normalize } from "./utils";
import { focalRatio, comaFree } from "./formulas";
import OpticalPieceSelector from "./OpticalPieceSelector.vue";

export default {
  name: "ComaFreeRadius",
  data() {
    return {
      fMm: 1200,
      dMm: 300,
      afovDeg: 82,
      eyepieceFlMm: 10,
    };
  },
  components: {
    OpticalPieceSelector,
  },
  methods: {
    normalize,
    onOpticalPieceSelected(piece) {
      this.dMm = piece.radius * 2;
      this.fMm = piece.radiusOfCurvature / 2;
    },
    setD(value) {
      this.dMm = this.$units.convert.lengthFromDisplay(parseFloat(value) || 0);
    },
    setF(value) {
      this.fMm = this.$units.convert.lengthFromDisplay(parseFloat(value) || 0);
    },
    setEyepieceFl(value) {
      this.eyepieceFlMm = this.$units.convert.lengthFromDisplay(
        parseFloat(value) || 0,
      );
    },
    setAfov(value) {
      this.afovDeg = parseFloat(value) || 0;
    },
  },
  computed: {
    displayD() {
      return this.$units.convert.lengthToDisplay(this.dMm);
    },
    displayF() {
      return this.$units.convert.lengthToDisplay(this.fMm);
    },
    displayEyepieceFl() {
      return this.$units.convert.lengthToDisplay(this.eyepieceFlMm);
    },
    displayAfov() {
      return this.afovDeg;
    },
    lengthUnit() {
      return this.$units.convert.lengthUnit();
    },
    ratio() {
      return focalRatio({
        focalLength: this.fMm,
        diameter: this.dMm,
      });
    },
    comaFreeLinear() {
      return comaFree.linearRadius({
        focalLength: this.fMm,
        diameter: this.dMm,
      });
    },
    comaFreeLinearDisplay() {
      return this.$units.convert.formatLength(this.comaFreeLinear);
    },
    comaFreeApparent() {
      return comaFree.apparentField({
        focalLength: this.fMm,
        diameter: this.dMm,
      });
    },
    magnification() {
      return comaFree.magnification({
        focalLength: this.fMm,
        eyepieceFocalLength: this.eyepieceFlMm,
      });
    },
    trueFov() {
      return comaFree.trueFieldOfView({
        focalLength: this.fMm,
        eyepieceFocalLength: this.eyepieceFlMm,
        apparentFOV: this.afovDeg,
      });
    },
    comaFreeInEyepiece() {
      return comaFree.inEyepiece({
        focalLength: this.fMm,
        diameter: this.dMm,
        eyepieceFocalLength: this.eyepieceFlMm,
        apparentFOV: this.afovDeg,
      });
    },
  },
};
</script>
