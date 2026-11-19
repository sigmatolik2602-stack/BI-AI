import {readFileSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {defineConfig} from 'vite'
import tailwindcss from '@tailwindcss/vite'

function offlineShell() {
  return {
    name: 'bi-ai-offline-shell',
    apply: 'build',
    generateBundle(_options, bundle) {
      const files = ['/icon.svg', '/icon-192.png', '/icon-512.png', '/kaa.svg', '/manifest.webmanifest']
      const assets = Object.keys(bundle).filter(file => file.startsWith('assets/')).sort()
      const version = createHash('sha256').update(assets.join('\n'))
      for (const file of files) version.update(readFileSync(new URL('./public' + file, import.meta.url)))
      const template = readFileSync(new URL('./src/sw.js', import.meta.url), 'utf8')
      this.emitFile({
        type: 'asset', fileName: 'sw.js',
        source: template.replace('__VERSION__', version.digest('hex').slice(0, 12)).replace('__ASSETS__', JSON.stringify([...assets.map(file => '/' + file), ...files])),
      })
    },
  }
}

export default defineConfig({
  plugins: [tailwindcss(), offlineShell()],
  build: {
    rolldownOptions: {
      onLog(level, log, handler) {
        if (log.code === 'MODULE_LEVEL_DIRECTIVE' && log.message.includes('"use client"') && log.id?.includes('node_modules')) return
        handler(level, log)
      },
    },
  },
})
