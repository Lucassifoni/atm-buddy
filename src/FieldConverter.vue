<template>
  <div>
    <div class="card-title justify-center mb-3">
      <div class="badge badge-outline badge-sm">
        {{ $t("fieldConverter.title") }}
      </div>
    </div>
    <div class="alert alert mb-3 py-1">
      <div class="text-xs">
        <p>{{ $t("fieldConverter.formula") }}</p>
      </div>
    </div>
    <OpticalPieceSelector @optical-piece-selected="onOpticalPieceSelected" />
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{
        $t("fieldConverter.focalLength")
      }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="focalLength"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="onFocalLength($event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{
        $t("fieldConverter.fieldHeight")
      }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="fieldHeight"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="onFieldHeight($event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{
        $t("fieldConverter.tfov")
      }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="tfov"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="onTfov($event.target.value)"
      />
    </div>
  </div>
</template>

<script>
import { get, set, parseFloat } from "./utils";
import { fieldConverter } from "./formulas";
import OpticalPieceSelector from "./OpticalPieceSelector.vue";

const STORAGE_KEY = "__field_converter";

export default {
  name: "FieldConverter",
  components: {
    OpticalPieceSelector,
  },
  data() {
    return {
      focalLength: get(STORAGE_KEY, "focalLength", "1200"),
      fieldHeight: get(STORAGE_KEY, "fieldHeight", "27"),
      tfov: get(STORAGE_KEY, "tfov", ""),
      lastEdited: get(STORAGE_KEY, "lastEdited", "fieldHeight"),
    };
  },
  mounted() {
    this.recompute();
  },
  methods: {
    persist() {
      set(
        this,
        STORAGE_KEY,
        {
          focalLength: this.focalLength,
          fieldHeight: this.fieldHeight,
          tfov: this.tfov,
          lastEdited: this.lastEdited,
        },
        "focalLength",
        this.focalLength,
      );
    },
    recompute() {
      const focalLength = parseFloat(this.focalLength);
      if (this.lastEdited === "tfov") {
        const height = fieldConverter.heightFromTfov({
          tfovDegrees: parseFloat(this.tfov),
          focalLength,
        });
        this.fieldHeight = this.format(height);
      } else {
        const angle = fieldConverter.tfovFromHeight({
          fieldHeightMm: parseFloat(this.fieldHeight),
          focalLength,
        });
        this.tfov = this.format(angle);
      }
      this.persist();
    },
    format(value) {
      if (!isFinite(value)) return "";
      return Number(value.toFixed(4)).toString();
    },
    onOpticalPieceSelected(piece) {
      this.focalLength = (piece.radiusOfCurvature / 2).toString();
      this.recompute();
    },
    onFocalLength(value) {
      this.focalLength = value;
      this.recompute();
    },
    onFieldHeight(value) {
      this.fieldHeight = value;
      this.lastEdited = "fieldHeight";
      this.recompute();
    },
    onTfov(value) {
      this.tfov = value;
      this.lastEdited = "tfov";
      this.recompute();
    },
  },
};
</script>
