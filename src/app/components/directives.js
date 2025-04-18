const clickOutside = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = event => {
      // here I check that click was outside the el and his children
      if (!(el == event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        binding.value(event, el)
      }
    };
    document.addEventListener("click", el.clickOutsideEvent)
  },

  beforeUnmount(el) {
    document.removeEventListener("click", el.clickOutsideEvent)
  },

  stopProp(event) { event.stopPropagation() }
}

const CropHighText = {
  beforeMount(el, binding, vnode) {
    let data = binding.value
    if (data.on)
      return
    vnode.context.$nextTick(() => {
      if (el.offsetHeight >= data.height) {
        el.classList.add(data.class)
        el.style.maxHeight = data.height + 'px'
      }
    })
  }
}

let directives = { clickOutside, CropHighText }

export default new class {
  install(app) {
    Object.keys(directives).forEach((key) => {
      app.directive(key, directives[key])
    })
  }
}