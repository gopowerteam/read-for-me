import html2md from "html-to-md";
import { PromptTemplate } from "langchain/prompts";
import { appConfig } from "../config/app.config";
import {
  STORAGE_ANSWER_PROMPT,
  STORAGE_SETTING,
  STORAGE_SUMMARY_PROMPT,
} from "../config/constant.config";

/* 通过文字二进制得到文字字节数 */
function getByteByBinary(binaryCode: string) {
  /**
   * 二进制 Binary system,es6表示时以0b开头
   * 八进制 Octal number system,es5表示时以0开头,es6表示时以0o开头
   * 十进制 Decimal system
   * 十六进制 Hexadecimal,es5、es6表示时以0x开头
   */
  var byteLengthDatas = [0, 1, 2, 3, 4];
  var len = byteLengthDatas[Math.ceil(binaryCode.length / 8)];
  return len;
}

/* 通过文字十六进制得到文字字节数 */
function getByteByHex(hexCode: string) {
  return getByteByBinary(parseInt(hexCode, 16).toString(2));
}

function substringByByte(str: string, maxLength: number) {
  var result = "";
  var flag = false;
  var len = 0;
  var length = 0;
  var length2 = 0;
  for (var i = 0; i < str.length; i++) {
    var code = str.codePointAt(i)!.toString(16);
    if (code.length > 4) {
      i++;
      if (i + 1 < str.length) {
        flag = str.codePointAt(i + 1)!.toString(16) == "200d";
      }
    }
    if (flag) {
      len += getByteByHex(code);
      if (i == str.length - 1) {
        length += len;
        if (length <= maxLength) {
          result += str.substr(length2, i - length2 + 1);
        } else {
          break;
        }
      }
    } else {
      if (len != 0) {
        length += len;
        length += getByteByHex(code);
        if (length <= maxLength) {
          result += str.substr(length2, i - length2 + 1);
          length2 = i + 1;
        } else {
          break;
        }
        len = 0;
        continue;
      }
      length += getByteByHex(code);
      if (length <= maxLength) {
        if (code.length <= 4) {
          result += str[i];
        } else {
          result += str[i - 1] + str[i];
        }
        length2 = i + 1;
      } else {
        break;
      }
    }
  }
  return result;
}

function getMarkdownContent(content: string) {
  const markdown = html2md(content);
  return substringByByte(markdown, 15000);
}

export async function getAnswerPrompt(content: string, question: string) {
  const storage = await chrome.storage.local.get();
  const template =
    storage[STORAGE_ANSWER_PROMPT]?.summary ?? appConfig.prompt.answer;
  const language =
    storage[STORAGE_SETTING]?.language ?? appConfig.setting.language;

  const markdown = getMarkdownContent(content);
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

  const markdown = getMarkdownContent(content);
  const prompt = new PromptTemplate({
    template: `${template} \n please output in ${language}. \n Content: \n {content}`,
    inputVariables: ["content"],
  });

  return prompt.format({
    content: markdown,
  });
}
