<template>
  <div class="community-item-wrapper">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'community-item-wrapper'
}
</script>

<style lang="scss">
.community-item-wrapper {
  --community-item__divider-color: #f1f3f5;

  html[data-theme="black"] & {
    --community-item__divider-color: #242424;
  }
}
.community-item-wrapper:not(:last-child) {
  border-bottom: 1px solid var(--community-item__divider-color);
  position: relative;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
}
</style>