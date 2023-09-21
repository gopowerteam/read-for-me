<template>
  <div class="container bg-yellow" :class="{ collapsed: store.collapsed }">
    <div class="collapsed-btn" @click="store.toggleCollapsed">
      <span class="i-icon-park-outline:right"></span>
    </div>
    <div
      class="chat-container absolute inset-0 flex flex-col"
      v-if="openai?.key"
    >
      <div class="chat-header">
        <ChatHeader></ChatHeader>
      </div>
      <div id="chat-list" class="chat-list flex-auto overflow-auto">
        <ChatList></ChatList>
      </div>
      <div class="chat-input">
        <ChatInput></ChatInput>
      </div>
    </div>
    <div v-else class="flex flex-col justify-center items-center absolute inset-0">
      <AButton type="primary" @click="onOpenOptions">配置OPENAI API KEY</AButton>
      <div class="mt-5">
        <ALink @click="onReload">刷新</ALink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { extractFromHtml } from "@extractus/article-extractor";
import { useStore } from "../store";
import {
  ACTION_CREATE_RECORD,
  ACTION_SUMMARY_CONTENT,
  ACTION_TOGGER_DRAWER,
  EVENT_RESPONSE_MSG,
  STORAGE_OPENAI_API,
  ACTION_OPEN_OPTIONS
} from "../config/constant.config";
import ChatInput from "./components/chat-input.vue";
import ChatList from "./components/chat-list.vue";
import ChatHeader from "./components/chat-header.vue";
import { watchOnce } from "@vueuse/core";

const store = useStore();
const openai = ref();

function updateScroll() {
  var element = document.getElementById("chat-list");

  if (element) element.scrollTop = element.scrollHeight;
}

watchOnce(
  () => store.collapsed,
  () => {
    if (!store.collapsed) {
      generateSummary();
    }
  }
);
/**
 * Extract Html Content form body
 */
async function generateSummary() {
  // 获取文章内容
  const article = await extractFromHtml(document.documentElement.outerHTML);
  store.updateContent(article?.content || "");
  // 请求生成摘要
  const id = store.addRecord("", "AI");

  chrome.runtime.sendMessage({
    type: ACTION_SUMMARY_CONTENT,
    content: article?.content,
    id,
  });
}

function onMessage(
  request: any,
  sender: any,
  sendResponse: (response?: any) => void
) {
  switch (request.type) {
    case ACTION_TOGGER_DRAWER:
      store.toggleCollapsed();
      break;
    case EVENT_RESPONSE_MSG:
      store.updateRecord(request.id, request.content, request.state);
      updateScroll();
      break;
    case ACTION_CREATE_RECORD:
      const id = store.addRecord("", "AI");
      sendResponse(id);
      break;
  }
}

async function getOpenAISetting() {
  const storage = await chrome.storage.local.get();
  openai.value = storage[STORAGE_OPENAI_API];
}

function onOpenOptions() {
  chrome.runtime.sendMessage({ type: ACTION_OPEN_OPTIONS });
}

function onReload(){
  location.reload()
}

onMounted(() => {
  getOpenAISetting();
  chrome.runtime.onMessage.addListener(onMessage);
});
</script>

<style scoped lang="scss">
.container {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 250px;
  background-color: #fff;
  z-index: 99999;
  transition: transform 0.15s ease-out;
  box-shadow: 0 0 5px 5px rgba($color: #000000, $alpha: 0.1);

  &.collapsed {
    transform: translateX(250px);

    .collapsed-btn {
      span {
        transform: rotate(180deg);
      }
    }
  }

  .collapsed-btn {
    cursor: pointer;
    box-shadow: -5px 0px 20px 2px rgba($color: #000000, $alpha: 0.1);
    cursor: pointer;
    display: flex;
    width: 25px;
    height: 50px;
    border-radius: 50px 0 0 50px;
    background-color: #f7f7f7;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: -25px;
    top: calc(50% - 25px);
    z-index: 100;
    font-size: 24px;
    padding-left: 3px;

    span {
      transition: transform 0.15s ease-out;
    }
  }

  .chat-list {
    &::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
  }
}
</style>
