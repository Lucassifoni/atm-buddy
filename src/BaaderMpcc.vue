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
      <OpticalPieceSelector @optical-piece-selected="onOpticalPieceSelected" />
      <div class="field is-horizontal">
        <label for="" class="label is-small">Diameter (mm) : </label>
        <input
          class="input is-small"
          :value="d"
@input="d = Number(normalize($event.target.value))"
        />
      </div>
      <div class="field is-horizontal">
        <label for="" class="label is-small">Focal length (mm) : </label>
        <input
          class="input is-small"
          :value="f"
@input="f = Number(normalize($event.target.value))"
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
import { normalize } from './utils';
import OpticalPieceSelector from "./OpticalPieceSelector.vue";

export default {
  name: "App",
  data() {
    return {
      f: 1200,
      d: 300,
    };
  },
  components: {
    OpticalPieceSelector,
  },
  methods: {
    normalize,
    onOpticalPieceSelected(piece) {
      this.d = piece.radius * 2; // diameter = 2 * radius
      this.f = piece.radiusOfCurvature / 2; // focal length = ROC / 2
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
