<template>
  <div>
    <div class="card-title justify-center mb-3">
      <div class="badge badge-outline badge-sm">
        {{ $t("spraySilvering.title") }}
      </div>
    </div>
    <div class="alert mb-3 py-1">
      <div class="text-xs">
        <p v-html="$t('spraySilvering.baseQuantityInfo')"></p>
      </div>
    </div>
    <div class="card bg-base-200 p-3 mb-3">
      <h3 class="text-sm font-semibold mb-2">
        {{ $t("spraySilvering.bomTitle") }}
      </h3>
      <div class="grid grid-cols-2 gap-1 mb-2">
        <div
          v-for="(item, index) in bomItems"
          :key="index"
          class="flex items-center gap-1"
        >
          <input
            type="checkbox"
            v-model="item.checked"
            class="checkbox checkbox-sm"
          />
          <span class="text-xs">{{ $t("spraySilvering." + item.key) }}</span>
        </div>
      </div>
      <button class="btn btn-sm btn-outline" @click="resetBom">
        {{ $t("spraySilvering.resetBom") }}
      </button>
    </div>

    <h2 class="font-bold text-xl">{{ $t("spraySilvering.chemicalsTitle") }}</h2>
    <div class="card bg-base-200 p-3 mb-3">
      <div class="flex items-center gap-2 mb-2">
        <span class="badge badge-neutral badge-sm">{{
          $t("spraySilvering.step0")
        }}</span>
        <h2 class="text-sm font-bold">
          {{ $t("spraySilvering.calibrateBottles") }}
        </h2>
      </div>
      <p class="text-xs">
        {{ $t("spraySilvering.calibrate") }}
        <span class="badge badge-neutral badge-xs">{{
          $t("spraySilvering.bottle1")
        }}</span>
        and
        <span class="badge badge-error badge-xs">{{
          $t("spraySilvering.bottle2")
        }}</span>
        {{ $t("spraySilvering.calibrateInstruction") }}
      </p>
    </div>
    <div class="card bg-base-200 p-3 mb-3">
      <div class="flex items-center gap-2 mb-2">
        <span class="badge badge-primary badge-sm">{{
          $t("spraySilvering.step1")
        }}</span>
        <h2 class="text-sm font-bold">
          {{ $t("spraySilvering.prepareSolutions") }}
        </h2>
      </div>
      <div class="field-horizontal">
        <label class="label text-xs font-medium">{{
          $t("spraySilvering.baseQuantity")
        }}</label>
        <input
          type="number"
          class="input input-bordered input-sm w-full"
          :value="b"
          @input="set('b', $event.target.value)"
        />
      </div>
    </div>
    <div class="card bg-base-200 p-3 mb-3">
      <div class="space-y-2 text-xs">
        <p>
          <span class="badge badge-info badge-sm">{{
            $t("spraySilvering.solution1")
          }}</span
          >: <strong>{{ silver }}g</strong>
          {{ $t("spraySilvering.silverNitrate") }} + <strong>{{ b }}ml</strong>
          {{ $t("spraySilvering.distilledWater") }}
        </p>
        <p>
          <span class="badge badge-success badge-sm">{{
            $t("spraySilvering.solution2")
          }}</span
          >: <strong>{{ soda }}g</strong>
          {{ $t("spraySilvering.sodiumHydroxide") }} +
          <strong>{{ b }}ml</strong> {{ $t("spraySilvering.distilledWater") }}
        </p>
        <p>
          <span class="badge badge-warning badge-sm">{{
            $t("spraySilvering.solution3")
          }}</span
          >: <strong>{{ sugar }}g</strong> {{ $t("spraySilvering.glucose") }} +
          <strong>{{ sugarwater }}ml</strong>
          {{ $t("spraySilvering.distilledWater") }}
        </p>
      </div>
    </div>

    <div class="alert alert-info mb-3 py-2">
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <div class="text-xs">
        <p>
          <span class="badge badge-neutral badge-xs">{{
            $t("spraySilvering.bottle1")
          }}</span>
          {{ $t("spraySilvering.bottle1Info") }}
        </p>
        <p>
          <span class="badge badge-error badge-xs">{{
            $t("spraySilvering.bottle2")
          }}</span>
          {{ $t("spraySilvering.bottle2Info") }}
          <span class="badge badge-warning badge-xs">{{
            $t("spraySilvering.solution3")
          }}</span>
        </p>
      </div>
    </div>
    <div class="card bg-base-200 p-3 mb-3">
      <div class="flex items-center gap-2 mb-2">
        <span class="badge badge-secondary badge-sm">{{
          $t("spraySilvering.step2")
        }}</span>
        <h2 class="text-sm font-bold">
          {{ $t("spraySilvering.mixingSilver") }}
        </h2>
      </div>
      <p>
        ({{ $t("spraySilvering.becomes") }}
        <span class="badge badge-neutral badge-xs">{{
          $t("spraySilvering.bottle1")
        }}</span
        >)
      </p>
      <ul class="list-disc list-inside space-y-2 text-xs">
        <li>
          {{ $t("spraySilvering.step2_1") }} <strong>{{ firstQty }}ml</strong>
          {{ $t("spraySilvering.step2_1b") }}
          <span class="badge badge-info badge-xs">{{
            $t("spraySilvering.solution1")
          }}</span>
          {{ $t("spraySilvering.step2_1c") }}
        </li>
        <li>
          {{ $t("spraySilvering.step2_2") }}
        </li>
        <li>
          {{ $t("spraySilvering.step2_3") }}
          <span class="badge badge-success badge-xs">{{
            $t("spraySilvering.solution2")
          }}</span>
        </li>
        <li>
          {{ $t("spraySilvering.step2_4") }}
          <span class="badge badge-info badge-xs">{{
            $t("spraySilvering.solution1")
          }}</span>
          {{ $t("spraySilvering.step2_4b") }}
        </li>
        <li>
          {{ $t("spraySilvering.step2_5") }}
        </li>
      </ul>
    </div>
    <p>
      {{ $t("spraySilvering.precipitateNote") }}
    </p>
    <hr class="my-4" />
    <h2 class="font-bold text-xl mb-4">
      {{ $t("spraySilvering.cleaningTitle") }}
    </h2>
    <h2 class="title font-bold">{{ $t("spraySilvering.cleanMirror") }}</h2>
    <p class="mb-2" v-html="$t('spraySilvering.cleaningInstructions')"></p>
    <OpticalPieceSelector @optical-piece-selected="onOpticalPieceSelected" />
    <div class="rounded-md bg-gray-200 p-2">
      <label for="" class="label is-small"
        >{{ $t("spraySilvering.mirrorDiameter") }} ({{ lengthUnit }}):</label
      >
      <input
        class="input is-small"
        type="text"
        placeholder="diameter"
        :value="displayDiameter"
        @input="setDiameter($event.target.value)"
      />
      <p>
        {{ $t("spraySilvering.cleaningTime") }}
        {{ cleaning_time }}
      </p>
    </div>
    <hr />
    <h2 class="title font-bold my-2">{{ $t("spraySilvering.sprayMirror") }}</h2>
    <p v-html="$t('spraySilvering.sprayingInstructions')"></p>
    <h2 class="title font-bold my-2">{{ $t("spraySilvering.dryStore") }}</h2>
    <p>
      {{ $t("spraySilvering.storageInstructions") }}
    </p>
  </div>
