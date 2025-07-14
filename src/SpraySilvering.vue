<template>
    <div>
        <div class="card-title justify-center mb-3">
            <div class="badge badge-outline badge-sm">
                Spray silvering proportions & recipe
            </div>
        </div>
        <div class="alert mb-3 py-1">
            <div class="text-xs">
                <p>
                    Base quantity is 150ml distilled water + 1.6g silver
                    nitrate.<br />
                    Other quantities are derived from that.<br />
                    Recipe from Gerhard S. on Cloudy Nights
                </p>
            </div>
        </div>
        <div class="card bg-base-200 p-3 mb-3">
            <h3 class="text-sm font-semibold mb-2">BOM for a session</h3>
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
                    <span class="text-xs">{{ item.name }}</span>
                </div>
            </div>
            <button class="btn btn-sm btn-outline" @click="resetBom">
                Reset BOM
            </button>
        </div>
        <div class="card bg-base-200 p-3 mb-3">
            <div class="flex items-center gap-2 mb-2">
                <span class="badge badge-neutral badge-sm">Step 0</span>
                <h2 class="text-sm font-bold">Calibrate bottles</h2>
            </div>
            <p class="text-xs">
                Calibrate
                <span class="badge badge-neutral badge-xs">Bottle 1</span> and
                <span class="badge badge-error badge-xs">Bottle 2</span> with
                water, ensuring that the same quantity of water is sprayed with
                100 sprays.
            </p>
        </div>
        <div class="card bg-base-200 p-3 mb-3">
            <div class="flex items-center gap-2 mb-2">
                <span class="badge badge-primary badge-sm">Step 1</span>
                <h2 class="text-sm font-bold">Prepare the solutions</h2>
            </div>
            <div class="field-horizontal">
                <label class="label text-xs font-medium"
                    >Base quantity (ml):</label
                >
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
                    <span class="badge badge-info badge-sm">Solution 1</span>:
                    <strong>{{ silver }}g</strong> silver nitrate +
                    <strong>{{ b }}ml</strong> distilled water
                </p>
                <p>
                    <span class="badge badge-success badge-sm">Solution 2</span
                    >: <strong>{{ soda }}g</strong> sodium hydroxide +
                    <strong>{{ b }}ml</strong> distilled water
                </p>
                <p>
                    <span class="badge badge-warning badge-sm">Solution 3</span
                    >: <strong>{{ sugar }}g</strong> glucose +
                    <strong>{{ sugarwater }}ml</strong> distilled water
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
                    <span class="badge badge-neutral badge-xs">Bottle 1</span>
                    is the mixed solution according to below instructions.
                </p>
                <p>
                    <span class="badge badge-error badge-xs">Bottle 2</span>
                    contains the sugar
                    <span class="badge badge-warning badge-xs">Solution 3</span>
                </p>
            </div>
        </div>
        <div class="card bg-base-200 p-3 mb-3">
            <div class="flex items-center gap-2 mb-2">
                <span class="badge badge-secondary badge-sm">Step 2</span>
                <h2 class="text-sm font-bold">
                    Mixing of silver solution (becomes
                    <span class="badge badge-neutral badge-xs">Bottle 1</span>)
                </h2>
            </div>
            <ul class="list-disc list-inside space-y-2 text-xs">
                <li>
                    1 : Pour about <strong>{{ firstQty }}ml</strong> of
                    <span class="badge badge-info badge-xs">Solution 1</span>
                    into a mixing bowl.
                </li>
                <li>
                    2 : Add <strong>a few drops</strong> of
                    <strong>ammonia solution (25% dilution)</strong>
                </li>
                <li>
                    3 : Add <strong>all of</strong>
                    <span class="badge badge-success badge-xs">Solution 2</span>
                </li>
                <li>
                    4 : Add <strong>the rest</strong> of
                    <span class="badge badge-info badge-xs">Solution 1</span>
                    (the solution will turn brown)
                </li>
                <li>
                    5 : Carefully add
                    <strong>ammonia solution drop by drop</strong> while
                    stirring until a transparent, slightly brownish solution is
                    obtained.
                </li>
            </ul>
        </div>
        <p>
            Any precipitate that may still be present should be completely
            dissolved
        </p>
        <hr />
        <h2 class="title">Step 2 : clean the mirror</h2>
        <p>
            Use chalk precipitate in distilled/demin water on small cotton
            balls. Change often and start with thick sauce, thinning it
            progressively. The center will clean fast but the edge and chamfer
            need a LOT of time.<br />Rough guideline : (diameter_in_mm/15)^1.4 =
            time in minutes.<br />Yes, that is an advice of 1h40 for a 400mm
            mirror.<br />Rinse with demin water and if possible, high pressure.
        </p>
        <OpticalPieceSelector
            @optical-piece-selected="onOpticalPieceSelected"
        />
        <label for="" class="label is-small">
            Mirror diameter in mm:
            <input
                class="input is-small"
                type="text"
                placeholder="diameter"
                v-model="diameter"
            />
        </label>
        <p>
            Cleaning time :
            {{ cleaning_time }}
        </p>
        <hr />
        <h2 class="title">Step 3 : spray the mirror</h2>
        <p>
            Spray the mirror with both sprays, ensuring that they mix on the
            surface. You will see a faint blue film appear first.<br />Then it
            will turn yellowish. If you see dark brown or black streaks, this
            means your cleaning wasn't thorough enough.<br />A thin coating is
            preferable to a thick one and it should still be a tad transparent
            at the end.
        </p>
        <hr />
        <h2 class="title">Step 4 : dry & store</h2>
        <p>
            Immediately dry with a hot air gun and store in an airtight box with
            dessicant packs, or better, silver protector felt. Silver protector
            felt is felt impregnated with tiny silver particles that are there
            to react with oxydants first and protect your coating.
        </p>
    </div>
