import { OpenAI } from 'langchain/llms/openai'
import {
  EVENT_RESPONSE_MSG,
  STORAGE_OPENAI_API,
} from '../config/constant.config'
import { appConfig } from '../config/app.config'

export async function sendChat(tabId: number, id: string, question: string) {
  const storage = await chrome.storage.local.get()
  const openAI = storage[STORAGE_OPENAI_API]

  const model = new OpenAI(
    {
      modelName: openAI?.model ?? appConfig.openai.model,
      openAIApiKey: openAI?.key,
      temperature: 0,
      streaming: true,
    },
    {
      baseURL: openAI?.host ?? appConfig.openai.host,
    },
  )

  await model.call(question, {
    timeout: 60000,
    callbacks: [
      {
        handleLLMNewToken(token: string) {
          chrome.tabs.sendMessage(tabId, {
            type: EVENT_RESPONSE_MSG,
            content: token,
            id,
            state: 'RESPONSING',
          })
        },
      },
    ],
  })

  chrome.tabs.sendMessage(tabId, {
    type: EVENT_RESPONSE_MSG,
    content: '',
    id,
    state: 'COMPLETED',
  })
}
