<template>
  <label :class="controlClass">
    <input
      class="n-checkbox__input"
      v-bind="controlBinds"
      v-on="controlEvents"
    />
    <div class="n-checkbox__control">
      <span class="n-checkbox__check"></span>
    </div>
    <div class="n-checkbox__label">{{ label }}</div>
  </label>
</template>

<script>
export default {
  name: 'n-checkbox',
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
    controlClass() {
      return [
        'n-checkbox',
        {
          'n-checkbox--checked':  this.checked,
          'n-checkbox--invalid':  this.invalid,
          'n-checkbox--disabled': this.disabled
        }
      ]
    },
    controlBinds() {
      return {
        type:     'checkbox',
        tabindex: this.tabindex,
        value:    this.value,
        checked:  this.checked,
        disabled: this.disabled
      }
    },
    controlEvents() {
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
      if (Array.isArray(this.modelValue)) {
        const next = [...this.modelValue]
        this.checked
          ? next.splice(next.indexOf(this.value), 1)
          : next.push(this.value)
        this.$emit('update:modelValue', next)
      } else {
        this.$emit('update:modelValue', !this.checked)
      }
    },
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

  html[data-theme="black"] & {
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
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
  min-height: 2rem;
  cursor: pointer;

  &--checked {
    #{$p}__control {
      color: var(--n-checkbox__control--color-checked);
      background-color: var(--n-checkbox__control--background-checked);
      border: 1px solid var(--n-checkbox__control--border-color-checked);
    }
    #{$p}__check {
      opacity: 1;
      transform: rotate(45deg) scale(1);
    }
  }

  &--disabled {
    opacity: 0.4;
    pointer-events: none;
    cursor: not-allowed;
  }

  // Нативный элемент
  &__input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  &__label {
    font-size: 1.4rem;
    font-weight: 500;
    line-height: 1.4;
  }

  &__control {
    flex-shrink: 0;
    margin-top: 1px;
    width: 18px;
    height: 18px;
    background-color: var(--n-checkbox__control--background);
    border: 1px solid var(--n-checkbox__control--border-color);
    border-radius: 5px;
    box-sizing: border-box;
    transition: background-color 0.1s linear, border-color 0.1s linear;
    position: relative;
  }

  &__check {
    position: absolute;
    left: 5px;
    top: 2px;
    width: 5px;
    height: 9px;
    border: 2px solid var(--n-checkbox__control--color-checked);
    border-top: none;
    border-left: none;
    opacity: 0;
    transform: rotate(45deg) scale(0.5);
    transition: opacity 0.1s linear, transform 0.1s linear;
  }
}
</style>