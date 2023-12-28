<template>
  <div class="form-block">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'form-block'
}
</script>

<style lang="scss">
.form-block {
  margin-bottom: 1.5rem;
  position: relative;

  &:last-of-type { margin-bottom: 0;  }
}
</style>