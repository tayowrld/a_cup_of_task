"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import { Achievement } from "@/types/types";
import { useToast } from "@/contexts/ToastContext";

interface ACHContextValue {
  achievements: Achievement[];
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  recordEvent: (key: string) => void;
}

const ACHContext = createContext<ACHContextValue | undefined>(undefined);

const definitions: Array<{ id: number; name: string; title: string; icon: string; key: string; threshold: number, isCompleted: boolean }> = [
  { id: 1, name: "The beginning is set", title: "Create the first task", icon: "✅", key: "tasksCreated", threshold: 1, isCompleted: false },
  { id: 2, name: "First steps", title: "Create 5 tasks", icon: "📝", key: "tasksCreated", threshold: 5, isCompleted: false },
  { id: 3, name: "Unshakable excitement", title: "Create 10 tasks", icon: "📋", key: "tasksCreated", threshold: 10, isCompleted: false },
  { id: 4, name: "Productive path", title: "Complete 5 tasks", icon: "🏁", key: "tasksCompleted", threshold: 5, isCompleted: false },
  { id: 5, name: "General Taskplanner", title: "Complete 10 tasks", icon: "✅🏁", key: "tasksCompleted", threshold: 10, isCompleted: false },
  { id: 6, name: "Erasing memory", title: "Delete 3 tasks", icon: "🗑️", key: "tasksDeleted", threshold: 3, isCompleted: false },
  { id: 7, name: "Everything has its state", title: "Change status in 3 tasks", icon: "📋✅", key: "statusChange", threshold: 3, isCompleted: false },
  { id: 8, name: "Interest", title: "Log in for 3 consecutive days", icon: "📅", key: "daysOpened", threshold: 3, isCompleted: false },
  { id: 9, name: "Stability is a sign of mastery", title: "Log in for 7 consecutive days", icon: "📅", key: "daysOpened", threshold: 7, isCompleted: false },
  { id: 10, name: "Red book", title: "Log in for 30 consecutive days", icon: "📅", key: "daysOpened", threshold: 30, isCompleted: false },
  { id: 11, name: "Setting priorities", title: "Create a note with priority", icon: "⚡", key: "priority_note", threshold: 1, isCompleted: false },
];


export const ACHProvider = ({ children }: { children: ReactNode }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();
  const shownRef = useRef<Set<number>>(new Set());

  // Инициализация метрик и ачивок
  useEffect(() => {
    const storedMetrics = JSON.parse(localStorage.getItem("metrics") || "{}");
    setMetrics(storedMetrics);

    const storedAch = JSON.parse(localStorage.getItem("achievements") || "null");
    if (storedAch) setAchievements(storedAch);
    else {
      const initial = definitions.map(d => ({ id: d.id, name: d.name, title: d.title, icon: d.icon, progress: 0 }));
      setAchievements(initial);
      localStorage.setItem("achievements", JSON.stringify(initial));
    }
  }, []);

  // Сохраняем изменения
  useEffect(() => {
    localStorage.setItem("metrics", JSON.stringify(metrics));
    localStorage.setItem("achievements", JSON.stringify(achievements));
  }, [metrics, achievements]);

  // Побочный эффект: при достижении 100% отправляем тосты
  useEffect(() => {
    achievements.forEach(a => {
      if (a.progress >= 100 && !shownRef.current.has(a.id) && !a.isCompleted) {
        showToast(`🏆 Achieved: ${a.title}`);
        shownRef.current.add(a.id);
        setAchievements(prev => prev.map(ach => ach.id === a.id ? { ...ach, isCompleted: true } : ach));
      }
    });
  }, [achievements, showToast]);

  // Обновление прогресса
  const recordEvent = useCallback((key: string) => {
    setMetrics(prev => {
      const count = (prev[key] || 0) + 1;
      const updatedMetrics = { ...prev, [key]: count };

      // Обновляем прогресс
      setAchievements(prevAch => prevAch.map(a => {
        const def = definitions.find(d => d.id === a.id && d.key === key);
        if (!def) return a;
        
        // Рассчитываем прогресс динамически
        const progress = Math.min((updatedMetrics[key] / def.threshold) * 100, 100);
        return { ...a, progress };
      }));
      return updatedMetrics;
    });
  }, []);

  return (
    <ACHContext.Provider value={{ achievements, isModalOpen, openModal: () => setIsModalOpen(true), closeModal: () => setIsModalOpen(false), recordEvent }}>
      {children}
    </ACHContext.Provider>
  );
};

export const useACH = () => {
  const ctx = useContext(ACHContext);
  if (!ctx) throw new Error("useACH must be inside ACHProvider");
  return ctx;
};