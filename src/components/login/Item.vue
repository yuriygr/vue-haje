<template>
  <template v-if="data">
    <div :class="[ 'login-item' ]">
      <div class="login-item__content">
        <div class="login-item__key">ОС:</div>
        <div class="login-item__value">{{ data.os.name }} {{ data.os.version }}</div>
      </div>
      <div class="login-item__content">
        <div class="login-item__key">Браузер:</div>
        <div class="login-item__value">{{ data.browser.name }} {{ data.browser.version }}</div>
      </div>
      <div class="login-item__content">
        <div class="login-item__key">Дата:</div>
        <div class="login-item__value">{{ formattedDate }}</div>
      </div>
    </div>
  </template>

  <template v-else>
    <div :class="[ 'login-item' ]">
      <div class="login-item__content">
        <div class="login-item__key">ОС:</div>
        <div class="login-item__value"><skeleton :width="skeletonWidths.os" :height="7" /></div>
      </div>
      <div class="login-item__content">
        <div class="login-item__key">Браузер:</div>
        <div class="login-item__value"><skeleton :width="skeletonWidths.br" :height="7" /></div>
      </div>
      <div class="login-item__content">
        <div class="login-item__key">Дата:</div>
        <div class="login-item__value"><skeleton :width="skeletonWidths.ts" :height="7" /></div>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTimeAgo } from '@/app/composables/useTimeAgo'
import type { Login } from '@/types/login'

const props = withDefaults(defineProps<{
  data: Login | null
  clickable?: boolean
  showSubscribeAction?: boolean
}>(), {
  data: null,
  clickable: true,
  showSubscribeAction: true
})

const { t } = useI18n()
const { timeAgo } = useTimeAgo()

const skeletonWidths = {
  os: Math.floor(Math.random() * 100) + 60,
  br: Math.floor(Math.random() * 100) + 70,
  ts: Math.floor(Math.random() * 100) + 50,
}

const formattedDate = computed(() =>
  props.data ? timeAgo(props.data.date_added) : ''
)
</script>

<style lang="scss">
.login-item {
  --login-item--background: #f1f3f5;
  --login-item__key--color: #868e96;
  --login-item__value--color: #212529;

  --login-item--background-hover: #e9ecef;

  html[data-theme="black"] & {
    --login-item--background: #1f1f1f;
    --login-item__key--color: var(--x-color-white--shade40, #999);
    --login-item__value--color: #f0f0f0;

    --login-item--background-hover: #242424;
  }
}

.login-item {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;

  background: var(--login-item--background);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  padding: 1.25rem 1.5rem;
  transition: var(--x-transition);

  &__content {
    display: flex;
    flex-direction: row;
    align-items: center;

    &:not(:last-child) {
      margin-bottom: .5rem;
    }
  }

  &__key {
    color: var(--login-item__key--color);
    font-size: 1.4rem;
    font-weight: var(--x-font-weight--normal);
    line-height: calc(1.2 * 1em);
  }

  &__value {
    display: flex;
    justify-content: center;
    color: var(--login-item__value--color);
    font-size: 1.4rem;
    font-weight: var(--x-font-weight--normal);
    line-height: calc(1.2 * 1em);
  }

  &__key + &__value {
    margin-left: .5rem;
  }
}
</style>