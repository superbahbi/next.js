import { createNext, FileRef } from 'e2e-utils'
import { NextInstance } from 'test/lib/next-modes/base'
import { renderViaHTTP } from 'next-test-utils'
import webdriver from 'next-webdriver'
import path from 'path'

describe('app-dir alias handling', () => {
  if ((global as any).isNextDeploy) {
    it('should skip next deploy for now', () => {})
    return
  }

  let next: NextInstance

  beforeAll(async () => {
    next = await createNext({
      files: new FileRef(path.join(__dirname, 'app-alias')),
      dependencies: {
        react: 'latest',
        'react-dom': 'latest',
        typescript: 'latest',
        '@types/react': 'latest',
        '@types/node': 'latest',
      },
    })
  })
  afterAll(() => next.destroy())

  it('should handle typescript paths alias correctly', async () => {
    const html = await renderViaHTTP(next.url, '/button')
    expect(html).toContain('click</button>')
  })

  it('should resolve css imports from outside with src folder presented', async () => {
    const browser = await webdriver(next.url, '/button')
    const fontSize = await browser
      .elementByCss('button')
      .getComputedCss('font-size')
    expect(fontSize).toBe('50px')
  })
})
