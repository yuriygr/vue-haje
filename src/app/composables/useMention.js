import { reactive } from 'vue'
import { to } from '@/app/services/utilities'

export function useMention() {
  const state = reactive({
    active:        false,
    query:         '',
    users:         [],
    loading:       false,
    selectedIndex: 0,
    position:      { top: 0, left: 0 },
  })

  let timer          = null
  let abortController = null

  // Возвращает { node, offset, atIndex, query } или null
  function getAtContext() {
    const selection = window.getSelection()
    if (!selection?.rangeCount) return null

    const range  = selection.getRangeAt(0)
    const node   = range.startContainer
    const offset = range.startOffset

    let text = ''
    if (node.nodeType === Node.TEXT_NODE) {
      text = node.textContent?.slice(0, offset) ?? ''
    } else {
      const child = node.childNodes[offset - 1]
      text = child?.textContent ?? ''
    }

    const match = text.match(/(^|[\s\n])@(\w*)$/)
    if (!match) return null

    const atIndex = text.lastIndexOf('@')
    if (atIndex === -1) return null

    return { node, offset, atIndex, query: match[2] }
  }

  function detect() {
    const ctx = getAtContext()

    if (!ctx) {
      close()
      return
    }

    // Позицию обновляем всегда — курсор мог сдвинуться при том же query
    updatePosition(ctx)

    // Запрос перезапускаем только при смене query
    if (state.active && state.query === ctx.query) return

    state.query         = ctx.query
    state.selectedIndex = 0
    state.active        = true
    state.loading       = true
    state.users         = []

    clearTimeout(timer)

    timer = setTimeout(async () => {
      abortController?.abort()
      const controller = new AbortController()
      abortController  = controller

      const [error, result] = await to(
        this.$api.get(`utils/mention?query=${encodeURIComponent(state.query)}`, null, controller.signal)
      )

      // Ответ устарел — пришёл не от последнего контроллера
      if (controller !== abortController) return

      if (error) {
        // Не закрываем если запрос сам же был отменён (пришёл новый)
        if (!controller.signal.aborted) close()
        return
      }

      state.users   = result.items ?? []
      state.loading = false
      if (!state.users.length) close()
      abortController = null
    }, 300)
  }

  // Возвращает одно из:
  //   false              — событие не поглощено
  //   true               — поглощено, продолжать не нужно
  //   { pick: user }     — пользователь выбрал элемент
  function handleKeydown(e) {
    if (!state.active) return false

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        state.selectedIndex = Math.min(state.selectedIndex + 1, state.users.length - 1)
        return true

      case 'ArrowUp':
        e.preventDefault()
        state.selectedIndex = Math.max(state.selectedIndex - 1, 0)
        return true

      case 'Tab':
        e.preventDefault()
        if (e.shiftKey) {
          state.selectedIndex = Math.max(state.selectedIndex - 1, 0)
        } else {
          state.selectedIndex = Math.min(state.selectedIndex + 1, state.users.length - 1)
        }
        return true

      case 'Enter': {
        const user = state.users[state.selectedIndex]
        if (user) {
          e.preventDefault()
          return { pick: user }
        }
        return false
      }

      case 'Escape':
        e.stopPropagation()
        close()
        return true
    }

    return false
  }

  // Принимает готовый ctx чтобы не делать второй проход по DOM
  function updatePosition(ctx) {
    try {
      const atCtx = ctx ?? getAtContext()
      if (!atCtx) return

      const { node, atIndex } = atCtx

      const atRange = document.createRange()
      atRange.setStart(node, atIndex)
      atRange.setEnd(node, atIndex + 1)

      const rect = atRange.getBoundingClientRect()
      state.position = {
        top:  rect.bottom + 4,
        left: rect.left,
      }
    } catch {}
  }

  function pick(user) {
    const ctx = getAtContext()
    if (!ctx) return

    const { node, offset, atIndex } = ctx

    const newRange = document.createRange()
    newRange.setStart(node, atIndex)
    newRange.setEnd(node, offset)

    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(newRange)

    document.execCommand('insertText', false, `@${user.username} `)

    close()
  }

  function close() {
    state.active        = false
    state.query         = ''
    state.users         = []
    state.loading       = false
    abortController?.abort()
    abortController     = null
    clearTimeout(timer)
    timer               = null
  }

  return {
    mention:               state,
    mentionDetect:         detect,
    mentionHandleKeydown:  handleKeydown,
    updateMentionPosition: updatePosition,
    mentionPick:           pick,
    mentionClose:          close,
  }
}