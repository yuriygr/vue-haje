<template>
  <div :class="$formClass" v-on="$formEvents">

    <div v-if="data.user" class="comment-form__header">
      <user-item :data="data.user" :clickable="false" :showSubscribeAction="false" mode="small" />
    </div>

    <div class="comment-form__field"
      v-on="$fieldEvents"
      v-bind="$fieldBinds"
    ></div>

    <attachments-form class="comment-form__attachments"
      v-model="form.files"
      :allowedFormats="allowedFormats"
      :max-files="1"
      ref="file"
    />

    <div class="comment-form__actions">
      <buttons-group :withGap="true">
        <n-button size="s" icon_before="image-line" @click="attachFiles" mode="tertiary" :title="$t('action.attach_image')" />
        <n-button size="s" icon_before="gif-line" :disabled="true" mode="tertiary" :title="$t('action.select_gif')" />
      </buttons-group>
      <buttons-group :withGap="true">
        <n-button size="s" v-if="data.comment_id" mode="tertiary" @click.exact="resetForm">{{ $t('action.cancel') }}</n-button>
        <n-button size="s" v-if="isReply" mode="tertiary" @click.exact="resetForm">{{ $t('action.cancel') }}</n-button>
        <n-button v-if="mode == 'add'"  size="s" :disabled="!canSubmit" :mode="!canSubmit ? 'tertiary' : 'primary'" @click.exact="sendForm">{{ $t('action.add_comment') }}</n-button>
        <n-button v-if="mode == 'edit'" size="s" :disabled="!canSubmit" :mode="!canSubmit ? 'tertiary' : 'primary'" @click.exact="sendForm">{{ $t('action.save_comment') }}</n-button>
      </buttons-group>
    </div>
  </div>
</template>

<script>
import { cancelEvent } from '@/app/services/utilities'
import AttachmentsForm from '@/components/attachments/form'
import { UserItem } from '@/components/user'

import { NButton, ButtonsGroup } from '@vue-norma/ui'

export default {
  name: 'comment-form',
  components: {
    NButton, ButtonsGroup, AttachmentsForm, UserItem
  },
  props: {
    mode: {
      type: String,
      default: 'add',
      validator(value) {
        return ['add', 'edit'].includes(value)
      }
    },
    entry: {
      type: String
    },
    data: {
      type: [ Object, Boolean ],
      default: false
    },
    parent_id: {
      type: [ Number ],
      default: 0
    }
  },
  emits: [ 'success', 'error', 'cancel' ],
  data() {
    return {
      hovered: false,
      dragover: false,
      loading: false,
      error: false,

      allowedFormats: ['image/gif', 'image/jpeg', 'image/jpg', 'image/png'],

      form: {
        text: '',
        files: [],
        link: false
      }
    }
  },
  computed: {
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
      return (this.form.text.trim() != '' || this.hasFiles) && !this.loading
    },
    hasFiles() {
      return this.form.files.length != 0
    },
    isReply() {
      return this.parent_id != 0
    }
  },
  methods: {
    sendForm() {
      return this.mode == 'add' ? this.addComment() : this.updateComment()
    },

    addComment() {
      if (!this.canSubmit) return

      this.loading = true
      this.error = false

      this.$api.postJSON(`entry/${this.entry}/comments`, { ...this.form, parent_id: this.parent_id })
      .then(result => {
        this.$emit('success', result)
        this.resetForm()
      })
      .catch(error => {
        this.$emit('error', error)
      })
      .then(_ => this.loading = false)
    },
    updateComment() {
      if (!this.canSubmit) return

      this.loading = true
      this.error = false

      this.$api.postJSON(`comment/${this.data.comment_id}`, this.form)
      .then(result => {
        this.$emit('success', result)
        this.resetForm()
      })
      .catch(error => {
        this.$emit('error', error)
      })
      .then(_ => this.loading = false)
    },
    resetForm() {
      // TODO
      this.$emit('cancel')
      
      this.form.files = []
      this.form.text = ""

      this.$refs.field.innerText = ""
      this.$refs.file.reset()
    },

    attachFiles() {
      this.$refs.file.attachFiles()
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
    form_onMouseOver(e) {
      this.hovered = true
    },
    form_onMouseLeave(e) {
      this.hovered = false
    },
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
    if (this.data) {
      this.$refs.field.innerHTML = this.data.content.text
      this.form = {
        text: this.$refs.field.innerText,
        files: this.data.files ? this.data.files.flatMap(i => i.file) : []
      }
    }
  },
  beforeUnmount() {

  }
}
</script>

<style lang="scss">
.comment-form {
  --comment-form--padding: 1rem;
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

  &--hovered:not(&--dragover) {
    background: var(--comment-form--background-hovered);
    border: var(--comment-form--border-hovered);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--comment-form--padding) var(--comment-form--padding) .75rem var(--comment-form--padding);
  }

  &__field {
    border: none;
    padding: var(--comment-form--padding);
    margin: 0;
    outline: 0;
    min-height: 5rem;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    font-size: 1.5rem;
    line-height: calc(1.4 * 1em);
    word-wrap: break-word;
    -webkit-font-smoothing: subpixel-antialiased;
    display: block;
    cursor: text;

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

  &__header + &__field {
    padding-top: 0;
  }

  &__attachments {
    padding: 0 var(--comment-form--padding);
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