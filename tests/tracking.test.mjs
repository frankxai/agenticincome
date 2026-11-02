import test from 'node:test'
import assert from 'node:assert'
import { isTrackingParam, appendTrackingParams, appendTrackingParamsToPath } from '../lib/tracking.ts'

test('isTrackingParam identifies tracking parameters', () => {
  assert.strictEqual(isTrackingParam('utm_source'), true)
  assert.strictEqual(isTrackingParam('utm_campaign'), true)
  assert.strictEqual(isTrackingParam('ref'), true)
  assert.strictEqual(isTrackingParam('src'), true)
  assert.strictEqual(isTrackingParam('source'), true)
  assert.strictEqual(isTrackingParam('campaign'), true)
  assert.strictEqual(isTrackingParam('gclid'), true)
  assert.strictEqual(isTrackingParam('fbclid'), true)
  assert.strictEqual(isTrackingParam('msclkid'), true)

  assert.strictEqual(isTrackingParam('other'), false)
  assert.strictEqual(isTrackingParam('page'), false)
  assert.strictEqual(isTrackingParam(''), false)
})

test('appendTrackingParams adds tracking parameters to a URL object', () => {
  const url = new URL('https://example.com/path')
  const sourceParams = new URLSearchParams('utm_source=twitter&other=skip&ref=homepage')

  const result = appendTrackingParams(url, sourceParams)

  assert.strictEqual(result.toString(), 'https://example.com/path?utm_source=twitter&ref=homepage')
  assert.strictEqual(result, url, 'The function modifies the URL object in-place and returns it')
})

test('appendTrackingParams does not override existing parameters', () => {
  const url = new URL('https://example.com/path?utm_source=existing')
  const sourceParams = new URLSearchParams('utm_source=new&ref=homepage')

  const result = appendTrackingParams(url, sourceParams)

  assert.strictEqual(result.toString(), 'https://example.com/path?utm_source=existing&ref=homepage')
})

test('appendTrackingParams ignores missing values', () => {
  const url = new URL('https://example.com/path')
  const sourceParams = new URLSearchParams('utm_source=&ref=homepage')

  const result = appendTrackingParams(url, sourceParams)

  assert.strictEqual(result.toString(), 'https://example.com/path?ref=homepage')
})

test('appendTrackingParamsToPath adds tracking parameters to a path string', () => {
  const sourceParams = new URLSearchParams('utm_source=twitter&other=skip&ref=homepage')

  const result = appendTrackingParamsToPath('/path', sourceParams)

  assert.strictEqual(result, '/path?utm_source=twitter&ref=homepage')
})

test('appendTrackingParamsToPath merges with existing query parameters', () => {
  const sourceParams = new URLSearchParams('utm_source=twitter&ref=homepage')

  const result = appendTrackingParamsToPath('/path?existing=val', sourceParams)

  assert.strictEqual(result, '/path?existing=val&utm_source=twitter&ref=homepage')
})

test('appendTrackingParamsToPath does not override existing tracking parameters', () => {
  const sourceParams = new URLSearchParams('utm_source=new&ref=homepage')

  const result = appendTrackingParamsToPath('/path?utm_source=existing', sourceParams)

  assert.strictEqual(result, '/path?utm_source=existing&ref=homepage')
})

test('appendTrackingParamsToPath handles hash fragments correctly', () => {
  const sourceParams = new URLSearchParams('utm_source=twitter&ref=homepage')

  const result = appendTrackingParamsToPath('/path#fragment', sourceParams)
  assert.strictEqual(result, '/path?utm_source=twitter&ref=homepage#fragment')

  const resultWithQuery = appendTrackingParamsToPath('/path?existing=val#fragment', sourceParams)
  assert.strictEqual(resultWithQuery, '/path?existing=val&utm_source=twitter&ref=homepage#fragment')
})

test('appendTrackingParamsToPath ignores empty tracking values', () => {
  const sourceParams = new URLSearchParams('utm_source=&ref=homepage')

  const result = appendTrackingParamsToPath('/path', sourceParams)

  assert.strictEqual(result, '/path?ref=homepage')
})