</template>

<script>
import { get, set, normalize } from "./utils";
import { spraySilvering } from "./formulas";
import OpticalPieceSelector from "./OpticalPieceSelector.vue";

export default {
  name: "SpraySilvering",
  components: {
    OpticalPieceSelector,
  },
  data() {
    return {
      b: Number(normalize(get("__baseqty", "b", "150"))),
      bomItems: this.loadBomItems(),
      diameterMm: 150,
    };
  },
  methods: {
    set(key, value) {
      set(this, "__baseqty", { f: this.f, d: this.d }, key, value);
    },
    normalize,
    onOpticalPieceSelected(piece) {
      this.diameterMm = piece.radius * 2;
    },
    setDiameter(value) {
      this.diameterMm = this.$units.convert.lengthFromDisplay(
        parseFloat(value) || 0,
      );
    },
    loadBomItems() {
      const defaultItems = [
        { name: "Gloves", key: "bomGloves", checked: false },
        { name: "Chalk to wash the mirrors", key: "bomChalk", checked: false },
        { name: "Mirror stands", key: "bomMirrorStands", checked: false },
        {
          name: "Anti-projection box",
          key: "bomAntiProjection",
          checked: false,
        },
        { name: "Hairdryer", key: "bomHairdryer", checked: false },
        { name: "Hydrophilic cotton", key: "bomCotton", checked: false },
        { name: "Demin. water", key: "bomDeminWater", checked: false },
        { name: "Stands for the mirrors", key: "bomStands", checked: false },
        {
          name: "A box in which to silver",
          key: "bomSilverBox",
          checked: false,
        },
        { name: "Glucose", key: "bomGlucose", checked: false },
        { name: "Silver nitrate", key: "bomSilverNitrate", checked: false },
        { name: "Sodium hydroxide", key: "bomSodiumHydroxide", checked: false },
        { name: "Ammonia", key: "bomAmmonia", checked: false },
        { name: "Two sprayers", key: "bomSprayers", checked: false },
        { name: "Containers", key: "bomContainers", checked: false },
        { name: "FFP2 masks", key: "bomMasks", checked: false },
      ];

      const savedItems =
        typeof window !== "undefined" ? localStorage.getItem("bomItems") : null;
      if (savedItems) {
        const parsedItems = JSON.parse(savedItems);
        if (!parsedItems) {
          return defaultItems;
        }
        defaultItems.forEach((item) => {
          if (
            !parsedItems.find(
              (saved) => saved.name === item.name || saved.key === item.key,
            )
          ) {
            parsedItems.push(item);
          }
        });
        return parsedItems;
      }
      return defaultItems;
    },
    resetBom() {
      this.bomItems = null;
      this.saveBomItems();
    },
    saveBomItems() {
      if (typeof window !== "undefined") {
        localStorage.setItem("bomItems", JSON.stringify(this.bomItems));
      }
    },
  },
  watch: {
    bomItems: {
      handler() {
        this.saveBomItems();
      },
      deep: true,
    },
  },
  computed: {
    displayDiameter() {
      return this.$units.convert.lengthToDisplay(this.diameterMm);
    },
    lengthUnit() {
      return this.$units.convert.lengthUnit();
    },
    cleaning_time() {
      const minutes = spraySilvering.cleaningTimeMinutes(this.diameterMm);
      const hours = Math.floor(minutes / 60);
      const rminutes = Math.trunc(minutes - hours * 60);
      const p = (n) => (n + "").padStart("0", 2);
      return `${p(hours)}h${p(rminutes)}m`;
    },
    silver() {
      return Number(spraySilvering.silverNitrate(this.b).toFixed(2));
    },
    soda() {
      return Number(spraySilvering.sodiumHydroxide(this.b).toFixed(2));
    },
    sugarwater() {
      return Number(spraySilvering.sugarWater(this.b).toFixed(2));
    },
    sugar() {
      return Number(spraySilvering.glucose(this.b).toFixed(2));
    },
    firstQty() {
      return Number(spraySilvering.firstQuantity(this.b).toFixed(2));
    },
  },
};
</script>
