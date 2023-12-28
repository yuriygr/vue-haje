<template>
  <div :class="elClass" @click="onClick">
    <div class="n-input__icon" v-if="icon">
      <icon :name="icon" :size="iconSize" />
    </div>
    <input ref="input"
      :value="value"
      :placeholder="placeholder"

      @input="onInput"
      @keyup="onKeyup"
      @keydown="onKeydown"
      @blur="onBlur"

      autocomplete="off"
      :type="type"
      class="n-input__input"
      tabindex="0"
    >
  </div>
</template>

<script>
import { Icon } from '@vue-norma/ui'

export default {
  name: 'n-input',
  components: {
    Icon
  },
  props: {
    icon: {
      type: [ String, Boolean ],
      default: false 
    },
    type: {
      type: String,
      default: 'text'
    },
    value: {
      type: [ String, Number, Boolean ],
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    // Mods
    size: {
      type: String,
      default: 'm'
    },
    stretched: {
      type: Boolean,
      default: false
    },
    // State
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: false
    },
  },
  emits: [ 'click', 'input', 'keyup', 'keydown', 'blur' ],
  computed: {
    elClass() {
      return [
        'n-input',
        'n-input--size-' + this.size,
        {
          'n-input--has-icon': this.icon,
          'n-input--stretched': this.stretched,
          'n-input--loading': this.loading,
          'n-input--disabled': this.disabled,
          'n-input--active': this.active
        }
      ]
    },
    iconSize() {
      switch (this.size) {
        case 's':
          return 14;
        case 'm':
          return 16;
        case 'l':
          return 18;
        default:
          return 16;
      }
    }
  },
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
.n-input {
  &--size-s {
    --n-input--height: 36px;
    --n-input--font-size: 1.4rem;
    --n-input--padding: 1.25rem;
  }
  &--size-m {
    --n-input--height: 42px;
    --n-input--font-size: 1.4rem;
    --n-input--padding: 1.25rem;
  }
  &--size-l {
    --n-input--height: 44px;
    --n-input--font-size: 1.5rem;
    --n-input--padding: 1.25rem;
  }
}

.n-input {
   --n-input--color: #111;
   --n-input--backgroud: #f7f7f7;
   --n-input--border-color: #f1f1f1;
   --n-input__icon--color: #aaa;
   --n-input__placeholder--color: #999;

  html[data-theme="black"] & {
     --n-input--color: #fffcea;
     --n-input--backgroud: #181818;
     --n-input--border-color: #222;
     --n-input__icon--color: #aaa;
     --n-input__placeholder--color: #999;
  }
}

.n-input {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: var(--n-input--height);
  width: 100%;
  cursor: text;

  background: var(--n-input--backgroud, #f7f7f7);
  border-radius: 8px;
  border: 1px solid var(--n-input--border-color, #f1f1f1);
  
  &__icon {
    color: var(--n-input__icon--color, #aaa);
    display: flex;
    justify-content: center;
    align-items: center;

    padding-left: var(--n-input--padding);

    svg { fill: currentColor; flex-shrink: 0; }
  }

  &__input {
    display: flex;
    align-items: center;
    background: transparent;
    border: 0;
    border-radius: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    outline: none;
    appearance: textfield;
    color: var(--n-input--color, #111);
    font-size: var(--n-input--font-size);
    font-family: inherit;
    line-height: calc(1.5 * 1em);

    &:last-child {
      padding-right: var(--n-input--padding);
    }
    &:first-child {
      padding-left: var(--n-input--padding);
    }

    &::placeholder {
      user-select: none;
      color: var(--n-input__placeholder--color, #999);
      opacity: 1;
    }

    &::-webkit-search-decoration,
    &::-webkit-search-cancel-button,
    &::-webkit-search-results-button,
    &::-webkit-search-results-decoration {
      appearance: none;
    }
  }

  &__clear:not(:first-child),
  &__icon:not(:last-child) + &__input {
    margin-left: 8px;
  }

  &--stretched {
    display: block;
    flex-basis: 0;
    flex-grow: 1;
    width: 100%;
  }

  &--disabled {
    opacity: 0.4;
    pointer-events: none;
    cursor: default;
    @media(hover: hover) {
      &:hover {
        background: var(--n-input--background);
        color: var(--n-input--color);
      }
    }
  }
}
</style>