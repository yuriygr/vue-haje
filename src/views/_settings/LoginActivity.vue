<template>
  <group>
    <n-header>{{ $t('settings.login-activity.title') }}</n-header>

    <logins-list v-if="data.length > 0 || loading">
      <template v-if="data.length > 0">
        <login-item-wrapper v-for="item in data" :key="`login-item-${item.login_id}`" v-memo="[item.login_id]">
          <login-item :data="item" />
        </login-item-wrapper>

        <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />
        <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
      </template>
    
      <template v-else-if="loading">
        <login-item-wrapper v-for="index in 15" :key="`item-${index}`">
          <login-item  />
        </login-item-wrapper>
      </template>
    </logins-list>

    <placeholder v-else-if="error"
      :icon="$t($filters.humanizeError(error).icon)"
      :header="$t($filters.humanizeError(error).title)"
      :text="$t($filters.humanizeError(error).description)"
    />
    <placeholder v-else :text="$t('settings.login-activity.empty')" />
  </group>
</template>

<script>
import { NButton, LoadmoreTrigger, Group, NHeader, Placeholder } from '@vue-norma/ui'

import { LoginsList, LoginItem, LoginItemWrapper } from '@/components/login'
import { useLoginsStore } from '@/app/components/stores/modules/logins'

export default {
  name: 'settings-login-activity',
  components: {
    NButton, LoadmoreTrigger, Group, NHeader, Placeholder,
    LoginsList, LoginItem, LoginItemWrapper
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('settings.login-activity.title')
      }
    }
  },
  created() {
    this.loginsStore = useLoginsStore()
  },
  computed: {
    data()         { return this.loginsStore.data },
    loading()      { return this.loginsStore.loading },
    error()        { return this.loginsStore.error },
    hasMoreItems() { return this.loginsStore.hasMoreItems }
  },
  methods: {
    loadMore() {
      this.loginsStore.more()
    },
    async revokeSession(loginId) {
      const error = await this.loginsStore.revokeSession(loginId)
      if (error) {
        this.$alerts.danger({ text: this.$t(`alerts.${error.status}`) })
      }
    }
  },
  mounted() {
    this.loginsStore.fetch()
  },
  beforeUnmount() {
    this.loginsStore.clear()
  }
}
</script>
