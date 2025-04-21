// app/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/header';
import Workspace from '@/components/workflow/workspace';
import { Task } from '@/types/types';
import { getTasks, saveTasks } from '@/lib/db';
import { useACH } from '@/contexts/AchievementContext';

const QUOTES = [
  "Новый день — пора новых амбиций",
  "Каждый миг приносит шанс перезапустить историю",
  "Встречай все вокруг с надеждой и энергией",
  "Наш день начнется с победы над вчерашними сомнениями",
  "Настало твое время действовать",
  // …ещё 95 цитат
] as const;

type Phase = 'day' | 'eve';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [phase, setPhase] = useState<Phase>('day');
  const [showQuote, setShowQuote] = useState(false);
  const [quote, setQuote] = useState('');
  const { recordEvent } = useACH();

  // Фон, цитата + дни открытия
  useEffect(() => {
    recordEvent('daysOpened');           // 16,17,18: открыть приложение 1/5/10 дней

    const now = new Date();
    const hour = now.getHours();
    setPhase(hour >= 18 || hour < 6 ? 'eve' : 'day');

    const todayKey = now.toISOString().slice(0, 10);
    if (localStorage.getItem('lastVisitDate') !== todayKey) {
      const idx = Math.floor(Math.random() * QUOTES.length);
      setQuote(QUOTES[idx]);
      setShowQuote(true);
      localStorage.setItem('lastVisitDate', todayKey);
      setTimeout(() => setShowQuote(false), 5000);
    }
  }, [recordEvent]);

  // Загрузка сохранённых задач
  useEffect(() => {
    getTasks().then((stored) => {
      if (stored?.length) setTasks(stored);
    });
  }, []);

  const updateTasks = (updated: Task[]) => {
    setTasks(updated);
    saveTasks(updated);
  };

  // Создание задачи
  const handleCreateTask = (name: string, date: string) => {
    const newTask: Task = {
      id: tasks.length,
      name,
      date,
      priority: undefined,
      status: { value: 'Actual', color: 'amber' },
    };
    const updated = [...tasks, newTask];
    updateTasks(updated);
    recordEvent('tasksCreated');        // 5,6,7: добавить 1/5/10 задач
  };

  // Переименование задачи (не в ачивках)
  const handleRenameTask = (id: number, newName: string) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, name: newName } : t
    );
    updateTasks(updated);
  };

  // Удаление задачи (не в ачивках)
  const handleDeleteTask = (id: number) => {
    const updated = tasks.filter((t) => t.id !== id);
    updateTasks(updated);
  };

  // Смена приоритета (не в ачивках)
  const handlePrioritySwitch = (
    id: number,
    priority: { value: string; color: string }
  ) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, priority } : t
    );
    updateTasks(updated);
  };

  // Смена статуса задачи
  const handleStatusSwitch = (
    id: number,
    status: { value: string; color: string }
  ) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, status } : t
    );
    updateTasks(updated);
    if (status.value === 'Done') {
      recordEvent('tasksCompleted');    // 8,9,10: выполнить 1/5/10 задач
    }
  };

  // Режим редактирования / сессии / переключение режима
  const handleToggleEditingMode = () => {
    setIsEditingMode((prev) => !prev);
    recordEvent('sessions');            // 11,12,13: начать 1/5/10 сессий
    recordEvent('modeToggles');         // 19,20: переключить режим 5/20 раз
  };

  return (
    <>
      {showQuote && (
        <div className="fixed inset-0 flex items-center justify-center bg-black quote-overlay z-50">
          <p className="text-4xl text-amber-100 bg-amber-100/20 border-pink-200 border-2 px-6 py-2 text-center">
            {quote}
          </p>
        </div>
      )}

      <Header
        onCreateTask={() =>
          handleCreateTask(
            'Новая задача',
            new Date().toISOString().split('T')[0]
          )
        }
        onToggleEdit={handleToggleEditingMode}
      />

      <Workspace
        tasks={tasks}
        isEditing={isEditingMode}
        onRenameTask={handleRenameTask}
        onDeleteTask={handleDeleteTask}
        onPrioritySwitch={handlePrioritySwitch}
        onStatusSwitch={handleStatusSwitch}
      />
    </>
  );
}
