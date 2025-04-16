<template>
  <group>
    <n-header>{{ $t('settings.permissions.title') }}</n-header>

    <template v-if="(!loading && !error) && Object.keys(data).length > 0">
      <div class="permission-item-wrapper" v-for="(i_value, i_key) in data">
        <div :class="[ 'permission-item', `permission-item--state-${i_value ? 'allowed' : 'denied'}`]">
          <div class="permission-item__state"><icon :name="i_value ? 'check-line' : 'cross-line'" size="11" /></div>
          <div class="permission-item__label">{{ $t(`settings.permissions.items.${i_key}`) }}</div>
        </div>
      </div>

      <div class="permission-item-wrapper">
        <div :class="[ 'permission-item', `permission-item--state-allowed`]">
          <div class="permission-item__state"><icon :name="'check-line'" size="11" /></div>
          <div class="permission-item__label">Восхвалять создателей футубры</div>
        </div>
      </div>
      <div class="permission-item-wrapper">
        <div :class="[ 'permission-item', `permission-item--state-denied`]">
          <div class="permission-item__state"><icon :name="'cross-line'" size="11" /></div>
          <div class="permission-item__label">Отрицать превосходство футубры</div>
        </div>
      </div>
      <div class="permission-item-wrapper">
        <div :class="[ 'permission-item', `permission-item--state-allowed`]">
          <div class="permission-item__state"><icon :name="'check-line'" size="11" /></div>
          <div class="permission-item__label">Есть кашу по утрам</div>
        </div>
      </div>
      <div class="permission-item-wrapper">
        <div :class="[ 'permission-item', `permission-item--state-allowed`]">
          <div class="permission-item__state"><icon :name="'check-line'" size="11" /></div>
          <div class="permission-item__label">Срать не снимая свитер</div>
        </div>
      </div>
      <div class="permission-item-wrapper">
        <div :class="[ 'permission-item', `permission-item--state-denied`]">
          <div class="permission-item__state"><icon :name="'cross-line'" size="11" /></div>
          <div class="permission-item__label">Обижаться на тупые шутки</div>
        </div>
      </div>
    </template>

    <template v-if="Object.keys(data).length == 0">
      <placeholder-loading v-if="loading" />
      <placeholder v-else-if="error"
        :icon="$t(humanizeError.icon)"
        :header="$t(humanizeError.title)"
        :text="$t(humanizeError.description)"
      />
      <placeholder v-else :text="$t('settings.permissions.empty')" />
    </template>
  </group>
</template>

<script>
import { Icon, Group, NHeader, Placeholder, PlaceholderLoading } from '@vue-norma/ui'

export default {
  name: 'settings-permissions',
  components: {
    Icon, Group, NHeader, Placeholder, PlaceholderLoading
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('settings.permissions.title')
      },

      data: false,

      error: false,
      loading: true
    }
  },
  computed: {
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    }
  },
  methods: {
    // Fetching
    fetch() {
      this.loading = true
      return this.$api.get('settings/permissions')
      .then(result => {
        this.data = result
      })
      .catch(error => {
        this.error = error
      })
      .then(_ => this.loading = false)
    },
  },
  mounted() {
    this.fetch()
  },
  beforeUnmount() {
    this.data = {}
  },
}
</script>

<style lang="scss">
.permission-item-wrapper {
  margin-bottom: 1rem;
}

.permission-item {
  &--state-allowed {
    --permission-item__icon--background: #aed5c5;
    --permission-item__icon--color: #153c2c;
  }

  &--state-denied {
    --permission-item__icon--background: #ffc2c8;
    --permission-item__icon--color: #66141c;
  }
  
  --permission-item__label--color: var(--x-body--color);
  
  html[data-theme="black"] & {

    &--state-allowed {
      --permission-item__icon--background: #153c2c;
      --permission-item__icon--color: #86c0a7;
    }

    &--state-denied {
      --permission-item__icon--background: #801a24;
      --permission-item__icon--color: #ffadb5;
    }

    --permission-item__label--color: var(--x-body--color);
  }
}

.permission-item {
  display: flex;
  align-items: center;
  position: relative;

  &__state {
    background: var(--permission-item__icon--background);
    color: var(--permission-item__icon--color);
    margin-right: .75rem;
    padding: 4px;
    width: 30px;
    height: 30px;
    position: relative;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;

    svg { display: block; fill: currentColor; }
  }

  &__label {

  }
}
</style>