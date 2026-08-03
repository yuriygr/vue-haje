import { createListStore, extendStore } from '@/app/store/factory'
import { computed } from 'vue'

const useBase = createListStore(
  'entry_comments',
  (uuid) => `entry/${uuid}/comments`,
  { last_id: 0 }
)

export const useEntryCommentsStore = extendStore(useBase, (store) => ({
  async more(uuid) {
    const last_id = store.data.reduce((max, item) => 
      item.comment_id > max ? item.comment_id : max, 0
    )
    store.setFilters({ last_id })
    await store.fetch(uuid, false)
  },

  add(comment) {
    store.data.push(comment)
  },

  updateComment(comment_id, value) {
    const index = store.data.findIndex(item => item.comment_id === comment_id)
    if (index !== -1) {
      store.data[index] = value
    }
  },

  updateUserState(user_id, patch) {
    store.data.forEach((item, index) => {
      if (item.user_id === user_id) {
        store.data[index] = { ...item, user: { ...item.user, state: { ...item.user.state, ...patch } } }
      }
    })
  },

  tree: computed(() => {
    const map = Object.create(null)
    const roots = []

    for (const item of store.data) {
      map[item.comment_id] = { ...item, replies: [] }
    }

    for (const item of store.data) {
      if (item.parent_id && map[item.parent_id]) {
        map[item.parent_id].replies.push(map[item.comment_id])
      } else {
        roots.push(map[item.comment_id])
      }
    }

    return roots
  })
}))