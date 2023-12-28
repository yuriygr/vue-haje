<template>
  <div class="tag-item-wrapper">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'tag-item-wrapper'
}
</script>

<style lang="scss">
.tag-item-wrapper:not(:last-child) {
  position: relative;
  margin-bottom: .5rem;
  padding-bottom: .5rem;
}
</style>