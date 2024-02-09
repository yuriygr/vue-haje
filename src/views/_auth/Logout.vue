<template>
  <placeholder-loading />
</template>

<script>
import { mapState } from 'vuex'
import { PlaceholderLoading } from '@vue-norma/ui'

export default {
  name: 'auth-logout',
  components: {
    PlaceholderLoading
  },
  data() {
    return { }
  },
  computed: {
    ...mapState('auth', {
      'session_data': state => state.data
    })
  },
  methods: {
    logout() {
      this.loading = true
      this.error = false

      this.$api.post('auth/logout', { logout_hash: this.session_data.logout_hash })
      .then(result => {
        this.$store.dispatch('auth/fetch')

        this.$router.push(this.$route.query.redirect || { name: 'home' })
      })
      .catch(error => {
        this.error = error
      })
      .then(_ => this.loading = false)
    }
  },
  watch: {},
  mounted() {
    this.logout()
  }
}
</script>
