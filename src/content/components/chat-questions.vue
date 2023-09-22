<template>
  <div class="p-5">
    <div v-for="(question, index) in questions" :key="index">
      <a-link @click="onSubmit(question)">
        <div class="text-[12px]">
          {{ question }}
        </div>
      </a-link>
    </div>
  </div>
</template>

<style scoped></style>

<script setup lang="ts">
import { appConfig } from '../../config/app.config'
import {
  ACTION_ANSWER_CONTENT,
  STORAGE_QUESTIONS,
} from '../../config/constant.config'
import { useStore } from '../../store'

const store = useStore()
const questions = ref<string[]>([])

async function getQuestions() {
  const storage = await chrome.storage.local.get()
  questions.value = storage[STORAGE_QUESTIONS] ?? appConfig.questions
}

function onSubmit(question: string) {
  if (store.records.some(x => ['WAITING', 'RESPONSING'].includes(x.state)))
    return

  store.addRecord(question, 'HUMAN')

  // 请求生成摘要
  const id = store.addRecord('', 'AI')

  chrome.runtime.sendMessage({
    type: ACTION_ANSWER_CONTENT,
    content: store.content,
    question,
    id,
  })
}
onMounted(async () => {
  await getQuestions()
})
</script>
