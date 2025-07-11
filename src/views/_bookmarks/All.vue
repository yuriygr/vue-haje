<template>
  <template v-if="!emptyData">
    <group v-if="data.users.length > 0">
      <n-header>{{ $t('bookmarks.section.users') }}</n-header>

      <users-list>
        <user-item-wrapper v-for="item in data.users" :key="`user-short-${item.user_id}`">
          <user-item :data="item" />
        </user-item-wrapper>
      </users-list>

      <spacer height="20" />

      <n-button component="router-link"  mode="secondary" active-class="" exact-active-class="" :to="{ name: 'bookmarks-users' }">{{ $t('action.show_more') }}</n-button>
    </group>

    <group v-if="data.entries.length > 0">
      <n-header>{{ $t('bookmarks.section.entries') }}</n-header>

      <entries-list>
        <entry-item-wrapper v-for="item in data.entries" :key="`entry-${item.uuid}`">
          <entry-item :data="item" type="short" />
        </entry-item-wrapper>
      </entries-list>

      <spacer height="20" />

      <n-button component="router-link"  mode="secondary" active-class="" exact-active-class="" :to="{ name: 'bookmarks-entries' }">{{ $t('action.show_more') }}</n-button>
    </group>

    <group v-if="data.comments.length > 0">
      <n-header>{{ $t('bookmarks.section.comments') }}</n-header>

      <div class="comments-list">
        <comment-item-wrapper v-for="item in data.comments" :key="`comment-${item.comment_id}`">
          <comment-item :data="item" replyButton="link" />
        </comment-item-wrapper>
      </div>

      <spacer height="20" />

      <n-button component="router-link"  mode="secondary" active-class="" exact-active-class="" :to="{ name: 'bookmarks-comments' }">{{ $t('action.show_more') }}</n-button>
    </group>

    <group v-if="data.feeds.length > 0">
      <n-header>{{ $t('bookmarks.section.feeds') }}</n-header>

      <feeds-list>
        <feed-item-wrapper v-for="item in data.feeds" :key="`feed-${item.feed_id}`">
          <feed-item :data="item" type="short" />
        </feed-item-wrapper>
      </feeds-list>

      <spacer height="20" />

      <n-button component="router-link"  mode="secondary" active-class="" exact-active-class="" :to="{ name: 'bookmarks-feeds' }">{{ $t('action.show_more') }}</n-button>
    </group>
  </template>

  <template v-if="emptyData">
    <template v-if="loading">
      <group>
        <n-header><skeleton :width="80" :height="12" /></n-header>
        <users-list>
          <user-item-wrapper v-for="index in skeletons_min" :key="`item-${index}`">
            <user-item />
          </user-item-wrapper>
        </users-list>
      </group>
      <group>
        <n-header><skeleton :width="91" :height="12" /></n-header>
        <entries-list>
          <entry-item-wrapper v-for="index in skeletons_min" :key="`item-${index}`">
            <entry-item />
          </entry-item-wrapper>
        </entries-list>
      </group>
    </template>
    <placeholder v-else-if="error"
      :icon="$t(humanizeError.icon)"
      :header="$t(humanizeError.title)"
      :text="$t(humanizeError.description)"
    />
    <placeholder v-else
      :icon="$t('errors.empty_bookmarks.icon')"
      :header="$t('errors.empty_bookmarks.title')"
      :text="$t('errors.empty_bookmarks.description')"
    />
  </template>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import {
  NHeader,
  Placeholder, PlaceholderLoading, Separator, Spacer,
  Group, NButton
} from '@vue-norma/ui'

import { UsersList, UserItem, UserItemWrapper } from '@/components/user'
import { EntriesList, EntryItem, EntryItemWrapper } from '@/components/entry'
import { CommentItem, CommentItemWrapper } from '@/components/comment'
import { FeedsList, FeedItem, FeedItemWrapper } from '@/components/feed'

export default {
  name: 'bookmarks-all',
  components: {
    NHeader,
    Placeholder, PlaceholderLoading, Separator, Spacer,
    Group, NButton,
    UsersList, UserItem, UserItemWrapper,
    EntriesList, EntryItem, EntryItemWrapper,
    CommentItem, CommentItemWrapper,
    FeedsList, FeedItem, FeedItemWrapper
  },
  computed: {
    ...mapState('app', [ 'skeletons_min' ]),
    ...mapState('bookmarks/all', [ 'data', 'loading', 'error' ]),
    ...mapGetters('bookmarks/all', [ 'emptyData' ]),
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    }
  },
  data() {
    return { }
  },
  methods: {
    formatLink(tab = false) {
      return { name: `bookmarks-${tab}`}
    },
  },
  mounted() {
    this.$store.dispatch('bookmarks/all/fetch')
  },
  beforeUnmount() {
    this.$store.dispatch('bookmarks/all/clear')
  },
  watch: {}
}
</script>

<style>

</style>