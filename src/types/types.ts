export interface Task {
    id: number;
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
    title: string;
    icon: string; // URL или data‑URI
    progress: number; //%
  }
  