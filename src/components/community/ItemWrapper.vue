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
.community-item-wrapper:not(:last-child) {
  position: relative;
  margin-bottom: .75rem;
  padding-bottom: .75rem;
}
</style>