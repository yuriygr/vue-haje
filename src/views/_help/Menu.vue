<template>
  <div class="navigation">
    <template v-for="(section, index) in sections" :key="`section-${index}`">
      <navigation-section>
        <navigation-title v-if="!section.label">{{ section.label }}</navigation-title>
        <template v-for="(item, jndex) in section.items" :key="`section-${index}-item-${jndex}`">
          <navigation-item :icon="item.icon" :to="item.to" :disabled="item.disabled">
            {{ item.label }}
          </navigation-item>
        </template>
      </navigation-section>
    </template>
  </div>
</template>

<script>
import { NavigationSection, NavigationItem, Icon } from '@vue-norma/ui'

export default {
  name: 'help-menu',
  components: {
    NavigationSection, NavigationItem, Icon
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('help.title')
      }
    }
  },
  computed: {
    sections() {
      let base = [
        {
          icon: 'kb-line',
          label: this.$t('help.item.all-questions'),
          to: { name: 'help-all-questions' },
          disabled: true
        }
      ]

      let my = [
        {
          icon: 'question-line',
          label: this.$t('help.item.my-questions'),
          to: { name: 'help-my-questions' },
          disabled: true
        },
        {
          icon: 'add-line',
          label: this.$t('help.item.add-question'),
          to: { name: 'help-add-question' },
          disabled: true
        }
      ]
  
      return [
        { label: this.$t('help.section.base'), items: base },
        { label: this.$t('help.section.my'), items: my }
      ]
    }
  }
}
</script>

<style lang="scss">

</style>