<template>
  <div class="meta-info">
    <template v-for="(item, index) in items" :key="`meta-info-${index}`">

      <template v-if="isHasLink(item)">
        <router-link :to="item.to" @click="selectItem(item, $event)" :class="elClass(item)" exact-active-class="" active-class="">
          {{ item.label }}
        </router-link>
      </template>

      <template v-else>
        <div :class="elClass(item)" @click="selectItem(item, $event)">
          {{ item.label }}
        </div>
      </template>

      <div v-if="index != items.length - 1" class="meta-info__separator"></div>
    </template>
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


    if (t && !e.to && !e.url && (t.preventDefault(), t.stopPropagation()), "function" == typeof e.action && e.action(e), !this.isSelectable)
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
  --meta-info__item--color: #666;
  --meta-info__item--color-hover: #111;
  --meta-info__item--color-active: #111;
  --meta-info__separator--color: #666;

  html[data-theme="black"] & {
    --meta-info__item--color: #999;
    --meta-info__item--color-hover: #fffcea;
    --meta-info__item--color-active: #fffcea;
    --meta-info__separator--color: #666;
  }
}

.meta-info {
  display: flex;
  justify-content: left;
  align-items: center;
  position: relative;

  color: var(--meta-info__item--color);
  font-size: 1.3rem;
  font-weight: var(--x-font-weight--normal);
  line-height: calc(1.2 * 1em);

  &__item {
    position: relative;
    color: var(--meta-info__item--color);
    transition: var(--x-transition);

    @media(hover: hover) {
      &:is(a, &--action):hover {
        cursor: pointer;
        color: var(--meta-info__item--color-hover);
      }
    }

    &--active {
      color: var(--meta-info__item--color-active);
    }
  }

  &__separator {
    color: var(--meta-info__separator--color);
    user-select: none;
    margin: 0 .5rem;

    &::after {
      content: "·";
    }
  }
}
</style>