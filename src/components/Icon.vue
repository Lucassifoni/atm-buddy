<template>
  <svg
    :class="className"
    :width="size"
    :height="size"
    :viewBox="viewBox"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    v-html="spriteContent"
  />
</template>

<script>
import iconMap from "../assets/iconMap.js";
import iconSprite from "../assets/icons.svg?raw";

const ICON_SIZE = 24;

const match = iconSprite.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
const spriteContent = match ? match[1] : "";

export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: [String, Number],
      default: 24,
    },
    className: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      spriteContent,
    };
  },
  computed: {
    viewBox() {
      const coords = iconMap[this.name];
      if (!coords) {
        return "0 0 24 24";
      }
      const [col, row] = coords;
      const x = (col - 1) * ICON_SIZE;
      const y = (row - 1) * ICON_SIZE;
      return `${x} ${y} ${ICON_SIZE} ${ICON_SIZE}`;
    },
  },
};
</script>
