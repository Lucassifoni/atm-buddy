<template>
  <div>
      <h3 class="subtitle" style="margin-bottom: 0">
        Sine table</h3>
        <p>where x is the angle between the two planes.<br>
        r is the cup radius<br>(measure outside for a concave curve, inside for a convex curve !)<br>
        sin(x) = r / R
      </p>
      <hr>
      <OpticalPieceSelector @optical-piece-selected="onOpticalPieceSelected" />
      <div class="field is-horizontal">
        <label for="" class="label is-small">Cup radius (in mm): </label>
        <input
          class="input is-small"
          :value="r"
@input="r = $event.target.value"
        />
      </div>
      <div class="field is-horizontal">
        <label for="" class="label is-small">Desired ROC (in mm): </label>
        <input
          class="input is-small"
          :value="R"
@input="R = $event.target.value"
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
import { normalize, parseFloat } from './utils';
import OpticalPieceSelector from './OpticalPieceSelector.vue';

export default {
  name: "App",
  components: {
    OpticalPieceSelector,
  },
  data() {
    return {
      r: "125",
      R: "2500",
    };
  },
  methods: {
    normalize,
    onOpticalPieceSelected(piece) {
      this.R = piece.radiusOfCurvature.toString(); // ROC directly
    },
  },
  computed: {
    x() {
      const r = parseFloat(this.r);
      const R = parseFloat(this.R);
      const sinx = r / R;
      const rad = Math.asin(sinx);
      const deg = rad * (180 / Math.PI);
      return deg;
    },
  }
};
</script>