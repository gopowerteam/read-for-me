export {};
declare global {
  interface ChatRecord {
    id: string;
    content: string;
    state: "WAITING" | "RESPONSING" | "COMPLETED";
    origin: "AI" | "HUMAN";
  }
}
