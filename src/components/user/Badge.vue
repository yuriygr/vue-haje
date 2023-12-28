<template>
  <div :class="[ 'badge', 'badge--' + tint ]"></div>
</template>

<script>
export default {
  name: 'user-badge',
  props: {
    tint: {
      type: String,
      default: 'black'
    }
  }
}
</script>

<style lang="scss" scoped>
.badge {
  --badge--size: 0.7rem;

  background: var(--tint, currentColor);
  display: block;
  width: var(--badge--size);
  height: var(--badge--size);
	border-radius: 50%;

	&--black  { --tint: #212529; }
	&--grape  { --tint: #862e9c; }
	&--indigo { --tint: #364fc7; }
	&--pink   { --tint: #a61e4d; }
	&--violet { --tint: #5f3dc4; }
	&--blue   { --tint: #1864ab; }
	&--cyan   { --tint: #0b7285; }
	&--teal   { --tint: #087f5b; }
	&--green  { --tint: #2b8a3e; }
	&--lime   { --tint: #5c940d; }
	&--yellow { --tint: #e67700; }
	&--orange { --tint: #d9480f; }
	&--red    { --tint: #c92a2a; }
	&--gold   { --tint: gold; }
}
</style>