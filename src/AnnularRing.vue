<template>
    <div>
        <h3 class="subtitle" style="margin-bottom: 0">
            Annular Ring Surface Area Calculator
        </h3>
        <hr />
        <div class="field is-horizontal">
            <label for="" class="label is-small"
                >Mirror diameter (in mm):
            </label>
            <input
                class="input is-small"
                :value="mirrorDiameter"
                inputmode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                @input="set('mirrorDiameter', $event.target.value)"
            />
        </div>
        <div class="field is-horizontal">
            <label for="" class="label is-small">Input mode: </label>
            <div class="control">
                <label class="radio">
                    <input type="radio" value="percent" v-model="inputMode" />
                    0..1
                </label>
                <label class="radio">
                    <input type="radio" value="mm" v-model="inputMode" />
                    Millimeters
                </label>
            </div>
        </div>
        <div class="field is-horizontal">
            <label for="" class="label is-small">
                Central obstruction radius ({{
                    inputMode === "percent" ? "0..1" : "in mm"
                }}):
            </label>
            <input
                class="input is-small"
                :value="centralObstruction"
                inputmode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                @input="set('centralObstruction', $event.target.value)"
            />
        </div>
        <div class="field is-horizontal">
            <label for="" class="label is-small">
                Zone Start radius ({{
                    inputMode === "percent" ? "0..1" : "in mm"
                }}):
            </label>
            <input
                class="input is-small"
                :value="startRadius"
                inputmode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                @input="set('startRadius', $event.target.value)"
            />
        </div>
        <div class="field is-horizontal">
            <label for="" class="label is-small">
                Zone End radius ({{
                    inputMode === "percent" ? "0..1" : "in mm"
                }}):
            </label>
            <input
                class="input is-small"
                :value="endRadius"
                inputmode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                @input="set('endRadius', $event.target.value)"
            />
        </div>
        <hr />
        <div style="display: flex; align-items: flex-start; gap: 20px">
            <div style="flex: 1">
                <h4 class="subtitle is-6">Results:</h4>
                <div class="content">
                    <div class="field is-horizontal">
                        <label class="label">Surface Area:</label>
                        <span class="has-text-weight-bold"
                            >&nbsp;{{ surfaceArea.toFixed(2) }} mm²</span
                        >
                    </div>
                    <div class="field is-horizontal">
                        <label class="label">Of Total Area:</label>
                        <span class="has-text-weight-bold"
                            >&nbsp;{{ percentageTotal.toFixed(2) }}%</span
                        >
                    </div>
                    <div class="field is-horizontal">
                        <label class="label">Of Unobstructed Area:</label>
                        <span class="has-text-weight-bold"
                            >&nbsp;{{
                                percentageUnobstructed.toFixed(2)
                            }}%</span
                        >
                    </div>
                    <div class="field is-horizontal">
                        <label class="label">Should you fix it ? </label>
                        <span class="has-text-weight-bold">&nbsp;yes</span>
                    </div>
                </div>
            </div>
            <div>
                <h4 class="subtitle is-6">Visual:</h4>
                <canvas
                    ref="canvas"
                    width="120"
                    height="120"
                    style="border: 1px solid #ccc"
                ></canvas>
            </div>
        </div>
    </div>
</template>

<script>
import { get, set, normalize } from "./utils";

const toN = (a) => Number(normalize(a));

export default {
    name: "AnnularRing",
    data() {
        return {
            mirrorDiameter: get("__annular", "mirrorDiameter", "200"),
            startRadius: get("__annular", "startRadius", "0.95"),
            endRadius: get("__annular", "endRadius", "0.85"),
            inputMode: get("__annular", "inputMode", "percent"),
            centralObstruction: get("__annular", "centralObstruction", "0.3"),
        };
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
                obstructionRadiusMm =
                    mirrorRadiusMm * toN(this.centralObstruction);
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
                ctx.arc(
                    centerX,
                    centerY,
                    innerRadiusCanvas,
                    0,
                    2 * Math.PI,
                    true,
                );
                ctx.fillStyle = "rgba(220, 80, 80, 0.6)";
                ctx.fill();
                ctx.restore();
            }

            if (obstructionRadiusCanvas > 0) {
                ctx.beginPath();
                ctx.arc(
                    centerX,
                    centerY,
                    obstructionRadiusCanvas,
                    0,
                    2 * Math.PI,
                );
                ctx.fillStyle = "#000";
                ctx.fill();
            }
        },
    },
    mounted() {
        this.drawCanvas();
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
            return (
                Math.PI *
                (outerRadius * outerRadius - innerRadius * innerRadius)
            );
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
