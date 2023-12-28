<template>
  <group>
    <n-header>{{ $t('settings.login-activity.title') }}</n-header>

    <template v-if="(!loading && !error) || data.length > 0">
      <table class="table">
        <thead>
          <tr>
            <td>IP</td>
            <td>Устройство</td>
            <td>Версия приложения</td>
            <td>Дата</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in data" :key="'login-' + index">
            <td>{{ item.IP }}</td>
            <td>{{ item.Useragent }}</td>
            <td>{{ item.Date }}</td>
          </tr>
        </tbody>
      </table>

      <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />

      <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
    </template>

    <template v-if="data.length == 0">
      <placeholder v-if="(!loading && !error)" :text="$t('settings.login-activity.empty')" />
      <placeholder v-if="error"
        :icon="$t(humanizeError.icon)"
        :header="$t(humanizeError.title)"
        :text="$t(humanizeError.description)"
      />
      <placeholder-loading v-if="loading" />
    </template>
  </group>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { NButton, LoadmoreTrigger, Group, NHeader, Placeholder, PlaceholderLoading } from '@vue-norma/ui'

export default {
  name: 'settings-login-activity',
  components: {
    NButton, LoadmoreTrigger, Group, NHeader, Placeholder, PlaceholderLoading
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