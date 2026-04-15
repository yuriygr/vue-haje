<template>
  <div class="tag-header">
    <div class="tag-header__content">
      <div class="tag-header__hash">#</div>
      <div class="tag-header__label">{{ data.label }}</div>
    </div>
    <meta-info class="tag-header__meta" :items="metaItems" />
  </div>
</template>

<script>
import { MetaInfo } from '@vue-norma/ui'

export default {
  name: 'tag-card',
  components: {
    MetaInfo
  },
  props: {
    data: {
      type: Object,
      default: false
    }
  },
  data() {
    return {}
  },
  computed: {
    metaItems() {
      let _result = []

      this.data.state.is_official && _result.push({ label: this.$t('tag.meta.official') })
      this.data.state.is_nsfw && _result.push({ label: this.$t('tag.meta.nsfw') })
      _result.push({ label: this.$t('tag.meta.from_date', { date: this.formatedDate }) })

      return _result
    },
    formatedDate() {
      return this.$filters.timeFormatOnlyYear(this.data.date_added, this.$i18n.locale)
    }
  },
  methods: { }
}
</script>

<style lang="scss">
.tag-header {
  --tag-header__label-color: var(--x-body--color);
  --tag-header__hash-color: #868e96;

  html[data-theme='black'] & {
    --tag-header__label-color: var(--x-body--color);
    --tag-header__hash-color: var(--x-color-white--shade40, #999);
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