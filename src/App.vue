<template>
  <div id="app">
    <div class="box" style="width: 100%;max-width: 540px;margin:auto;margin-bottom:15px;">
      <h2 class="subtitle" style="margin-bottom: 0">{{ l["title"] }}</h2>
      <h3 class="subtitle" style="margin-bottom: 0">
        R = (S / 2) + (D<sup>2</sup> / 8 * S)
      </h3>
      <p>
        <span v-html="l['equation_1']"></span>
        <span v-html="l['equation_2']"></span>
        <span v-html="l['equation_3']"></span>
      </p>
      <hr>
      <div class="field is-horizontal">
        <label for="" class="label is-small">{{ l["language"] }} :</label>
        <div class="select is-small">
          <select
            class="is-small"
            name="language"
            id=""
            @change="set('lang', $event.target.value)"
            :value="lang"
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
      <div class="field is-horizontal">
        <label for="" class="label is-small"> D : </label>
        <input
          type="number"
          class="input is-small"
          :value="d"
          @input="set('d', parseFloat($event.target.value, 10))"
        />
      </div>
      <div class="field is-horizontal">
        <label for="" class="label is-small"> S : </label>
        <input
          type="number"
          class="input is-small"
          :value="s"
          @input="set('s', parseFloat($event.target.value, 10))"
        />
      </div>
      <div class="button is-primary" style="white-space: normal">
        <span
          >{{ l["roc"] }} &nbsp;
          <strong
            >&nbsp;{{ r.toFixed(2) }}</strong
          ></span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { fr as langpack_fr, en as langpack_en } from "./lang";

const get = (storage_key, key, default_value) => {
  try {
    return JSON.parse(localStorage.getItem(storage_key))[key] || default_value;
  } catch (e) {
    return default_value;
  }
};

const set = (component, storage_key, obj, key, value) => {
  try {
    component[key] = value;
    const n_obj = { ...obj, key: value };
    localStorage.setItem(storage_key, JSON.stringify(n_obj));
    return value;
  } catch (e) {
    return value;
  }
};

export default {
  name: "App",
  data() {
    return {
      lang: get("__sphero", "lang", "fr"),
      d: parseFloat(get("__sphero", "d", 40), 10),
      s: parseFloat(get("__sphero", "s", 3), 10),
    };
  },
  methods: {
    set(key, value) {
      set(
        this,
        "__sphero",
        { d: this.d, s: this.s, units: this.units, lang: this.lang },
        key,
        value
      );
    },
  },
  computed: {
    r() {
      const d = this.d;
      const s = this.s;
      const r = (s / 2) + ((d * d) / (8 * s))
      return r;
    },
    l() {
      return this.lang === "fr" ? langpack_fr : langpack_en;
    },
  }
};
</script>

<style lang="scss">
@import "~bulma";

html, body {
  background: gray;
  overflow-x: hidden;
}

#app {
  padding: 15px;
}

.is-horizontal {
  display: flex;
  label {
    min-width: 10ch;
  }
}
</style>
