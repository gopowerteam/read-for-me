<template>
  <ACard title="白名单">
    <template #extra>
      <ALink @click="() => questions.push('')">
        添加
      </ALink>
      <ALink @click="onSaveQuestions">
        保存
      </ALink>
    </template>
    <ASpace direction="vertical" fill>
      <AInput
        v-for="question, index in questions"
        :key="index"
        v-model="questions[index]"
        allow-clear
      />
    </ASpace>
  </ACard>
  <ACard title="黑名单">
    <template #extra>
      <ALink @click="() => questions.push('')">
        添加
      </ALink>
      <ALink @click="onSaveQuestions">
        保存
      </ALink>
    </template>
    <ASpace direction="vertical" fill>
      <AInput
        v-for="question, index in questions"
        :key="index"
        v-model="questions[index]"
        allow-clear
      />
    </ASpace>
  </ACard>
</template>

<style scoped></style>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { appConfig } from '../../config/app.config'
import {
  STORAGE_QUESTIONS,
} from '../../config/constant.config'

const questions = ref<string[]>([])

async function onSaveQuestions() {
  const list = questions.value.filter(Boolean)
  await chrome.storage.local.set({ [STORAGE_QUESTIONS]: list })
  questions.value = list
  Message.success('保存成功')
}

async function getQuestions() {
  const storage = await chrome.storage.local.get()

  questions.value = storage[STORAGE_QUESTIONS] ?? appConfig.questions
}

onMounted(() => {
  getQuestions()
})
</script>
