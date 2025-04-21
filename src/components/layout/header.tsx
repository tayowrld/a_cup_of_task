// components/layout/Header.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useUser } from "@/contexts/UserContext";
import { AchievementModal } from "@/components/user/AchievementModal";
import { useACH } from "@/contexts/AchievementContext";
import { Profile } from "@/components/user/new";

interface HeaderProps {
  onCreateTask: () => void;
  onToggleEdit: () => void;
  onToggleCalendar: () => void;
}

const Header = ({ onCreateTask, onToggleEdit, onToggleCalendar }: HeaderProps) => {
  const { user, register, updateUser } = useUser();
  const { openModal } = useACH();
  const [toolsOpen, setToolsOpen] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // close menus on outside click
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
        {/* PROFILE / REGISTER */}
        <div ref={menuRef} className="absolute top-5 right-5">
          {user && (
            // once logged-in: show name/avatar
            <div
              onClick={() => {
                setProfileMenu((v) => !v);
                setEditingProfile(false);
              }}
              className="flex items-center space-x-2 rounded-full p-1 cursor-pointer hover:scale-105 transition-all duration-300 bg-amber-50"
            >
              <span className="text-xl font-semibold text-white">{user.name}</span>
              <Image
                src={user.avatar || "/navigation/cup.svg"}
                alt="avatar"
                width={40}
                height={40}
                className="rounded-full border-2 border-white"
                unoptimized
              />
            </div>
          )}

          {/* dropdown for edit vs register form */}
          {((user && profileMenu) || editingProfile) && (
            <div className="mt-2 w-56 bg-white/20 backdrop-blur-lg rounded-lg shadow-lg z-50 absolute left-[100%] translate-x-[-100%]">
              <Profile
                // if editing existing, prefill; else blank
                initialName={user?.name ?? ""}
                initialAvatar={user?.avatar ?? ""}
                onSubmit={(name, avatar) => {
                  if (user) {
                    updateUser(name, avatar);
                  } else {
                    register(name, avatar);
                  }
                  setEditingProfile(false);
                  setProfileMenu(false);
                }}
                onCancel={() => {
                  setEditingProfile(false);
                  setProfileMenu(false);
                }}
              >
                {/* hide inner register/edit button,
                    we’re handling submit in the header */}
              </Profile>
            </div>
          )}
        </div>

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
              className="flex items-center space-x-4 text-3xl font-semibold"
            >
              <span>Edit</span>
              <Image src="/navigation/cup.svg" alt="cup" width={28} height={28} />
              <span>session</span>
            </motion.div>
          </div>
        ) : (
          <motion.nav className="flex items-center space-x-4 transition-colors duration-300 cup_transition"
              initial={{ opacity: 0, y: -5, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}>
            <button
              onClick={onCreateTask}
              title="Create task"
              className="p-3 bg-white/20 rounded-full hover:scale-110 transition duration-400 cursor-pointer"
              style={styleMain}
            >
              <Image src="/navigation/new.svg" alt="new" width={40} height={40} />
            </button>
            <button
              onClick={onToggleCalendar}
              title="Calendar"
              className="p-3 bg-white/20 rounded-full hover:scale-110 transition cursor-pointer"
              style={styleMain}
            >
              <Image src="/navigation/calendar.svg" alt="calendar" width={40} height={40} />
            </button>
            <button
              onClick={openModal}
              title="Achivments"
              className="p-3 bg-white/20 rounded-full hover:scale-110 transition cursor-pointer"
              style={styleMain}
            >
              <Image src="/navigation/achivement.svg" alt="achieve" width={40} height={40} />
            </button>
            <button
              onClick={() => {
                onToggleEdit();
                setToolsOpen(false);
              }}
              title="Назад"
              className="p-3 bg-white/20 rounded-full hover:scale-110 transition cursor-pointer"
              style={styleMain}
            >
              <Image src="/navigation/done.svg" alt="done" width={40} height={40} />
            </button>
          </motion.nav>
        )}
      </header>

      <AchievementModal />
    </>
  );
};

export default Header;
