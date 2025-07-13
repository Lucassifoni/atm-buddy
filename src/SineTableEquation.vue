<template>
  <div>
      <h3 class="subtitle" style="margin-bottom: 0">
        Sine table</h3>
        <p>where x is the angle between the two planes.<br>
        r is the cup radius<br>(measure outside for a concave curve, inside for a convex curve !)<br>
        sin(x) = r / R
      </p>
      <hr>
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
      <div class="field is-horizontal">
        <label for="" class="label is-small">Cup radius (in mm): </label>
        <input
          class="input is-small"
          :value="r"
          @input="set('r', Number(normalize(($event.target.value))))"
        />
      </div>
      <div class="field is-horizontal">
        <label for="" class="label is-small">Desired ROC (in mm): </label>
        <input
          class="input is-small"
          :value="R"
          @input="set('R', Number(normalize(($event.target.value))))"
        />
      </div>
      <div class="button is-primary" style="white-space: normal">
        <span
          >Angle x in degrees : &nbsp;
          <strong
            >&nbsp;{{ x.toFixed(2) }}</strong
          ></span
        >
      </div>
  </div>
</template>

<script>
import { fr as langpack_fr, en as langpack_en } from "./lang";
import {get, set, normalize, getOpticalPieces} from './utils';

export default {
  name: "App",
  data() {
    return {
      r: Number(normalize(get("__sinetable", "r", "125"))),
      R: Number(normalize(get("__sinetable", "R", "2500"))),
      savedOpticalPieces: [],
      selectedOpticalPiece: "",
    };
  },
  mounted() {
    this.savedOpticalPieces = getOpticalPieces();
  },
  methods: {
    set(key, value) {
      set(
        this,
        "__sinetable",
        { R: this.R, r: this.r },
        key,
        value
      );
    },
    normalize,
    loadOpticalPiece() {
      if (this.selectedOpticalPiece) {
        const piece = this.savedOpticalPieces.find(
          p => p.name === this.selectedOpticalPiece
        );
        if (piece) {
          this.set('R', piece.radiusOfCurvature); // ROC directly
        }
      }
    },
  },
  computed: {
    x() {
      const sinx = this.r / this.R;
      const rad = Math.asin(sinx);
      const deg = rad * (180 / Math.PI);
      return deg;
    },
  }
};
</script>