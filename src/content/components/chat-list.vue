<template>
  <ChatRecord
    :id="record.id"
    v-for="record in store.records"
    :key="record.id"
  ></ChatRecord>
  <ChatQuestions v-if="showQuestions"></ChatQuestions>
</template>

<script setup lang="ts">
import { appConfig } from "../../config/app.config";
import { STORAGE_SETTING } from "../../config/constant.config";
import { useStore } from "../../store";
import ChatQuestions from "./chat-questions.vue";
import ChatRecord from "./chat-record.vue";

const store = useStore();
const showQuestions = ref<boolean>(false)

async function getShowQuestions(){
  const storage = await chrome.storage.local.get()
  const setting = storage[STORAGE_SETTING]
  console.log(setting,132313)
  showQuestions.value = setting?.showQuestions ?? appConfig.setting.showQuestions
}

onMounted(()=>{
  getShowQuestions()
})
</script>

<style scoped></style>
