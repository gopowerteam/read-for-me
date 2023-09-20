<template>
  <div class="p-2">
    <AInput v-model="input" @keydown.enter.prevent.stop="onSubmit" :disabled="disabled">
      <template #append>
        <div class="i-icon-park-outline:send" @click="onSubmit"></div>
      </template>
    </AInput>
  </div>
</template>

<script setup lang="ts">
import { ACTION_ANSWER_CONTENT } from "../../config/constant.config";
import { useStore } from "../../store";

const store = useStore();
const input = ref("");

const disabled = computed(() =>
  store.records.some((x) => ["RESPONSING", "WAITING"].includes(x.state))
);

function onSubmit() {
  if (!input.value) {
    return;
  }

  store.addRecord(input.value, "HUMAN");

  // 请求生成摘要
  const id = store.addRecord("", "AI");

  chrome.runtime.sendMessage({
    type: ACTION_ANSWER_CONTENT,
    content: store.content,
    question: input.value,
    id,
  });

  input.value = "";
}
</script>

<style scoped></style>
