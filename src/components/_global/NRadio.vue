<template>
  <label :class="controlClass">
    <input
      class="n-radio__input"
      v-bind="controlBinds"
      v-on="controlEvents"
    />
    <span class="n-radio__control">
      <span class="n-radio__dot" />
    </span>
    <span class="n-radio__content">
      <span class="n-radio__label">{{ label }}</span>
      <span v-if="description" class="n-radio__description">
        {{ description }}
      </span>
    </span>
  </label>
</template>

<script>
export default {
  name: 'n-radio',
  props: {
    modelValue: {
      type: [String, Number, Boolean],
      default: null,
    },
    value: {
      type: [String, Number, Boolean],
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    'update:modelValue'
  ],
  computed: {
    controlClass() {
      return [
        'n-radio',
        {
          'n-radio--checked': this.checked,
          'n-radio--disabled': this.disabled,
        }
      ]
    },
    controlBinds() {
      return {
        type:     'radio',
        name:     this.name,
        value:    this.value,
        checked:  this.checked,
        disabled: this.disabled
      }
    },
    controlEvents() {
      return {
        change: () => {
          this.$emit('update:modelValue', this.value)
        }
      }
    },
    checked() {
      return this.modelValue === this.value
    },
  },
}
</script>

<style lang="scss">
.n-radio {
  --n-radio__control--background: rgba(0,0,0,0.1);
  --n-radio__control--border-color: rgba(0,0,0,0.06);

  --n-radio__control--color-checked: #fff;
  --n-radio__control--background-checked: var(--x-color-pink--tint10);
  --n-radio__control--border-color-checked: var(--x-color-pink);

  html[data-theme='black'] & {
    --n-radio__control--background: rgba(255,255,255,0.1);
    --n-radio__control--border-color: rgba(255,255,255,0.06);

    --n-radio__control--color-checked: #fff;
    --n-radio__control--background-checked: var(--x-color-pink--shade10);
    --n-radio__control--border-color-checked: var(--x-color-pink--shade30);
  }
}

.n-radio {
  $p: #{&};

  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px;
  cursor: pointer;

  &--checked {
    #{$p}__control {
      border-color: var(--n-radio__control--border-color-checked);
      background: var(--n-radio__control--background-checked);
    }
    #{$p}__dot {
      opacity: 1;
      transform: scale(1);
    }
  }

  &--disabled {
    opacity: 0.4;
    pointer-events: none;
    cursor: not-allowed;
  }

  &__input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  &__control {
    flex-shrink: 0;
    margin-top: 1px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 1px solid var(--n-radio__control--border-color);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.15s, background-color 0.15s;
    background: var(--n-radio__control--background);
  }

  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--n-radio__control--color-checked);
    opacity: 0;
    transform: scale(0.5);
    transition: opacity 0.15s, transform 0.15s;
  }
}

/* Text content */
.n-radio__content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.n-radio__label {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
}

.n-radio__description {
  font-size: 13px;
  line-height: 1.5;
}
</style>