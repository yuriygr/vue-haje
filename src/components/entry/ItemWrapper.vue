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
.entry-item-wrapper {
  --entry-item__divider-color: #f1f3f5;

  html[data-theme="black"] & {
    --entry-item__divider-color: #242424;
  }
}

.entry-item-wrapper:not(:last-child) {
  border-bottom: 1px solid var(--entry-item__divider-color);
  position: relative;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
}
</style>