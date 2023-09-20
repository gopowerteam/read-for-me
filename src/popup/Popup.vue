<script lang="ts" setup>
import { onMounted, ref } from "vue";

const tabs = ref<chrome.tabs.Tab[]>([])

async function getTabList(){
   tabs.value = await chrome.tabs.query({})
}
const data = ref(0)

console.log(chrome['tabGroups'],33)
async function onGroup(){
 data.value += 1
 localStorage.setItem("TTT",JSON.stringify(data.value))
  // const ids = tabs.value.map(({id})=>id!)
  // const group = await chrome.tabs.group({tabIds:ids})
  // await chrome.tabGroups.update(group,{title:'DOCS'})
}

onMounted(async() => {
  getTabList()
  // data.value = JSON.parse(localStorage.getItem("TTT")||'0')
});

function onClick(tab: chrome.tabs.Tab){

  chrome.tabs.update(tab.id!,{active:true})
  chrome.windows.update(tab.windowId!, {focused:true})

}
</script>

<template>
  <div style="color:red;" @click="onGroup">number:{{ data }}</div>
  <div>
    <img src="/icon-with-shadow.svg" />
    <h1>vite-plugin-web-extension</h1>
    <p>Template: <code>vue-ts123</code></p>
  </div>
  <div>
    <div v-for="tab in tabs"  style="display:flex;">
      <span  @click="()=>onClick(tab)">{{ tab.id}}</span>
      <span>{{ tab.title }}</span>
      <span>{{ tab.url}}</span>
    </div>
  </div>
</template>

<style>
html,
body {
  width: 300px;
  height: 400px;
  padding: 0;
  margin: 0;
}

body {
  background-color: rgb(36, 36, 36);
}

body > div {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: center;
}

img {
  width: 200px;
  height: 200px;
}

h1 {
  font-size: 18px;
  color: white;
  font-weight: bold;
  margin: 0;
}

p {
  color: white;
  opacity: 0.7;
  margin: 0;
}

code {
  font-size: 12px;
  padding: 2px 4px;
  background-color: #ffffff24;
  border-radius: 2px;
}
</style>
