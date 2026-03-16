<template>
  <modal :class="$formClass" v-on="$formEvents">
    <div v-show="currentView == 'form'">

      <div v-if="entryUser" class="compose__header">
        <user-item :data="entryUser" :clickable="false" :showSubscribeAction="false" />
        <buttons-group :withGap="true">
          <n-button v-if="mode == 'add'" icon_before="drafts-line" @click="openView('drafts')" mode="tertiary" :title="$t('modals.compose.action.view_drafts')" />
        </buttons-group>
      </div>

      <div class="compose__field"
        v-on="$fieldEvents"
        v-bind="$fieldBinds"
      ></div>

      <attachments-form class="compose__attachments"
        v-model="form.files"
        :allowedFormats="allowedFormats"
        :max-files="1"
        ref="file"
      />

      <div class="compose__actions">
        <n-button mode="secondary" @click.exact="closeModal">{{ $t('action.cancel') }}</n-button>
        <buttons-group :withGap="true">
          <n-button icon_before="settings-line" @click="openView('options')" mode="tertiary" ref="options" :title="$t('modals.compose.action.options')" />
          <n-button icon_before="gif-line" @click="openView('gifs')" mode="tertiary" :title="$t('modals.compose.action.attach_gifs')" />
          <n-button icon_before="image-line" @click="attachFiles" mode="tertiary" :title="$t('action.attach_image')" />
          <n-button :disabled="!canSubmit" @click="sendForm">
            {{ $t(mode == 'add' ? 'action.create_entry' : 'action.save_entry') }}
          </n-button>
        </buttons-group>
      </div>
    </div>

    <div v-if="currentView == 'drafts'">
      <modal-header :title="$t('modals.compose.tab.drafts')">
        <template #before>
          <n-button icon_before="angle-left-line" mode="tertiary" @click.exact="openView('form')" :title="$t('action.back')" />
        </template>
        <template #after>
          <n-button icon_before="delete-bin-line" mode="tertiary" @click.exact="deleteAllDrafts" :title="$t('modals.compose.action.delete_drafts')" />
        </template>
      </modal-header>

      <template v-if="drafts.length == 0">
        <placeholder-loading v-if="draftsLoading" />
        <placeholder v-else-if="draftsError"
          :icon="$t(humanizeError(draftsError).icon)"
          :header="$t(humanizeError(draftsError).title)"
          :text="$t(humanizeError(draftsError).description)"
        />
        <placeholder v-else
          :icon="$t('errors.empty_drafts.icon')"
          :header="$t('errors.empty_drafts.title')"
          :text="$t('errors.empty_drafts.description')"
        />
      </template>
    </div>

    <div v-if="currentView == 'gifs'">
      <modal-header :title="$t('modals.compose.tab.gifs')">
        <template #before>
          <n-button icon_before="angle-left-line" mode="tertiary" @click.exact="openView('form')" :title="$t('action.back')" />
        </template>
      </modal-header>

      <placeholder
        :icon="$t('errors.todo.icon')"
        :header="$t('errors.todo.title')"
        :text="$t('errors.todo.description')"
      />
    </div>

    <div v-if="currentView == 'options'">
      <modal-header :title="$t('modals.compose.tab.options')">
        <template #before>
          <n-button icon_before="angle-left-line" mode="tertiary" @click.exact="openView('form')" :title="$t('action.back')" />
        </template>
      </modal-header>

      <modal-body>
        <form-block>
          <n-checkbox :label="$t('modals.compose.options.is_comments_enabled')" v-model="form.is_comments_enabled" :disabled="loading" />
        </form-block>
        <form-block>
          <n-checkbox :label="$t('modals.compose.options.is_hidden_from_feed')" v-model="form.is_hidden_from_feed" :disabled="loading" />
        </form-block>
        <form-block>
          <n-checkbox :label="$t('modals.compose.options.is_nsfw')" v-model="form.is_nsfw" :disabled="loading" />
        </form-block>
        <form-block>
          <n-checkbox :label="$t('modals.compose.options.is_ai')" v-model="form.is_ai" :disabled="loading" />
        </form-block>
      </modal-body>

    </div>
  </modal>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { cancelEvent } from '@/app/services/utilities'
import AttachmentsForm from '@/components/attachments/form'
import { UserItem } from '@/components/user'

import { useDraft } from '@/composables/useDraft'

import { Modal, ModalHeader, ModalBody, NButton, ButtonsGroup, Placeholder, PlaceholderLoading, Group } from '@vue-norma/ui'

