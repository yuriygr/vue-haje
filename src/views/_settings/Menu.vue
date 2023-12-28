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
import { NavigationSection, NavigationItem } from '@vue-norma/ui'

export default {
  name: 'settngs-menu',
  components: {
    NavigationSection, NavigationItem
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('settings.title')
      }
    }
  },
  computed: {
    sections() {
      let base = [
        {
          icon: 'user-edit-line',
          label: this.$t('settings.item.profile'),
          to: { name: 'settings-profile' }
        },
        {
          icon: 'bell-line',
          label: this.$t('settings.item.notifications'),
          to: { name: 'settings-notifications' }
        },
        {
          icon: 'link-line',
          label: this.$t('settings.item.connections'),
          to: { name: 'settings-connections' },
          disabled: true
        },
        {
          icon: 'palette-line',
          label: this.$t('settings.item.appearance'),
          to: { name: 'settings-appearance' },
          disabled: true
        }
      ]

      let secure = [
        {
          icon: 'user-lock-line',
          label: this.$t('settings.item.account'),
          to: { name: 'settings-account' },
          disabled: true
        },
        {
          icon: 'password-line',
          label: this.$t('settings.item.password'),
          to: { name: 'settings-password' }
        },
        {
          icon: 'history-line',
          label: this.$t('settings.item.login_activity'),
          to: { name: 'settings-login-activity' }
        }
      ]

      let danger = [
        {
          icon: 'gdpr-line',
          label: this.$t('settings.item.gdpr'),
          to: { name: 'settings-gdpr' }
        },
        {
          icon: 'delete-bin-line',
          label: this.$t('settings.item.delete_account'),
          to: { name: 'settings-delete-account' }
        }
      ]

      return [
        { label: this.$t('settings.section.base'), items: base },
        { label: this.$t('settings.section.secure'), items: secure },
        { label: this.$t('settings.section.danger'), items: danger }
      ]
    }
  }
}
</script>

<style lang="scss">

</style>