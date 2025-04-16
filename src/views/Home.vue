<template>
  <div class="hero">
    <div class="hero__title" v-html="$t('home.hero.title')" />
    <div class="hero__description" v-html="$t('home.hero.description')" />

    <buttons-group class="hero__actions">
      <n-button size="l" component="router-link" :to="{ name: 'auth-register' }">
        {{ $t('home.action.create_account') }}
      </n-button>
      <n-button size="l" mode="tertiary" component="router-link" :to="{ name: 'auth-login' }">
        {{ $t('home.action.login') }}
      </n-button>
    </buttons-group>
  </div>

  <spacer height="40" />

  <group>
    <div class="teasers__grid">
      <template v-for="(item, key) in teasers" :key="`teaser-item-${key}`">
        <div :class="[ 'teaser-item' ]">
          <div class="teaser-item__icon">
            <icon :name="item.icon" size="20" />
          </div>
          <div class="teaser-item__content">
            <div class="teaser-item__title">{{ $t(`home.teasers.item.${item.code}.title`) }}</div>
            <div class="teaser-item__info">{{ $t(`home.teasers.item.${item.code}.info`) }}</div>
          </div>
        </div>
      </template>
    </div>
  </group>
</template>

<script>
import { mapGetters } from 'vuex'
import { Icon, NHeader, Group, Spacer, ButtonsGroup, NButton } from '@vue-norma/ui'

export default {
  name: 'home',
  components: {
    Icon, NHeader, Group, Spacer, ButtonsGroup, NButton
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('home.title')
      },
      teasers: [
        { code: 'stories',         icon: 'stories-line' },
        { code: 'brain',           icon: 'brain-line' },
        { code: 'recommendations', icon: 'sparkling-line' },
        { code: 'combine',         icon: 'function-line' },
        { code: 'friends',         icon: 'team-line' },
        { code: 'likes',           icon: 'like-line' },
        { code: 'blacklist',       icon: 'user-forbid-line' },
        { code: 'ads',             icon: 'advertisement-line' }
      ]
    }
  },
  computed: {
    ...mapGetters('auth', [ 'isAuth' ]),
  },
  mounted() {
    if (this.isAuth) {
      this.$router.push({ name: 'feed' })
      return
    }
  }
}
</script>

<style lang="scss">
.hero {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 4vh 0 5vh;

  &__title {
    font-size: 3rem;
    line-height: calc(1.2 * 1em);
    font-weight: 600;
    margin-bottom: 1rem;
  }

  &__description {
    font-size: 1.6rem;
    line-height: calc(1.4 * 1em);
    font-weight: 400;
  }

  &__actions {
    margin-top: 3rem;
  }
}


.teasers__grid {
  .teaser-item + .teaser-item {
    margin-top: 2rem;
  }
}

.teaser-item {
  --icon-background: var(--x-color-gray--tint90);
  --icon-color: var(--x-color-black);
  --teaser-item__title-color: var(--x-color-black);
  --teaser-item__info-color: var(--x-color-black--tint40);
  
  html[data-theme="black"] & {
    --icon-background: var(--x-body--color);
    --icon-color: #1d1d1d;
    --teaser-item__title-color: var(--x-body--color);
    --teaser-item__info-color: var(--x-color-black--tint50);
  }
}

.teaser-item {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;

  &__icon {
    background: var(--icon-background);
    display: flex;
    justify-content: center;
    padding: 1.5rem;
    border-radius: 8px;
    margin-right: 1rem;

    svg {
      fill: var(--icon-color);
      width: 3rem;
      height: 3rem;
      display: block;
    }
  }

  &__title {
    color: var(--teaser-item__title-color);
    font-size: 1.5rem;
    font-weight: 600;
    line-height: calc(1.5 * 1em);
  }

  &__info {
    color: var(--teaser-item__info-color);
    font-size: 1.4rem;
    font-weight: 400;
    line-height: calc(1.5 * 1em);
  }
}
</style>