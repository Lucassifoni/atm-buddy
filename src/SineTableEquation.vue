<template>
  <div>
      <h3 class="subtitle" style="margin-bottom: 0">
        Sine table</h3>
        <p>where x is the angle between the two planes.<br>
        r is the cup radius<br>(measure outside for a concave curve, inside for a convex curve !)<br>
        sin(x) = r / R
      </p>
      <hr>
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
import {get, set, normalize} from './utils';

export default {
  name: "App",
  data() {
    return {
      r: Number(normalize(get("__sinetable", "r", "125"))),
      R: Number(normalize(get("__sinetable", "R", "2500"))),
    };
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
    normalize
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