<template>

  <div class="feed-navigation">
    <tabs>
      <tabs-item size="s" selected="true">Моя лента</tabs-item>
      <tabs-item size="s">Популярное</tabs-item>
      <tabs-item size="s">Бездна</tabs-item>
    </tabs>
    <icon-button name="settings-line" size="s" mode="tertiary" :title="$t('feed.settings')" />
  </div>


  <separator />

  <entry-pseudo-form @click="openComposeModal" />

  <spacer height="30" />

  <entries-list v-if="(!loading && !error) || data.length > 0">
    <entry-item-wrapper v-for="item in data" :key="`entry-${item.uuid}`">
      <entry-item :data="item" type="short" />
    </entry-item-wrapper>

    <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />

    <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
  </entries-list>

  <template v-if="data.length == 0">
    <placeholder-loading v-if="loading" />
    <placeholder v-else-if="error"
      :icon="$t(humanizeError.icon)"
      :header="$t(humanizeError.title)"
      :text="$t(humanizeError.description)"
    />
    <placeholder v-else
      :icon="$t('errors.empty_feed.icon')"
      :header="$t('errors.empty_feed.title')"
      :text="$t('errors.empty_feed.description')"
    />
  </template>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Placeholder, PlaceholderLoading, Spacer, Tabs, TabsItem, Separator, NButton, LoadmoreTrigger, IconButton } from '@vue-norma/ui'

import { EntriesList, EntryItem, EntryItemWrapper, EntryPseudoForm } from '@/components/entry'
import ComposeModal from '@/components/modals/Compose'

export default {
  name: 'feed',
  components: {
    EntriesList,EntryItem, EntryItemWrapper, EntryPseudoForm,
    Placeholder, PlaceholderLoading, Separator, NButton, LoadmoreTrigger, Spacer, Tabs, TabsItem, IconButton
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('feed.title')
      }
    }
  },
  computed: {
    ...mapState('feed', [ 'data', 'filters', 'loading', 'error' ]),
    ...mapGetters('feed', [ 'hasMoreItems' ]),
    ...mapGetters('auth', [ 'isAuth' ]),
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    }
  },
  methods: {
    openComposeModal() {
      if (!this.isAuth) {
        this.$router.push({ name: 'auth' })
        return
      }
      this.$modals.show(ComposeModal)
    },
    loadMore() {
      this.$store.dispatch('feed/more')
    }
  },
  mounted() {
    this.$store.dispatch('feed/fetch')
  },
  unmounted() {
    this.$store.dispatch('feed/clear')
  }
}
</script>

<style lang="scss">
.feed-navigation {
  display: flex;
  justify-content: space-between;
}
</style>