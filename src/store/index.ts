import { defineStore } from "pinia";
import { appConfig } from "../config/app.config";

export interface State {
  collapsed: boolean; // 系统准备状态
  content: string;
  responsing: boolean;
  waiting: boolean;
  records: ChatRecord[];
}

function createState(): State {
  return {
    waiting: false,
    collapsed: true,
    content: "",
    responsing: false,
    records: []
  };
}

export const useStore = defineStore("app", {
  state: createState,
  actions: {
    /**
     * 更新系统状态
     */
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    },
    updateContent(value: string) {
      this.content = value;
    },
    addRecord(content: string, origin: "AI" | "HUMAN") {
      const id = Math.random().toString(16).slice(2).toUpperCase();

      const record: ChatRecord = {
        id,
        content,
        state: origin === "AI" ? "WAITING" : "COMPLETED",
        origin,
      };

      this.records.push(record);
      return id;
    },
    updateRecord(
      id: string,
      content: string,
      state: "RESPONSING" | "COMPLETED"
    ) {
      let record = this.records.find((x) => x.id === id);

      if (record) {
        record.content += content;
        record.state = state;
      }
    },
    clearRecord(){
      this.records = []
    }
  },
});
