<template>
  <div class="navigation">
    <template v-for="(section, index) in sections" :key="`section-${index}`">
      <navigation-section>
        <navigation-title v-if="section.label && false">{{ section.label }}</navigation-title>
        <template v-for="(item, jndex) in section.items" :key="`section-${index}-item-${jndex}`">
          <navigation-item :icon="item.icon" :to="item.to" :disabled="item.disabled">
            {{ item.label }}
          </navigation-item>
        </template>
      </navigation-section>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { NavigationSection, NavigationItem, NavigationTitle } from '@vue-norma/ui'
import { useI18n } from 'vue-i18n'

import { useMeta } from '@/app/composables/useMeta'
import { useAuthStore } from '@/app/store/modules/auth'

defineOptions({
  name: 'settings-menu'
})

// Composables
const { t } = useI18n()
const authStore = useAuthStore()

useMeta(() => ({ title: t('settings.title') }))

// Computed
const isAuth = computed(() => authStore.isAuth)

const sections = computed(() => {
  const base = [
    {
      icon: 'user-edit-line',
      label: t('settings.item.profile'),
      to: { name: 'settings-profile' },
      disabled: !isAuth.value
    },
    {
      icon: 'bell-line',
      label: t('settings.item.notifications'),
      to: { name: 'settings-notifications' },
      disabled: !isAuth.value
    },
    {
      icon: 'link-line',
      label: t('settings.item.connections'),
      to: { name: 'settings-connections' },
      disabled: !isAuth.value
    },
    {
      icon: 'palette-line',
      label: t('settings.item.appearance'),
      to: { name: 'settings-appearance' }
    }
  ]

  const secure = [
    {
      icon: 'user-lock-line',
      label: t('settings.item.account'),
      to: { name: 'settings-account' },
      disabled: !isAuth.value
    },
    {
      icon: 'password-line',
      label: t('settings.item.password'),
      to: { name: 'settings-password' },
      disabled: !isAuth.value
    },
    {
      icon: 'user-history-line',
      label: t('settings.item.login-activity'),
      to: { name: 'settings-login-activity' },
      disabled: !isAuth.value
    },
    {
      icon: 'user-permissions-line',
      label: t('settings.item.permissions'),
      to: { name: 'settings-permissions' },
      disabled: !isAuth.value
    }
  ]

  const danger = [
    {
      icon: 'gdpr-line',
      label: t('settings.item.gdpr'),
      to: { name: 'settings-gdpr' },
      disabled: !isAuth.value || true
    },
    {
      icon: 'delete-bin-line',
      label: t('settings.item.delete-account'),
      to: { name: 'settings-delete-account' },
      disabled: !isAuth.value
    }
  ]

  return [
    { label: t('settings.section.base'), items: base },
    { label: t('settings.section.secure'), items: secure },
    { label: t('settings.section.danger'), items: danger }
  ]
})
</script>