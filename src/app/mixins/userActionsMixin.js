import { defineAsyncComponent } from 'vue'
import { useModals } from '@vue-norma/ui'
import { useI18n } from 'vue-i18n'

import { useApi } from '@/app/composables/useApi'
import { useToast } from '@/app/composables/useToast'

const ReportModal = defineAsyncComponent(() => import("@/modals/Report.vue"))

export const userActionsMixin = {
  data() {
    return {
      localData: null,
      loading: {
        subscribe: false,
        bookmarks: false,
        mute: false
      }
    }
  },
  setup() {
    const { t } = useI18n()
    const api = useApi()
    const toast = useToast()
    const modals = useModals()

    return { t, toast, api, modals }
  },
  computed: {
    userLink() {
      return { name: 'user', params: { username: this.localData.username } }
    }
  },
  watch: {
    data: {
      handler(val) {
        this.localData = val ? { ...val, state: { ...val.state } } : null
      },
      immediate: true
    }
  },
  methods: {
    // Хук для компонентов, которые хотят реагировать на результат подписки
    onSubscribeResult(result) {},
    // Подписка
    toggleSubscribe() {
      this.loading.subscribe = true
      const path = this.localData.state.me_subscribed
        ? `user/${this.localData.username}/unsubscribe`
        : `user/${this.localData.username}/subscribe`

      this.$api.post(path)
      .then(result => {
        this.localData.state.me_subscribed = result.status === 'subscribed'
        this.$emit('update:data', { ...this.localData })
        this.$toast.success(this.$t(`alerts.${result.status}`))
        this.onSubscribeResult(result)
      })
      .catch(error => {
        this.$toast.danger(this.$t(`alerts.${error.status}`))
      })
      .finally(() => this.loading.subscribe = false)
    },
    // Мьют
    toggleMute() {
      this.loading.mute = true
      const path = this.localData.state.is_muted
        ? `user/${this.localData.username}/unmute`
        : `user/${this.localData.username}/mute`

      this.$api.post(path)
      .then(result => {
        this.localData.state.is_muted = result.status === 'muted'
        this.$emit('update:data', { ...this.localData })
        this.$toast.success(this.$t(`alerts.${result.status}`))
      })
      .catch(error => {
        this.$toast.danger(this.$t(`alerts.${error.status}`))
      })
      .finally(() => this.loading.mute = false)
    },

    // Закладки
    toggleBookmarks() {
      this.loading.bookmarks = true

      return this.$api.post('my/bookmarks', {
        type: this.localData.state.is_bookmarked ? 'remove' : 'add',
        object: 'user',
        user_id: this.localData.user_id
      })
      .then(result => {
        this.localData.state.is_bookmarked = result.status === 'added'
        this.$emit('update:data', { ...this.localData })
        this.$toast.success(this.$t(`alerts.${result.status}`))
        this.$popover.close()
      })
      .catch(error => {
        this.$toast.danger(this.$t(`alerts.${error.status}`))
      })
      .finally(() => this.loading.bookmarks = false)
    },

    // Уведомления
    toggleNotify() {
      const path = this.localData.state.me_subscribed_to_new_posts
        ? `user/${this.localData.username}/unnotify`
        : `user/${this.localData.username}/notify`

      return this.$api.post(path)
      .then(result => {
        this.localData.state.me_subscribed_to_new_posts = result.status === 'subscribed'
        this.$emit('update:data', { ...this.localData })
        this.$toast.success(this.$t(`alerts.${result.status}`))
        this.$popover.close()
      })
      .catch(error => {
        this.$toast.danger(this.$t(`alerts.${error.status}`))
      })
    },

    // Репорт
    reportUser(reason = 0) {
      return this.$api.post(`user/${this.localData.username}/report`, { reason })
      .then(result => {
        this.$toast.success(this.$t(`alerts.${result.status}`))
      })
      .catch(error => {
        this.$toast.danger(this.$t(`alerts.${error.status}`))
      })
    },

    // Копировать ссылку
    copyLink() {
      const url = this.$router.resolve(this.userLink)
      navigator.clipboard.writeText(window.location.origin + url.fullPath).then(() => {
        this.$toast.success(this.$t('success.link_copied'))
      })
      this.$popover.close()
    },

    // Открыть модалку репорта
    report() {
      this.modals.show(ReportModal, {
        callback: this.reportUser
      })
      this.$popover.close()
    }
  }
}