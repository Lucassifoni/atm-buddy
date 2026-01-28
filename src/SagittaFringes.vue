<template>
  <div>
    <div class="card-title justify-center mb-3">
      <div class="badge badge-outline badge-sm">
        {{ $t("sagittaFringes.title") }}
      </div>
    </div>
    <OpticalPieceSelector @optical-piece-selected="onOpticalPieceSelected" />
    <div class="alert alert-success mt-4 py-2" v-if="!isNaN(rocTestFace)">
      <span class="text-sm font-semibold"
        >{{ $t("sagittaFringes.rocLabel") }} <strong>{{ rocDisplay }}</strong>
        {{ lengthUnit }}</span
      >
    </div>
    <div class="alert alert-error mt-4 py-2" v-else>
      <span class="text-sm font-semibold">{{
        $t("sagittaFringes.invalidInput")
      }}</span>
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{
        $t("sagittaFringes.lambda")
      }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="lambda"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="setLambda($event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium"
        >{{ $t("sagittaFringes.contactDiameter") }} ({{ lengthUnit }}):</label
      >
      <input
        class="input input-bordered input-sm w-full"
        :value="displayContactDiameter"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="setContactDiameter($event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium"
        >{{ $t("sagittaFringes.concaveRoc") }} ({{ lengthUnit }}):</label
      >
      <input
        class="input input-bordered input-sm w-full"
        :value="displayConcaveRoc"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="setConcaveRoc($event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{
        $t("sagittaFringes.nbFringes")
      }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="nbFringes"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="setNbFringes($event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{
        $t("sagittaFringes.relativeShape")
      }}</label>
      <div class="flex gap-3">
        <label class="cursor-pointer flex items-center gap-1">
          <input
            type="radio"
            name="relativeShape"
            value="1"
            :checked="relativeShape === 1"
            @change="relativeShape = 1"
            class="radio radio-primary radio-sm"
          />
          <span class="text-xs">{{ $t("sagittaFringes.concavity") }}</span>
        </label>
        <label class="cursor-pointer flex items-center gap-1">
          <input
            type="radio"
            name="relativeShape"
            value="-1"
            :checked="relativeShape === -1"
            @change="relativeShape = -1"
            class="radio radio-primary radio-sm"
          />
          <span class="text-xs">{{ $t("sagittaFringes.convexity") }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import { sagittaFringes } from "./formulas";
import OpticalPieceSelector from "./OpticalPieceSelector.vue";

export default {
  name: "SagittaFringes",
  components: {
    OpticalPieceSelector,
  },
  data() {
    return {
      lambda: 550,
      contactDiameterMm: 0,
      concaveRocMm: 0,
      nbFringes: 0,
      relativeShape: 1,
    };
  },
  methods: {
    setLambda(value) {
      this.lambda = parseFloat(value) || 0;
    },
    setContactDiameter(value) {
      this.contactDiameterMm = this.$units.convert.lengthFromDisplay(
        parseFloat(value) || 0,
      );
    },
    setConcaveRoc(value) {
      this.concaveRocMm = this.$units.convert.lengthFromDisplay(
        parseFloat(value) || 0,
      );
    },
    setNbFringes(value) {
      this.nbFringes = parseFloat(value) || 0;
    },
    onOpticalPieceSelected(piece) {
      this.concaveRocMm = piece.radiusOfCurvature;
      this.contactDiameterMm = piece.radius * 2;
    },
  },
  computed: {
    displayContactDiameter() {
      return this.$units.convert.lengthToDisplay(this.contactDiameterMm);
    },
    displayConcaveRoc() {
      return this.$units.convert.lengthToDisplay(this.concaveRocMm);
    },
    lengthUnit() {
      return this.$units.convert.lengthUnit();
    },
    rocTestFace() {
      return sagittaFringes.rocFromFringes({
        wavelengthNm: this.lambda,
        contactDiameter: this.contactDiameterMm,
        concaveROC: this.concaveRocMm,
        fringeCount: this.nbFringes,
        relativeShape: this.relativeShape,
      });
    },
    rocDisplay() {
      return this.$units.convert.formatLength(this.rocTestFace);
    },
  },
};
</script>
