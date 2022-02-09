<template>
  <div>
      <h3 class="subtitle" style="margin-bottom: 0">
        ROC = (r² + s²) / 2s ± b/2
      </h3>
      <hr>
      <div class="field is-horizontal">
        <label for="" class="label is-small">Radius of feet : </label>
        <input
          class="input is-small"
          :value="r"
          @input="set('r', Number(normalize(($event.target.value))))"
        />
      </div>
      <div class="field is-horizontal">
        <label for="" class="label is-small">Sagitta : </label>
        <input
          class="input is-small"
          :value="s"
          @input="set('s', Number(normalize(($event.target.value))))"
        />
      </div>
      <div class="field is-horizontal">
        <label for="" class="label is-small">Ball diameter : </label>
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
          >ROC: &nbsp;
          <strong
            >&nbsp;{{ roc.toFixed(2) }}</strong
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
      r: Number(normalize(get("__sphero", "r", "40"))),
      s: Number(normalize(get("__sphero", "s", "3"))),
      b: Number(normalize(get("__sphero", "b", "3"))),
      curve: 'concave',
    };
  },
  methods: {
    set(key, value) {
      set(
        this,
        "__sphero",
        { b: this.b, s: this.s, r: this.r, curve: this.curve},
        key,
        value
      );
    },
    normalize
  },
  computed: {
    roc() {
      const r = this.r;
      const s = this.s;
      const b = this.curve === 'concave' ? this.b : -this.b;
      const roc = (r * r + s * s) / (2 * s) + b / 2;
      return roc;
    },
  }
};
</script>