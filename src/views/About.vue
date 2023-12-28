<template>
  <group>
    <n-header>Футубра</n-header>
    <p>Как-то несправедливо, что все социальные сети России в руках одного человека, вы не находите?</p>
  </group>

  <spacer height="40" />

  <group>
    <n-header>{{ $t('about.section.teasers.title') }}</n-header>
    <div class="teasers__grid">
      <template v-for="(item, index) in teasers" :key="`teaser-item${index}`">
        <div :class="[ 'teaser-item', 'teaser-item--' + item.color ]">
          <div class="teaser-item__icon">
            <icon :name="item.icon" size="20" />
          </div>
          <div class="teaser-item__content">
            <div class="teaser-item__title">{{ item.title }}</div>
            <div class="teaser-item__info">{{ item.info }}</div>
          </div>
        </div>
      </template>
    </div>
  </group>
</template>

<script>
import { Icon, PageHeader, NHeader, Group, Spacer } from '@vue-norma/ui'

export default {
  name: 'about',
  components: {
    Icon, PageHeader, NHeader, Group, Spacer
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('about.title')
      },
      teasers: [
        { color: 'pink', icon: 'sparkling-line', title: 'Никаких рекомендаций', info: 'Новостная лента содержит только то, на что ты подписался и без рекомендаций добавить бывшую и ее нового парня в друзья' },
        { color: 'green', icon: 'team-line', title: 'Никаких друзей', info: 'Только подписки на контент пользователя что интересен тебе' },
        { color: 'blue', icon: 'dislike-line', title: 'Никаких лайков', info: 'Мы же не хотим видеть посты с котятами на постоянке ради набора рейтинга?' },
        { color: 'orange', icon: 'user-forbid-line', title: 'Никаких черных списков', info: 'Тебе не нравится что пишет другой человек? Не читай его, это не сложно' },
        { color: 'violet', icon: 'advertisement-line', title: 'Никаких брендов', info: 'Лично мне хватает их рекламы в интернете' }
      ]
    }
  }
}
</script>

<style lang="scss">
.teasers__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(28rem, 1fr));
  grid-gap: 3rem;
}
.teaser-item {
  --icon-background: var(--x-color-white);
  --icon-color: var(--x-color-black);

  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 1.75rem;

  &__icon {
    background: var(--icon-background);
    display: flex;
    justify-content: center;
    padding: 1.5rem;
    border-radius: 8px;

    svg {
      fill: var(--icon-color);
      width: 3rem;
      height: 3rem;
      display: block;
    }
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 500;
    line-height: calc(1.5 * 1em);
  }

  &__info {
    font-size: 1.4rem;
    font-weight: 400;
    line-height: calc(1.5 * 1em);
  }

  &--pink {
    --icon-background: var(--x-color-pink--tint90);
    --icon-color: var(--x-color-pink--tint20);
  }

  &--green {
    --icon-background: var(--x-color-green--tint90);
    --icon-color: var(--x-color-green--tint20)
  }

  &--orange {
    --icon-background: var(--x-color-orange--tint90);
    --icon-color: var(--x-color-orange--tint20)
  }

  &--blue {
    --icon-background: var(--x-color-blue--tint90);
    --icon-color: var(--x-color-blue--tint20)
  }

  &--red {
    --icon-background: var(--x-color-red--tint90);
    --icon-color: var(--x-color-red--tint20)
  }

  &--violet {
    --icon-background: var(--x-color-violet--tint90);
    --icon-color: var(--x-color-violet--tint20)
  }
}

html[data-theme="black"] {
  .teaser-item--pink {
    --icon-background: var(--x-color-pink--shade70);
    --icon-color: var(--x-color-pink--tint20);
  }
  .teaser-item--green {
    --icon-background: var(--x-color-green--shade70);
    --icon-color: var(--x-color-green--tint20)
  }

  .teaser-item--orange {
    --icon-background: var(--x-color-orange--shade70);
    --icon-color: var(--x-color-orange--tint20)
  }

  .teaser-item--blue {
    --icon-background: var(--x-color-blue--shade70);
    --icon-color: var(--x-color-blue--tint20)
  }

  .teaser-item--red {
    --icon-background: var(--x-color-red--shade70);
    --icon-color: var(--x-color-red--tint20)
  }

  .teaser-item--violet {
    --icon-background: var(--x-color-violet--shade70);
    --icon-color: var(--x-color-violet--tint20)
  }
}
</style>