import html2md from "html-to-md";
import { PromptTemplate } from "langchain/prompts";
import { appConfig } from "../config/app.config";
import {
  STORAGE_ANSWER_PROMPT,
  STORAGE_SETTING,
  STORAGE_SUMMARY_PROMPT,
} from "../config/constant.config";

export async function getAnswerPrompt(content: string, question: string) {
  const storage = await chrome.storage.local.get();
  const template =
    storage[STORAGE_ANSWER_PROMPT]?.summary ?? appConfig.prompt.answer;
  const language =
    storage[STORAGE_SETTING]?.language ?? appConfig.setting.language;

  const markdown = html2md(content);
  const prompt = new PromptTemplate({
    template: `${template} \n please output in ${language} \n Question: \n {question} \n Content: \n {content}`,
    inputVariables: ["question", "content"],
  });

  return prompt.format({
    content: markdown,
    question,
  });
}

export async function getSummaryPrompt(content: string) {
  const storage = await chrome.storage.local.get();
  const template =
    storage[STORAGE_SUMMARY_PROMPT]?.summary ?? appConfig.prompt.summary;
  const language =
    storage[STORAGE_SETTING]?.language ?? appConfig.setting.language;

  const markdown = html2md(content);
  const prompt = new PromptTemplate({
    template: `${template} \n please output in ${language}. \n Content: \n {content}`,
    inputVariables: ["content"],
  });

  return prompt.format({
    content: markdown,
  });
}
