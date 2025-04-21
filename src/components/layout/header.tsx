// components/layout/Header.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  IoCreate,
  IoReturnDownBack,
  IoCalendarOutline,
} from "react-icons/io5";
import { motion } from "framer-motion";
import Image from "next/image";
import { useUser } from "@/contexts/UserContext";
import { AchievementModal } from "@/components/user/AchievementModal";
import { Profile } from "@/components/user/new";

interface HeaderProps {
  onCreateTask: () => void;
  onToggleEdit: () => void;
  onToggleCalendar: () => void;
}

const Header = ({ onCreateTask, onToggleEdit, onToggleCalendar }: HeaderProps) => {
  const { user, updateUser } = useUser();

  const [toolsOpen, setToolsOpen] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setProfileMenu(false);
        setEditingProfile(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const styleMain = {
    background:
      "linear-gradient(90deg, rgba(255,190,146,0.5) 0%, rgba(255,182,167,0.5) 49%, rgba(255,172,147,0.5) 100%)",
    boxShadow: "0 4px 70px rgba(0, 0, 0, 0.079)",
    borderRadius: "100px",
    backdropFilter: "blur(20px)",
  };

  return (
    <>
      <header className="relative flex items-center justify-center px-6 py-4">
        {/* PROFILE */}
        {user && (
          <div ref={menuRef} className="absolute top-5 right-5">
            <div
              onClick={() => {
                setProfileMenu((v) => !v);
                setEditingProfile(false);
              }}
              className="flex items-center space-x-2 rounded-full p-1 cursor-pointer hover:scale-105 transition-all duration-300 bg-amber-50"
            >
              <span className="text-xl font-semibold text-white">{user.name}</span>
              <Image
                src={user.avatar || "/default-avatar.png"}
                alt="avatar"
                width={40}
                height={40}
                className="rounded-full border-2 border-white"
                unoptimized
              />
            </div>

            {profileMenu && !editingProfile && (
              <div className="mt-2 w-40 bg-white/20 backdrop-blur-lg rounded-lg shadow-lg z-50 transition absolute left-[100%] translate-x-[-100%] cursor-pointer">
                <button
                  onClick={() => setEditingProfile(true)}
                  className="w-full text-left px-4 py-2 text-white hover:bg-white/30 cursor-pointer"
                >
                  Изменить профиль
                </button>
              </div>
            )}

            {profileMenu && editingProfile && (
              <Profile
                initialName={user.name}
                initialAvatar={user.avatar}
                onSubmit={(name, avatar) => {
                  updateUser(name, avatar);
                  setEditingProfile(false);
                  setProfileMenu(false);
                }}
                onCancel={() => setEditingProfile(false)}
              />
            )}
          </div>
        )}

        {/* MAIN BUTTON / NAV */}
        {!toolsOpen ? (
          <div
            onClick={() => {
              onToggleEdit();
              setToolsOpen(true);
            }}
            className="cup_transition flex items-center bg-white/20 text-white py-4 px-8 rounded-full shadow-lg backdrop-blur-md cursor-pointer hover:scale-105 transition duration-300"
            style={styleMain}
          >
            <motion.div
              initial={{ opacity: 0, y: -5, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="flex items-center space-x-4 text-3xl font-extrabold"
            >
              <span>Start a</span>
              <Image src="/navigation/cup.svg" alt="cup" width={28} height={28} unoptimized />
              <span>session</span>
            </motion.div>
          </div>
        ) : (
          <nav className="flex items-center space-x-4">
            <button
              onClick={onCreateTask}
              title="Создать задачу"
              className="p-3 bg-white/20 rounded-full hover:scale-110 transition"
              style={styleMain}
            >
              <IoCreate className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={onToggleCalendar}
              title="Календарь"
              className="p-3 bg-white/20 rounded-full hover:scale-110 transition"
              style={styleMain}
            >
              <IoCalendarOutline className="w-6 h-6 text-white" />
            </button>

            {/* <button
              onClick={openModal}
              title="Достижения"
              className="p-3 bg-white/20 rounded-full hover:scale-110 transition"
              style={styleMain}
            >
              <IoTrophyOutline className="w-6 h-6 text-white" />
            </button> */}

            <button
              onClick={() => {
                onToggleEdit();
                setToolsOpen(false);
              }}
              title="Назад"
              className="p-3 bg-white/20 rounded-full hover:scale-110 transition"
              style={styleMain}
            >
              <IoReturnDownBack className="w-6 h-6 text-white" />
            </button>
          </nav>
        )}
      </header>

      <AchievementModal />
    </>
  );
};

export default Header;
