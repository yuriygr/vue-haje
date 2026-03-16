import { createItemModule } from '@/app/components/store/factory'

export default {
  ...createItemModule(uuid => `help/${uuid}`)
}