export interface Task {
    id: string;
    name: string;
    date: string;
    priority?: { value: string, color: string };
    status?: { value: string, color: string };
}

export interface User {
    name: string;
    avatar: string; // URL или data‑URI
  }
  
  export interface Achievement {
    id: number;
    name: string;
    title: string;
    icon: string; // URL или data‑URI
    progress: number; //%
    isCompleted?: boolean;
  }
  