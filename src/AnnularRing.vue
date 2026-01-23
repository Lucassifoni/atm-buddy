<template>
  <div>
    <div class="card-title justify-center mb-3">
      <div class="badge badge-outline badge-sm">
        {{ $t('annularRing.title') }}
      </div>
    </div>
    <OpticalPieceSelector @optical-piece-selected="onOpticalPieceSelected" />
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{ $t('annularRing.mirrorDiameter') }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="mirrorDiameter"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="set('mirrorDiameter', $event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{ $t('annularRing.inputMode') }}</label>
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
          <span class="text-xs">{{ $t('annularRing.normalized') }}</span>
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
          <span class="text-xs">{{ $t('annularRing.millimeters') }}</span>
        </label>
      </div>
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">
        {{ $t('annularRing.centralObstruction') }} ({{
          inputMode === "percent" ? $t('annularRing.normalized') : $t('common.mm')
        }}):
      </label>
      <input
        class="input input-bordered input-sm w-full"
        :value="centralObstruction"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="set('centralObstruction', $event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">
        {{ $t('annularRing.zoneStart') }} ({{ inputMode === "percent" ? $t('annularRing.normalized') : $t('common.mm') }}):
      </label>
      <input
        class="input input-bordered input-sm w-full"
        :value="startRadius"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="set('startRadius', $event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">
        {{ $t('annularRing.zoneEnd') }} ({{ inputMode === "percent" ? $t('annularRing.normalized') : $t('common.mm') }}):
      </label>
      <input
        class="input input-bordered input-sm w-full"
        :value="endRadius"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="set('endRadius', $event.target.value)"
      />
    </div>
    <div
      style="display: flex; align-items: flex-start; gap: 20px; flex-wrap: wrap"
    >
      <div style="flex: 1">
        <h4 class="subtitle is-6">{{ $t('annularRing.results') }}</h4>
        <div class="">
          <div class="flex items-center">
            <label class="">{{ $t('annularRing.surfaceArea') }}</label>
            <span class="font-bold"
              >&nbsp;{{ surfaceArea.toFixed(2) }} {{ $t('common.mm') }}²</span
            >
          </div>
          <div class="flex items-center">
            <label class="">{{ $t('annularRing.ofTotalArea') }}</label>
            <span class="font-bold"
              >&nbsp;{{ percentageTotal.toFixed(2) }}{{ $t('common.percent') }}</span
            >
          </div>
          <p>
            {{ $t('annularRing.ofUnobstructedArea') }}
            <strong>{{ percentageUnobstructed.toFixed(2) }}</strong
            >{{ $t('common.percent') }}
          </p>
          <p>{{ $t('annularRing.shouldFix') }}</p>
        </div>
      </div>
      <div></div>
    </div>
    <div class="card bg-base-200 p-3 mt-3">
      <h4 class="text-sm font-semibold mb-2">{{ $t('annularRing.visual') }}</h4>
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
import { get, set, normalize } from "./utils";
import OpticalPieceSelector from "./OpticalPieceSelector.vue";

const toN = (a) => Number(normalize(a));

export default {
  name: "AnnularRing",
  components: {
    OpticalPieceSelector,
  },
  data() {
    return {
      mirrorDiameter: get("__annular", "mirrorDiameter", "200"),
      startRadius: get("__annular", "startRadius", "0.95"),
      endRadius: get("__annular", "endRadius", "0.85"),
      inputMode: get("__annular", "inputMode", "percent"),
      centralObstruction: get("__annular", "centralObstruction", "0.3"),
    };
  },
  mounted() {
    this.drawCanvas();
  },
  methods: {
    set(key, value) {
      set(
        this,
        "__annular",
        {
          mirrorDiameter: this.mirrorDiameter,
          startRadius: this.startRadius,
          endRadius: this.endRadius,
          inputMode: this.inputMode,
          centralObstruction: this.centralObstruction,
        },
        key,
        value,
      );
    },
    normalize,
    onOpticalPieceSelected(piece) {
      this.set("mirrorDiameter", piece.radius * 2);
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

      const mirrorDiameterMm = toN(this.mirrorDiameter);
      const mirrorRadiusMm = mirrorDiameterMm / 2;

      let startRadiusMm, endRadiusMm;
      if (this.inputMode === "percent") {
        startRadiusMm = mirrorRadiusMm * toN(this.startRadius);
        endRadiusMm = mirrorRadiusMm * toN(this.endRadius);
      } else {
        startRadiusMm = toN(this.startRadius);
        endRadiusMm = toN(this.endRadius);
      }

      let obstructionRadiusMm;
      if (this.inputMode === "percent") {
        obstructionRadiusMm = mirrorRadiusMm * toN(this.centralObstruction);
      } else {
        obstructionRadiusMm = toN(this.centralObstruction);
      }

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
    startRadiusMm() {
      const diameter = toN(this.mirrorDiameter);
      const radius = diameter / 2;
      if (this.inputMode === "percent") {
        return radius * toN(this.startRadius);
      }
      return toN(this.startRadius);
    },
    endRadiusMm() {
      const diameter = toN(this.mirrorDiameter);
      const radius = diameter / 2;
      if (this.inputMode === "percent") {
        return radius * toN(this.endRadius);
      }
      return toN(this.endRadius);
    },
    obstructionRadiusMm() {
      const diameter = toN(this.mirrorDiameter);
      const radius = diameter / 2;
      if (this.inputMode === "percent") {
        return radius * toN(this.centralObstruction);
      }
      return toN(this.centralObstruction);
    },
    surfaceArea() {
      const outerRadius = Math.max(this.startRadiusMm, this.endRadiusMm);
      const innerRadius = Math.min(this.startRadiusMm, this.endRadiusMm);
      return Math.PI * (outerRadius * outerRadius - innerRadius * innerRadius);
    },
    totalMirrorArea() {
      const diameter = toN(this.mirrorDiameter);
      return Math.PI * (diameter / 2) * (diameter / 2);
    },
    unobstructedMirrorArea() {
      const obstructionArea =
        Math.PI * this.obstructionRadiusMm * this.obstructionRadiusMm;
      return this.totalMirrorArea - obstructionArea;
    },
    percentageTotal() {
      return (this.surfaceArea / this.totalMirrorArea) * 100;
    },
    percentageUnobstructed() {
      if (this.unobstructedMirrorArea <= 0) return 0;
      return (this.surfaceArea / this.unobstructedMirrorArea) * 100;
    },
  },
  watch: {
    mirrorDiameter() {
      this.$nextTick(() => this.drawCanvas());
    },
    startRadius() {
      this.$nextTick(() => this.drawCanvas());
    },
    endRadius() {
      this.$nextTick(() => this.drawCanvas());
    },
    inputMode() {
      this.$nextTick(() => this.drawCanvas());
    },
    centralObstruction() {
      this.$nextTick(() => this.drawCanvas());
    },
  },
};
</script>
