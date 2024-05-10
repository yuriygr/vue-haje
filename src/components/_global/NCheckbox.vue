<template>
  <label :class="elClass">
    <input
     class="n-checkbox__input"
      v-bind="$elBinds"
      v-on="$elEvents"
    >
    <div class="n-checkbox__control">
      <icon name="ui-check" v-if="checked" size="16" />
    </div>
    <div class="n-checkbox__label">{{ label }}</div>
  </label>
</template>

<script>
import { Icon } from '@vue-norma/ui'

/**
 * Normal Checkbox
 * 
 * Украл ли я код у "Комитета"? Возможно!
 * Стыдно ли мне? Ни капли!
 * 
 * @version 1.0.2
 */
export default {
  name: 'n-checkbox',
  components: { Icon },
  props: {
    label: {
      type: [ String, Boolean ],
      default: false
    },
    modelValue: {
      type: [Boolean, Array]
    },
    value: {
      default: false
    },
    tabindex: {
      default: 0
    },
    invalid: {
      type: Boolean
    },
    disabled: {
      type: Boolean
    }
  },
  emits: [
    'update:modelValue'
  ],
  computed: {
    elClass() {
      return [
        'n-checkbox',
        {
          'n-checkbox--checked':  this.checked,
          'n-checkbox--invalid':  this.invalid,
          'n-checkbox--disabled': this.disabled
        }
      ]
    },
    $elBinds() {
      return {
        type:     'checkbox',
        tabindex: this.tabindex,
        value:    this.value,
        checked:  this.checked,
        disabled: this.disabled,
      }
    },
    $elEvents() {
      return {
        change: this.onChange
      }
    },
    checked() {
      return Array.isArray(this.modelValue) ? this.modelValue.includes(this.value) : this.modelValue
    }
  },
  methods: {
    onChange() {
      let e = !this.checked;
      Array.isArray(this.modelValue) && (e = [...this.modelValue],
      this.checked ? e.splice(e.indexOf(this.value), 1) : e.push(this.value)),
      this.$emit('update:modelValue', true === e && this.value ? this.value : e)
    }
  }
}
</script>

<style lang="scss">
.n-checkbox {
  --n-checkbox__control--background: rgba(0,0,0,0.1);
  --n-checkbox__control--border-color: rgba(0,0,0,0.06);

  --n-checkbox__control--color-checked: #fff;
  --n-checkbox__control--background-checked: var(--x-color-pink--tint10);
  --n-checkbox__control--border-color-checked: var(--x-color-pink);

  html[data-theme='black'] & {
    --n-checkbox__control--background: rgba(255,255,255,0.1);
    --n-checkbox__control--border-color: rgba(255,255,255,0.06);

    --n-checkbox__control--color-checked: #fff;
    --n-checkbox__control--background-checked: var(--x-color-pink--shade10);
    --n-checkbox__control--border-color-checked: var(--x-color-pink--shade30);
  }
}

.n-checkbox {
  $p: #{&};

  position: relative;
  display: inline-flex;
  justify-content: flex-start;
  align-items: flex-start;
  min-width: 18px;
  min-height: 24px;
  cursor: pointer;

  &--checked {
    #{$p}__control {
      color: var(--n-checkbox__control--color-checked);
      background-color: var(--n-checkbox__control--background-checked);
      border: 1px solid var(--n-checkbox__control--border-color-checked);
    }
  }

  &--disabled {
    opacity: 0.4;
    pointer-events: none;
    cursor: default;
  }

  &__input {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    padding: 0;
    margin: 0;
    visibility: hidden;
  }

  &__label {
    padding-left: 24px;
    font-size: 1.5rem;
    font-weight: 500;
    line-height: calc(1.6 * 1em);
    user-select: none;
  }

  &__control {
    position: absolute;
    z-index: 1;
    top: 3px;
    left: 0;
    width: 18px;
    height: 18px;
    color: var(--n-checkbox__control--color-checked);
    background-color: var(--n-checkbox__control--background);
    border: 1px solid var(--n-checkbox__control--border-color);
    border-radius: 5px;
    box-sizing: border-box;
    transition: background-color 0.1s linear, border-color 0.1s linear, box-shadow 0.1s linear;

    svg { display: block; fill: currentColor; }
  }
}
</style>