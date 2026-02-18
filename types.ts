
export interface Idea {
  id: string;
  originalText: string;
  expandedTitle: string;
  description: string;
  sections: {
    title: string;
    content: string;
  }[];
  imageUrl?: string;
  createdAt: number;
}

export interface IdeaState {
  ideas: Idea[];
  loading: boolean;
  error: string | null;
}
