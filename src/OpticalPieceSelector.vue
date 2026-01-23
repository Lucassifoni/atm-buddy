<template>
  <div>
    <div v-if="savedOpticalPieces.length > 0" class="mb-3">
      <label class="label text-xs font-medium mb-1">{{ $t('selectors.loadOpticalPiece') }}</label>
      <div class="flex flex-wrap gap-1">
        <button
          class="btn btn-info btn-xs"
          @click="loadOpticalPiece(piece)"
          v-for="piece in savedOpticalPieces"
          :key="piece.name"
        >
          {{ piece.name }}
        </button>
      </div>
    </div>
    <div class="alert mb-3 py-1">
      <div class="text-xs">
        <p v-if="savedOpticalPieces.length === 0">
          {{ $t('selectors.createOpticalPiecesHint') }}
          <router-link to="/hardware" class="link">{{ $t('common.hardware') }}</router-link>
          {{ $t('selectors.tabSuffix') }}
        </p>
        <p v-else>
          {{ $t('selectors.manageOpticalPiecesHint') }}
          <router-link to="/hardware" class="link">{{ $t('common.hardware') }}</router-link>
          {{ $t('selectors.tabSuffixManage') }}
        </p>
      </div>
    </div>
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
