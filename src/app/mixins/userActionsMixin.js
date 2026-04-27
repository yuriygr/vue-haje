import { defineAsyncComponent } from 'vue'

const UserReportModal = defineAsyncComponent(() => import("@/modals/_user/Report.vue"))

export const userActionsMixin = {
  data() {
    return {
      localData: null,
      loading: {
        subscribe: false,
        bookmarks: false
      }
    }
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
        this.$alerts.success({ text: this.$t(`alerts.${result.status}`) })
        this.onSubscribeResult(result)
      })
      .catch(error => {
        this.$alerts.danger({ text: this.$t(`alerts.${error.status}`) })
      })
      .finally(() => this.loading.subscribe = false)
    },

    // Закладки
    toggleBookmarks() {
      this.loading.bookmarks = true

      this.$api.post('my/bookmarks', {
        type: this.localData.state.is_bookmarked ? 'remove' : 'add',
        object: 'user',
        user_id: this.localData.user_id
      })
      .then(result => {
        this.localData.state.is_bookmarked = result.status === 'added'
        this.$emit('update:data', { ...this.localData })
        this.$alerts.success({ text: this.$t(`alerts.${result.status}`) })
        this.$popover.close()
      })
      .catch(error => {
        this.$alerts.danger({ text: this.$t(`alerts.${error.status}`) })
      })
      .finally(() => this.loading.bookmarks = false)
    },

    // Уведомления
    toggleNotify() {
      const path = this.localData.state.me_subscribed_to_new_posts
        ? `user/${this.localData.username}/unnotify`
        : `user/${this.localData.username}/notify`

      this.$api.post(path)
      .then(result => {
        this.localData.state.me_subscribed_to_new_posts = result.status === 'subscribed'
        this.$emit('update:data', { ...this.localData })
        this.$alerts.success({ text: this.$t(`alerts.${result.status}`) })
        this.$popover.close()
      })
      .catch(error => {
        this.$alerts.danger({ text: this.$t(`alerts.${error.status}`) })
      })
    },

    // Репорт
    reportUser(reason = 0) {
      return this.$api.post(`user/${this.localData.username}/report`, { reason })
      .then(result => {
        this.$alerts.success({ text: this.$t(`alerts.${result.status}`) })
      })
      .catch(error => {
        this.$alerts.danger({ text: this.$t(`alerts.${error.status}`) })
      })
    },

    // Копировать ссылку
    copyLink() {
      const url = this.$router.resolve(this.userLink)
      navigator.clipboard.writeText(window.location.origin + url.fullPath).then(() => {
        this.$alerts.success({ text: this.$t('success.link_copied') })
      })
      this.$popover.close()
    },

    // Открыть модалку репорта
    report() {
      this.$modals.show(UserReportModal, {
        reportUser: this.reportUser
      })
      this.$popover.close()
    }
  }
}