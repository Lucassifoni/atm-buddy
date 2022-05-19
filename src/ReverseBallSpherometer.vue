<template>
  <div>
      <h3 class="subtitle" style="margin-bottom: 0">
        Sagitta = ROC ± b/2 - sqrt((ROC ± b/2)² - r²)
      </h3>
      <hr>
      <div class="field is-horizontal">
        <label for="" class="label is-small">Radius of feet (in mm): </label>
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
      <div class="field is-horizontal">
        <label for="" class="label is-small">Ball diameter (in mm): </label>
        <input
          class="input is-small"
          :value="b"
          @input="set('b', Number(normalize(($event.target.value))))"
        />
      </div>
      <div class="field is-horizontal">
        <label for="" class="label is-small">Curve : </label>
        <div class="select is-small">
          <select name="" id="" :value="curve">
            <option :value="'concave'">Concave</option>
            <option :value="'convex'">Convex</option>
          </select>
        </div>
      </div>
      <div class="button is-primary" style="white-space: normal">
        <span
          >Sagitta: &nbsp;
          <strong
            >&nbsp;{{ sag.toFixed(3) }}</strong
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
      R: Number(normalize(get("__rsphero", "R", "2500"))),
      r: Number(normalize(get("__rsphero", "r", "35"))),
      b: Number(normalize(get("__rsphero", "b", "3"))),
      curve: 'concave',
    };
  },
  methods: {
    set(key, value) {
      set(
        this,
        "__rsphero",
        { R: this.R, r: this.r, curve: this.curve, b: this.b},
        key,
        value
      );
    },
    normalize
  },
  computed: {
    sag() {
      const r = this.r;
      const R = this.R;
      const b = this.curve === 'concave' ? this.b : -this.b;
      const aR = (R + b / 2);
      const sag = aR - Math.sqrt((aR * aR) - (r * r));
      return sag;
    },
  }
};
</script>