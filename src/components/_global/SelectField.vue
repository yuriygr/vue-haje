<template>
  <div :class="elClass" @click="onClick">
    <div class="select-field__icon" v-if="icon">
      <icon :name="icon" :size="iconSize" />
    </div>
    <select ref="input"
      :value="modelValue"

      @input="$emit('update:modelValue', $event.target.value)"
      @keyup="onKeyup"
      @keydown="onKeydown"
      @update="onUpdate"
      @focus="onFocus"
      @blur="onBlur"

      v-bind="$elBinds"

      class="select-field__input"
    >
      <slot />
    </select>
  </div>
</template>

<script>
import { Icon } from '@vue-norma/ui'

export default {
  name: 'select-field',
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
        'select-field',
        'select-field--size-' + this.size,
        {
          'select-field--has-icon': this.icon,
          'select-field--stretched': this.stretched,
          'select-field--loading': this.loading,
          'select-field--disabled': this.disabled,
          'select-field--focused': this.focused,
          'select-field--active': this.active
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
    focus() {
      this.$refs.input.focus()
    },
    // Events
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
    onFocus(e) {
      this.focused = true
    },
    onBlur(e) {
      this.focused = false
      this.$emit('blur', e)
    }
  }
}
</script>

<style lang="scss">
.select-field {
  &--size-s {
    --select-field--height: 36px;
    --select-field--font-size: 1.4rem;
    --select-field--padding: 1.25rem;
  }
  &--size-m {
    --select-field--height: 38px;
    --select-field--font-size: 1.4rem;
    --select-field--padding: 1.25rem;
  }
  &--size-l {
    --select-field--height: 44px;
    --select-field--font-size: 1.5rem;
    --select-field--padding: 1.25rem;
  }
}

.select-field {
  --select-field--color: #212529;
  --select-field--background: #f1f3f5;
  --select-field--border-color: #f0f0f0;
  --select-field__icon--color: #868e96;
  --select-field__placeholder--color: #868e96;

  --select-field--background-focused: #f1f3f5;
  --select-field--border-color-focused: #d76ea0;

  --select-field--background-hovered: #f1f3f5;
  --select-field--border-color-hovered: #e9ecef;

  html[data-theme="black"] & {
    --select-field--color: #fffcea;
    --select-field--background: #181818;
    --select-field--border-color: #1b1b1b;
    --select-field__icon--color: #999;
    --select-field__placeholder--color: #999;

    --select-field--background-focused: #181818;
    --select-field--border-color-focused: #771d47;

    --select-field--background-hovered: #181818;
    --select-field--border-color-hovered: #1f1f1f;
  }
}

.select-field {
  $p: &;

  display: flex;
  flex-direction: row;
  align-items: center;
  height: var(--select-field--height);
  width: 100%;
  cursor: text;

  background: var(--select-field--background);
  border-radius: 8px;
  border: 1px solid var(--select-field--border-color);

  &--focused {
    background: var(--select-field--background-focused);
    border-color: var(--select-field--border-color-focused);
  }

  @media(hover: hover) {
    &:not(&--focused):hover {
      background: var(--select-field--background-hovered);
      border-color: var(--select-field--border-color-hovered);
    }
  }
  
  &__icon {
    color: var(--select-field__icon--color, #aaa);
    display: flex;
    justify-content: center;
    align-items: center;

    padding-left: var(--select-field--padding);

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
    color: var(--select-field--color, #111);
    font-size: var(--select-field--font-size);
    font-family: inherit;
    line-height: calc(1.5 * 1em);

    & > option {
      background: var(--select-field--background);
    }

    &:last-child {
      padding-right: var(--select-field--padding);
    }
    &:first-child {
      padding-left: var(--select-field--padding);
    }

    &::placeholder {
      user-select: none;
      color: var(--select-field__placeholder--color, #999);
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
        background: var(--select-field--background);
        color: var(--select-field--color);
      }
    }
  }
}
</style>