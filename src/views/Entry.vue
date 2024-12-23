<template>
  <template v-if="(!loading && !error) && Object.keys(data).length > 0">
    <entry-item-wrapper :key="`entry-${data.uuid}`">
      <entry-item :data="data" type="full" />
    </entry-item-wrapper>
    
    <entry-comments v-if="data.state.is_comments_enabled" :entry="data" />
    <placeholder v-else :text="$t('entry.errors.comments_disabled')" />
  </template>
  
  <template v-if="Object.keys(data).length == 0">
    <placeholder-loading v-if="loading" />
    <placeholder v-if="(!loading && !error)" :text="$t('entry.errors.empty')" />
    <placeholder v-if="error"
      :icon="$t(humanizeError.icon)"
      :header="$t(humanizeError.title)"
      :text="$t(humanizeError.description)"
    />
  </template>

</template>

<script>
import { mapState } from 'vuex'
import { Placeholder, PlaceholderLoading, Separator, NButton, LoadmoreTrigger } from '@vue-norma/ui'

import { EntryItem, EntryItemWrapper } from '@/components/entry'
import EntryComments from '@/views/EntryComments'

export default {
  name: 'entry',
  props: {
    uuid: {
      type: [ Boolean, String ],
      default: false
    }
  },
  components: {
    EntryItem, EntryItemWrapper, EntryComments,
    Placeholder, PlaceholderLoading, Separator, NButton, LoadmoreTrigger
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('entry.title')
      }
    }
  },
  computed: {
    ...mapState('entry', [ 'data', 'loading', 'error' ]),
    ...mapState('auth', {
      'session_data': state => state.data
    }),
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    }
  },
  mounted() {
    this.$store.dispatch('entry/fetch', this.uuid)
  },
  unmounted() {
    this.$store.dispatch('entry/clear')
  },
  watch: {
    'error'(to) {
      if (to)
        this.meta.title = this.$t(this.humanizeError.title)
    },
    '$route.params.uuid'(to, from) {
      if (to != from) {
        this.$store.dispatch('entry/fetch', to)
      }
    }
  }
}
</script>

<style>

</style>