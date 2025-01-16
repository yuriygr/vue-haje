<template>
  <div :class="elClass">
    <branches :count="level - 1" key="comment-form" />
    <div :class="$formClass" v-on="$formEvents">
      <div class="comment-form__field"
        v-on="$fieldEvents"
        v-bind="$fieldBinds"
      ></div>

      <div class="comment-form__actions">
        <buttons-group :withGap="true">
          <n-button icon_before="add-image-line" @click="attachFiles" mode="tertiary" :title="$t('action.attach_image')" />
        </buttons-group>
        <buttons-group :withGap="true">
          <n-button v-if="isReply" mode="tertiary" @click.exact="resetForm">{{ $t('action.cancel') }}</n-button>
          <n-button :disabled="!canSubmit" :mode="!canSubmit ? 'tertiary' : 'primary'" @click.exact="submitForm">{{ $t('action.create_entry') }}</n-button>
        </buttons-group>
      </div>
      <input type="file" ref="file" @change="_handleFilesAttach" :accept="acceptetFiles" multiple hidden>
    </div>
  </div>
</template>

<script>
import { cancelEvent } from '@/app/services/utilities'

import { NButton, ButtonsGroup } from '@vue-norma/ui'

export default {
  name: 'comment-form',
  components: {
    NButton, ButtonsGroup
  },
  props: {
    entry: {
      type: [ Object, Boolean ],
      default: false
    },
    entry: {
      type: String
    }
  },
  emits: [ 'success', 'error' ],
  data() {
    return {
      hovered: false,
      dragover: false,
      loading: false,
      error: false,

      acceptetFiles: ['image/gif', 'image/jpeg', 'image/jpg', 'image/png'],

      originalParentNode: false,
      level: 1,

      form: {
        parent_id: 0,
        root_id: 0,
        text: ''
      },
      attachedFiles: []
    }
  },
  computed: {
    elClass() {
      return [
        'comment-form-wrapper',
        `comment-form-wrapper--level-${this.level}`
      ]
    },
    $formClass() {
      return [
        'comment-form',
        { 'comment-form--hovered': this.hovered },
        { 'comment-form--dragover': this.dragover },
      ]
    },
    $formEvents() {
      return {
        mouseover:  this.form_onMouseOver,
        mouseleave: this.form_onMouseLeave,
        drop:       this.form_onDrop,
        dragenter:  this.form_onDragEnter,
        dragleave:  this.form_onDragLeave,
        dragover:   this.form_onDragOver
      }
    },
    $field() {
      return this.$refs.field
    },
    $fieldBinds() {
      return {
        ref: 'field',
        tabindex: 1,
        placeholder: this.$t('comment.form.placeholder'),
        contenteditable: true,
        dir: 'auto'
      }
    },
    $fieldEvents() {
      return {
        input:   this.field_onInput,
        keyup:   this.field_onKeyup,
        keydown: this.field_onKeydown,
        paste:   this.field_onPaste
      }
    },

    canSubmit() {
      return (this.form.text != '' || this.hasFiles) && !this.loading
    },
    hasFiles() {
      return this.attachedFiles.length != 0
    },
    isReply() {
      return this.form.parent_id != 0
    }
  },
  methods: {
    submitForm() {
      if (!this.canSubmit) return

      this.loading = true
      this.error = false

      this.$api.post(`entry/${this.entry}/comments`, this.form)
      .then(result => {
        this.resetForm()
        this.$emit('success', result)
      })
      .catch(error => {
        this.$emit('error', error)
      })
      .then(_ => this.loading = false)
    },
    resetForm() {
      if (this.originalParentNode) {
        this.originalParentNode.insertBefore(this.$el, this.originalParentNode.firstChild)
      }
      
      this.level = 1
      this.form.text = ""
      this.form.parent_id = 0
      this.$refs.field.innerText = ""
      this.attachedFiles = []
    },
    attachFiles() {
      this.$refs.file.value = ''
      this.$refs.file.click()
    },

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
            this.submitForm()
          break;
        }
      }
    },
    field_onPaste(e) {
      let cData = (e.originalEvent || e).clipboardData
      
      // Загружаем файлики
      let items = cData && cData.items || []
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          this._processFilesUpload([item.getAsFile()])
        }
      }

      // Копируем текстик
      let itemsText = cData.getData('text/plain')
      if (itemsText.length > 0) {
        document.execCommand('insertText', false, itemsText)
      }

      return cancelEvent(e)
    },
    // form events
    form_onMouseOver(e) {
      this.hovered = true
    },
    form_onMouseLeave(e) {
      this.hovered = false
    },
    form_onDrop(e) {
      e.preventDefault()
      this.dragover = false
      this._handleFilesAttach(e)
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
    // Грузилки
    _handleFilesAttach(e) {
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) return

      this._processFilesUpload(files)
    },
    _processFilesUpload(filesList) {
      [...filesList]
        .filter(file => this.acceptetFiles.includes(file.type))
        .forEach(file => {
          console.log(file)
        })
    }
  },
  mounted() {
    this.$bus.on('comment-form.reply', (payload) => {
      if (!this.originalParentNode) {
        this.originalParentNode = this.$el.parentNode
      }

      let target_comment = document.getElementById(`comment-${payload.comment_id}`)
      target_comment.parentNode.insertBefore(this.$el, target_comment.nextSibling)

      this.level = payload.level
      this.form.parent_id = payload.comment_id
    })
  },
  unmounted() {
    this.$bus.off('comment-form.reply')
  }
}
</script>

<style lang="scss">
.comment-form-wrapper {
  &--level-1 { --level: 1 }
  &--level-2 { --level: 2 }
  &--level-3 { --level: 3 }
  &--level-4 { --level: 4 }
  &--level-5 { --level: 5 }

  --gap-branch: 2rem;
  --avatar-size: 18px;
}

.comment-form-wrapper {
  display: grid;
  grid-template-columns: auto 1fr;
}

.comment-form {
  --comment-form--background: #fff;
  --comment-form--border: 1px solid #f0f0f0;
  --comment-form--background-dragover: #f5f5f5;
  --comment-form--border-dragover: 1px dashed var(--x-color-pink--tint10);
  
  --comment-form--background-hovered: #fff;
  --comment-form--border-hovered: 1px solid #f0f0f0;

  html[data-theme='black'] & {
    --comment-form--background: #181818;
    --comment-form--border: 1px solid #1b1b1b;
    --comment-form--background-dragover: #151515;
    --comment-form--border-dragover: 1px dashed var(--x-color-pink--shade50);

    --comment-form--background-hovered: #181818;
    --comment-form--border-hovered: 1px solid #1f1f1f;
  }
}

.comment-form {
  display: flex;
  flex-direction: column;
  overflow: hidden;

  background: var(--comment-form--background);
  border: var(--comment-form--border);
  border-radius: 8px;
  transition: background-color .1s linear, border-color .1s linear, box-shadow .1s linear;
  box-shadow: var(--x-box-shadow--elevation-2);

  &--dragover {
    background: var(--comment-form--background-dragover);
    border: var(--comment-form--border-dragover);
  }

  &--hovered {
    background: var(--comment-form--background-hovered);
    border: var(--comment-form--border-hovered);
  }

  &__field {
    border: none;
    padding: 1rem 1.5rem;
    margin: 0;
    outline: 0;
    min-height: 5rem;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    font-size: 1.4rem;
    line-height: 1.4;
    word-wrap: break-word;
    -webkit-font-smoothing: subpixel-antialiased;
    display: inline-block;
    cursor: text;

    &:empty::before {
      font-size: 1.4rem;
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

  &__actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
    padding: .5rem;
  }
}
</style>