<template>
    <div>
        <h3 class="subtitle" style="margin-bottom: 0">
            Spray silvering proportions & recipe.
        </h3>
        <p style="margin-bottom: 0.75em">
            Base quantity is 150ml distilled water + 1.6g silver nitrate.<br />
            Other quantities are derived from that.<br />
            Recipe from Gerhard S. on Cloudy Nights<br />
        </p>
        <div class="field">
            <h3 class="title">BOM for a session</h3>
            <div class="columns is-multiline">
                <div
                    v-for="(item, index) in bomItems"
                    :key="index"
                    class="column is-half"
                    style="margin: -0.5em 0"
                >
                    <label class="label checkbox">
                        <input type="checkbox" v-model="item.checked" />
                        {{ item.name }}
                    </label>
                </div>
            </div>
            <button class="button is-small" @click="resetBom">Reset BOM</button>
        </div>
        <hr />
        <h2 class="title">Step 0 : calibrate bottles</h2>
        <p>
            Calibrate
            <strong class="tag is-dark">Bottle 1</strong> and
            <strong class="tag is-danger">Bottle 2</strong> with water, ensuring
            that the same quantity of water is sprayed with 100 sprays.
        </p>
        <hr />
        <h2 class="title">Step 1 : prepare the solutions</h2>
        <div class="field">
            <label for="" class="label"
                >Base quantity in ml of the first solution</label
            >
            <input
                type="number"
                class="input"
                :value="b"
                @input="set('b', $event.target.value)"
            />
        </div>
        <p style="margin-bottom: 0.75em">
            <strong class="tag is-info">Solution 1</strong>:
            <strong>{{ silver }}g</strong> silver nitrate +
            <strong>{{ b }}ml</strong> distilled water<br />
            <strong class="tag is-success">Solution 2</strong>:
            <strong>{{ soda }}g</strong> sodium hydroxide +
            <strong>{{ b }}ml</strong> distilled water<br />
            <strong class="tag is-warning">Solution 3</strong>:
            <strong>{{ sugar }}g</strong> glucose +
            <strong>{{ sugarwater }}ml</strong> distilled water<br />
        </p>

        <p style="margin-bottom: 0.75em">
            <strong class="tag is-dark">Bottle 1</strong> is the mixed solution
            according to below instructions.<br />
            <strong class="tag is-danger">Bottle 2</strong> contains the sugar
            <strong class="tag is-warning">Solution 3</strong>
        </p>
        <h4 style="font-weight: 700">
            Mixing of silver solution (becomes
            <strong class="tag is-dark">Bottle 1</strong> )
        </h4>
        <ul>
            <li>
                1 : Pour about <strong>{{ firstQty }}ml</strong> of
                <strong class="tag is-info">Solution 1</strong> into a mixing
                bowl.
            </li>
            <li>
                2 : Add <strong>a few drops</strong> of
                <strong>ammonia solution (25% dilution)</strong>
            </li>
            <li>
                3 : Add <strong>all of</strong>
                <strong class="tag is-success">Solution 2</strong>
            </li>
            <li>
                4 : Add <strong>the rest</strong> of
                <strong class="tag is-info">Solution 1</strong> (the solution
                will turn brown)
            </li>
            <li>
                5 : Carefully add
                <strong>ammonia solution drop by drop</strong> while stirring
                until a transparent, slightly brownish solution is obtained.
            </li>
        </ul>
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
        <div class="field is-horizontal" v-if="savedOpticalPieces.length > 0">
            <label for="" class="label is-small">Load optical piece: </label>
            <div class="field has-addons">
                <div class="control">
                    <div class="select is-small">
                        <select v-model="selectedOpticalPiece">
                            <option value="">Select...</option>
                            <option v-for="piece in savedOpticalPieces" :key="piece.name" :value="piece.name">
                                {{ piece.name }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="control">
                    <button class="button is-small is-info" @click="loadOpticalPiece" :disabled="!selectedOpticalPiece">
                        Load
                    </button>
                </div>
            </div>
        </div>
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
import { get, set, normalize, getOpticalPieces } from "./utils";

export default {
    name: "App",
    data() {
        return {
            b: Number(normalize(get("__baseqty", "b", "150"))),
            bomItems: this.loadBomItems(),
            diameter: 150,
            savedOpticalPieces: [],
            selectedOpticalPiece: "",
        };
    },
    mounted() {
        this.savedOpticalPieces = getOpticalPieces();
    },
    methods: {
        set(key, value) {
            set(this, "__baseqty", { f: this.f, d: this.d }, key, value);
        },
        normalize,
        loadOpticalPiece() {
            if (this.selectedOpticalPiece) {
                const piece = this.savedOpticalPieces.find(
                    p => p.name === this.selectedOpticalPiece
                );
                if (piece) {
                    this.diameter = piece.radius * 2; // diameter = 2 * radius
                }
            }
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
