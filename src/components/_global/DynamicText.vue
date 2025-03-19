<template>
  <div class="dynamic-content">
    <div 
      ref="content"
      class="content"
      :class="{ collapsed: !isExpanded && showToggle }"
      :style="{ maxHeight: isExpanded ? maxExpandedHeight : collapsedHeight }"
    >
      <slot />
    </div>
    
    <a v-if="showToggle"
      @click.prevent="toggle"
      class="dynamic-content__toggle"
      href="#"
    >
      {{ isExpanded ? collapseText : expandText }}
    </a>
  </div>
</template>

<script>
export default {
  name: "dynamic-text",
  props: {
    collapsedHeight: {
      type: String,
      default: '250px' // Высота в свернутом состоянии
    },
    expandText: {
      type: String,
      default: 'Показать ещё'
    },
    collapseText: {
      type: String,
      default: 'Свернуть'
    }
  },
  data() {
    return {
      isExpanded: false,
      showToggle: false,
      maxExpandedHeight: 'auto'
    }
  },
  mounted() {
    this.checkContentHeight();
  },
  updated() {
    this.checkContentHeight();
  },
  methods: {
    toggle() {
      this.isExpanded = !this.isExpanded;
    },
    checkContentHeight() {
      const contentHeight = this.$refs.content.scrollHeight;
      const collapsedHeight = parseInt(this.collapsedHeight, 10);
      
      this.showToggle = contentHeight > collapsedHeight;
      
      if (this.isExpanded) {
        this.maxExpandedHeight = `${contentHeight}px`;
      }
    }
  }
}
</script>

<style lang="scss">
.dynamic-content {
  position: relative;

  &__toggle {
    display: inline-block;
    margin-top: 1rem;
  }
}

.content {
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}
.collapsed {
  mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
}


.toggle-button:hover {
  text-decoration: underline;
}

.toggle-button:focus {
  outline: none;
}
</style>