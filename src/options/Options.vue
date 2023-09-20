<template>
  <div class="header">
    <div class="action"></div>
    <div class="title">帮我读 ({{ appConfig.version }})</div>
  </div>
  <div class="container">
    <ATabs direction="vertical" type="line">
      <ATabPane key="general" title="通用配置">
        <GeneralSetting></GeneralSetting>
      </ATabPane>
      <ATabPane key="questions" title="问题配置">
        <QuestionsSetting></QuestionsSetting>
      </ATabPane>
      <!-- <ATabPane key="prompt" title="提示词配置">
        <PromptSetting></PromptSetting>
      </ATabPane>
      -->
    </ATabs>
  </div>
</template>

<style>
html,
body {
  padding: 0;
  margin: 0;
}

.header {
  /* padding-left: 20px; */
  padding: 10px 20px;
  border-bottom: solid 1px rgba(0, 0, 0, 0.1);
  text-align: right;
  display: flex;
  justify-content: space-between;
}

.container {
  padding:  20px;
  width: 80%;
  margin: auto;
}
</style>

<script lang="ts" setup>
import { onMounted } from "vue";
import { appConfig } from "../config/app.config";
import GeneralSetting from "./components/general-setting.vue";
import QuestionsSetting from "./components/questions-setting.vue";

onMounted(() => {
  console.log("for test.");
});
</script>
