<template>
  <div class="form-divider" />
</template>

<script>
export default {
  name: 'form-divider'
}
</script>

<style lang="scss">
.form-divider {
  height: 0;
  margin: .5rem 0;
  background: transparent;
  border-bottom: 1px solid var(--separator--color, #eee);
}
</style>