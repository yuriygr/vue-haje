<template>
  <group>
    <n-header>{{ $t('settings.login-activity.title') }}</n-header>

    <logins-list v-if="(!loading && !error) && data.length > 0">
      <login-item-wrapper v-for="item in data" :key="`login-item-${item.login_id}`">
        <login-item :data="item" />
      </login-item-wrapper>

      <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />

      <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
    </logins-list>

    <template v-if="data.length == 0">
      <logins-list v-if="loading">
        <login-item-wrapper v-for="_ in skeletons">
          <login-item  />
        </login-item-wrapper>
      </logins-list>

      <placeholder v-else-if="error"
        :icon="$t(humanizeError.icon)"
        :header="$t(humanizeError.title)"
        :text="$t(humanizeError.description)"
      />
      <placeholder v-else :text="$t('settings.login-activity.empty')" />
    </template>
  </group>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { NButton, LoadmoreTrigger, Group, NHeader, Placeholder } from '@vue-norma/ui'
import { LoginsList, LoginItem, LoginItemWrapper } from '@/components/login'

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
  computed: {
    ...mapState('app', [ 'skeletons' ]),
    ...mapState('logins', [ 'data', 'filters', 'loading', 'error' ]),
    ...mapGetters('logins', [ 'hasMoreItems' ]),
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    }
  },
  methods: {
    loadMore() {
      this.$store.dispatch('logins/more')
    }
  },
  mounted() {
    this.$store.dispatch('logins/fetch')
  },
  unmounted() {
    this.$store.dispatch('logins/clear')
  },
}
</script>

<style>

</style>