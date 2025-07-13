<template>
  <div>
      <h3 class="subtitle" style="margin-bottom: 0">
        Baader MPCC Conic calculator
      </h3>
      <p>
      In waves @550nm :<br>Correction of a parabola : D (mm) / (1.1264 * (F/D)^3)
      <br>MPCC S.A. undercorrection : (4 / (F/D))^4 * 0.81
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
        <label for="" class="label is-small">Diameter (mm) : </label>
        <input
          class="input is-small"
          :value="d"
          @input="set('d', Number(normalize(($event.target.value))))"
        />
      </div>
      <div class="field is-horizontal">
        <label for="" class="label is-small">Focal length (mm) : </label>
        <input
          class="input is-small"
          :value="f"
          @input="set('f', Number(normalize(($event.target.value))))"
        />
      </div>
      <hr>
      <p>
      <strong>Focal ratio :</strong> {{ ratio }}<br>
      <strong>Parabola correction :</strong> {{ correction }}<br>
      <strong>MPCC Undercorrection :</strong> {{ undercorrection }}<br>
      <strong>Target conic : </strong> {{ target }}
      </p>
  </div>
</template>

<script>
import { fr as langpack_fr, en as langpack_en } from "./lang";
import {get, set, normalize, getOpticalPieces} from './utils';

export default {
  name: "App",
  data() {
    return {
      f: Number(normalize(get("__mpcc", "f", "1200"))),
      d: Number(normalize(get("__mpcc", "d", "300"))),
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
        "__mpcc",
        { f: this.f, d: this.d},
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
          this.set('d', piece.radius * 2); // diameter = 2 * radius
          this.set('f', piece.radiusOfCurvature / 2); // focal length = ROC / 2
        }
      }
    },
  },
  computed: {
    ratio() {
        return this.f / this.d;
    },
    correction() {
      return this.d / (1.1264 * (this.ratio * this.ratio * this.ratio));
    },
    undercorrection() {
    const c = (4 / this.ratio);
    return  c * c * c * c * 0.81;
    },
    target() {
        return -1 - (this.undercorrection / this.correction);
    },
  }
};
</script>
