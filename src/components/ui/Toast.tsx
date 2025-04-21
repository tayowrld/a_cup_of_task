"use client";
import React from "react";
import { useToast } from "@/contexts/ToastContext";
import { motion, AnimatePresence } from "framer-motion";

export const ToastContainer = () => {
  const { toasts } = useToast();
  return (
    <div className="fixed top-4 left-4 flex flex-col space-y-2 z-1000">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="bg-white/20 backdrop-blur-lg text-white px-4 py-2 rounded-lg shadow-lg"
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};