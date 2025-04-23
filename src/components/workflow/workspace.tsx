// workspace.tsx
"use client";
import React from "react";;
import { motion } from "framer-motion";
import Select from "@/components/ui/select";
import { Task } from "@/types/types";
import Image from "next/image";

interface WorkspaceProps {
  tasks: Task[];
  isEditing: boolean;
  selectedDate: string;
  priority?: { value: string; color: string };
  status?: { value: string; color: string };
  onRenameTask: (id: string, newName: string) => void;
  onDeleteTask: (id: string) => void;
  onPrioritySwitch: (id: string, priority: { value: string; color: string }) => void;
  onStatusSwitch: (id: string, status: { value: string; color: string }) => void;
}

export const Workspace = ({
  tasks,
  isEditing,
  selectedDate,
  onRenameTask,
  onDeleteTask,
  onPrioritySwitch,
  onStatusSwitch,
}: WorkspaceProps) => (
  <section className="flex flex-col items-center justify-start space-y-4 mt-2 h-full text-white">
    <div className="w-fit mx-auto flex flex-col items-end">
      <h2 className="text-3xl bg-amber-50 w-fit p-2 z-0">{selectedDate}</h2>
      <div className=" max-h-[calc(100%-300px)] z-1">
        <ul>
          {tasks
              .filter((task) => task.date === selectedDate)
              .map((task) => (
            <li key={task.id} className="relative z-10 h-fit">
              <motion.div className="cup_transition flex justify-between h-fit items-center bg-white/40 text-white py-2 border-black border-2 px-4 w-screen max-w-[950px] mx-auto mt-6 shadow-lg backdrop-blur relative text-2xl gap-2 font-semibold">
              <div className="relative h-[3em] flex items-center overflow-hidden px-4 bg-[#eee3d2]/30 w-full col-span-12 border-2 border-black/60">
                <textarea
                  value={task.name.replace(/^~~|~~$/g, "")}
                  onChange={(e) => {
                    const value = e.target.value;
                    const lines = value.split("\n");
                    if (lines.length <= 2 && lines.every(line => line.length <= 50)) {
                      onRenameTask(task.id, value);
                    }
                  }}
                  rows={2}
                  className="w-full bg-transparent text-black placeholder:text-neutral-600 font-pixel text-[1.45rem] font-light leading-tight resize-none outline-none pt-[0.4em]"
                  placeholder="New task"
                  style={{
                    height: "2.25em", // 2 strokes
                    overflow: "hidden"
                  }}
                />
              </div>
              <div className="col-span-1 flex justify-start cursor-pointer w-[124px] relative z-10">
                <Select
                  options={[
                    { value: "Matter", color: "red" },
                    { value: "Usual", color: "green" },
                    { value: "Maybe", color: "blue" },
                  ]}
                  onChange={(value, color) =>
                    onPrioritySwitch(task.id, { value, color })
                  }
                  color={task.priority?.color ?? "white"}
                  value={task.priority?.value}
                  placeholder={task.priority?.value}
                />
              </div>

              {isEditing ? (
                <div className="flex gap-2 justify-center items-center w-[124px]">
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="text-xl hover:scale-110 transition-transform cursor-pointer bg-[#ffdab9d9] border-2 border-black box-border"
                    title="Delete task"
                  >
                    <Image
                      src="/navigation/trash.svg"
                      alt="trash"
                      width={56}
                      height={56}
                      className="p-1"
                    />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-end cursor-pointer w-[124px]">
                  <Select
                    options={[
                      { value: "Actual", color: "amber" },
                      { value: "Done", color: "green" },
                    ]}
                    onChange={(value, color) =>
                      onStatusSwitch(task.id, { value, color })
                    }
                    color={task.status?.color}
                    value={task.status?.value}
                    placeholder={task.status?.value}
                  />
                </div>
              )}
              </motion.div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default Workspace;
