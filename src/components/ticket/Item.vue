<template>
  <template v-if="data">
    <router-link class="ticket-item" :to="ticketUrl">
      <div class="ticket-item__content">
        <div class="ticket-item__subject">
          {{ data.subject }}
        </div>
        <meta-info class="ticket-item__meta" :items="metaItems" />
      </div>
    </router-link>
  </template>
  <template v-else>
    <div :class="[ 'ticket-item' ]">
      <div class="ticket-item">
        <div class="ticket-item__content">
          <div class="ticket-item__subject">
            <skeleton :width="skeletonWidths.subject" :height="9" />
          </div>
          <div class="ticket-item__caption">
            <skeleton :width="skeletonWidths.caption" :height="7" />
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<script>
import { MetaInfo } from '@vue-norma/ui'

export default {
  name: 'ticket-item',
  components: {
    MetaInfo
  },
  props: {
    data: false
  },
  data() {
    return {
      skeletonWidths: {
        subject: Math.floor(Math.random() * 100) + 100,
        caption: Math.floor(Math.random() * 100) + 120
      }
    }
  },
  computed: {
    ticketUrl() {
      return { name: 'support-ticket', params: { uuid: this.data.uuid } }
    },
    metaItems() {
      let _result = []
      _result.push({ label: this.$t(`ticket.meta.status_${this.data.status}`) })
      _result.push({ label: this.$t(`ticket.meta.priority_${this.data.priority}`) })
      _result.push({ label: this.formatedDate })
      return _result
    },
    formatedDate() {
      return this.$filters.timeAgo(this.data.meta.created_at, this.$i18n.locale)
    }
  }
}
</script>

<style lang="scss">
.ticket-item {
  --ticket-item__subject--color: #212529;
  --ticket-item__caption--color: #495057;

  html[data-theme='black'] & {
    --ticket-item__subject--color: #f0f0f0;
    --ticket-item__caption--color: #999;
  }
}

.ticket-item {
  display: inline-flex;
  flex-direction: row;
  align-items: center;

  position: relative;
  overflow: hidden;
  text-decoration: none;
  transition: var(--x-transition);


  &__content {
    display: flex;
    flex-direction: column;
    align-items: baseline;
  }

  &__subject {
    color: var(--ticket-item__subject--color);
    font-size: 1.4rem;
    font-weight: 500;
    line-height: calc(1.4 * 1em);
  }

  &__caption {
    color: var(--ticket-item__caption--color);
    font-size: 1.3rem;
    font-weight: var(--x-font-weight--normal);
    line-height: calc(1.4 * 1em);
  }

  @media(hover: hover) {
    &:hover {
      text-decoration: none;
    }
  }
}
</style>