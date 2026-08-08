import mitt from 'mitt'
import type { Emitter } from 'mitt'

type BusEvents = Record<string, unknown>
type Bus = Emitter<BusEvents> & Record<string, any>

const instance: { value: Bus | null } = { value: null }

function createBus(methods: Record<string, any> = {}): Bus {
  const bus = mitt<BusEvents>() as Bus
  Object.assign(bus, methods)
  return bus
}

export function useBus(): Bus {
  if (!instance.value) {
    throw new Error('useBus: instance not initialized. Call initBus() first.')
  }
  return instance.value
}

// Вызывается один раз в main.ts / плагине
export function initBus(methods: Record<string, any> = {}): Bus {
  instance.value = createBus(methods)
  return instance.value
}