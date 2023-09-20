<template>
  <ASpace direction="vertical" fill>
    <ACard title="基础">
      <template #extra>
        <ALink @click="onSaveSetting">保存</ALink>
      </template>
      <AForm
        layout="vertical"
        :model="settingModel"
        ref="settingForm"
        auto-label-width
      >
        <AFormItem label="语言" field="language">
          <ASelect v-model="settingModel.language">
            <AOption value="chinese">中文</AOption>
            <AOption value="english">英文</AOption>
          </ASelect>
        </AFormItem>
        <AFormItem label="显示问题列表" field="showQuestion">
          <ASwitch v-model="settingModel.showQuestions">
            <template #checked> 显示 </template>
            <template #unchecked> 隐藏 </template></ASwitch
          >
        </AFormItem>
      </AForm>
    </ACard>
    <ACard title="OpenAI API">
      <template #extra>
        <ALink @click="onSaveOpenAI">保存</ALink>
      </template>
      <AForm
        layout="vertical"
        :model="openAIModel"
        ref="openAIForm"
        :rules="openAIRules"
        auto-label-width
      >
        <AFormItem label="模型" field="model">
          <ASelect v-model="openAIModel.model">
            <AOption value="gpt-3.5-turbo">gpt-3.5-turbo</AOption>
            <AOption value="gpt-3.5-turbo-16k">gpt-3.5-turbo-16k</AOption>
            <AOption value="gpt-4">gpt-4</AOption>
            <AOption value="gpt-4-32k">gpt-4-32k</AOption>
          </ASelect>
        </AFormItem>
        <AFormItem label="OpenAI API KEY" field="key">
          <AInput v-model="openAIModel.key"></AInput>
        </AFormItem>
        <AFormItem label="OpenAI API HOST" field="host">
          <AInput v-model="openAIModel.host"></AInput>
        </AFormItem>
      </AForm>
    </ACard>
  </ASpace>
</template>

<script setup lang="ts">
import { appConfig } from "../../config/app.config";
import { type FormInstance, type FieldRule, Message } from "@arco-design/web-vue";
import {
  STORAGE_OPENAI_API,
  STORAGE_SETTING,
} from "../../config/constant.config";

const openAIForm = ref<FormInstance>();
const openAIModel = ref({
  model: "",
  key: "",
  host: "",
});

const settingForm = ref<FormInstance>();
const settingModel = ref({
  language: "",
  showQuestions: "",
  questions: [],
});

const openAIRules: Record<string, FieldRule[]> = {
  key: [
    {
      required: true,
      message: "不能为空",
    },
  ],
  host: [
    {
      required: true,
      message: "不能为空",
    },
  ],
};

async function onSaveSetting() {
  if (!settingForm.value) {
    return;
  }

  await chrome.storage.local.set({ [STORAGE_SETTING]: settingModel.value });
  Message.success("保存成功")
}

function onSaveOpenAI() {
  if (!openAIForm.value) {
    return;
  }

  openAIForm.value.validate(async (error) => {
    if (!error) {
      await chrome.storage.local.set({ [STORAGE_OPENAI_API]: openAIModel.value });
      Message.success("保存成功")
    }
  });
}

async function getOpenAIConfig() {
  const storage = await chrome.storage.local.get();

  openAIModel.value.model =
    storage[STORAGE_OPENAI_API]?.model ?? appConfig.openai.model;
  openAIModel.value.key = storage[STORAGE_OPENAI_API]?.key || "";
  openAIModel.value.host =
    storage[STORAGE_OPENAI_API]?.host ?? appConfig.openai.host;
}

async function getSettingConfig() {
  const storage = await chrome.storage.local.get();
  const setting = storage[STORAGE_SETTING];

  settingModel.value.language = setting?.language ?? appConfig.setting.language;
  settingModel.value.showQuestions =
    setting?.showQuestions ?? appConfig.setting.showQuestions;
}

onMounted(() => {
  getOpenAIConfig();
  getSettingConfig();
});
</script>

<style scoped></style>
