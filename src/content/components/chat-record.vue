<template>
  <div
    v-if="record"
    class="record"
    :class="{ ai: record.origin === 'AI', human: record.origin === 'HUMAN' }"
  >
    <div
      v-if="record.state === 'WAITING'"
      class="flex items-center justify-center"
    >
      <ASpin />
    </div>
    <div v-else>
      {{ record.content }}
    </div>
  </div>
</template>

<style scoped>
.record {
  font-size: 14px;
  line-height: 2;
  padding: 15px;
  word-break: break-all;
  white-space: pre-wrap;
  color: #3f3f3f;
  border-bottom: solid 1px #7f7f7f7f;

  &.ai {
    background-color: #f7f7f7;
  }

  &.human {
    background-color: #fff;
  }
}
</style>

<script setup lang="ts">
import { useStore } from '../../store'

const props = defineProps<{
  id: string
}>()
const store = useStore()
const record = computed(() => store.records.find(x => x.id === props.id))
</script>
