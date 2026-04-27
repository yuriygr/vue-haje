<template>
  <template v-if="data">
    <router-link class="help-item" :to="helpUrl">
      <div class="help-item__content">
        <div class="help-item__title">
          {{ data.title }}
        </div>
        <div class="help-item__caption">
          {{ data.caption }}
        </div>
      </div>
    </router-link>
  </template>
  <template v-else>
    <div :class="[ 'help-item' ]">
      <div class="help-item">
        <div class="help-item__content">
          <div class="help-item__title">
            <skeleton :width="skeletonWidths.title" :height="9" />
          </div>
          <div class="help-item__caption">
            <skeleton :width="skeletonWidths.caption" :height="7" />
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<script>
export default {
  name: 'help-item',
  props: {
    data: false
  },
  data() {
    return {
      skeletonWidths: {
        title: Math.floor(Math.random() * 100) + 100,
        caption: Math.floor(Math.random() * 100) + 120
      }
    }
  },
  computed: {
    helpUrl() {
      return { name: 'help-page', params: { slug: this.data.uuid } }
    }
  }
}
</script>

<style lang="scss">
.help-item {
  --help-item__title--color: #212529;
  --help-item__caption--color: #495057;

  html[data-theme='black'] & {
    --help-item__title--color: #f0f0f0;
    --help-item__caption--color: #999;
  }
}

.help-item {
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

  &__title {
    color: var(--help-item__title--color);
    font-size: 1.4rem;
    font-weight: 500;
    line-height: calc(1.4 * 1em);
  }

  &__caption {
    color: var(--help-item__caption--color);
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