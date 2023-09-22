import './style.scss'
import 'uno.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { ROOT_CLASS } from '../config/constant.config'
import Content from './Content.vue'

async function launch() {
  const container = document.createElement('section')
  container.className = ROOT_CLASS
  document.body.prepend(container)
  const pinia = createPinia()

  const app = createApp(Content)
  app.use(pinia)
  app.mount(container)
}

setTimeout(() => {
  launch()
}, 150)
