<template>
  <span class="skeleton" :style="$style"></span>
</template>

<script>
export default {
  name: 'skeleton'
}
</script>
<script setup>
import { computed } from 'vue'

const props = defineProps({
  width: {
    type: Number,
    default: 18
  },
  height: {
    type: Number,
    default: 18
  }
})

const $style = computed(() => {
  return [
    `--w: ${props.width}px`,
    `--h: ${props.height}px`
  ]
})
</script>

<style lang="scss">
.skeleton {
  --skeleton-background: rgba(0, 0, 0, 0.09);

  html[data-theme="black"] & {
    --skeleton-background: rgba(255, 255, 255, 0.05);
  }
}
.skeleton {
  background: var(--skeleton-background);

  width: 100%;
  max-width: 100%;
  border-radius: 6px;
  display: inline-flex;
  line-height: 1;
  position: relative;
  overflow: hidden;
  visibility: visible;
  z-index: 1;

  width: var(--w);
  height: var(--h);
}
</style>