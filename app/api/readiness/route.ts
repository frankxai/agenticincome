import { NextResponse } from 'next/server'
import { getLaunchReadiness } from '@/lib/readiness'

export function GET() {
  const readiness = getLaunchReadiness()

  return NextResponse.json(readiness, {
    status: readiness.fullLaunchReady ? 200 : 503,
    headers: {
      'cache-control': 'no-store',
    },
  })
}
