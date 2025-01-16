<template>
  <div class="meta-info">
    <template v-for="(item, index) in items" :key="`meta-info-${index}`">

      <template v-if="isHasLink(item)">
        <router-link :to="item.to" @click="selectItem(item, $event)" :class="elClass(item)" :title="item.title" exact-active-class="" active-class="">
          {{ item.label }}
        </router-link>
      </template>

      <template v-else>
        <div :class="elClass(item)" @click="selectItem(item, $event)" :title="item.title">
          {{ item.label }}
        </div>
      </template>

    </template>

    <slot />
  </div>
</template>

<script>
export default {
  name: 'meta-info',
  props: {
    items: {
      type: Array,
      default: []
    }
  },
  methods: {
    elClass(item) {
      return [
        'meta-info__item',
        {
          'meta-info__item--disabled': this.isItemDisabled(item),
          'meta-info__item--action': this.isItemHasAction(item),
          'meta-info__item--link': this.isHasLink(item)
        }
      ]
    }, 
    selectItem(e, t = null) {
      if (this.isItemDisabled(e)) return

      if (t && !e.to && (t.preventDefault(), t.stopPropagation()), "function" == typeof e.action && e.action(t), !this.isSelectable)
        return this.$emit("select", this.selected, e);
    },


    isItemDisabled(item) {
      return item.disabled
    },
    isItemHasAction(item) {
      return typeof item.action === 'function'
    }, 


    isHasLink(item) {
      return typeof item.to === 'string' || typeof item.to === 'object'
    },
    isInnerLink(item) {
      return typeof item.to === 'object'
    },
    isExternalLink(item) {
      return typeof item.to === 'string' && item.to.startsWith('http')
    }
  }
}
</script>

<style lang="scss">
.meta-info {
  --meta-info__item--color: #495057;
  --meta-info__item--color-hover: #212529;
  --meta-info__item--color-active: #212529;

  html[data-theme="black"] & {
    --meta-info__item--color: #919190;
    --meta-info__item--color-hover: #f2f2f0;
    --meta-info__item--color-active: #f2f2f0;
  }
}

.meta-info {
  display: flex;
  justify-content: left;
  align-items: center;
  position: relative;

  &__item {
    position: relative;
    color: var(--meta-info__item--color);
    font-weight: 500;
    font-size: 1.2rem;
    line-height: calc(1.2 * 1em);
    transition: var(--x-transition);

    @media(hover: hover) {
      &:is(a, &--action):hover {
        text-decoration: none;
        cursor: pointer;
        color: var(--meta-info__item--color-hover);
      }
    }

    &--active {
      color: var(--meta-info__item--color-active);
    }
  }

  svg { fill: currentColor; flex-shrink: 0; display: block; }

  &__item +  &__item {
    margin-left: 1.25rem;
  }
}
</style>