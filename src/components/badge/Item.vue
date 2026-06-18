<template>
  <template v-if="data">
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
  <template v-else>
    <div :class="[ 'badge-item' ]">
      <div class="badge-item__icon">
        <skeleton :width="27" :height="27" />
      </div>
      <div class="badge-item__content">
        <div class="badge-item__label">
          <skeleton :width="skeletonWidths.label" :height="9" />
        </div>
        <div class="badge-item__description">
          <skeleton :width="skeletonWidths.description" :height="8" />
        </div>
        <skeleton :width="skeletonWidths.meta" :height="7" />
      </div>
    </div>
  </template>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon, MetaInfo } from '@vue-norma/ui'
import { timeFormatOnlyYear } from '@/app/services/datetime.js'

const props = defineProps({
  data: {
    default: false
  }
})

const { t, locale } = useI18n()

const skeletonWidths = {
  label:       Math.floor(Math.random() * 100) + 100,
  description: Math.floor(Math.random() * 100) + 150,
  meta:        Math.floor(Math.random() * 100) + 70
}

const elClass = computed(() => [
  'badge-item',
  `badge-item--type-${props.data.type}`
])

const formatedDate = computed(() =>
  timeFormatOnlyYear(props.data.date_added, locale.value)
)

const metaItems = computed(() => [
  { label: t(`badge.type.${props.data.type}`) },
  { label: t('badge.date', { date: formatedDate.value }) }
])
</script>

<style lang="scss">
.badge-item {
  --badge-item--background: transparent;
  --badge-item__icon--background: #f5f5f5;
  --badge-item__icon--color: var(--x-body--color);
  --badge-item__label--color: var(--x-body--color);
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

  &--type-mythical {
    --badge-item__icon--background: var(--x-color-red--tint80);
    --badge-item__icon--color: var(--x-color-red--shade10);
    --badge-item__label--color: var(--x-color-red--shade10);
  }

  html[data-theme="black"] & {
    --badge-item--background: transparent;
    --badge-item__icon--background: #161616;
    --badge-item__icon--color: var(--x-body--color);
    --badge-item__label--color: var(--x-body--color);
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

    &--type-mythical {
      --badge-item__icon--background: var(--x-color-red--shade70);
      --badge-item__icon--color: var(--x-color-red--tint20);
      --badge-item__label--color: var(--x-color-red--tint20);
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