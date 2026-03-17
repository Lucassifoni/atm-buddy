<template>
  <div>
    <p class="text-sm text-gray-600 mb-3">
      {{ $t("colorSplitter.description") }}
    </p>

    <div
      class="drop-zone"
      :class="{ 'drop-zone-active': isDragging }"
      @click="$refs.fileInput.click()"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="onDrop"
    >
      <p class="text-sm text-gray-500">{{ $t("colorSplitter.dropOrClick") }}</p>
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="onFileSelected"
      />
    </div>

    <div v-if="hasImage" class="mt-4">
      <div class="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3 text-sm">
        <label class="flex items-center gap-1 cursor-pointer">
          <input
            type="checkbox"
            class="checkbox checkbox-xs"
            v-model="normalize"
            @change="render()"
          />
          {{ $t("colorSplitter.normalize") }}
        </label>
        <label class="flex items-center gap-1 cursor-pointer">
          <input
            type="checkbox"
            class="checkbox checkbox-xs"
            v-model="grayscale"
            @change="render()"
          />
          {{ $t("colorSplitter.grayscale") }}
        </label>
        <label class="flex items-center gap-1 cursor-pointer">
          <input
            type="checkbox"
            class="checkbox checkbox-xs"
            v-model="lineEnabled"
            @change="render()"
          />
          {{ $t("colorSplitter.showLine") }}
        </label>
      </div>

      <div
        v-if="lineEnabled"
        class="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3 text-sm"
      >
        <label class="flex items-center gap-2">
          {{ $t("colorSplitter.linePosition") }}
          <input
            type="range"
            class="range range-xs w-32"
            min="0"
            max="100"
            v-model.number="lineY"
            @input="render()"
          />
        </label>
        <label class="flex items-center gap-2">
          {{ $t("colorSplitter.lineAngle") }}
          <input
            type="range"
            class="range range-xs w-32"
            min="-90"
            max="90"
            v-model.number="lineAngle"
            @input="render()"
          />
        </label>
      </div>

      <div class="flex flex-wrap gap-2 mb-3">
        <button class="btn btn-sm btn-primary" @click="downloadComposite">
          {{ $t("colorSplitter.downloadComposite") }}
        </button>
        <button class="btn btn-sm btn-outline" @click="downloadChannel('orig')">
          {{ $t("colorSplitter.downloadOriginal") }}
        </button>
        <button
          class="btn btn-sm btn-outline btn-error"
          @click="downloadChannel('r')"
        >
          {{ $t("colorSplitter.downloadRed") }}
        </button>
        <button
          class="btn btn-sm btn-outline btn-success"
          @click="downloadChannel('g')"
        >
          {{ $t("colorSplitter.downloadGreen") }}
        </button>
        <button
          class="btn btn-sm btn-outline btn-info"
          @click="downloadChannel('b')"
        >
          {{ $t("colorSplitter.downloadBlue") }}
        </button>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div class="channel-panel">
          <h3 class="text-xs font-medium mb-1">
            {{ $t("colorSplitter.original") }}
          </h3>
          <canvas ref="cOrig" class="channel-canvas"></canvas>
        </div>
        <div class="channel-panel">
          <h3 class="text-xs font-medium mb-1 text-red-500">
            {{ $t("colorSplitter.red") }}
          </h3>
          <canvas ref="cR" class="channel-canvas"></canvas>
        </div>
        <div class="channel-panel">
          <h3 class="text-xs font-medium mb-1 text-green-500">
            {{ $t("colorSplitter.green") }}
          </h3>
          <canvas ref="cG" class="channel-canvas"></canvas>
        </div>
        <div class="channel-panel">
          <h3 class="text-xs font-medium mb-1 text-blue-500">
            {{ $t("colorSplitter.blue") }}
          </h3>
          <canvas ref="cB" class="channel-canvas"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ColorChannelSplitter",
  data() {
    return {
      isDragging: false,
      hasImage: false,
      imageWidth: 0,
      imageHeight: 0,
      img: null,
      normalize: false,
      grayscale: false,
      lineEnabled: false,
      lineY: 50,
      lineAngle: 0,
    };
  },
  methods: {
    onDrop(e) {
      this.isDragging = false;
      if (e.dataTransfer.files.length) {
        this.loadFile(e.dataTransfer.files[0]);
      }
    },
    onFileSelected() {
      const files = this.$refs.fileInput.files;
      if (files.length) {
        this.loadFile(files[0]);
      }
    },
    loadFile(file) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        this.img = img;
        this.hasImage = true;
        this.$nextTick(() => {
          this.render();
          URL.revokeObjectURL(url);
        });
      };
      img.src = url;
    },
    render() {
      const img = this.img;
      if (!img) return;

      const w = img.naturalWidth;
      const h = img.naturalHeight;
      this.imageWidth = w;
      this.imageHeight = h;

      const canvases = [
        this.$refs.cOrig,
        this.$refs.cR,
        this.$refs.cG,
        this.$refs.cB,
      ];
      canvases.forEach((c) => {
        c.width = w;
        c.height = h;
      });

      const ctxOrig = this.$refs.cOrig.getContext("2d");
      ctxOrig.drawImage(img, 0, 0);
      const pixels = ctxOrig.getImageData(0, 0, w, h).data;

      const rData = new ImageData(w, h);
      const gData = new ImageData(w, h);
      const bData = new ImageData(w, h);

      let rMin = 255,
        rMax = 0,
        gMin = 255,
        gMax = 0,
        bMin = 255,
        bMax = 0;

      if (this.normalize) {
        for (let i = 0; i < pixels.length; i += 4) {
          const rv = pixels[i],
            gv = pixels[i + 1],
            bv = pixels[i + 2];
          if (rv < rMin) rMin = rv;
          if (rv > rMax) rMax = rv;
          if (gv < gMin) gMin = gv;
          if (gv > gMax) gMax = gv;
          if (bv < bMin) bMin = bv;
          if (bv > bMax) bMax = bv;
        }
      }

      const rRange = rMax - rMin || 1;
      const gRange = gMax - gMin || 1;
      const bRange = bMax - bMin || 1;

      for (let i = 0; i < pixels.length; i += 4) {
        let rv = pixels[i],
          gv = pixels[i + 1],
          bv = pixels[i + 2];

        if (this.normalize) {
          rv = ((rv - rMin) / rRange) * 255;
          gv = ((gv - gMin) / gRange) * 255;
          bv = ((bv - bMin) / bRange) * 255;
        }

        if (this.grayscale) {
          rData.data[i] = rv;
          rData.data[i + 1] = rv;
          rData.data[i + 2] = rv;

          gData.data[i] = gv;
          gData.data[i + 1] = gv;
          gData.data[i + 2] = gv;

          bData.data[i] = bv;
          bData.data[i + 1] = bv;
          bData.data[i + 2] = bv;
        } else {
          rData.data[i] = rv;
          rData.data[i + 1] = 0;
          rData.data[i + 2] = 0;

          gData.data[i] = 0;
          gData.data[i + 1] = gv;
          gData.data[i + 2] = 0;

          bData.data[i] = 0;
          bData.data[i + 1] = 0;
          bData.data[i + 2] = bv;
        }

        rData.data[i + 3] = 255;
        gData.data[i + 3] = 255;
        bData.data[i + 3] = 255;
      }

      this.$refs.cR.getContext("2d").putImageData(rData, 0, 0);
      this.$refs.cG.getContext("2d").putImageData(gData, 0, 0);
      this.$refs.cB.getContext("2d").putImageData(bData, 0, 0);

      if (this.lineEnabled) {
        canvases.forEach((c) => this.drawLine(c));
      }
    },
    drawLine(canvas) {
      const ctx = canvas.getContext("2d");
      const w = canvas.width;
      const h = canvas.height;
      const diag = Math.sqrt(w * w + h * h);
      const theta = (this.lineAngle * Math.PI) / 180;
      const d = ((this.lineY - 50) / 50) * (diag / 2);
      const cx = w / 2 - d * Math.sin(theta);
      const cy = h / 2 + d * Math.cos(theta);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(theta);
      ctx.setLineDash([10, 8]);
      ctx.strokeStyle = "white";
      ctx.lineWidth = Math.max(1, Math.round(Math.min(w, h) / 500));
      ctx.beginPath();
      ctx.moveTo(-diag, 0);
      ctx.lineTo(diag, 0);
      ctx.stroke();
      ctx.restore();
    },
    downloadChannel(channel) {
      const canvasMap = {
        orig: this.$refs.cOrig,
        r: this.$refs.cR,
        g: this.$refs.cG,
        b: this.$refs.cB,
      };
      const nameMap = { orig: "original", r: "red", g: "green", b: "blue" };
      const canvas = canvasMap[channel];
      if (!canvas) return;
      this.triggerDownload(
        canvas.toDataURL("image/png"),
        `channel_${nameMap[channel]}.png`,
      );
    },
    downloadComposite() {
      const w = this.imageWidth;
      const h = this.imageHeight;
      const padding = 4;
      const labelHeight = 20;

      const compositeCanvas = document.createElement("canvas");
      compositeCanvas.width = w * 2 + padding * 3;
      compositeCanvas.height = (h + labelHeight) * 2 + padding * 3;

      const ctx = compositeCanvas.getContext("2d");
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, compositeCanvas.width, compositeCanvas.height);

      ctx.font = `${Math.max(12, Math.round(h * 0.03))}px system-ui, sans-serif`;
      ctx.textAlign = "left";

      const panels = [
        {
          canvas: this.$refs.cOrig,
          label: "Original",
          col: 0,
          row: 0,
          color: "#cccccc",
        },
        {
          canvas: this.$refs.cR,
          label: "Red",
          col: 1,
          row: 0,
          color: "#ff4444",
        },
        {
          canvas: this.$refs.cG,
          label: "Green",
          col: 0,
          row: 1,
          color: "#44ff44",
        },
        {
          canvas: this.$refs.cB,
          label: "Blue",
          col: 1,
          row: 1,
          color: "#6666ff",
        },
      ];

      panels.forEach(({ canvas, col, row }) => {
        const x = padding + col * (w + padding);
        const y = padding + row * (h + labelHeight + padding);
        ctx.drawImage(canvas, x, y + labelHeight);
      });

      panels.forEach(({ label, col, row, color }) => {
        const x = padding + col * (w + padding);
        const y = padding + row * (h + labelHeight + padding);
        ctx.fillStyle = color;
        ctx.fillText(label, x, y + Math.max(12, Math.round(h * 0.03)));
      });

      this.triggerDownload(
        compositeCanvas.toDataURL("image/png"),
        "color_channels_composite.png",
      );
    },
    triggerDownload(dataUrl, filename) {
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = filename;
      a.click();
    },
  },
};
</script>

<style scoped>
.drop-zone {
  border: 2px dashed #d1d5db;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: border-color 0.2s;
}

.drop-zone:hover,
.drop-zone-active {
  border-color: #6b7280;
}

.channel-panel {
  background-color: oklch(var(--b2));
  padding: 0.5rem;
  border-radius: 0.375rem;
}

.channel-canvas {
  width: 100%;
  height: auto;
  display: block;
  background: #000;
  border-radius: 0.25rem;
}
</style>
