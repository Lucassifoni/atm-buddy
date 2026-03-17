<template>
  <div>
    <div class="card-title justify-center mb-3">
      <div class="badge badge-outline badge-sm">
        {{ $t("glassSlab.formula") }}
      </div>
    </div>
    <div class="alert alert-success mt-4 py-2">
      <span class="text-sm font-semibold"
        >{{ $t("glassSlab.resultLabel") }}
        <strong>{{ formattedResult }}</strong></span
      >
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{
        $t("glassSlab.thickness")
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
        $t("glassSlab.refractiveIndex")
      }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="refractiveIndex"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="set('refractiveIndex', $event.target.value)"
      />
    </div>
    <div class="field-horizontal">
      <label class="label text-xs font-medium">{{
        $t("glassSlab.fNumber")
      }}</label>
      <input
        class="input input-bordered input-sm w-full"
        :value="fNumber"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        @input="set('fNumber', $event.target.value)"
      />
    </div>
  </div>
</template>

<script>
import { get, set, normalize } from "./utils";
import { glassSlabSphericalAberration } from "./formulas";

const toN = (a) => Number(normalize(a));

export default {
  name: "GlassSlabAberration",
  data() {
    return {
      thickness: get("__glass_slab", "thickness", "7"),
      refractiveIndex: get("__glass_slab", "refractiveIndex", "1.51"),
      fNumber: get("__glass_slab", "fNumber", "7.8"),
    };
  },
  methods: {
    set(key, value) {
      set(
        this,
        "__glass_slab",
        {
          thickness: this.thickness,
          refractiveIndex: this.refractiveIndex,
          fNumber: this.fNumber,
        },
        key,
        value,
      );
    },
  },
  computed: {
    aberration() {
      return glassSlabSphericalAberration({
        thickness: toN(this.thickness),
        refractiveIndex: toN(this.refractiveIndex),
        fNumber: toN(this.fNumber),
      });
    },
    formattedResult() {
      const nmValue = Math.abs(this.aberration) * 1e6;
      const wavesAt550 = nmValue / 550;
      return `${nmValue.toFixed(2)} nm (1/${Math.round(1 / wavesAt550)} wave @550nm)`;
    },
  },
};
</script>
