<template>
  <modal class="compose">
    <div v-if="session_data.user" class="compose__user">
      <user-item :data="session_data.user" :clickable="false" :showSubscribeAction="false" />
    </div>
    <div
      ref="field"
      class="compose__field"
      tabindex="1"
      :placeholder="$t('entry.pseudo-form.placeholder')"

      v-on="$fieldEvents"
      v-bind="$fieldBinds"
    ></div>

    <div class="compose__footer">
      <n-button mode="secondary" @click.exact="closeModal">{{ $t('action.cancel') }}</n-button>
      <buttons-group :withGap="true">
        <icon-button name="settings-line" mode="tertiary" :disabled="true" :title="$t('action.options')" />
        <n-button :disabled="!canSubmit" @click.exact="submit">{{ $t('action.create_entry') }}</n-button>
      </buttons-group>
    </div>
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
  data() {
    return {
      loading: false,
      error: false,

      form: {
        text: ''
      },
      attachedFiles: []
    }
  },
  computed: {
    ...mapState('auth', {
      'session_data': state => state.data
    }),
    $field() {
      return this.$refs.field
    },
    $fieldBinds() {
      return {
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
    closeModal() {
      this.$modals.close()
    },

    submit() {
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
      })
      .then(_ => this.loading = false)
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
    field_onDragEnter(e) {
      return cancelEvent(e)
    },
    field_onDragOver(e) {
      return cancelEvent(e)
    }
  },
  mounted() {
    this.$field.focus()
  }
}
</script>

<style lang="scss" scoped>
.compose {
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &__user {
    padding: var(--modal-padding) var(--modal-padding);
  }

  &__field {
    border: none;
    padding: var(--modal-padding) var(--modal-padding);
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
      font-size: 1.5rem;
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

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
    padding: var(--modal-padding) var(--modal-padding);
  }
}
</style>