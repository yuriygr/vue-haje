<template>
  <div :class="elClass" @click="onClick">
    <div class="text-field__icon" v-if="icon">
      <icon :name="icon" :size="iconSize" />
    </div>
    <input ref="input"
      :value="modelValue"

      @input="$emit('update:modelValue', $event.target.value)"
      @keyup="onKeyup"
      @keydown="onKeydown"
      @update="onUpdate"
      @blur="onBlur"

      v-bind="$elBinds"

      class="text-field__input"
    >
  </div>
</template>

<script>
import { Icon } from '@vue-norma/ui'

export default {
  name: 'text-field',
  components: {
    Icon
  },
  props: {
    icon: {
      type: [ String, Boolean ],
      default: false 
    },
    modelValue: {
      type: [ String, Number, Boolean ],
      default: ''
    },
    modelModifiers: {
      default: () => ({})
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
    // Input props
    type: {
      type: String,
      default: 'text'
    },
    tabindex: 0,
    name: false,
    autocomplete: false,
    placeholder: {
      type: String,
      default: ''
    }
  },
  emits: [ 'click', 'update', 'keyup', 'keydown', 'blur', 'update:modelValue' ],
  data() {
    return {
      focused: false
    }
  },
  computed: {
    elClass() {
      return [
        'text-field',
        'text-field--size-' + this.size,
        {
          'text-field--has-icon': this.icon,
          'text-field--stretched': this.stretched,
          'text-field--loading': this.loading,
          'text-field--disabled': this.disabled,
          'text-field--focused': this.focused,
          'text-field--active': this.active
        }
      ]
    },
    $elBinds() {
      return {
        tabindex:     this.tabindex,
        type:         this.type,
        name:         this.name,
        autocomplete: this.autocomplete,
        placeholder:  this.placeholder
      }
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
      this.focused = true
      this.$emit('click', e)
    },
    onKeyup(e) {
      this.$emit('keyup', e)
    },
    onKeydown(e) {
      this.$emit('keydown', e)
    },
    onUpdate(e) {
      this.$emit('update', e)
    },
    onBlur(e) {
      this.focused = false
      this.$emit('blur', e)
    }
  }
}
</script>

<style lang="scss">
.text-field {
  &--size-s {
    --text-field--height: 36px;
    --text-field--font-size: 1.4rem;
    --text-field--padding: 1.25rem;
  }
  &--size-m {
    --text-field--height: 38px;
    --text-field--font-size: 1.4rem;
    --text-field--padding: 1.25rem;
  }
  &--size-l {
    --text-field--height: 44px;
    --text-field--font-size: 1.5rem;
    --text-field--padding: 1.25rem;
  }
}

.text-field {
  --text-field--color: #212529;
  --text-field--background: #f1f3f5;
  --text-field--border-color: #f0f0f0;
  --text-field__icon--color: #868e96;
  --text-field__placeholder--color: #868e96;

  --text-field--background-focused: #f1f3f5;
  --text-field--border-color-focused: #dee2e6;

  --text-field--background-hovered: #f1f3f5;
  --text-field--border-color-hovered: #e9ecef;

  html[data-theme="black"] & {
    --text-field--color: #fffcea;
    --text-field--background: #181818;
    --text-field--border-color: #1b1b1b;
    --text-field__icon--color: #999;
    --text-field__placeholder--color: #999;

    --text-field--background-focused: #181818;
    --text-field--border-color-focused: #252525;

    --text-field--background-hovered: #181818;
    --text-field--border-color-hovered: #1f1f1f;
  }
}

.text-field {
  $p: &;

  display: flex;
  flex-direction: row;
  align-items: center;
  height: var(--text-field--height);
  width: 100%;
  cursor: text;

  background: var(--text-field--background);
  border-radius: 8px;
  border: 1px solid var(--text-field--border-color);

  &--focused {
    background: var(--text-field--background-focused);
    border: 1px solid var(--text-field--border-color-focused);
  }

  @media(hover: hover) {
    &:not(&--focused):hover {
      background: var(--text-field--background-hovered);
      border: 1px solid var(--text-field--border-color-hovered);
    }
  }
  
  &__icon {
    color: var(--text-field__icon--color, #aaa);
    display: flex;
    justify-content: center;
    align-items: center;

    padding-left: var(--text-field--padding);

    svg { fill: currentColor; flex-shrink: 0; }
  }

  &__input {
    display: flex;
    align-items: center;
    background: transparent;
    border: 0;
    border-radius: 7px;
    padding: 0;
    height: 100%;
    width: 100%;
    outline: none;
    appearance: textfield;
    color: var(--text-field--color, #111);
    font-size: var(--text-field--font-size);
    font-family: inherit;
    line-height: calc(1.5 * 1em);

    &:last-child {
      padding-right: var(--text-field--padding);
    }
    &:first-child {
      padding-left: var(--text-field--padding);
    }

    &::placeholder {
      user-select: none;
      color: var(--text-field__placeholder--color, #999);
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
        background: var(--text-field--background);
        color: var(--text-field--color);
      }
    }
  }
}
</style>