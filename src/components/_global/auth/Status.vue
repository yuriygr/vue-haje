<template>
  <div class="form-status">
    <div v-if="icon" class="form-status__icon">
      <icon :name="icon" size="20" />
    </div>
    <div class="form-status__content">
      <div class="header" v-if="header">{{ header }}</div>
      <div class="message"><slot /></div>
    </div>
  </div>
</template>

<script>
import { Icon } from '@vue-norma/ui'

export default {
  name: 'form-status',
  components: {
    Icon
  },
  props: {
    icon: {
      type: [ Boolean, String ],
      default: false
    },
    header:{ 
      type: [ Boolean, String ],
      default: false
    }
  }
}
</script>

<style lang="scss">
.form-status {
  --form-status--background: var(--x-background);

  html[data-theme="black"] & {
    --form-status--background: var(--x-background);
  }
}

.form-status {
  display: flex;
  background: var(--form-status--background);
  border: 1px solid;
  border-color: var(--form-status--border-color);
  margin-bottom: 1.5rem;
  padding: 1rem;
  border-radius: 8px;

  &__icon {
    display: flex;
    align-content: center;
    align-items: center;

    svg { fill: currentColor; flex-shrink: 0; display: block; }
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 1.4rem;
    line-height: calc(1.2 * 1em);

    .header {
      white-space: nowrap;
      word-break: keep-all;
      font-weight: 500;
    }

    .message {
      font-weight: 400;
    }

    .header + .message {
      margin-top: .25rem;
    }
  }

  &__icon + &__content {
    margin-left: 1rem;
  }
}
</style>