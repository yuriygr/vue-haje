<template>
  <div class="entry-item-wrapper">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'entry-item-wrapper'
}
</script>

<style lang="scss">
.entry-item-wrapper:not(:last-child) {
  border-bottom: 1px solid var(--entry-item__divider-color);
  position: relative;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
}
</style>