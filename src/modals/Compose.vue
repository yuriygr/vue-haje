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
          <n-button icon_before="settings-line" @click="toggleOptions" mode="tertiary" ref="options" :title="$t('action.options')" />
          <n-button icon_before="gif-line" @click="openView('gifs')" mode="tertiary" :title="$t('action.select_gif')" />
          <n-button icon_before="image-line" @click="attachFiles" mode="tertiary" :title="$t('action.attach_image')" />
          <n-button v-if="mode == 'add'" :disabled="!canSubmit" @click="addEntry">{{ $t('action.create_entry') }}</n-button>
          <n-button v-if="mode == 'edit'" :disabled="!canSubmit" @click="updateEntry">{{ $t('action.save_entry') }}</n-button>
        </buttons-group>
      </div>
    </div>

    <div v-show="currentView == 'drafts'">
      <modal-header :title="$t('modals.compose.drafts')">
        <template #before>
          <n-button icon_before="angle-left-line" mode="tertiary" @click.exact="openView('form')" :title="$t('action.back')" />
        </template>
        <template #after>
          <n-button icon_before="delete-bin-line" mode="tertiary" @click.exact="deleteAllDrafts" :title="$t('modals.compose.action.delete_drafts')" />
        </template>
      </modal-header>

      <placeholder
        :icon="$t('errors.todo.icon')"
        :header="$t('errors.todo.title')"
        :text="$t('errors.todo.description')"
      />
    </div>

    <div v-show="currentView == 'gifs'">
      <modal-header :title="$t('modals.compose.gifs')">
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
  </modal>
</template>

<script>
import { mapState } from 'vuex'
import { cancelEvent } from '@/app/services/utilities'
import AttachmentsForm from '@/components/attachments/form'
import { UserItem } from '@/components/user'

import { Modal, ModalHeader, NButton, ButtonsGroup, Placeholder } from '@vue-norma/ui'

export default {
  name: 'compose-modal',
  components: {
    UserItem,
    Modal, ModalHeader, NButton, ButtonsGroup, AttachmentsForm, Placeholder
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

      allowedFormats: ['image/gif', 'image/jpeg', 'image/jpg', 'image/png'],

      user: false,

      form: {
        text: '',
        files: [],
        link: false,
        is_comments_enabled: true,
        is_hidden_from_feed: false
      },

      currentView: 'form',
      availableViews: [ 'form', 'drafts', 'gifs' ]
    }
  },
  computed: {
    ...mapState('auth', {
      'session_data': state => state.data
    }),
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
    optionsItems() {
      let _comments = [
        this.form.is_comments_enabled ?
        {
          icon: 'comments-line',
          label: this.$t('entry.pseudo-form.comments-on'),
          action: this.toggleState('is_comments_enabled')
        } : {
          icon: 'comments-off-line',
          label: this.$t('entry.pseudo-form.comments-off'),
          action: this.toggleState('is_comments_enabled')
        }
      ]

      let _hidde_from_feed = [
        this.form.is_hidden_from_feed ?
        {
          icon: 'eye-off-line',
          label: this.$t('entry.pseudo-form.hidden_from_feed-on'),
          action: this.toggleState('is_hidden_from_feed')
        } : {
          icon: 'eye-line',
          label: this.$t('entry.pseudo-form.hidden_from_feed-off'),
          action: this.toggleState('is_hidden_from_feed')
        }
      ]

      return [
        ..._comments,
        ..._hidde_from_feed
      ]
    },
    // Выбираем какого пользователя выводить как автора
    entryUser() {
      return this.user || this.session_data.user
    }
  },
  methods: {
    openView(view) {
      this.currentView = this.availableViews.includes(view) 
                        ? view 
                        : this.availableViews[0] ?? 'form'
    },
    closeModal() {
      if (this.canSubmit) {
        confirm(this.$t('action.confirm')) && this.$modals.close()
        return
      }
      this.$modals.close()
    },

    sendForm() {
      return this.mode == 'add' ? this.addEntry() : this.updateEntry()
    },

    addEntry() {
      if (!this.canSubmit) return

      this.loading = true
      this.error = false

      this.$api.postJSON('entry', this.form)
      .then(result => {
        this.$modals.close()
        this.$router.push({ name: 'entry', params: { uuid: result.payload } })
      })
      .catch(error => {
        this.error = error
        this.$alerts.danger({ text: this.$t(`alerts.${error.status}`) })
      })
      .then(_ => this.loading = false)
    },
    updateEntry() {
      if (!this.canSubmit) return

      this.loading = true
      this.error = false

      this.$api.postJSON('entry/' + this.data.uuid, this.form)
      .then(result => {
        this.$modals.close()
        this.$router.push({ name: 'entry', params: { uuid: result.payload } })
      })
      .catch(error => {
        this.error = error
        this.$alerts.danger({ text: this.$t(`alerts.${error.status}`) })
      })
      .then(_ => this.loading = false)
    },
    toggleOptions(e) {
      let target = typeof e == "object" ? e.currentTarget : this.$refs.options.$el
      this.$popover.open({
        items: this.optionsItems,
        target: target,
        align: 'right'
      })
    },
    toggleState(key) {
      return () => {
        this.form[key] = !this.form[key]
        this.$popover.close()
      }
    },

    attachFiles() {
      this.$refs.file.attachFiles()
    },

    deleteAllDrafts() {
      this.$api.delete('my/drafts')
      .then(result => {
        this.$alerts.success({ text: this.$t(`alerts.${result.status}`) })
      })
      .catch(error => {
        this.$alerts.danger({ text: this.$t(`alerts.${error.status}`) })
      })
    },

    // Field
    
    field_onInput(e) {
      if (this.$refs.field.innerHTML == "<br>") {
        this.$refs.field.innerText = ''
      }
      this.form.text = this.$refs.field.innerText
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
    }
  },
  mounted() {
    this.$field.focus()

    if (this.data) {
      this.$refs.field.innerHTML = this.data.content.text
      this.user = this.data.user
      this.form = {
        text: this.$refs.field.innerText,
        is_comments_enabled: this.data.state.is_comments_enabled,
        is_hidden_from_feed: this.data.state.is_hidden_from_feed,
        files: this.data.files ? this.data.files.flatMap(i => i.file) : []
      }
    }

    this.$nextTick(_ => {
      if (this.draggedFiles.length > 0) {
        this.$refs.file.handleFileSelect({ target: { files: this.draggedFiles }})
      }
    })
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