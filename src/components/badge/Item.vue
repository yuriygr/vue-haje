<template>
  <div :class="elClass">
    <div class="badge-item__icon">
      <icon :name="data.content.icon" :size="22" />
    </div>
    <div class="badge-item__content">
      <div class="badge-item__label">{{ data.content.label }}</div>
      <div class="badge-item__description">{{ data.content.description }}</div>
      <meta-info class="badge-item__meta" :items="metaItems" />
    </div>
  </div>
</template>

<script>
import { Icon, IconButton, MetaInfo } from '@vue-norma/ui'

export default {
  name: 'badge-item',
  components: {
    Icon, IconButton, MetaInfo
  },
  props: {
    data: false
  },
  data() {
    return {
      loading: { }
    }
  },
  computed: {
    elClass() {
      return [
        'badge-item',
        'badge-item--type-' + this.data.type
      ]
    },
    metaItems() {
      let _result = []

      _result.push({ label: this.$t(`badge.type.${this.data.type}`) })
      _result.push({ label: this.$t('badge.date', { date: this.formatedDate }) })

      return _result
    },
    formatedDate() {
      return this.$filters.timeFormatOnlyYear(this.data.date_added, this.$i18n.locale)
    }
  },
  methods: { }
}
</script>

<style lang="scss">
.badge-item {
  --badge-item--background: transparent;
  --badge-item__icon--background: #f5f5f5;
  --badge-item__icon--color: #333;
  --badge-item__label--color: #111;
  --badge-item__description--color: #495057;

  &--type-common {
    --badge-item__icon--background: var(--x-color-green--tint80);
    --badge-item__icon--color: var(--x-color-green--tint20);
    --badge-item__label--color: var(--x-color-green--shade10);
  }

  &--type-rare {
    --badge-item__icon--background: var(--x-color-blue--tint80);
    --badge-item__icon--color: var(--x-color-blue--tint20);
    --badge-item__label--color: var(--x-color-blue--shade10);
  }

  &--type-epic {
    --badge-item__icon--background: var(--x-color-violet--tint80);
    --badge-item__icon--color: var(--x-color-violet--tint20);
    --badge-item__label--color: var(--x-color-violet--shade10);
  }

  &--type-legendary {
    --badge-item__icon--background: var(--x-color-orange--tint80);
    --badge-item__icon--color: var(--x-color-orange--shade10);
    --badge-item__label--color: var(--x-color-orange--shade10);
  }

  html[data-theme="black"] & {
    --badge-item--background: transparent;
    --badge-item__icon--background: #999;
    --badge-item__icon--color: #fff;
    --badge-item__label--color: #fffcea;
    --badge-item__description--color: #999;

    &--type-common {
      --badge-item__icon--background: var(--x-color-green--shade70);
      --badge-item__icon--color: var(--x-color-green--tint20);
      --badge-item__label--color: var(--x-color-green--tint20);
    }

    &--type-rare {
      --badge-item__icon--background: var(--x-color-blue--shade70);
      --badge-item__icon--color: var(--x-color-blue--tint20);
      --badge-item__label--color: var(--x-color-blue--tint20);
    }

    &--type-epic {
      --badge-item__icon--background: var(--x-color-violet--shade70);
      --badge-item__icon--color: var(--x-color-violet--tint20);
      --badge-item__label--color: var(--x-color-violet--tint20);
    }

    &--type-legendary {
      --badge-item__icon--background: var(--x-color-orange--shade70);
      --badge-item__icon--color: var(--x-color-orange--tint20);
      --badge-item__label--color: var(--x-color-orange--tint20);
    }
  }
}

.badge-item {
  display: inline-flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;

  background: var(--badge-item--background);
  position: relative;
  overflow: hidden;

  &__icon {
    background: var(--badge-item__icon--background);
    color: var(--badge-item__icon--color);
    display: flex;
    justify-content: center;
    padding: 1.3rem;
    margin-right: 1rem;
    border-radius: 8px;

    svg {
      fill: currentColor;
      width: 2.7rem;
      height: 2.7rem;
      display: block;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
  }

  &__label {
    color: var(--badge-item__label--color);
    font-size: 1.4rem;
    font-weight: var(--x-font-weight--semi-bold);
    line-height: calc(1.4 * 1em);
    margin-bottom: 0;
  }

  &__description {
    color: var(--badge-item__description--color);
    font-size: 1.4rem;
    font-weight: var(--x-font-weight--normal);
    line-height: calc(1.4 * 1em);
    margin-bottom: .75rem;
  }
}
</style>