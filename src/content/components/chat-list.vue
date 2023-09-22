<template>
  <ChatRecord
    v-for="record in store.records"
    :id="record.id"
    :key="record.id"
  />
  <ChatQuestions v-if="showQuestions" />
</template>

<style scoped></style>

<script setup lang="ts">
import { appConfig } from '../../config/app.config'
import { STORAGE_SETTING } from '../../config/constant.config'
import { useStore } from '../../store'
import ChatQuestions from './chat-questions.vue'
import ChatRecord from './chat-record.vue'

const store = useStore()
const showQuestions = ref<boolean>(false)

async function getShowQuestions() {
  const storage = await chrome.storage.local.get()
  const setting = storage[STORAGE_SETTING]
  showQuestions.value = setting?.showQuestions ?? appConfig.setting.showQuestions
}

onMounted(() => {
  getShowQuestions()
})
</script>
