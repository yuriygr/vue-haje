<template>
  <group>
    <n-header>{{ t('settings.login-activity.title') }}</n-header>

    <items-list type="logins" v-if="data.length > 0 || loading" :has-data="data.length > 0" :loading="loading" :has-more="hasMoreItems" @more="loadMore">
      <login-item v-for="item in data" :key="`login-item-${item.login_id}`" v-memo="[item.login_id]" :data="item" />

      <template #skeleton>
        <login-item v-for="index in 15" :key="`item-${index}`" />
      </template>
    </items-list>

    <placeholder v-else-if="error"
      :icon="humanizeError(error).icon"
      :header="humanizeError(error).title"
      :text="humanizeError(error).description"
    />
    <placeholder v-else :text="t('settings.login-activity.empty')" />
  </group>
</template>

<script>
import { Group, NHeader, Placeholder } from '@vue-norma/ui'
import { useI18n } from 'vue-i18n'

import { LoginItem } from '@/components/login'
import { useLoginsStore } from '@/app/store/modules/logins'
import { useHumanizeError } from '@/app/composables/useHumanizeError'
import { useMeta } from '@/app/composables/useMeta'
import { useToast } from '@/app/composables/useToast'
export default {
  name: 'settings-login-activity',
  components: {
    Group, NHeader, Placeholder, LoginItem
  },
  setup() {
    const { t } = useI18n()
    const store = useLoginsStore()
    const humanizeError = useHumanizeError()
    const toast = useToast()

    useMeta(() => ({ title: t('settings.login-activity.title') }))

    return { t, store, toast, humanizeError }
  },
  computed: {
    data()         { return this.store.data },
    loading()      { return this.store.loading },
    error()        { return this.store.error },
    hasMoreItems() { return this.store.hasMoreItems }
  },
  methods: {
    loadMore() {
      this.store.more()
    },
    async revokeSession(loginId) {
      const error = await this.store.revokeSession(loginId)
      if (error) {
        this.toast.danger(this.t(`alerts.${error.status}`))
      }
    }
  },
  mounted() {
    this.store.fetch()
  },
  beforeUnmount() {
    this.store.clear()
  }
}
</script>
