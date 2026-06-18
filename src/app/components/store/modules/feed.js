import { createItemModule, createListedModule } from '@/app/components/store/factory'


let custom = {
  ...createItemModule(uuid => `feed/${uuid}`),
  modules: {
    entries: createListedModule(
      (rootState) => `feed/${rootState.feed.custom.data.uuid}/entries`
    ),
    tags: createListedModule(
      (rootState) => `feed/${rootState.feed.custom.data.uuid}/tags`
    )
  }
}

export default {
  namespaced: true,
  modules: { custom }
}