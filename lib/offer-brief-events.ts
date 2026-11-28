'use client'

import { trackClientEvent } from '@/lib/client-analytics'

export function trackOfferBrief(stage: 'generated' | 'exported' | 'error') {
  trackClientEvent(`offer_brief_${stage}`, { path: '/workbench/offer-brief' })
}
