<template>
    <div>
        <div v-if="savedOpticalPieces.length > 0">
            <label class="label is-small">Load optical piece: </label>
            <div class="buttons">
                <button
                    class="button is-small is-info is-rounded"
                    @click="loadOpticalPiece(piece)"
                    v-for="piece in savedOpticalPieces"
                    :key="piece.name"
                >
                    {{ piece.name }}
                </button>
            </div>
        </div>
        <p
            v-if="savedOpticalPieces.length === 0"
            class="has-text-grey is-size-7 mb-3"
        >
            💡 Create optical pieces in the
            <router-link to="/hardware">Hardware</router-link> tab to quickly
            load their dimensions here.
        </p>
        <p v-else class="has-text-grey is-size-7 mb-3">
            💡 Manage optical pieces in the
            <router-link to="/hardware">Hardware</router-link> tab.
        </p>
    </div>
</template>

<script>
import { getOpticalPieces } from "./utils";

export default {
    name: "OpticalPieceSelector",
    data() {
        return {
            savedOpticalPieces: [],
        };
    },
    mounted() {
        this.savedOpticalPieces = getOpticalPieces();
    },
    methods: {
        loadOpticalPiece(piece) {
            if (piece) {
                this.$emit("optical-piece-selected", piece);
            }
        },
    },
};
</script>
