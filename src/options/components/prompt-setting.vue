<template>
  <ACard title="Prompt">
    <template #extra>
      <ALink @click="onSavePrompt">保存</ALink>
    </template>
    <AForm
      layout="vertical"
      :model="promptModel"
      ref="promptForm"
      :rules="promptRules"
      auto-label-width
    >
      <AFormItem label="总结提示词" field="summary">
        <ATextarea
          v-model="promptModel.summary"
          placeholder="请输入文本提示词"
          allow-clear
          :auto-size="{ minRows: 5, maxRows: 10 }"
        ></ATextarea>
      </AFormItem>
    </AForm>
  </ACard>
</template>

<script setup lang="ts">
import { appConfig } from "../../config/app.config";
import type { FormInstance, FieldRule } from "@arco-design/web-vue";
import {  STORAGE_SUMMARY_PROMPT } from "../../config/constant.config";

const promptForm = ref<FormInstance>();
const promptModel = ref({
  summary: "",
});

const promptRules: Record<string, FieldRule[]> = {
  summary: [
    {
      required: true,
      message: "不能为空",
    },
  ],
};

function onSavePrompt() {
  if (!promptForm.value) {
    return;
  }

  promptForm.value.validate((error) => {
    if (!error) {
      chrome.storage.local.set({ [STORAGE_SUMMARY_PROMPT]: promptModel.value });
    }
  });
}

async function getPromptConfig() {
  const storage = await chrome.storage.local.get();

  promptModel.value.summary =
    storage[STORAGE_SUMMARY_PROMPT]?.summary ?? appConfig.prompt.summary;
}

onMounted(() => {
  getPromptConfig();
});
</script>

<style scoped></style>
