// app/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/header';
import Workspace from '@/components/workflow/workspace';
import { Task } from '@/types/types';
import { getTasks, saveTasks } from '@/lib/db';
import { useACH } from '@/contexts/AchievementContext';
import { Calendar } from '@/components/ui/Calendar';

const QUOTES = [
  "Новый день — пора новых амбиций",
  "Каждый миг приносит шанс перезапустить историю",
  "Встречай все вокруг с надеждой и энергией",
  "Наш день начнется с победы над вчерашними сомнениями",
  "Настало твое время действовать",
  // …ещё 95 цитат
] as const;

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const [quote, setQuote] = useState('');
  const { recordEvent } = useACH();
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().split('T')[0]
  );

  // Загрузка и дни открытия
  useEffect(() => {
    getTasks().then((stored) => stored && setTasks(stored));
    recordEvent('daysOpened');
  }, [recordEvent]);


  // Фон, цитата + дни открытия
  useEffect(() => {
    recordEvent('daysOpened');           // 16,17,18: открыть приложение 1/5/10 дней

    const now = new Date();

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

  const handleCreateTask = (name: string, date: string) => {
    recordEvent('tasksCreated');
    const newT: Task = {
      id: tasks.length,
      name,
      date,
      priority: undefined,
      status: { value: 'Actual', color: 'amber' },
    };
    updateTasks([...tasks, newT]);
  };

  const handleRenameTask = (id: number, newName: string) =>
    updateTasks(tasks.map((t) => (t.id === id ? { ...t, name: newName } : t)));

  const handleDeleteTask = (id: number) =>
    updateTasks(tasks.filter((t) => t.id !== id));

  const handlePrioritySwitch = (id: number, pr: {value:string, color:string}) =>
    updateTasks(tasks.map((t) => (t.id === id ? { ...t, priority: pr } : t)));

  const handleStatusSwitch = (id: number, st: {value:string, color:string}) => {
    updateTasks(tasks.map((t) => (t.id === id ? { ...t, status: st } : t)));
    if (st.value === 'Done') recordEvent('tasksCompleted');
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
        onToggleCalendar={() => setShowCalendar((p) => !p)}
      />



      {showCalendar && (
        <Calendar
          selectedDate={selectedDate}
          onSelectDate={(d) => {
            setSelectedDate(d);
            setShowCalendar(false);
          }}
        />
      )}

      <Workspace
        tasks={tasks}
        isEditing={isEditingMode}
        selectedDate={selectedDate}
        onRenameTask={handleRenameTask}
        onDeleteTask={handleDeleteTask}
        onPrioritySwitch={handlePrioritySwitch}
        onStatusSwitch={handleStatusSwitch}
      />
    </>
  );
}
