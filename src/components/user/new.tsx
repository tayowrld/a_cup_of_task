"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";

interface RegistrationFormProps {
  initialName?: string;
  initialAvatar?: string;
  onSubmit: (name: string, avatar: string) => void;
  onCancel?: () => void;
}
export const Newbie = () => {
  const { register } = useUser();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white-200 p-6">
      <h2 className="text-2xl mb-4 text-[#130a07]">Hello! What is your name?</h2>
      <input
        className="mb-3 p-2 border rounded w-64"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="mb-3 p-2 border rounded w-64"
        placeholder="Avatar URL"
        value={avatar}
        onChange={(e) => setAvatar(e.target.value)}
      />
      <button
        onClick={() => {
          if (!name.trim()) return;
          register(name.trim(), avatar.trim());
        }}
        className="px-4 py-2 bg-green-200 rounded shadow hover:scale-105 transition"
      >
        Take a sit here
      </button>
    </div>
  );
};

export default Newbie;
export const Profile = ({
  initialName = "",
  initialAvatar = "",
  onSubmit,
  onCancel,
}: RegistrationFormProps) => {
  const [name, setName] = useState(initialName);
  const [avatar, setAvatar] = useState(initialAvatar);

  useEffect(() => {
    setName(initialName);
    setAvatar(initialAvatar);
  }, [initialName, initialAvatar]);

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white/95 p-4 rounded border-2 border-black shadow-lg z-50">
      <label className="block mb-2 text-white">
        Name
        <input
          className="mt-1 w-full p-2 rounded bg-white/80 text-black"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label className="block mb-4 text-white">
        Avatar URL
        <input
          className="mt-1 w-full p-2 rounded bg-white/80 text-black"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
        />
      </label>
      <div className="flex justify-between">
        <button
          onClick={() => onSubmit(name.trim(), avatar.trim())}
          className="px-3 py-1 bg-green-200 rounded hover:scale-105 transition cursor-pointer"
        >
          Save
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-3 py-1 bg-red-200 rounded hover:scale-105 transition cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};
