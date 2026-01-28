<template>
  <div>
    <div class="card-title justify-center mb-3">
      <div class="badge badge-outline badge-sm">
        {{ $t("annularRing.title") }}
      </div>
    </div>
    <OpticalPieceSelector @optical-piece-selected="onOpticalPieceSelected" />
    <div class="field-horizontal">
      <label class="label text-xs font-medium"
        >{{ $t("annularRing.mirrorDiameter") }} ({{ lengthUnit }}):</label
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
      <label class="label text-xs font-medium">{{
        $t("annularRing.inputMode")
      }}</label>
      <div class="flex gap-3">
        <label class="cursor-pointer flex items-center gap-1">
          <div>
            <input
              type="radio"
              value="percent"
              v-model="inputMode"
              class="radio radio-primary radio-sm"
            />
          </div>
          <span class="text-xs">{{ $t("annularRing.normalized") }}</span>
        </label>
        <label class="cursor-pointer flex items-center gap-1">
          <div>
            <input
              type="radio"
              value="mm"
              v-model="inputMode"
              class="radio radio-primary radio-sm"
            />
          </div>
          <span class="text-xs">{{ $t("annularRing.millimeters") }}</span>
        </label>
      </div>
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">
        {{ $t("annularRing.centralObstruction") }} ({{
          inputMode === "percent" ? $t("annularRing.normalized") : lengthUnit
        }}):
      </label>
      <input
        class="input input-bordered input-sm w-full"
        :value="displayCentralObstruction"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="setCentralObstruction($event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">
        {{ $t("annularRing.zoneStart") }} ({{
          inputMode === "percent" ? $t("annularRing.normalized") : lengthUnit
        }}):
      </label>
      <input
        class="input input-bordered input-sm w-full"
        :value="displayStartRadius"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="setStartRadius($event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">
        {{ $t("annularRing.zoneEnd") }} ({{
          inputMode === "percent" ? $t("annularRing.normalized") : lengthUnit
        }}):
      </label>
      <input
        class="input input-bordered input-sm w-full"
        :value="displayEndRadius"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="setEndRadius($event.target.value)"
      />
    </div>
    <div
      style="display: flex; align-items: flex-start; gap: 20px; flex-wrap: wrap"
    >
      <div style="flex: 1">
        <h4 class="subtitle is-6">{{ $t("annularRing.results") }}</h4>
        <div class="">
          <div class="flex items-center">
            <label class="">{{ $t("annularRing.surfaceArea") }}</label>
            <span class="font-bold"
              >&nbsp;{{ surfaceAreaDisplay }} {{ lengthUnit }}²</span
            >
          </div>
          <div class="flex items-center">
            <label class="">{{ $t("annularRing.ofTotalArea") }}</label>
            <span class="font-bold"
              >&nbsp;{{ percentageTotal.toFixed(2)
              }}{{ $t("common.percent") }}</span
            >
          </div>
          <p>
            {{ $t("annularRing.ofUnobstructedArea") }}
            <strong>{{ percentageUnobstructed.toFixed(2) }}</strong
            >{{ $t("common.percent") }}
          </p>
          <p>{{ $t("annularRing.shouldFix") }}</p>
        </div>
      </div>
      <div></div>
    </div>
    <div class="card bg-base-200 p-3 mt-3">
      <h4 class="text-sm font-semibold mb-2">{{ $t("annularRing.visual") }}</h4>
      <div class="flex justify-center">
        <canvas
          ref="canvas"
          width="120"
          height="120"
          class="border border-gray-300 rounded"
        ></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { normalize } from "./utils";
import { annularRing, circleArea } from "./formulas";
import OpticalPieceSelector from "./OpticalPieceSelector.vue";

