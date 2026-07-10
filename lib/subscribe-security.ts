import { randomUUID } from 'node:crypto'

export function createSubscribeRequestId() {
  return randomUUID().toUpperCase()
}
