import type { App, Directive, DirectiveBinding } from 'vue'
import type { Router } from 'vue-router'

import { contentFormat } from '@/app/services/content'

// ─── clickOutside ────────────────────────────────────────────────────────

interface ClickOutsideElement extends HTMLElement {
  clickOutsideEvent?: (event: MouseEvent) => void
}

const clickOutside: Directive<ClickOutsideElement, (event: MouseEvent, el: HTMLElement) => void> = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = (event: MouseEvent) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event, el)
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },

  beforeUnmount(el) {
    if (el.clickOutsideEvent) {
      document.removeEventListener('click', el.clickOutsideEvent)
    }
  }
}

// ─── markup ──────────────────────────────────────────────────────────────

interface MarkupElement extends HTMLElement {
  _handleClick?: (event: MouseEvent) => void
}

function handleClick(router?: Router) {
  return (e: MouseEvent) => {
    const target = e.target as HTMLElement
    const link = target.closest('a')
    if (!link) return

    const href = link.getAttribute('href')
    if (!href) return

    // Внутренние ссылки вида /t/... /u/...
    if (href.startsWith('/')) {
      e.preventDefault()
      router?.push(href)
      return
    }

    try {
      const url = new URL(href)
      if (url.hostname === window.location.hostname) {
        e.preventDefault()
        router?.push(url.pathname + url.search + url.hash)
      }
    } catch {
      // невалидный url — игнорируем
    }
  }
}

// штука что размечает текст в html
const markup: Directive<MarkupElement, string> = {
  mounted(el, binding: DirectiveBinding<string>) {
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
    if (el._handleClick) {
      el.removeEventListener('click', el._handleClick)
      delete el._handleClick
    }
  }
}

const directives: Record<string, Directive> = { clickOutside, markup }

export default {
  install(app: App) {
    Object.keys(directives).forEach((key) => {
      app.directive(key, directives[key])
    })
  }
}