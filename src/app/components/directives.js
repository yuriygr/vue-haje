import router from '@/app/components/router'
import { contentFormat } from '@/app/components/filters'

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

const handleClick = (router) => (e) => {
  const link = e.target.closest('a')
  if (!link) return

  const href = link.getAttribute('href')
  if (!href) return

  // Внутренние ссылки вида /t/... /u/...
  if (href?.startsWith('/')) {
    e.preventDefault()
    router.push(href)
  }

  try {
    const url = new URL(href)
    if (url.hostname === window.location.hostname) {
      e.preventDefault()
      router.push(url.pathname + url.search + url.hash)
    }
  } catch (e) {
    // невалидный url — игнорируем
  }
}

const linkified = {
  mounted(el, binding, vnode) {
    const router = binding.instance?.$router
    el.innerHTML = contentFormat(binding.value)
    el._handleClick = handleClick(router)
    el.addEventListener('click', el._handleClick)
  },

  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      el.innerHTML = contentFormat(binding.value)
    }
  },

  unmounted(el) {
    el.removeEventListener('click', el._handleClick)
    delete el._handleClick
  }
}


let directives = { clickOutside, CropHighText, linkified }

export default new class {
  install(app) {
    Object.keys(directives).forEach((key) => {
      app.directive(key, directives[key])
    })
  }
}