import { get, set, del } from 'idb-keyval';
import { Task, User, Achievement } from '@/types/types';

// Tasks
export const getTasks = (): Promise<Task[]> => get('tasks').then(t => t || []);
export const saveTasks = (tasks: Task[]) => set('tasks', tasks);

// User
export const getUser = (): Promise<User | null> => get('user');
export const saveUser = (user: User) => set('user', user);

// Achievements
export const getAchievements = (): Promise<Achievement[]> =>
  get('achievements').then(a => a || []);
export const saveAchievements = (ach: Achievement[]) =>
  set('achievements', ach);

// Helpers
export const clearDB = () => Promise.all([del('tasks'), del('user'), del('achievements')]);
