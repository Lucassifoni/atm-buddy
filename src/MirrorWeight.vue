<template>
  <div>
    <div class="card-title justify-center mb-3">
      <div class="badge badge-outline badge-sm">
        {{ $t("mirrorWeight.title") }}
      </div>
    </div>
    <OpticalPieceSelector @optical-piece-selected="onOpticalPieceSelected" />
    <div class="alert alert-success mt-4 py-2">
      <div class="text-sm">
        <p class="font-semibold">
          {{ $t("mirrorWeight.volumeLabel") }}
          <strong>{{ volumeCm3.toFixed(1) }}</strong>
          {{ $t("mirrorWeight.cm3") }}
        </p>
        <p class="mt-1 font-semibold">
          {{ $t("mirrorWeight.weightLabel") }}
          <strong>{{ weightGrams.toFixed(0) }}</strong>
          {{ $t("common.grams") }}
          <span class="font-normal"
            >({{ (weightGrams / 1000).toFixed(2) }}
            {{ $t("mirrorWeight.kg") }})</span
          >
        </p>
        <p class="mt-1 text-xs">
          {{ $t("mirrorWeight.centerThicknessLabel") }}
          <strong>{{ centerThickness.toFixed(1) }}</strong>
          {{ $t("common.mm") }}
        </p>
      </div>
    </div>
    <div v-if="warning" class="alert alert-warning py-2 mt-2">
      <div class="text-xs">{{ warning }}</div>
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{
        $t("mirrorWeight.diameter")
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
        $t("mirrorWeight.thickness")
      }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="thickness"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="set('thickness', $event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{
        $t("mirrorWeight.focalLength")
      }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="focalLength"
        inputmode="decimal"
        pattern="-?[0-9]*[.,]?[0-9]*"
        @input="set('focalLength', $event.target.value)"
      />
    </div>
    <p class="text-xs opacity-70 -mt-1 mb-2">
      {{ $t("mirrorWeight.focalLengthHint") }}
    </p>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{
        $t("mirrorWeight.backRadius")
      }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="backRadius"
        inputmode="decimal"
        pattern="-?[0-9]*[.,]?[0-9]*"
        @input="set('backRadius', $event.target.value)"
      />
    </div>
    <p class="text-xs opacity-70 -mt-1 mb-2">
      {{ $t("mirrorWeight.backRadiusHint") }}
    </p>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{
        $t("mirrorWeight.material")
      }}</label>
      <select
        class="select select-bordered select-sm w-full"
        :value="material"
        @change="set('material', $event.target.value)"
      >
        <option v-for="m in materials" :key="m.key" :value="m.key">
          {{ m.label }} ({{ m.density }} {{ $t("mirrorWeight.gPerCm3") }})
        </option>
      </select>
    </div>
    <div class="card bg-base-200 p-3 mt-3">
      <h4 class="text-sm font-semibold mb-2">
        {{ $t("mirrorWeight.sideCut") }}
      </h4>
      <div class="flex justify-center">
        <canvas
          ref="canvas"
          width="280"
          height="150"
          class="border border-gray-300 rounded bg-white max-w-full"
        ></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { get, set, normalize } from "./utils";
import { mirrorBlank } from "./formulas";
import OpticalPieceSelector from "./OpticalPieceSelector.vue";

const toN = (a) => Number(normalize(a));

const MATERIALS = [
  { key: "borosilicate", labelKey: "borosilicate", density: 2.23 },
  { key: "sodalime", labelKey: "sodalime", density: 2.53 },
  { key: "fusedSilica", labelKey: "fusedSilica", density: 2.2 },
  { key: "bk7", labelKey: "bk7", density: 2.51 },
  { key: "zerodur", labelKey: "zerodur", density: 2.53 },
  { key: "sitall", labelKey: "sitall", density: 2.46 },
];

const CANVAS_WIDTH = 280;
const CANVAS_HEIGHT = 150;
const CANVAS_PADDING = 14;
const PROFILE_SAMPLES = 80;

