<template>
  <div :class="[ 'user-item' ]">
    <div class="user-item__avatar"></div>
    <div class="user-item__content">
      <div class="user-item__name">
      </div>
      <div class="user-item__username"></div>
    </div>
    <buttons-group :withGap="true" class="user-item__actions">
      <icon-button :disabled="true" name="ui-more" mode="tertiary" :title="$t('user.action.options')" />
    </buttons-group>
  </div>
</template>

<script>
import { Icon, IconButton, ButtonsGroup } from '@vue-norma/ui'

export default {
  name: 'user-item-skeleton',
  components: {
    Icon, IconButton, ButtonsGroup
  },
  props: { },
  data() {
    return { }
  },
  computed: { },
  methods: { }
}
</script>

<style lang="scss">

</style>