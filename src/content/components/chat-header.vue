<template>
  <div ref="headerRef" class="text-right">
    <a-dropdown @select="onChangeLanguage" :popup-container="headerRef">
      <a-button type="text">
        <span class="i-icon-park-outline:chinese" v-if="language === 'chinese'"></span>
        <span class="i-icon-park-outline:english" v-if="language === 'english'"> </span>
      </a-button>
      <template #content>
        <a-doption value="chinese" v-if="language === 'english'">
          <div class="i-icon-park-outline:chinese"></div>
        </a-doption>
        <a-doption value="english" v-if="language === 'chinese'">
          <div class="i-icon-park-outline:english"></div>
        </a-doption>
      </template>
    </a-dropdown>
    <AButton type="text" @click="onReset">
      <div class="i-icon-park-outline:refresh"></div>
    </AButton>
  </div>
</template>

<script setup lang="ts">
import { appConfig } from "../../config/app.config";
import { ACTION_SUMMARY_CONTENT, STORAGE_SETTING } from "../../config/constant.config";
import { useStore } from "../../store";

const store = useStore()
const headerRef = ref();
const language = ref<"chinese" | "english">();

async function getLanguage() {
  const storage = await chrome.storage.local.get();
  language.value = storage[STORAGE_SETTING]?.language ?? appConfig.setting.language;
}

function onChangeLanguage(value: any) {
  language.value = value as "english" | "chinese" ;
  chrome.storage.local.set({
    [STORAGE_SETTING]:{
      language: value
    }
  })
}

function onReset(){
  store.clearRecord()
  const id = store.addRecord("", "AI");

  chrome.runtime.sendMessage({
    type: ACTION_SUMMARY_CONTENT,
    content: store?.content,
    id,
  });
}

onMounted(async () => {
  await getLanguage();
});
</script>

<style scoped></style>