export default {
  name: "MirrorWeight",
  components: {
    OpticalPieceSelector,
  },
  data() {
    return {
      diameter: get("__mirror_weight", "diameter", "300"),
      thickness: get("__mirror_weight", "thickness", "25"),
      focalLength: get("__mirror_weight", "focalLength", "1200"),
      backRadius: get("__mirror_weight", "backRadius", "0"),
      material: get("__mirror_weight", "material", "borosilicate"),
    };
  },
  mounted() {
    this.drawCanvas();
  },
  methods: {
    set(key, value) {
      set(
        this,
        "__mirror_weight",
        {
          diameter: this.diameter,
          thickness: this.thickness,
          focalLength: this.focalLength,
          backRadius: this.backRadius,
          material: this.material,
        },
        key,
        value,
      );
    },
    onOpticalPieceSelected(piece) {
      this.set("diameter", (piece.radius * 2).toString());
      this.set("focalLength", (piece.radiusOfCurvature / 2).toString());
    },
    frontSurfaceOffset(x) {
      const diameter = toN(this.diameter);
      const focalLength = toN(this.focalLength);
      if (focalLength === 0) return 0;
      const R = mirrorBlank.frontRadiusOfCurvature({ focalLength });
      const sf = mirrorBlank.frontSagitta({ diameter, focalLength });
      if (isNaN(sf) || R < Math.abs(x)) return 0;
      const sagAtX = R - Math.sqrt(R * R - x * x);
      const dir = focalLength > 0 ? 1 : -1;
      return dir * (sf - sagAtX);
    },
    backSurfaceOffset(x) {
      const diameter = toN(this.diameter);
      const backRadius = toN(this.backRadius);
      if (backRadius === 0) return 0;
      const R = Math.abs(backRadius);
      const sb = mirrorBlank.backSagitta({ diameter, backRadius });
      if (isNaN(sb) || R < Math.abs(x)) return 0;
      const sagAtX = R - Math.sqrt(R * R - x * x);
      const dir = backRadius > 0 ? 1 : -1;
      return dir * (sb - sagAtX);
    },
    drawCanvas() {
      const canvas = this.$refs.canvas;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      const diameter = toN(this.diameter);
      const thickness = toN(this.thickness);
      if (!(diameter > 0) || !(thickness > 0)) return;

      const r = diameter / 2;

      const front = [];
      const back = [];
      let yMin = 0;
      let yMax = thickness;
      for (let i = 0; i <= PROFILE_SAMPLES; i++) {
        const x = -r + (2 * r * i) / PROFILE_SAMPLES;
        const yf = this.frontSurfaceOffset(x);
        const yb = thickness + this.backSurfaceOffset(x);
        front.push({ x, y: yf });
        back.push({ x, y: yb });
        yMin = Math.min(yMin, yf);
        yMax = Math.max(yMax, yb);
      }

      const spanX = diameter;
      const spanY = Math.max(yMax - yMin, 1e-6);
      const scale = Math.min(
        (CANVAS_WIDTH - 2 * CANVAS_PADDING) / spanX,
        (CANVAS_HEIGHT - 2 * CANVAS_PADDING) / spanY,
      );

      const drawnW = spanX * scale;
      const drawnH = spanY * scale;
      const offsetX = (CANVAS_WIDTH - drawnW) / 2;
      const offsetY = (CANVAS_HEIGHT - drawnH) / 2;

      const px = (x) => offsetX + (x + r) * scale;
      const py = (y) => offsetY + (y - yMin) * scale;

      ctx.beginPath();
      ctx.moveTo(px(front[0].x), py(front[0].y));
      for (const p of front) ctx.lineTo(px(p.x), py(p.y));
      for (let i = back.length - 1; i >= 0; i--) {
        ctx.lineTo(px(back[i].x), py(back[i].y));
      }
      ctx.closePath();
      ctx.fillStyle = "rgba(120, 170, 220, 0.55)";
      ctx.fill();
      ctx.strokeStyle = "#2a3f5f";
      ctx.lineWidth = 1.25;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(px(0), offsetY);
      ctx.lineTo(px(0), offsetY + drawnH);
      ctx.strokeStyle = "rgba(120, 120, 120, 0.5)";
      ctx.lineWidth = 0.5;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
    },
  },
  computed: {
    materials() {
      return MATERIALS.map((m) => ({
        key: m.key,
        density: m.density,
        label: this.$t(`mirrorWeight.materials.${m.labelKey}`),
      }));
    },
    density() {
      const found = MATERIALS.find((m) => m.key === this.material);
      return found ? found.density : MATERIALS[0].density;
    },
    volumeMm3() {
      const v = mirrorBlank.volume({
        diameter: toN(this.diameter),
        edgeThickness: toN(this.thickness),
        focalLength: toN(this.focalLength),
        backRadius: toN(this.backRadius),
      });
      return isNaN(v) ? 0 : Math.max(0, v);
    },
    volumeCm3() {
      return this.volumeMm3 / 1000;
    },
    weightGrams() {
      return this.volumeCm3 * this.density;
    },
    centerThickness() {
      const c = mirrorBlank.centerThickness({
        diameter: toN(this.diameter),
        edgeThickness: toN(this.thickness),
        focalLength: toN(this.focalLength),
        backRadius: toN(this.backRadius),
      });
      return isNaN(c) ? 0 : c;
    },
    warning() {
      const diameter = toN(this.diameter);
      const r = diameter / 2;
      const focalLength = toN(this.focalLength);
      const backRadius = toN(this.backRadius);
      if (focalLength !== 0 && Math.abs(2 * focalLength) < r) {
        return this.$t("mirrorWeight.warnFocalTooShort");
      }
      if (backRadius !== 0 && Math.abs(backRadius) < r) {
        return this.$t("mirrorWeight.warnBackTooTight");
      }
      if (this.centerThickness <= 0) {
        return this.$t("mirrorWeight.warnNoCenter");
      }
      return "";
    },
  },
  watch: {
    diameter() {
      this.$nextTick(() => this.drawCanvas());
    },
    thickness() {
      this.$nextTick(() => this.drawCanvas());
    },
    focalLength() {
      this.$nextTick(() => this.drawCanvas());
    },
    backRadius() {
      this.$nextTick(() => this.drawCanvas());
    },
  },
};
</script>
