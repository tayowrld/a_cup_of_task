"use client";
import React from "react";
import { useACH } from "@/contexts/AchievementContext";
import { motion } from "framer-motion";

// AchievementModal component
export const AchievementModal = () => {
  const { achievements, isModalOpen, closeModal } = useACH();

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 overflow-hidden">
      <motion.div
        className="bg-white/50 backdrop-blur-lg p-6 rounded max-w-md w-full text-white max-h-1/2 overflow-y-auto"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Achivements</h2>
        <ul className="space-y-4">
          {achievements.map((a) => {
            const circumference = 2 * Math.PI * 30;
            const offset = circumference * (1 - a.progress / 100); // исправили расчёт
            return (
              <li key={a.id} className="flex items-center space-x-4">
                <svg width="68" height="68" className="drop-shadow-lg">
                  <circle
                    cx="34"
                    cy="34"
                    r="30"
                    stroke="#555"
                    strokeWidth="4"
                    fill="none"
                  />
                  <motion.circle
                    cx="34"
                    cy="34"
                    r="30"
                    stroke="#4CAF50"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    transform="rotate(-90 34 34)"
                    animate={{ strokeDashoffset: offset }} // плавная анимация
                    transition={{ duration: 1, type: "spring" }}
                  />
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#fff"
                    fontSize="16"
                    fontWeight="bold"
                    dy=".3em"
                  >{a.icon}</text>
                </svg>
                <div className="flex flex-col">
                  <h2 className="font-extrabold text-2xl m-0">{a.name}</h2><br />
                  <p className="m-0 ">{a.title}</p>
                </div>
              </li>
            );
          })}
        </ul>
        <button
          onClick={closeModal}
          className="sticky mt-6 bottom-0 left-0 w-full py-2 bg-[#ff8181d9] rounded hover:scale-105 transition cursor-pointer text-2xl"
        >
          Close
        </button>
      </motion.div>
    </div>
  );
};