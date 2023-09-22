import {
  ACTION_ANSWER_CONTENT,
  ACTION_CREATE_RECORD,
  ACTION_OPEN_OPTIONS,
  ACTION_SUMMARY_CONTENT,
  ACTION_TOGGER_DRAWER,
} from '../config/constant.config'
import { getAnswerPrompt, getSummaryPrompt } from './prompts'
import { sendChat } from './send-chat'

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: '帮我读 | 全文总结',
    type: 'normal',
    id: 'SUMMARY_PAGE',
    contexts: ['page'],
  })

  chrome.contextMenus.create({
    title: '帮我读 | 选中总结',
    type: 'normal',
    id: 'SUMMARY_SELECTION',
    contexts: ['selection'],
  })
})

chrome.contextMenus.onClicked.addListener((data, tab) => {
  switch (data.menuItemId) {
    case 'SUMMARY_SELECTION': {
      if (!data.selectionText || data.selectionText.length < 10)
        return

      chrome.tabs.sendMessage(
        tab!.id!,
        {
          type: ACTION_CREATE_RECORD,
          content: '',
          state: 'COMPLETED',
        },
        (id) => {
          sendSummaryChat(tab!.id!, id, data.selectionText!)
        },
      )
      break
    }
    default:
      toggleDrawer(tab)
      break
  }
})

chrome.action.onClicked.addListener((tab) => {
  toggleDrawer(tab)
})

/**
 * 打开侧边栏
 * @param tab
 * @returns
 */
function toggleDrawer(tab?: chrome.tabs.Tab) {
  if (!tab?.id)
    return

  chrome.tabs.sendMessage(tab.id, { type: ACTION_TOGGER_DRAWER, data: {} })
}

async function sendSummaryChat(tabId: number, id: string, content: string) {
  const question = await getSummaryPrompt(content)
  sendChat(tabId, id, question)
}

async function sendAnswerChat(
  tabId: number,
  id: string,
  content: string,
  question: string,
) {
  const prompt = await getAnswerPrompt(content, question)
  sendChat(tabId, id, prompt)
}

chrome.runtime.onMessage.addListener((request, sender) => {
  switch (request.type) {
    case ACTION_SUMMARY_CONTENT:
      sendSummaryChat(sender.tab!.id!, request.id, request.content)
      break
    case ACTION_ANSWER_CONTENT:
      sendAnswerChat(
        sender.tab!.id!,
        request.id,
        request.content,
        request.question,
      )
      break
    case ACTION_OPEN_OPTIONS:
      chrome.runtime.openOptionsPage()
      break
  }
})
