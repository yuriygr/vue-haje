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
  --thumb-width: 150px;
}

.tints-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--thumb-width), 1fr));
  grid-gap: 1rem;
}
</style>