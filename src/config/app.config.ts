export const appConfig = {
  version: __APP_VERSION__,
  openai: {
    host: "https://api.openai.com/v1",
    model: "gpt-3.5-turbo-16k",
  },
  prompt: {
    summary:
      "Summarize the highlights of the content and output a useful summary in a few sentences, please keep it simple.",
    answer:
      "Answer the following questions based on the content, please keep it simple.",
  },
  questions:[
    "请问最重要的三个关键词是什么?",
    "请问哪些章节是重要的章节？",
    "请问作者写这篇文章的目的是什么？",
  ],
  setting: {
    language: "chinese",
    showQuestions: true
  }
};
