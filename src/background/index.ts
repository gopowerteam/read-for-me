import {
  ACTION_ANSWER_CONTENT,
  ACTION_CREATE_RECORD,
  ACTION_SUMMARY_CONTENT,
  ACTION_TOGGER_DRAWER,
} from "../config/constant.config";
import { getSummaryPrompt, getAnswerPrompt } from "./prompts";
import { sendChat } from "./send-chat";

const id = Math.random().toString(16).slice(2).toUpperCase();

chrome.contextMenus.create(
  {
    title: "帮我读",
    type: "normal",
    id,
    contexts: ["all"],
  },
  () => {
    chrome.contextMenus.create({
      title: "总结选中内容",
      type: "normal",
      id: "SUMMARY_SELECTION",
      contexts: ["selection"],
      parentId: id,
    });
  }
);

chrome.contextMenus.onClicked.addListener((data, tab) => {
  switch (data.menuItemId) {
    case "SUMMARY_SELECTION": {
      if (!data.selectionText || data.selectionText.length < 10) {
        return;
      }

      chrome.tabs.sendMessage(
        tab?.id!,
        {
          type: ACTION_CREATE_RECORD,
          content: "",
          id,
          state: "COMPLETED",
        },
        (id) => {
          sendSummaryChat(tab?.id!, id, data.selectionText!);
        }
      );
      break;
    }
    default:
      toggleDrawer(tab);
      break;
  }
});

chrome.action.onClicked.addListener((tab) => {
  toggleDrawer(tab);
});

/**
 * 打开侧边栏
 * @param tab
 * @returns
 */
function toggleDrawer(tab?: chrome.tabs.Tab) {
  if (!tab?.id) {
    return;
  }

  chrome.tabs.sendMessage(tab.id, { type: ACTION_TOGGER_DRAWER, data: {} });
}

async function sendSummaryChat(tabId: number, id: string, content: string) {
  const question = await getSummaryPrompt(content);
  sendChat(tabId, id, question);
}

async function sendAnswerChat(
  tabId: number,
  id: string,
  content: string,
  question: string
) {
  const prompt = await getAnswerPrompt(content, question);
  sendChat(tabId, id, prompt);
}

chrome.runtime.onMessage.addListener((request, sender) => {
  switch (request.type) {
    case ACTION_SUMMARY_CONTENT:
      sendSummaryChat(sender.tab!.id!, request.id, request.content);
      break;
    case ACTION_ANSWER_CONTENT:
      sendAnswerChat(
        sender.tab!.id!,
        request.id,
        request.content,
        request.question
      );
      break;
  }
});
