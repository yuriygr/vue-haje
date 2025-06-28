<template>
  <group>
    <n-header>{{ $t('settings.profile.avatar.title') }}</n-header>

    <form-text>
      {{ $t('settings.profile.avatar.help') }}
    </form-text>

    <form-block>
      <n-button component="a" href="https://gravatar.com" target="_blank" size="l" icon_after="external-line">{{ $t('action.go_away') }}</n-button>
    </form-block>
  </group>

  <spacer height="40" />

  <group>
    <n-header>{{ $t('settings.profile.data') }}</n-header>

    <form-group @submit="submitProfile" :loading="loading.profile">
      <form-block :label="$t('settings.field.name')">
        <text-field tabindex="1" type="text" name="name" v-model.trim="profile.name" :disabled="loading.profile" />
      </form-block>

      <form-block :label="$t('settings.field.bio')">
        <text-field tabindex="2" type="text" name="bio" v-model.trim="profile.bio" :disabled="loading.profile" />
      </form-block>

      <form-block :label="$t('settings.field.sex')">
        <select-field tabindex="3" name="sex" :disabled="loading.profile" v-model.trim="profile.sex">
          <template v-for="key in sexs" :key="`sex-${key}`">
            <option :value="key" :selected="key == profile.sex">{{ $t(`settings.sex.${key}`) }}</option>
          </template>
        </select-field>
      </form-block>

      <form-block>
        <n-button tabindex="4" size="l" :disabled="loading.profile">{{ $t('action.save') }}</n-button>
      </form-block>
    </form-group>
  </group>

  <spacer height="40" />

  <group>
    <n-header>{{ $t('settings.profile.tint.title') }}</n-header>

    <form-group @submit="submitTint" :loading="loading.tint">
      <form-text>
        {{ $t('settings.profile.tint.help') }}
      </form-text>
      
      <form-block>
        <tints-grid v-if="tints.length > 0">
          <template v-for="(item, index) in tints" :key="`tint-${index}`">
            <tint-item :data="item" :selected="item.code == profile.tint" @click="changeTint" />
          </template>
        </tints-grid>
        <placeholder-loading v-if="(tints.length == 0) && loading.tint" />
      </form-block>

      <form-block>
        <n-button tabindex="4" size="l" :disabled="loading.tint">{{ $t('action.save') }}</n-button>
      </form-block>
    </form-group>
  </group>
</template>

<script>
import { mapState } from 'vuex'
import { PlaceholderLoading, NButton, Spacer, Group, NHeader } from '@vue-norma/ui'
import { TintsGrid, TintItem } from '@/components/tint'

export default {
  name: 'settings-profile',
  components: {
    PlaceholderLoading, NButton, Spacer, Group, NHeader,
    TintsGrid, TintItem
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('settings.profile.title')
      },

      tints: [],

      profile: {
        name: '',
        bio: '',
        sex: '',
        tint: ''
      },

      loading: {
        profile: true,
        tint: true
      }
    }
  },
  computed: {
    ...mapState('auth', {
      'session_data': state => state.data
    }),
    sexs() {
      return [
        'male',
        'female',
        'none'
      ]
    },
  },
  methods: {
    // Fetching
    fetchProfile() {
      this.loading.profile = true
      return this.$api.get('settings/profile')
      .then(result => {
        this.profile = result
      })
      .catch(error => {
        this.$alerts.danger({ text: error.status })
      })
      .then(_ => this.loading.profile = false)
    },
    fetchTints() {
      this.loading.tint = true
      return this.$api.get('settings/tint')
      .then(result => {
        this.tints = result.items
      })
      .catch(error => {
        this.$alerts.danger({ text: error.status })
      })
      .then(_ => this.loading.tint = false)
    },

    changeTint(payload) {
      this.profile.tint = payload.code
    },

    // Submits
    submitProfile() {
      this.loading.profile = true
      return this.$api.post('settings/profile', this.profile)
      .then(result => {
        this.$alerts.success({ text: this.$t(`alerts.${result.status}`) })

      })
      .catch(error => {
        this.$alerts.danger({ text: this.$t(`alerts.${error.status}`) })
      })
      .then(_ => this.loading.profile = false)
    },
    submitTint() {
      this.loading.tint = true
      return this.$api.post('settings/tint', { code: this.profile.tint })
      .then(result => {
        this.$alerts.success({ text: this.$t(`alerts.${result.status}`) })

      })
      .catch(error => {
        this.$alerts.danger({ text: this.$t(`alerts.${error.status}`) })
      })
      .then(_ => this.loading.tint = false)
    }
  },
  async mounted() {
    await this.fetchProfile()
    await this.fetchTints()
  }
}
</script>

<style>

</style>