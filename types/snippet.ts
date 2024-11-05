export interface Snippet {
  id: string;
  title: string;
  content: string;
  language: string;
  tags: string[];
  date: string;
  userId: string;
  favorite: boolean;
}