export default {
  name: 'compose-modal',
  components: {
    UserItem,
    Modal, ModalHeader, ModalBody, NButton, ButtonsGroup, AttachmentsForm, Placeholder, PlaceholderLoading, Group
  },
  props: {
    data: {
      type: [ Object, Boolean ],
      default: false
    },
    mode: {
      type: String,
      default: 'add',
      validator(value) {
        return ['add', 'edit'].includes(value)
      }
    },
    draggedFiles: {
      type: Array,
      default: []
    },
  },
  data() {
    return {
      dragover: false,
      loading: false,
      error: false,

      allowedFormats: ['image/gif', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4'],

      user: false,

      form: {
        text: '',
        files: [],
        link: null,
        is_comments_enabled: true,
        is_hidden_from_feed: false,
        is_nsfw: false,
        is_ai: false
      },

      currentView: 'form',
      availableViews: [ 'form', 'options', 'drafts', 'gifs' ]
    }
  },
  computed: {
    ...mapState('auth', {
      'session_data': state => state.data
    }),
    ...mapState('drafts', { drafts: 'data', draftsLoading: 'loading', draftsError: 'error' }),
    ...mapGetters('drafts', [ 'hasMoreItems' ]),
    $formClass() {
      return [
        'compose',
        { 'compose--dragover': this.dragover }
      ]
    },
    $formEvents() {
      return {
        drop:      this.form_onDrop,
        dragenter: this.form_onDragEnter,
        dragleave: this.form_onDragLeave,
        dragover:  this.form_onDragOver
      }
    },

    $field() {
      return this.$refs.field
    },
    $fieldBinds() {
      return {
        ref: 'field',
        tabindex: 1,
        placeholder: this.$t('entry.pseudo-form.placeholder'),
        contenteditable: true,
        dir: 'auto'
      }
    },
    $fieldEvents() {
      return {
        input:     this.field_onInput,
        keyup:     this.field_onKeyup,
        keydown:   this.field_onKeydown,
        paste:     this.field_onPaste,
      }
    },
    canSubmit() {
      return (this.form.text.trim() != '' || this.hasFiles) && !this.loading
    },
    hasFiles() {
      return this.form.files.length != 0
    },
    // Выбираем какого пользователя выводить как автора
    entryUser() {
      return this.user || this.session_data.user
    }
  },
  methods: {
    // ─── Навигация ────────────────────────────────────────
    openView(view) {
      this.currentView = this.availableViews.includes(view) 
                        ? view 
                        : this.availableViews[0] ?? 'form'

      if (view === 'drafts') {
        this.$store.dispatch('drafts/fetch')
      }
    },
    closeModal() {
      if (this.canSubmit) {
        confirm(this.$t('action.confirm')) && this.$modals.close()
        return
      }
      this.$modals.close()
    },

    // ─── Публикация ───────────────────────────────────────

    sendForm() {
      if (!this.canSubmit) return

      this.loading = true
      this.error = false

      let endpoint = this.mode == 'add'
        ? 'entry'
        : `entry/${this.data.uuid}`

      this.$api.postJSON(endpoint, this.form)
      .then(async result => {
        await this._draft.discardDraft()
        this.clearForm()
        this.$modals.close()
        this.$router.push({ name: 'entry', params: { uuid: result.payload } })
      })
      .catch(error => {
        this.error = error
        this.$alerts.danger({ text: this.$t(`alerts.${error.status}`) })
      })
      .finally(_ => this.loading = false)
    },

    clearForm() {
      this.form = {
        text: '',
        files: [],
        link: null,
        is_comments_enabled: true,
        is_hidden_from_feed: false,
        is_nsfw: false,
        is_ai: false
      }
    },

    attachFiles() {
      this.$refs.file.attachFiles()
    },

    // ─── Работа с черновиками ─────────────────────────────

    async loadDraft(id) {
      const data = await this._draft.loadDraft(id)
      if (!data) return

      this.$refs.field.innerHTML = (data.text ?? '').replace(/\n/g, '<br>')
      this.form = {
        text: this.$refs.field.innerText,
        files: data.files ?? [],
        link: data.link,
        is_comments_enabled: data.is_comments_enabled,
        is_hidden_from_feed: data.is_hidden_from_feed,
        is_nsfw: data.is_nsfw,
        is_ai: data.is_ai
      }
      this.openView('form')
      this.$refs.field.focus()
    },

    removeDraft(id) {
      this._draft.deleteDraft(id)
    },

    async deleteAllDrafts() {
      this._draft.deleteAll()
    },

    // ─── Поле ввода ───────────────────────────────────────
    
    field_onInput(e) {
      if (this.$refs.field.innerHTML == "<br>") {
        this.$refs.field.innerText = ''
      }
      this.form.text = this.$refs.field.innerText
      
      // Сохраняем при каждом нажатии
      this._draft.autoSave(this.form)
    },
    field_onKeyup(e) {
      
    },
    field_onKeydown(e) {
      if (!e.metaKey && !e.ctrlKey && !e.shiftKey) {
        switch(e.keyCode) {
          case 13: // Enter
            e.preventDefault()
            document.execCommand('insertHTML', false, '<br><br>')
            break;
        }
      }

      if ((e.metaKey || e.ctrlKey) && !e.shiftKey) {
        switch(e.keyCode) {
          case 13: // Enter
            e.preventDefault()
            this.sendForm()
          break;
        }
      }
    },
    field_onPaste(e) {
      let cData = (e.originalEvent || e).clipboardData,
      items = cData && cData.items || []

      // Загружаем картинки
      const files = []
      for (const item of items) {
        if (item.kind === 'file' && item.type.startsWith('image/')) {
          const file = item.getAsFile()
          if (file) files.push(file)
        }
      }

      if (files.length > 0)
        this.$refs.file.handleFileSelect({ target: { files: files } })

      // Копируем текстик
      let itemsText = cData.getData('text/plain')
      if (itemsText.length > 0) {
        document.execCommand('insertText', false, itemsText)
      }

      return cancelEvent(e)
    },
    // form events
    form_onDrop(e) {
      e.preventDefault()
      this.dragover = false
      this.$refs.file.handleFileSelect(e)
    },
    form_onDragEnter(e) {
      e.preventDefault()
      this.dragover = true
    },
    form_onDragLeave(e) {
      e.preventDefault()
      this.dragover = false
    },
    form_onDragOver(e) {
      e.preventDefault()
      this.dragover = true
    },

    detectLink() {
      if (this.debounceTimer) clearTimeout(this.debounceTimer)

      this.debounceTimer = setTimeout(async () => {
        const text = this.$refs.field.innerText
        const match = text.match(/(https?:\/\/[^\s]+)/)
        const url = match ? match[0] : null

        if (!url || url === this.currentUrl) return
        this.currentUrl = url
        this.form.link = null

        try {
          const { data } = await this.$api.get(`utils/linkpreview?url=${encodeURIComponent(url)}`)
          this.form.link = { ...data, url }
        } catch {}
      }, 600)
    },


    humanizeError(error) {
      return this.$filters.humanizeError(error)
    },
  },
  created() {
    this._draft = useDraft(this, { mode: this.mode })
  },
  mounted() {
    this.$field.focus()

    if (this.data) {
      this.$refs.field.innerHTML = this.data.content.text
      this.user = this.data.user
      this.form = {
        text: this.$refs.field.innerText,
        files: this.data.files ? this.data.files.flatMap(i => i.file) : [],
        link: this.data.link,
        is_comments_enabled: this.data.state.is_comments_enabled,
        is_hidden_from_feed: this.data.state.is_hidden_from_feed,
        is_nsfw: this.data.state.is_nsfw,
        is_ai: this.data.state.is_ai
      }
    } else {
      // Режим создания — восстанавливаем локальный черновик
      const local = this._draft.loadLocal()
      if (local) {
        this.$refs.field.innerHTML = (local.text ?? '').replace(/\n/g, '<br>')
        this.form = { ...this.form, ...local }
      }
    }

    this.$nextTick(_ => {
      if (this.draggedFiles.length > 0) {
        this.$refs.file.handleFileSelect({ target: { files: this.draggedFiles }})
      }
    })
  },
  beforeUnmount() {
    // Отменяем pending автосохранение
    this._draft.autoSave.cancel()

    // Сохраняем локально
    this._draft.saveLocal(this.form)

    // Очищаем стор черновиков
    this.$store.dispatch('drafts/clear')
  }
}
</script>

<style lang="scss">
.compose {
  --compose--background-dragover: #f5f5f5;
  --compose--border-dragover: var(--x-color-pink--tint10);

  html[data-theme='black'] & {
    --compose--background-dragover: #151515;
    --compose--border-dragover: var(--x-color-pink--shade50);
  }
}

.compose {
  transition: background-color .1s linear, border-color .1s linear, box-shadow .1s linear;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &--dragover {
    background: var(--compose--background-dragover);
    border-style: dashed;
    border-color: var(--compose--border-dragover);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--modal--padding) var(--modal--padding) .75rem var(--modal--padding);
  }

  &__field {
    border: none;
    padding: 0 var(--modal--padding) var(--modal--padding);
    margin: 0;
    outline: 0;
    min-height: 10rem;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    font-size: 1.5rem;
    line-height: calc(1.4 * 1em);
    word-wrap: break-word;
    -webkit-font-smoothing: subpixel-antialiased;
    display: block;

    &:empty::before {
      font-size: 1.4rem;
      line-height: calc(1.35 * 1em);
      content: attr(placeholder);
      display: block;
      opacity: .6;
      pointer-events: none;
      transition: opacity .3s;
    }
    &:empty:active::before,
    &:empty:focus::before {
      opacity: .3;
    }
  }

  &__attachments {
    padding: 0 var(--modal--padding);
  }

  &__actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
    padding: var(--modal--padding) var(--modal--padding);
  }
}
</style>