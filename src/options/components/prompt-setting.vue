<template>
  <ACard title="Prompt">
    <template #extra>
      <ALink @click="onSavePrompt">
        保存
      </ALink>
    </template>
    <AForm
      ref="promptForm"
      auto-label-width
      layout="vertical"
      :model="promptModel"
      :rules="promptRules"
    >
      <AFormItem field="summary" label="总结提示词">
        <ATextarea
          v-model="promptModel.summary"
          allow-clear
          :auto-size="{ minRows: 5, maxRows: 10 }"
          placeholder="请输入文本提示词"
        />
      </AFormItem>
    </AForm>
  </ACard>
</template>

<style scoped></style>

<script setup lang="ts">
import type { FieldRule, FormInstance } from '@arco-design/web-vue'
import { appConfig } from '../../config/app.config'
import { STORAGE_SUMMARY_PROMPT } from '../../config/constant.config'

const promptForm = ref<FormInstance>()
const promptModel = ref({
  summary: '',
})

const promptRules: Record<string, FieldRule[]> = {
  summary: [
    {
      required: true,
      message: '不能为空',
    },
  ],
}

function onSavePrompt() {
  if (!promptForm.value)
    return

  promptForm.value.validate((error) => {
    if (!error)
      chrome.storage.local.set({ [STORAGE_SUMMARY_PROMPT]: promptModel.value })
  })
}

async function getPromptConfig() {
  const storage = await chrome.storage.local.get()

  promptModel.value.summary
    = storage[STORAGE_SUMMARY_PROMPT]?.summary ?? appConfig.prompt.summary
}

onMounted(() => {
  getPromptConfig()
})
</script>
