<template>
  <div class="search-field" @click="onClick">
    <div class="search-field__icon">
      <icon name="search-line" size="18" />
    </div>
    <input ref="input"
      :value="value"
      :placeholder="placeholder"

      @input="onInput"
      @keyup="onKeyup"
      @keydown="onKeydown"
      @blur="onBlur"

      autocomplete="off"
      type="search"
      class="search-field__input"
      tabindex="0"
    >
  </div>
</template>

<script>
import { Icon } from '@vue-norma/ui'

export default {
  name: 'page-search',
  components: {
    Icon
  },
  props: {
    value: {
      type: [ String, Number, Boolean ],
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  emits: [ 'click', 'input', 'keyup', 'keydown', 'blur' ],
  methods: {
    onClick(e) {
      this.$refs.input.focus()
      this.$emit('click', e)
    },
    onInput(e) {
      this.$emit('input', e)
    }, 
    onKeyup(e) {
      this.$emit('keyup', e)
    },
    onKeydown(e) {
      this.$emit('keydown', e)
    },
    onBlur(e) {
      this.$emit('blur', e)
    }
  }
}
</script>

<style lang="scss">
.search-field {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 5rem;
  width: 100%;
  padding: 1rem;
  cursor: text;

  background: var(--search-field--backgroud, #f7f7f7);
  border-radius: 8px;
  border: 1px solid var(--search-field--border-color, #f1f1f1);
  
  &__icon {
    color: var(--search-field__icon--color, #aaa);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px;

    svg { fill: currentColor; flex-shrink: 0; }
  }

  &__input {
    display: flex;
    align-items: center;
    background: transparent;
    border: 0;
    border-radius: 0;
    height: 100%;
    width: 100%;
    outline: none;
    appearance: textfield;
    color: var(--search-field--color, #111);
    font-size: 1.4rem;
    font-family: inherit;
    line-height: 1.6;
    padding: .1rem .2rem;

    &::placeholder {
      color: var(--search-field__placeholder--color, #999);
      opacity: 1;
    }

    &::-webkit-search-decoration,
    &::-webkit-search-cancel-button,
    &::-webkit-search-results-button,
    &::-webkit-search-results-decoration {
      appearance: none;
    }
  }
}
</style>