export default {
  name: "AnnularRing",
  components: {
    OpticalPieceSelector,
  },
  data() {
    return {
      mirrorDiameterMm: 200,
      startRadiusNorm: 0.95,
      endRadiusNorm: 0.85,
      inputMode: "percent",
      centralObstructionNorm: 0.3,
    };
  },
  mounted() {
    this.drawCanvas();
  },
  methods: {
    normalize,
    setMirrorDiameter(value) {
      this.mirrorDiameterMm = this.$units.convert.lengthFromDisplay(
        parseFloat(value) || 0,
      );
    },
    setStartRadius(value) {
      const parsed = parseFloat(value) || 0;
      if (this.inputMode === "percent") {
        this.startRadiusNorm = parsed;
      } else {
        this.startRadiusNorm =
          this.$units.convert.lengthFromDisplay(parsed) / this.mirrorRadius;
      }
    },
    setEndRadius(value) {
      const parsed = parseFloat(value) || 0;
      if (this.inputMode === "percent") {
        this.endRadiusNorm = parsed;
      } else {
        this.endRadiusNorm =
          this.$units.convert.lengthFromDisplay(parsed) / this.mirrorRadius;
      }
    },
    setCentralObstruction(value) {
      const parsed = parseFloat(value) || 0;
      if (this.inputMode === "percent") {
        this.centralObstructionNorm = parsed;
      } else {
        this.centralObstructionNorm =
          this.$units.convert.lengthFromDisplay(parsed) / this.mirrorRadius;
      }
    },
    onOpticalPieceSelected(piece) {
      this.mirrorDiameterMm = piece.radius * 2;
    },
    drawCanvas() {
      const canvas = this.$refs.canvas;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      const centerX = 60;
      const centerY = 60;
      const maxRadius = 50;

      ctx.clearRect(0, 0, 120, 120);
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 120, 120);

      const mirrorRadiusMm = this.mirrorRadius;
      const startRadiusMm = this.startRadiusMm;
      const endRadiusMm = this.endRadiusMm;
      const obstructionRadiusMm = this.obstructionRadiusMm;

      const scaleFactor = maxRadius / mirrorRadiusMm;

      const mirrorRadiusCanvas = mirrorRadiusMm * scaleFactor;
      const outerRadiusCanvas =
        Math.max(startRadiusMm, endRadiusMm) * scaleFactor;
      const innerRadiusCanvas =
        Math.min(startRadiusMm, endRadiusMm) * scaleFactor;
      const obstructionRadiusCanvas = obstructionRadiusMm * scaleFactor;

      ctx.beginPath();
      ctx.arc(centerX, centerY, mirrorRadiusCanvas, 0, 2 * Math.PI);
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;
      ctx.stroke();

      if (outerRadiusCanvas > innerRadiusCanvas) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadiusCanvas, 0, 2 * Math.PI);
        ctx.arc(centerX, centerY, innerRadiusCanvas, 0, 2 * Math.PI, true);
        ctx.fillStyle = "rgba(220, 80, 80, 0.6)";
        ctx.fill();
        ctx.restore();
      }

      if (obstructionRadiusCanvas > 0) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, obstructionRadiusCanvas, 0, 2 * Math.PI);
        ctx.fillStyle = "#000";
        ctx.fill();
      }
    },
  },
  computed: {
    displayMirrorDiameter() {
      return this.$units.convert.lengthToDisplay(this.mirrorDiameterMm);
    },
    displayStartRadius() {
      if (this.inputMode === "percent") {
        return this.startRadiusNorm;
      }
      return this.$units.convert.lengthToDisplay(
        this.startRadiusNorm * this.mirrorRadius,
      );
    },
    displayEndRadius() {
      if (this.inputMode === "percent") {
        return this.endRadiusNorm;
      }
      return this.$units.convert.lengthToDisplay(
        this.endRadiusNorm * this.mirrorRadius,
      );
    },
    displayCentralObstruction() {
      if (this.inputMode === "percent") {
        return this.centralObstructionNorm;
      }
      return this.$units.convert.lengthToDisplay(
        this.centralObstructionNorm * this.mirrorRadius,
      );
    },
    lengthUnit() {
      return this.$units.convert.lengthUnit();
    },
    mirrorRadius() {
      return this.mirrorDiameterMm / 2;
    },
    startRadiusMm() {
      return this.startRadiusNorm * this.mirrorRadius;
    },
    endRadiusMm() {
      return this.endRadiusNorm * this.mirrorRadius;
    },
    obstructionRadiusMm() {
      return this.centralObstructionNorm * this.mirrorRadius;
    },
    surfaceArea() {
      return annularRing.surfaceArea({
        outerRadius: Math.max(this.startRadiusMm, this.endRadiusMm),
        innerRadius: Math.min(this.startRadiusMm, this.endRadiusMm),
      });
    },
    surfaceAreaDisplay() {
      const areaMm2 = this.surfaceArea;
      const areaDisplay = this.$units.convert.lengthToDisplay(
        Math.sqrt(areaMm2),
      );
      return (areaDisplay * areaDisplay).toFixed(2);
    },
    totalMirrorArea() {
      return circleArea(this.mirrorRadius);
    },
    unobstructedMirrorArea() {
      return this.totalMirrorArea - circleArea(this.obstructionRadiusMm);
    },
    percentageTotal() {
      return annularRing.percentageOfTotal({
        outerRadius: Math.max(this.startRadiusMm, this.endRadiusMm),
        innerRadius: Math.min(this.startRadiusMm, this.endRadiusMm),
        mirrorRadius: this.mirrorRadius,
      });
    },
    percentageUnobstructed() {
      return annularRing.percentageOfUnobstructed({
        outerRadius: Math.max(this.startRadiusMm, this.endRadiusMm),
        innerRadius: Math.min(this.startRadiusMm, this.endRadiusMm),
        mirrorRadius: this.mirrorRadius,
        obstructionRadius: this.obstructionRadiusMm,
      });
    },
  },
  watch: {
    mirrorDiameterMm() {
      this.$nextTick(() => this.drawCanvas());
    },
    startRadiusNorm() {
      this.$nextTick(() => this.drawCanvas());
    },
    endRadiusNorm() {
      this.$nextTick(() => this.drawCanvas());
    },
    inputMode() {
      this.$nextTick(() => this.drawCanvas());
    },
    centralObstructionNorm() {
      this.$nextTick(() => this.drawCanvas());
    },
  },
};
</script>
