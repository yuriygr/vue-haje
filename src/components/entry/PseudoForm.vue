<template>
  <div class="entry-pseudo-form">
    <div class="entry-pseudo-form__icon">
      <icon name="edit-line" size="18" />
    </div>
    <div class="entry-pseudo-form__placeholder">{{ $t('entry.pseudo-form.placeholder') }}</div>
  </div>
</template>

<script>
import { Icon } from '@vue-norma/ui'

export default {
  name: 'entry-pseudo-form',
  components: {
    Icon
  },
  props: {
    user: {
      type: Object,
      default: false
    }
  }
}
</script>

<style lang="scss">
.entry-pseudo-form {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 5rem;
  width: 100%;
  padding: 1rem;
  cursor: text;

  background: var(--entry-pseudo-form--backgroud, #f7f7f7);
  border-radius: 8px;
  border: 1px solid var(--entry-pseudo-form--border-color, #f1f1f1);

  &__icon {
    color: var(--entry-pseudo-form__icon--color, #aaa);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px;

    svg { fill: currentColor; flex-shrink: 0; }
  }

  &__placeholder {
    display: flex;
    align-items: center;
    background: transparent;
    border: 0;
    border-radius: 0;
    height: 100%;
    width: 100%;
    outline: none;
    font-size: 1.4rem;
    color: var(--search-field__placeholder--color, #999);
    font-family: inherit;
    line-height: 1.6;
    padding: .1rem 0.2rem;
  }
}
</style>