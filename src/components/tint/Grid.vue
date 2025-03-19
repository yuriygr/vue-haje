<template>
  <div class="tints-grid">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'tints-grid',
}
</script>

<style lang="scss" scoped>
.tints-grid {
  --item-size: 4.4rem;
}

.tints-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, var(--item-size));
  grid-gap: 1rem;
}
</style>