<template>
  <modal :class="$formClass" v-on="$formEvents">
    <div v-if="session_data.user" class="compose__user">
      <user-item :data="session_data.user" :clickable="false" :showSubscribeAction="false" />
    </div>
    <div class="compose__field"
      v-on="$fieldEvents"
      v-bind="$fieldBinds"
    ></div>

    <div class="compose__actions">
      <n-button mode="secondary" @click.exact="closeModal">{{ $t('action.cancel') }}</n-button>
      <buttons-group :withGap="true">
        <icon-button @click="toggleOptions" name="settings-line" mode="tertiary" ref="options" :title="$t('action.options')" />
        <icon-button @click="attachFiles" name="add-image-line" mode="tertiary" :title="$t('action.attach_image')" />
        <n-button v-if="mode == 'add'" :disabled="!canSubmit" @click="addEntry">{{ $t('action.create_entry') }}</n-button>
        <n-button v-if="mode == 'edit'" :disabled="!canSubmit" @click="updateEntry">{{ $t('action.save_entry') }}</n-button>
      </buttons-group>
    </div>
    <input type="file" ref="file" @change="_handleFilesAttach" :accept="acceptetFiles" multiple hidden>
  </modal>
</template>

<script>
import { cancelEvent } from '@/app/services/utilities'
import { UserItem } from '@/components/user'
import { mapState } from 'vuex'

import { Modal, NButton, IconButton, ButtonsGroup } from '@vue-norma/ui'

export default {
  name: 'compose-modal',
  components: {
    UserItem,
    Modal, NButton, IconButton, ButtonsGroup
  },
  props: {
    data: {
      type: [ Object, Boolean ],
      default: false
    },
    mode: {
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      dragover: false,
      loading: false,
      error: false,

      acceptetFiles: ['image/gif', 'image/jpeg', 'image/jpg', 'image/png'],

      form: {
        text: '',
        is_comments_enabled: true
      },
      attachedFiles: []
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
      return (this.form.text != '' || this.hasFiles) && !this.loading
    },
    hasFiles() {
      return this.attachedFiles.length != 0
    },
    optionsItems() {
      let _comments = [
        this.form.is_comments_enabled ?
        {
          icon: 'comments-line',
          label: this.$t('entry.pseudo-form.comments-on'),
          action: this.toggleCommentsState
        } : {
          icon: 'comments-off-line',
          label: this.$t('entry.pseudo-form.comments-off'),
          action: this.toggleCommentsState
        }
      ]
      return [
        ..._comments
      ]
    },
  },
  methods: {
    closeModal() {
      this.$modals.close()
    },

    addEntry() {
      if (!this.canSubmit) return

      this.loading = true
      this.error = false

      this.$api.post('entry', this.form)
      .then(result => {
        this.closeModal()
        this.$router.push({ name: 'entry', params: { uuid: result.payload } })
      })
      .catch(error => {
        this.error = error
        this.$alerts.danger({ text: error.status })
      })
      .then(_ => this.loading = false)
    },
    updateEntry() {
      if (!this.canSubmit) return

      this.loading = true
      this.error = false

      this.$api.post('entry/' + this.data.uuid, this.form)
      .then(result => {
        this.closeModal()
        this.$router.push({ name: 'entry', params: { uuid: result.payload } })
      })
      .catch(error => {
        this.error = error
        this.$alerts.danger({ text: error.status })
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
    toggleCommentsState() {
      this.form.is_comments_enabled = !this.form.is_comments_enabled
      this.$popover.close()
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
            //this.sendPost()
          break;
        }
      }
    },
    field_onPaste(e) {
      document.execCommand('insertText', false, (e.originalEvent || e).clipboardData.getData('text/plain'))
      return cancelEvent(e)
    },
    // form events
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
    this.$field.focus()

    if (this.data) {
      this.$refs.field.innerText = this.data.content.text
      this.form = {
        text: this.data.content.text
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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

  &__user {
    padding: var(--modal--padding) var(--modal--padding);
  }

  &__field {
    border: none;
    padding: 0 var(--modal--padding) var(--modal--padding);
    margin: 0;
    outline: 0;
    min-height: 9rem;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    font-size: 1.5rem;
    line-height: 1.4;
    word-wrap: break-word;
    -webkit-font-smoothing: subpixel-antialiased;
    display: inline-block;

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
    padding: var(--modal--padding) var(--modal--padding);
  }
}
</style>