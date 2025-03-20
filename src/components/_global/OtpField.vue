<template>
  <div class="otp-input-container">
    <div 
      v-for="(digit, index) in digits" 
      :key="index"
      class="otp-input-wrapper"
    >
      <input
        ref="inputs"
        v-model="digits[index]"
        type="tel"
        maxlength="1"
        class="otp-input"
        :class="{
          'otp-input--has-value': digits[index],
          'otp-input--read-only': readOnly
        }"
        :disabled="readOnly"
        spellcheck="false"
        autocomplete="off"
        autocapitalize="off"
        autocorrect="off"
        @input="e => handleInput(e, index)"
        @keydown.delete="e => handleDelete(e, index)"
        @keydown.left="moveFocus(index - 1)"
        @keydown.right="moveFocus(index + 1)"
        @paste.prevent="handlePaste"
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'otp-field',
  emits: ['update:modelValue'],
  props: {
    value: {
      type: String,
      default: ''
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      digits: Array(6).fill('')
    }
  },
  methods: {
    handleInput(event, index) {
      const value = event.target.value.replace(/[^0-9]/g, '')
      this.digits[index] = value
      
      if (value && index < 5) {
        this.$nextTick(() => {
          this.moveFocus(index + 1)
        })
      }
      
      this.emitCode()
    },
    
    handleDelete(event, index) {
      if (!this.digits[index] && index > 0) {
        this.moveFocus(index - 1)
      }
    },
    
    moveFocus(newIndex) {
      const index = Math.max(0, Math.min(newIndex, 5))
      this.$refs.inputs[index].focus()
    },
    
    handlePaste(event) {
      const pasteData = event.clipboardData.getData('text/plain').replace(/[^0-9]/g, '')
      const digits = pasteData.slice(0, 6).split('')
      
      digits.forEach((digit, i) => {
        if (i < 6) this.digits.splice(i, 1, digit)
      })
      
      this.emitCode()
      this.moveFocus(Math.min(digits.length - 1, 5))
    },
    
    emitCode() {
      const code = this.digits.join('')
      this.$emit('update:modelValue', code)
      this.$emit('change', code)
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(newVal) {
        console.log(newVal)
        if (newVal && newVal.length === 6) {
          this.digits = newVal.split('').slice(0, 6)
        }
      }
    }
  }
}
</script>

<style lang="scss">
.otp-input {
  --otp-input--color: #212529;
  --otp-input--background: #f1f3f5;
  --otp-input--border-color: #f0f0f0;

  --otp-input--background-focused: #f1f3f5;
  --otp-input--border-color-focused: #d76ea0;

  --otp-input--background-hovered: #f1f3f5;
  --otp-input--border-color-hovered: #e9ecef;

  html[data-theme="black"] & {
    --otp-input--color: #fffcea;
    --otp-input--background: #181818;
    --otp-input--border-color: #1b1b1b;

    --otp-input--background-focused: #181818;
    --otp-input--border-color-focused: #771d47;

    --otp-input--background-hovered: #181818;
    --otp-input--border-color-hovered: #1f1f1f;
  }
}

.otp-input-container {
  display: flex;
  justify-content: space-between;
}

.otp-input-wrapper {
  width: 46px;
  height: 50px;
}

.otp-input {
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 2.3rem;
  background: var(--otp-input--background);
  border: 1px solid var(--otp-input--border-color);
  color: var(--otp-input--color);
  border-radius: 8px;

  &:focus,
  &:focus-visible {
    outline: none;
    background: var(--otp-input--background-focused);
    border-color: var(--otp-input--border-color-focused);
  }


  @media(hover: hover) {
    &:not(&--focused):not(&:focus):hover {
      background: var(--otp-input--background-hovered);
      border-color: var(--otp-input--border-color-hovered);
    }
  }
}



</style>