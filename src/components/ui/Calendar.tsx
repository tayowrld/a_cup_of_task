// components/ui/Calendar.tsx
"use client";
import React, { useState } from "react";

interface CalendarProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export const Calendar = ({ selectedDate, onSelectDate }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const [y, m] = selectedDate.split("-").map(Number);
    return new Date(y, m - 1, 1);
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () =>
    setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () =>
    setCurrentMonth(new Date(year, month + 1, 1));

  // Собираем массив дат
  const blanks = Array(firstDayIndex).fill(null);
  const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Avg", "Sen", "Oct", "Nov", "Dec",
  ];

  const handleClick = (d: number) => {
    const dt = new Date(year, month, d);
    dt.setHours(0, 0, 0, 0);
    if (dt > today) {
      onSelectDate(today.toLocaleDateString("sv-SE"));
    } else {
      onSelectDate(dt.toLocaleDateString("sv-SE"));
    }
  };

  return (
    <div className="p-4 bg-white/20 backdrop-blur-lg rounded-lg shadow-lg z-50 absolute top-35 right-1/2 scale-130">
      <div className="flex justify-between items-center mb-2 text-white">
        <button onClick={prevMonth} className="px-2 cursor-pointer">{"<"}</button>
        <span className="font-semibold">
          {monthNames[month]} {year}
        </span>
        <button onClick={nextMonth} className="px-2 cursor-pointer">{">"}</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm text-white">
        {["sun","mon","tue","wed","thu","fri","sat"].map((wd) => (
          <div key={wd} className="font-medium">{wd}</div>
        ))}
        {blanks.map((_, idx) => (
          <div key={`b${idx}`} />
        ))}
        {dayNumbers.map((d) => {
          const dt = new Date(year, month, d);
          dt.setHours(0,0,0,0);
          const isSelected = selectedDate === dt.toLocaleDateString("sv-SE");
          const isPast = dt > today;
          return (
            <button
              key={d}
              onClick={() => handleClick(d)}
              disabled={isPast}
              className={`
                py-1 rounded 
                ${isSelected ? "bg-green-200 text-black" : ""}
                ${isPast ? "opacity-50 cursor-not-allowed" : "hover:bg-white/30 cursor-pointer"}
                transition 
              `}
            >
              {d}
            </button>
          );
        })}
      </div>
      <button
        onClick={() => onSelectDate(today.toLocaleDateString("sv-SE"))}
        className="mt-3 w-full py-1 bg-blue-200 rounded hover:scale-105 transition text-black cursor-pointer"
      >
        Today
      </button>
    </div>
  );
};
