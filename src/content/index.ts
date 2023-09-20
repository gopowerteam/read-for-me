import "./style.scss";
import 'uno.css'

import { ROOT_CLASS } from "../config/constant.config";
import { createApp } from "vue";
import Content from "./Content.vue";
import {createPinia} from 'pinia'

async function launch() {
  const container = document.createElement("section");
  container.className = ROOT_CLASS;
  document.body.prepend(container);
  const pinia = createPinia()

  const app = createApp(Content);
  app.use(pinia)
  app.mount(container)
}

launch();
