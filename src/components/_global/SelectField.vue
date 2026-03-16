<template>
  <div :class="elClass" @click="onClick">
    <div class="select-field__icon" v-if="icon">
      <icon :name="icon" :size="iconSize" />
    </div>
    <select
      ref="input"
      :value="modelValue"
      v-bind="$elBinds"
      class="select-field__input"
      @change="onChange"
      @keyup="onKeyup"
      @keydown="onKeydown"
      @focus="onFocus"
      @blur="onBlur"
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
  inheritAttrs: false,
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
      default: 'm',
      validator: (v) => ['s', 'm', 'l'].includes(v)
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
    // Native select props
    tabindex: {
      default: 0
    },
    name: {
      default: undefined
    },
    autocomplete: {
      default: undefined
    }
  },
  emits: [ 'click', 'change', 'keyup', 'keydown', 'blur', 'update:modelValue' ],
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
        name:         this.name,
        autocomplete: this.autocomplete,
        disabled:     this.disabled
      }
    },
    iconSize() {
      const sizes = { s: 14, m: 16, l: 18 }
      return sizes[this.size] ?? 16
    }
  },
  methods: {
    focus() {
      this.$refs.input.focus()
    },
    onClick(e) {
      this.$refs.input.focus()
      this.$emit('click', e)
    },
    onChange(e) {
      this.$emit('update:modelValue', e.target.value)
      this.$emit('change', e)
    },
    onKeyup(e) {
      this.$emit('keyup', e)
    },
    onKeydown(e) {
      this.$emit('keydown', e)
    },
    onFocus() {
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

  --select-field--background-focused: #f1f3f5;
  --select-field--border-color-focused: #d76ea0;

  --select-field--background-hovered: #f1f3f5;
  --select-field--border-color-hovered: #e9ecef;

  html[data-theme="black"] & {
    --select-field--color: #fffcea;
    --select-field--background: #181818;
    --select-field--border-color: #1b1b1b;
    --select-field__icon--color: #999;

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
  cursor: pointer;

  background: var(--select-field--background);
  border-radius: 8px;
  border: 1px solid var(--select-field--border-color);
  transition: border-color 0.15s ease, background 0.15s ease;

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
    flex-shrink: 0;

    svg { fill: currentColor; flex-shrink: 0; }
  }

  &__input {
    display: block;
    background: transparent;
    border: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    outline: none;
    //appearance: none;
    color: var(--select-field--color, #111);
    font-size: var(--select-field--font-size);
    font-family: inherit;
    line-height: calc(1.5 * 1em);
    cursor: pointer;

    & > option {
      background: var(--select-field--background);
      color: var(--select-field--color);
    }

    &:last-child {
      padding-right: var(--select-field--padding);
    }
    &:first-child {
      padding-left: var(--select-field--padding);
    }
  }

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
  }
}
</style>