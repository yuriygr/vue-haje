<template>
  <template v-if="(!loading && !error) && Object.keys(data).length > 0">
    <div class="tag-header">
      <div class="tag-header__content">
        <div class="tag-header__hash">#</div>
        <div class="tag-header__label">{{ data.label }}</div>
      </div>
      <meta-info class="tag-header__meta" :items="metaItems" />
    </div>

    <separator />

    <placeholder
      :icon="$t('errors.todo.icon')"
      :header="$t('errors.todo.title')"
      :text="$t('errors.todo.description')"
    />
  </template>

  <template v-if="Object.keys(data).length == 0">
    <placeholder-loading v-if="loading" />
    <placeholder v-else-if="error"
      :icon="$t(humanizeError.icon)"
      :header="$t(humanizeError.title)"
      :text="$t(humanizeError.description)"
    />
    <placeholder v-else
      :icon="$t('errors.tag_not_found.icon')"
      :header="$t('errors.tag_not_found.title')"
      :text="$t('errors.tag_not_found.description')"
    />
  </template>
</template>

<script>
import { mapState } from 'vuex'
import { Placeholder, PlaceholderLoading, Separator } from '@vue-norma/ui'


export default {
  name: 'tag',
  props: {
    slug: {
      type: [ Boolean, String ],
      defalult: false
    }
  },
  components: { Placeholder, PlaceholderLoading, Separator },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('tag.title'),
      },
    }
  },
  computed: {
    ...mapState('tag', [ 'data', 'filters', 'loading', 'error' ]),
    metaItems() {
      let _result = []

      this.data.state.is_official && _result.push({ label: this.$t('tag.meta.official') })
      this.data.state.is_nsfw && _result.push({ label: this.$t('tag.meta.nsfw') })
      _result.push({ label: this.$t('tag.meta.from_date', { date: this.formatedDate }) })

      return _result
    },
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    },
    formatedDate() {
      return this.$filters.timeFormatOnlyYear(this.data.date_added, this.$i18n.locale)
    }
  },
  methods: {

  },
  mounted() {
    this.$store.dispatch('tag/fetch', this.slug)
  },
  unmounted() {
    this.$store.dispatch('tag/clear')
  },
  watch: {
    'data'(to) {
      if (to)
        this.meta.title = `#${to.slug}`
    },
    '$route.params.slug'(to, from) {
      if (to != from) {
        this.$store.dispatch('tag/fetch', to)
      }
    }
  }
}
</script>

<style lang="scss">
.tag-header {
  --tag-header__hash-color: #999;
  --tag-header__label-color: #111;

  html[data-theme='black'] & {
    --tag-header__hash-color: #999;
    --tag-header__label-color: #fff;
  }
}

.tag-header {
  &__content {
    display: flex;
    flex-direction: row;
    align-items: center;

    margin-bottom: 1rem;
  }

  &__hash {
    color: var(--tag-header__hash-color);
    font-size: 2.0rem;
    font-weight: var(--x-font-weight--normal);
    line-height: calc(1.6 * 1em);
  }

  &__label {
    color: var(--tag-header__label-color);
    font-size: 2.3rem;
    font-weight: var(--x-font-weight--bold);
    line-height: calc(1.4 * 1em);
  }

  &__hash + &__label {
    margin-left: .5rem;
  }
}
</style>