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

// Определения ачивок и порогов
const definitions: Array<{ id: number; title: string; icon: string; key: string; threshold: number }> = [
  { id: 1, title: "Создать первую заметку", icon: "📝", key: "notes", threshold: 1 },
  /* ... остальные 20 определений ... */
];

export const ACHProvider = ({ children }: { children: ReactNode }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();
  const shownRef = useRef<Set<number>>(new Set());

  // Инициализация метрик и ачивок
  useEffect(() => {
    localStorage.removeItem("metrics");
    localStorage.removeItem("achievements");
    const storedMetrics = JSON.parse(localStorage.getItem("metrics") || "{}");
    setMetrics(storedMetrics);
    const storedAch = JSON.parse(localStorage.getItem("achievements") || "null");
    if (storedAch) setAchievements(storedAch);
    else {
      const initial = definitions.map(d => ({ id: d.id, title: d.title, icon: d.icon, progress: 0 }));
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
      if (a.progress === 100 && !shownRef.current.has(a.id)) {
        showToast(`🏆 Достижение: ${a.title}`);
        shownRef.current.add(a.id);
      }
    });
  }, [achievements, showToast]);

  // Только обновление метрик и прогресса
  const recordEvent = useCallback((key: string) => {
    setMetrics(prev => {
      const count = (prev[key] || 0) + 1;
      const updatedMetrics = { ...prev, [key]: count };
      // Обновляем progress
      setAchievements(prevAch => prevAch.map(a => {
        const def = definitions.find(d => d.id === a.id && d.key === key);
        if (!def) return a;
        const prog = 100;
        return { ...a, progress: prog };
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
