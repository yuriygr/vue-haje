<template>
  <template v-if="(!loading && !error) && Object.keys(data).length > 0">
    <n-header>{{ data.title  }}</n-header>
    <meta-info :items="metaItems" />
    <div v-html="data.content" />
  </template>
  <template v-if="Object.keys(data).length == 0">
    <placeholder-loading v-if="loading" />
    <placeholder v-if="(!loading && !error)" :text="$t('help.errors.empty_page')" />
    <placeholder v-if="error"
      :icon="$t(humanizeError.icon)"
      :header="$t(humanizeError.title)"
      :text="$t(humanizeError.description)"
    />
  </template>
</template>

<script>
import { mapState } from 'vuex'
import { Placeholder, PlaceholderLoading, NHeader } from '@vue-norma/ui'

export default {
  name: 'help-page',
  props: {
    uuid: {
      type: [ Boolean, String ],
      default: false
    }
  },
  components: {
    Placeholder, PlaceholderLoading, NHeader
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('help.title')
      },
    }
  },
  computed: {
    ...mapState('help', [ 'data', 'loading', 'error' ]),
    ...mapState('auth', {
      'session_data': state => state.data
    }),
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    },
    formatedDate() {
      return this.$filters.timeAgo(this.data.meta.date_edited, this.$i18n.locale)
    },
    metaItems() {
      let _result = []
      _result.push({ label: this.$t('help.meta.edited', { date: this.formatedDate }) })

      return _result
    },
  },
  mounted() {
    this.$store.dispatch('help/fetch', this.uuid)
  },
  unmounted() {
    this.$store.dispatch('help/clear')
  },
  watch: {
    'data'(to) {
      if (to)
        this.meta.title = to.title
    },
    'error'(to) {
      if (to)
        this.meta.title = this.$t(this.humanizeError.title)
    },
    '$route.params.username'(to, from) {
      if (to != from) {
        this.$store.dispatch('user/fetch', to)
      }
    }
  }
}
</script>