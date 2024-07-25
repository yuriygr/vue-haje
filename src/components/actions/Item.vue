<template>
  <component :is="component" :class="elClass" :title="title ?? label">
    <div v-if="icon" class="action-item__icon">
      <icon :name="icon" size="14" />
    </div>
    <div v-if="label" class="action-item__label">{{ label }}</div>
  </component>
</template>

<script>
import { Icon } from '@vue-norma/ui'

export default {
  name: 'action-item',
  components: {
    Icon
  },
  props: {
    icon: {
      type: [ Boolean, String ],
      default: false
    },
    label: {
      type: [ Boolean, String ],
      default: false
    },
    title: {
      type: [ Boolean, String ],
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    component: {
      type: String,
      default: 'div'
    },
  },
  data() {
    return {  }
  },
  computed: {
    elClass() {
      return [
        'action-item',
        {
          'action-item--has-icon': this.icon,
          'action-item--disabled': this.disabled,
        }
      ]
    }
  },
  methods: {

  }
}
</script>

<style lang="scss">
.action-item {
  --action-item--color: #495057;
  --action-item--color-hover: #222;

  html[data-theme='black'] & {
    --action-item--color: #a7a7a7;
    --action-item--color-hover: #fff;
  }
}

.action-item {
  color: var(--action-item--color);

  display: flex;
  flex-direction: row;
  align-items: center;
  padding: .5rem .75rem;
  cursor: pointer;

  @media(hover: hover) {
    &:hover {
      color: var(--action-item--color-hover);
      text-decoration: none;
    }
  }

  &--disabled {
    opacity: 0.4;
    pointer-events: none;
    cursor: default;
    @media(hover: hover) {
      &:hover {
        color: var(--action-item--color);
      }
    }
  }

  &__icon {

    svg {
      fill: currentColor;
      flex-shrink: 0;
      display: block;
    }
  }

  &__label {
    font-weight: 500;
    margin-left: .5rem;
    font-size: 1.2rem;
    line-height: calc(1.2 * 1em);
    user-select: none;
  }
}
</style>