<template>
  <form class="form-group" method="post" enctype="multipart/form-data" @submit.prevent="$emit('send', $event)" :disabled="loading">
    <slot />
  </form>
</template>

<script>
export default {
  name: 'form-group',
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
.l-input {
  --field--background: #f7f7f7;
  --field--color: #111;
  --field--border-color: #e8e8e8;

  html[data-theme='black'] & {
    --field--background: #141414;
    --field--color: #fffcea;
    --field--border-color: #222;
  }
}

.form-section {
  &__title {
    margin: 0 0 1rem 0;
  }
}

.l-input {
  &__title {
    display: block;
    font-weight: 400;
    font-size: 1.5rem;
    margin-bottom: .5rem;
    line-height: 2rem;
  }

  &__item {
    background: var(--field--background);
    color: var(--field--color);
    border: 1px solid var(--field--border-color);

    font-weight: 400;
    border-radius: 8px;
    display: block;
    width: 100%;
    height: 44px;

    outline: none;
    font-size: 1.5rem;
    font-family: inherit;
    line-height: calc(1.5 * 1em);

    margin: 0;
    padding: 0 1.25rem;
  }
}
</style>