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

  return (
    <>
      <header className="relative flex items-center justify-center px-4 py-5 sm:px-6">
        <div ref={menuRef} className="absolute top-5 right-5">
          {user && (
            <motion.div
            className="top-5 right-5 flex items-center gap-2 bg-[#fff8ee89] px-2 py-1 border-2 border-black cursor-pointer hover:brightness-105 transition-all"
                onClick={() => {
                  setProfileMenu((v) => !v);
                  setEditingProfile(false);
                }}>
              <span className="text-2xl font-bold text-black pixel-font">{user?.name}</span>
              <Image
                src={user?.avatar || "/navigation/cup.svg"}
                alt="avatar"
                width={56}
                height={56}
                className="border-2 border-black p-1"
                unoptimized
              />
            </motion.div>
          )}
          {((user && profileMenu) || editingProfile) && (
            <div className="mt-2 w-56 bg-white/20 rounded shadow-lg z-50 absolute left-[100%] translate-x-[-100%]">
              <Profile
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
              </Profile>
            </div>
          )}
        </div>
        {!toolsOpen ? (
          <div
            onClick={() => {
              onToggleEdit();
              setToolsOpen(true);
            }}
            className="cup_transition flex items-center py-5 border-2 border-black bg-[#fff8ee89] text-white px-8 shadow-lg backdrop-blur-md cursor-pointer hover:scale-105 transition duration-300"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
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
          <motion.nav
            className="flex items-center justify-center gap-2 px-2 space-x-3 py-1 border-2 border-black bg-[#fff8ee89]"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {[
              { src: "/navigation/new.svg", title: "New", onClick: onCreateTask },
              { src: "/navigation/calendar.svg", title: "Calendar", onClick: onToggleCalendar },
              { src: "/navigation/achivement.svg", title: "Achievements", onClick: openModal },
              { src: "/navigation/done.svg", title: "Done", onClick: () => { onToggleEdit(); setToolsOpen(false); } },
            ].map(({ src, title, onClick }, i) => (
              <motion.button
                key={i}
                onClick={onClick}
                title={title}
                className=" bg-[#ffdab9d9] border-2 border-black hover:brightness-110 transition pixel-font cursor-pointer"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
              >
                <Image src={src} alt={title} width={56} height={56} className="p-1" />
              </motion.button>
            ))}
          </motion.nav>
        )}
      </header>
      <AchievementModal />
    </>
  );
};

export default Header;
