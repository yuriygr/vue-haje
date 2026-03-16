import { createItemModule, createListedModule } from '@/app/components/store/factory'

export default {
  ...createItemModule(slug => `tag/${slug}`),
  modules: {
    entries: createListedModule(
      (rootState) => `tag/${rootState.tag.data.slug}/entries`
    )
  }
}