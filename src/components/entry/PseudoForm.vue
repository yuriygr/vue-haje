<template>
  <div :class="$formClass" v-on="$formEvents"
    @contextmenu="$event.preventDefault()"
  >
    <div class="entry-pseudo-form__icon">
      <icon name="edit-line" size="18" />
    </div>
    <div class="entry-pseudo-form__placeholder">{{ placeholder }}</div>
  </div>
</template>

<script>
import { Icon } from '@vue-norma/ui'

export default {
  name: 'entry-pseudo-form',
  emits: [ 'dropFile' ],
  components: {
    Icon
  },
  data() {
    return {
      dragover: false
    }
  },
  computed: {
    $formClass() {
      return [
        'entry-pseudo-form',
        { 'entry-pseudo-form--dragover': this.dragover }
      ]
    },
    $formEvents() {
      return {
        drop:      this.form_onDrop,
        dragenter: this.form_onDragEnter,
        dragleave: this.form_onDragLeave,
        dragover:  this.form_onDragOver
      }
    },
    placeholder() {
      const d = new Date();
      return d.getDay() == 3
      ? this.$t('entry.pseudo-form.placeholder-froggy')
      : this.$t('entry.pseudo-form.placeholder')
    }
  },
  methods: {
    // form events
    form_onDrop(e) {
      e.preventDefault()
      this.dragover = false
      this.$emit('dropFile', e)
    },
    form_onDragEnter(e) {
      e.preventDefault()
      this.dragover = true
    },
    form_onDragLeave(e) {
      e.preventDefault()
      this.dragover = false
    },
    form_onDragOver(e) {
      e.preventDefault()
      this.dragover = true
    }
  }
}
</script>

<style lang="scss">
.entry-pseudo-form {

  --entry-pseudo-form--background: #fff;
  --entry-pseudo-form--border-color: #f0f0f0;
  --entry-pseudo-form__icon--color: #868e96;
  --entry-pseudo-form__placeholder--color: #868e96;

  --entry-pseudo-form--background-hovered: #fff;
  --entry-pseudo-form--border-color-hovered: #e9ecef;

  --entry-pseudo-form--background-dragover: #f5f5f5;
  --entry-pseudo-form--border-color-dragover: var(--x-color-pink--tint10);
  
  html[data-theme="black"] & {
    --entry-pseudo-form--background: #181818;
    --entry-pseudo-form--border-color: #1b1b1b;
    --entry-pseudo-form__icon--color: #666;
    --entry-pseudo-form__placeholder--color: #666;

    --entry-pseudo-form--background-hovered: #181818;
    --entry-pseudo-form--border-color-hovered: #1f1f1f;

    --entry-pseudo-form--background-dragover: #151515;
    --entry-pseudo-form--border-color-dragover: var(--x-color-pink--shade50);
  }
}

.entry-pseudo-form {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 5rem;
  width: 100%;
  padding: 1rem;
  cursor: text;

  background: var(--entry-pseudo-form--background);
  border: 1px solid  var(--entry-pseudo-form--border-color);
  border-radius: 8px;
  transition: var(--x-transition);
  box-shadow: var(--x-box-shadow--elevation-2);

  &--dragover {
    background: var(--entry-pseudo-form--background-dragover);
    border-style: dashed;
    border-color: var(--entry-pseudo-form--border-color-dragover);
  }

  @media(hover: hover) {
    &:not(&--dragover):hover {
      background: var(--entry-pseudo-form--background-hovered);
      border: 1px solid var(--entry-pseudo-form--border-color-hovered);
    }
  }

  &__icon {
    color: var(--entry-pseudo-form__icon--color);
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
    color: var(--entry-pseudo-form__placeholder--color);
    font-family: inherit;
    line-height: 1.6;
    padding: .1rem 0.2rem;
    user-select: none;
  }
}
</style>