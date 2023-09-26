import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import webExtension, { readJsonFile } from 'vite-plugin-web-extension'
import AutoImport from 'unplugin-auto-import/vite'
// import Icons from "unplugin-icons/vite";
import UnoCSS from 'unocss/vite'
import { presetUno } from 'unocss'
import presetIcons from '@unocss/preset-icons'
import Components from 'unplugin-vue-components/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'

const manifest = readJsonFile('src/manifest.json')
const pkg = readJsonFile('package.json')
// import IconsResolver from 'unplugin-icons/resolver'

function generateManifest() {
  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    ...manifest,
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    charset: 'ascii',
  },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [
    vue(),
    webExtension({
      manifest: generateManifest,
      watchFilePaths: ['package.json', 'manifest.json'],
    }),
    AutoImport({
      imports: ['vue'],
      dts: 'src/@types/auto-imports.d.ts',
      resolvers: [ArcoResolver()],
    }),
    UnoCSS({
      presets: [
        presetUno(),
        presetIcons({
          /* options */
        }),
      ],
    }),
    Components({
      resolvers: [ArcoResolver()],
      dts: 'src/@types/components.d.ts',
    }),
  ],
})
