'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/header';
import Workspace from '@/components/workflow/workspace';
import { Task } from '@/types/types';
import { getTasks, saveTasks } from '@/lib/db';
import { useACH } from '@/contexts/AchievementContext';
import { Calendar } from '@/components/ui/Calendar';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';

const QUOTES = [
  "A new day is a time for new ambitions",
  "Every moment brings a chance to restart the story",
  "Meet everything around you with hope and energy",
  "Our day starts with victory over yesterday's doubts",
  "It's your time to act",
  "Act today so you won't regret tomorrow",
  "The power is in action, not in reflection",
  "Every step forward is a victory",
  "Don't put off until tomorrow what you can do today",
  "Tomorrow won't come if you don't start today",
  "Time doesn't wait, act right now",
  "Productivity is not just completing tasks, but moving forward",
  "It's better to do something than to sit idle",
  "Take small steps, but always move forward",
  "Your energy is your greatest asset",
  "Every day is a chance to get better",
  "Start with what you can do right now",
  "Don't be afraid to start small, the important thing is to keep moving",
  "There is value in every day, find it",
  "Only actions can lead to results",
  "It's better to do something and make a mistake than to do nothing at all",
  "When you want to but don't act, it's all just empty words",
  "Do what you can, with what you have, and where you are",
  "To succeed, you need not just to dream but also to act",
  "Productivity is the art of managing your time",
  "Don't wait for the perfect moment, create it",
  "Focus on the process leads to great results",
  "True strength is in concentration",
  "Tasks are completed not when you plan them, but when you start acting",
  "Every moment is a chance for growth",
  "There is no perfect time, start right now",
  "Action is the key to success",
  "The process is as important as the result",
  "Determination is what separates successful people from unsuccessful ones",
  "It's better to do something than to remain in place",
  "You can always do more than you think",
  "Success comes to those who never stop",
  "Every morning is a chance to start with a clean slate",
  "The desire to improve makes us productive",
  "If you don't manage your time, it will manage you",
  "Do everything you can, and the rest won't matter",
  "Fast work isn't always the best, but slowness is the enemy of success",
  "Don't forget to rest, but don't waste time on emptiness",
  "Small successes lead to big victories",
  "Do less, but do it better",
  "To achieve success, you must learn to say ‘no’ to unnecessary things",
  "Productivity is not the quantity of tasks completed, but the quality of each one",
  "Action is the key to success",
  "The secret of success is not working harder, but working smarter",
  "You can do anything if you organize your time well",
  "Be ready for change, it always brings new opportunities",
  "Being productive doesn't mean being busy",
  "Strong people act even when they don't feel ready",
  "The best moment is the moment to begin",
  "Productivity is a question of habit, not talent",
  "It's better to spend time preparing than to do everything hastily",
  "Being busy doesn't always mean being productive",
  "Not everything important is always urgent, but it needs to be done first",
  "Doing insignificant things well is also important",
  "Make a plan and follow it without hesitation",
  "Productivity is the art of prioritizing",
  "Success is the result of consistent efforts",
  "Every day is a new chance to be productive",
  "Productivity is the ability to distribute your energy effectively",
  "Better a bitter truth than a sweet lie, especially when it comes to goals",
  "All great achievements start with the first step",
  "Do what you can, and do it well",
  "Delays are the enemies of progress",
  "Don't put off until tomorrow what is important to do today",
  "Every day you don't rest is a chance to achieve more",
  "The most important thing is to start",
  "Keep moving forward, even if you're scared",
  "When you're tired, don't stop, just take a break",
  "Look to the future, but don't forget to work in the present",
  "To take a step forward, you must leave all fears behind",
  "If you want to achieve something, work tirelessly",
  "Don't fear mistakes, they're part of the path to success",
  "To be productive, get rid of the unnecessary",
  "If you want to be successful, be prepared for difficulties",
  "Life is not just a series of events, but a sequence of actions",
  "The secret of successful people is in their habits",
  "Success comes to those who work hard despite obstacles",
  "Every day is a chance to be better than you were yesterday",
  "It's better to move slowly but steadily than to stay in place",
  "Productivity is the mindset of performing tasks with maximum effort",
  "Just start, and everything else will get easier",
  "Ideas mean nothing unless you start acting on them",
  "Do less, but do it better, and it will yield better results",
  "Taking care of yourself is an important part of productivity",
  "The secret to success is proper time management",
  "Time doesn't wait, so act immediately",
  "Don't fear big changes, they might lead to big results"
] as const;

export default function Home() {
  const { user } = useUser(); 
  const router = useRouter();
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
    recordEvent('daysOpened');  // записываем событие открытия приложения
  }, [recordEvent]);
  useEffect(() => {
      if (user === null) {
        router.replace('/login');
      }
  }, [user, router]);
  // Фон, цитата + дни открытия
  useEffect(() => {
    recordEvent('daysOpened');    // 16,17,18: открыть приложение 1/5/10 дней

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
    recordEvent('tasksCreated'); // запись события создания задачи
    const newT: Task = {
      id: crypto.randomUUID(),
      name,
      date,
      priority: { value: 'Usual', color: 'green' },
      status: { value: 'Actual', color: 'amber' },
    };
    updateTasks([...tasks, newT]);
  };

  const handleRenameTask = (id: string, newName: string) =>
    updateTasks(tasks.map((t) => (t.id === id ? { ...t, name: newName } : t)));

  const handleDeleteTask = (id: string) => {
    recordEvent('tasksDeleted'); // записываем событие удаления задачи
    updateTasks(tasks.filter((t) => t.id !== id));
  };

  const handlePrioritySwitch = (id: string, pr: { value: string, color: string }) =>{
    updateTasks(tasks.map((t) => (t.id === id ? { ...t, priority: pr } : t)));
    if (pr.value === 'High') recordEvent('priority_note'); // событие приоритетной задачи
    recordEvent('priorityChange');
  }

  const handleStatusSwitch = (id: string, st: { value: string, color: string }) => {
    updateTasks(tasks.map((t) => (t.id === id ? { ...t, status: st } : t)));
    if (st.value === 'Done') recordEvent('tasksCompleted'); // событие завершения задачи
    recordEvent('statusChange');
  };

  // Режим редактирования / сессии / переключение режима
  const handleToggleEditingMode = () => {
    setIsEditingMode((prev) => !prev);
    recordEvent('sessions'); // событие начала сессии
    recordEvent('modeToggles'); // событие переключения режима
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
            '',
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
