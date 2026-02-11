<template>
  <div class="auth-form-wrapper">
    <div class="auth-form">
      <router-view name="auth"></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'auth'
}
</script>

<style lang="scss">
.auth-form {
  --auth-form--box-shadow: 0 11px 34px 0 rgba(0, 0, 0, 0.24);

  html[data-theme="black"] & {
    --auth-form--box-shadow: 0 11px 34px 0 rgba(0, 0, 0, 0.4);
  }
}


.auth-form-wrapper {
  display: flex;
  justify-content: center;
}
.auth-form {
  width: 400px;
  margin: 3rem 0;
  box-shadow: var(--auth-form--box-shadow);
  border-radius: 16px;
  padding: 2.5rem 3rem;
}

</style>