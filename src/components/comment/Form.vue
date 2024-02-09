<template>
  <div class="comment-form">
    <div
      ref="field"
      class="comment-form__field"

      v-on="$fieldEvents"
      v-bind="$fieldBinds"
    ></div>

    <div class="comment-form__actions">
      <buttons-group :withGap="true">
        <icon-button name="file-image-line" mode="tertiary" :disabled="true" :title="$t('comment.form.action.attach_image')" />
      </buttons-group>
      <buttons-group :withGap="true">
        <n-button :disabled="!canSubmit" @click.exact="submitForm">{{ $t('action.create_entry') }}</n-button>
      </buttons-group>
    </div>
  </div>
</template>

<script>
import { cancelEvent } from '@/app/services/utilities'

import { NButton, ButtonsGroup, IconButton } from '@vue-norma/ui'

export default {
  name: 'comment-form',
  components: {
    NButton, ButtonsGroup, IconButton
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
      loading: false,
      error: false,

      form: {
        parent_id: 0,
        root_id: 0,
        text: ''
      },
      attachedFiles: []
    }
  },
  computed: {
    $field() {
      return this.$refs.field
    },
    $fieldBinds() {
      return {
        tabindex: 1,
        placeholder: this.$t('comment.form.placeholder'),
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
        dragenter: this.field_onDragEnter,
        dragover:  this.field_onDragOver
      }
    },

    canSubmit() {
      return this.form.text != '' || this.hasFiles || this.loading
    },
    hasFiles() {
      return this.attachedFiles.length != 0
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
      this.form.text = ""
      this.$refs.field.innerText = ""
      this.attachedFiles = []
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
      document.execCommand('insertText', false, (e.originalEvent || e).clipboardData.getData('text/plain'))
      return cancelEvent(e)
    },
    field_onDragEnter(e) {
      return cancelEvent(e)
    },
    field_onDragOver(e) {
      return cancelEvent(e)
    }
  },
  mounted() {}
}
</script>

<style lang="scss">
.comment-form {
  --comment-form--background: #f7f7f7;
  --comment-form--border-color: #f1f1f1;

  html[data-theme='black'] & {
    --comment-form--background: #181818;
    --comment-form--border-color: #222;
  }
}

.comment-form {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--comment-form--background);
  border-radius: 8px;
  border: 1px solid var(--comment-form--border-color, #f1f1f1);

  &__field {
    border: none;
    padding: 1rem 1.5rem;
    margin: 0;
    outline: 0;
    min-height: 4rem;
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
    padding: 1rem;
  }
}
</style>