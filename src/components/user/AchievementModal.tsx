"use client";
import React from "react";
import { useACH } from "@/contexts/AchievementContext";
import { motion } from "framer-motion";

export const AchievementModal = () => {
  const { achievements, isModalOpen, closeModal } = useACH();

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <motion.div
        className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl max-w-md w-full text-white"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Достижения</h2>
        <ul className="space-y-4">
          {achievements.map((a) => {
            const circumference = 2 * Math.PI * 30;
            const offset = circumference * (1 - a.progress);
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
                  <circle
                    cx="34"
                    cy="34"
                    r="30"
                    stroke="#4CAF50"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    transform="rotate(-90 34 34)"
                  />
                </svg>
                <div>
                  <div className="text-3xl">{a.icon}</div>
                  <p className="text-base">{a.title}</p>
                </div>
              </li>
            );
          })}
        </ul>
        <button
          onClick={closeModal}
          className="mt-6 w-full py-2 bg-red-200 rounded-full hover:scale-105 transition"
        >
          Закрыть
        </button>
      </motion.div>
    </div>
  );
};
