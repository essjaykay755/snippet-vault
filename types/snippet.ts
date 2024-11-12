export interface Snippet {
  description: string;
  id: string;
  title: string;
  content: string;
  language:
    | "javascript"
    | "python"
    | "css"
    | "html"
    | "typescript"
    | "java"
    | "csharp"
    | "php"
    | "ruby"
    | "go"
    | "rust"
    | "swift"
    | "kotlin"
    | "plaintext";
  tags: string[];
  favorite: boolean;
  date: string;
  userId: string;
}
