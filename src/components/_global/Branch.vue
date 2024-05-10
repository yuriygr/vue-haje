<template>
  <div class="branches">
    <template v-for="i in count" :key="`branch-${key}-${i}`">
      <div class="branches__item" />
    </template>
  </div>
</template>

<script>
export default {
  name: 'branches',
  props: {
    count: 0,
    key: 'default'
  }
}
</script>

<style lang="scss">
.branches {
  --branch--color: #ebebeb;

  html[data-theme="black"] & {
    --branch--color: #222; 
  }
}

.branches {
  display: flex;
  width: calc(var(--gap-branch) * (var(--level) - 1));

  &__item {
    width: var(--gap-branch, 0);
    border-left: 1px solid var(--branch--color);
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    -ms-flex-negative: 0;
    flex-shrink: 0;

    &:last-child::before {
      content: '';
      box-sizing: content-box;
      display: block;
      width: 15px;
      height: calc(var(--avatar-size)* .5);
      padding-bottom: calc(var(--avatar-size)* .5);
      border: solid var(--branch--color);
      border-width: 0 0 1px 1px;
      border-bottom-left-radius: 10px;
      margin-left: -1px;
    }
  }
}

</style>