</template>

<script>
import { fr as langpack_fr, en as langpack_en } from "./lang";
import { get, set, normalize } from "./utils";
import OpticalPieceSelector from "./OpticalPieceSelector.vue";

export default {
    name: "App",
    components: {
        OpticalPieceSelector,
    },
    data() {
        return {
            b: Number(normalize(get("__baseqty", "b", "150"))),
            bomItems: this.loadBomItems(),
            diameter: 150,
        };
    },
    methods: {
        set(key, value) {
            set(this, "__baseqty", { f: this.f, d: this.d }, key, value);
        },
        normalize,
        onOpticalPieceSelected(piece) {
            this.diameter = piece.radius * 2; // diameter = 2 * radius
        },
        loadBomItems() {
            const defaultItems = [
                { name: "Gloves", checked: false },
                { name: "Chalk to wash the mirrors", checked: false },
                { name: "Mirror stands", checked: false },
                { name: "Anti-projection box", checked: false },
                { name: "Hairdryer", checked: false },
                { name: "Hydrophilic cotton", checked: false },
                { name: "Demin. water", checked: false },
                { name: "Stands for the mirrors", checked: false },
                { name: "A box in which to silver", checked: false },
                { name: "Glucose", checked: false },
                { name: "Silver nitrate", checked: false },
                { name: "Sodium hydroxide", checked: false },
                { name: "Ammonia", checked: false },
                { name: "Two sprayers", checked: false },
                { name: "Containers", checked: false },
                { name: "FFP2 masks", checked: false },
            ];

            const savedItems = localStorage.getItem("bomItems");
            if (savedItems) {
                const parsedItems = JSON.parse(savedItems);
                if (!parsedItems) {
                    return defaultItems;
                }
                // Check if any new items need to be added
                defaultItems.forEach((item) => {
                    if (
                        !parsedItems.find((saved) => saved.name === item.name)
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
            localStorage.setItem("bomItems", JSON.stringify(this.bomItems));
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
        cleaning_time() {
            const minutes = Math.pow(this.diameter / 15, 1.4).toFixed(2);
            const hours = Math.floor(minutes / 60);
            const rminutes = Math.trunc(minutes - hours * 60);
            const p = (n) => (n + "").padStart("0", 2);
            return `${p(hours)}h${p(rminutes)}m`;
        },
        silver() {
            return Number((1.6 * (this.b / 150)).toFixed(2));
        },
        soda() {
            return Number((2.5 * (this.b / 150)).toFixed(2));
        },
        sugarwater() {
            return Number((300 * (this.b / 150)).toFixed(2));
        },
        sugar() {
            return Number((12 * (this.b / 150)).toFixed(2));
        },
        firstQty() {
            return Number((100 * (this.b / 150)).toFixed(2));
        },
    },
};
</script>
