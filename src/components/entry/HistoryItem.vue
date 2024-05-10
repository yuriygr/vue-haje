<template>
  <div class="entry-history">
    <div class="entry-history__header">
      <user-item :data="data.user" :showSubscribeAction="false" mode="small" />
      <meta-info class="entry-history__meta" :items="metaItems" />
    </div>
    <div v-if="data.content" class="entry-history__content" v-html="$filters.contentFormat(data.content.text)" />
  </div>
</template>

<script>
import { MetaInfo } from '@vue-norma/ui'

import { UserItem } from '@/components/user'

export default {
  name: 'entry-history-item',
  components: {
    UserItem,
    MetaInfo
  },
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {

    }
  },
  computed: {
    metaItems() {
      let _result = []

      _result.push({ label: this.formatedDate })

      return _result
    },
    formatedDate() {
      return this.$filters.timeAgo(this.data.content.date_added, this.$i18n.locale)
    }
  },
  methods: {
 
  }
}
</script>

<style lang="scss">
.entry-history {
  --entry-history__content--background: #161616;
}

.entry-history {
  &__header {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
  }

  &__meta {
    margin-top: .5rem;
  }

  &__content {
    background: var(--entry-history__content--background);
    padding: 1rem 1rem;
    border-radius: 8px;
    font-size: 1.4rem;
    line-height: 1.4em;
    word-break: break-word;
  }
}
</style>