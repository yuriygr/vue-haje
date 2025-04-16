<template>
  <template v-if="Object.keys(data).length > 0">
    <entry-item-wrapper :key="`entry-${data.uuid}`">
      <entry-item :data="data" type="full" />
    </entry-item-wrapper>
    
    <entry-comments v-if="data.state.is_comments_enabled" :entry="data" />
    <placeholder v-else :text="$t('entry.errors.comments_disabled')" />
  </template>
  
  <template v-if="Object.keys(data).length == 0">
    <entry-item-wrapper v-if="loading">
      <entry-item type="full" />
    </entry-item-wrapper>
    
    <placeholder v-else-if="error"
      :icon="$t(humanizeError.icon)"
      :header="$t(humanizeError.title)"
      :text="$t(humanizeError.description)"
    />
    <placeholder v-else :text="$t('entry.errors.empty')" />
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
  created() {
    this.$store.dispatch('entry/fetch', this.uuid)
  },
  beforeUnmount() {
    this.$store.dispatch('entry/clear')
  },
  watch: {
    async uuid(to) {
      if (to != undefined) {
        await this.$store.dispatch('entry/clear')
        await this.$store.dispatch('entry/comments/clear')
        this.$store.dispatch('entry/fetch', to)
      }
    },
    data: {
      handler(to) {
        if (to.content)
          this.meta.title = this.$filters.truncateText(to.content.text)
      },
      immediate: true
    },
    error(to) {
      if (to)
        this.meta.title = this.$t(this.humanizeError.title)
    },
  }
}
</script>

<style>

</style>