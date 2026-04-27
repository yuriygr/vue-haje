import { createItemStore, createListStore } from '@/app/components/stores/factory'

export const useSupportTicketStore = createItemStore(`support_ticket`,
  (slug) => `support/${slug}`
)

export const useSupportTicketsStore = createListStore('support_tickets',
  `support`,
  { offset: 0 }
)