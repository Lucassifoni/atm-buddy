<template>
  <div>
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
    <p v-if="savedOpticalPieces.length === 0" class="has-text-grey is-size-7 mb-3">
      💡 Create optical pieces in the <router-link to="/hardware">Hardware</router-link> tab to quickly load their dimensions here.
    </p>
    <p v-else class="has-text-grey is-size-7 mb-3">
      💡 Manage optical pieces in the <router-link to="/hardware">Hardware</router-link> tab.
    </p>
  </div>
</template>

<script>
import { getOpticalPieces } from './utils';

export default {
  name: 'OpticalPieceSelector',
  data() {
    return {
      savedOpticalPieces: [],
      selectedOpticalPiece: "",
    };
  },
  mounted() {
    this.savedOpticalPieces = getOpticalPieces();
  },
  methods: {
    loadOpticalPiece() {
      if (this.selectedOpticalPiece) {
        const piece = this.savedOpticalPieces.find(
          p => p.name === this.selectedOpticalPiece
        );
        if (piece) {
          this.$emit('optical-piece-selected', piece);
          this.selectedOpticalPiece = "";
        }
      }
    },
  },
};
</script>