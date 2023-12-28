<template>
  <div class="meta-info">
    <template v-for="(item, index) in items" :key="`meta-info-${index}`">

      <template v-if="isHasLink(item)">
        <router-link :to="item.to" class="meta-info__item" exact-active-class="" active-class="">
          {{ item.label }}
        </router-link>
      </template>

      <template v-else>
        <div class="meta-info__item">
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
    --meta-info__separator--color: #999;
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
      &:is(a):hover {
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