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
            <h3 class="subtitle">BOM for a session</h3>
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
        <hr />
        <p>
            Any precipitate that may still be present should be completely
            dissolved
        </p>
        <hr />
        <p>
            To use, first calibrate
            <strong class="tag is-dark">Bottle 1</strong> and
            <strong class="tag is-danger">Bottle 2</strong> with water, ensuring
            that the same quantity of water is sprayed with 100 sprays.
        </p>
    </div>
</template>

<script>
import { fr as langpack_fr, en as langpack_en } from "./lang";
import { get, set, normalize } from "./utils";

export default {
    name: "App",
    data() {
        return {
            b: Number(normalize(get("__baseqty", "b", "150"))),
            bomItems: this.loadBomItems(),
        };
    },
    methods: {
        set(key, value) {
            set(this, "__baseqty", { f: this.f, d: this.d }, key, value);
        },
        normalize,
        loadBomItems() {
            const defaultItems = [
                { name: "Gloves", checked: false },
                { name: "Chalk to wash the mirrors", checked: false },
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
