const TRACKING_PARAM_NAMES = new Set([
  'ref',
  'src',
  'source',
  'campaign',
  'gclid',
  'fbclid',
  'msclkid',
])

function isTrackingParam(name: string) {
  return name.startsWith('utm_') || TRACKING_PARAM_NAMES.has(name)
}

export function appendTrackingParams(url: URL, source: URLSearchParams) {
  source.forEach((value, key) => {
    if (isTrackingParam(key) && value && !url.searchParams.has(key)) {
      url.searchParams.set(key, value)
    }
  })

  return url
}

export function appendTrackingParamsToPath(href: string, source: URLSearchParams) {
  const hashIndex = href.indexOf('#')
  const withoutHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : ''
  const queryIndex = withoutHash.indexOf('?')
  const pathname = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash
  const query = queryIndex >= 0 ? withoutHash.slice(queryIndex + 1) : ''
  const params = new URLSearchParams(query)

  source.forEach((value, key) => {
    if (isTrackingParam(key) && value && !params.has(key)) {
      params.set(key, value)
    }
  })

  const nextQuery = params.toString()
  return `${pathname}${nextQuery ? `?${nextQuery}` : ''}${hash}`
}
