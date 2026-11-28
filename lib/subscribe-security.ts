import { randomUUID } from 'node:crypto'

export function createSubscribeRequestId() {
  return randomUUID().toUpperCase()
}

type SubscribeDestination =
  | { mode: 'webhook'; url: string }
  | { mode: 'manual_email'; email: string }
  | { mode: 'unwired' }

export function getSubscribeDestination(): SubscribeDestination {
  const webhook = process.env.SUBSCRIBE_WEBHOOK_URL
  if (webhook && URL.canParse(webhook)) {
    const url = new URL(webhook)
    if (url.protocol === 'https:' && !url.username && !url.password) {
      return { mode: 'webhook', url: url.href }
    }
  }

  const contact = process.env.ACCESS_REQUEST_EMAIL
  if (contact && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(contact)) {
    return { mode: 'manual_email', email: contact }
  }
  return { mode: 'unwired' }
}
