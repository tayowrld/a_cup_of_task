// workspace.tsx
"use client";
import React from "react";
import { UserProvider, useUser } from "@/contexts/UserContext";
import { Newbie } from "@/components/user/new";
import { motion } from "framer-motion";
import Select from "@/components/ui/select";
import { Task } from "@/types/types";

interface WorkspaceProps {
  tasks: Task[];
  isEditing: boolean;
  selectedDate: string;
  priority?: { value: string; color: string };
  status?: { value: string; color: string };
  onRenameTask: (id: number, newName: string) => void;
  onDeleteTask: (id: number) => void;
  onPrioritySwitch: (id: number, priority: { value: string; color: string }) => void;
  onStatusSwitch: (id: number, status: { value: string; color: string }) => void;
}

const WorkspaceContent = ({
  tasks,
  isEditing,
  selectedDate,
  onRenameTask,
  onDeleteTask,
  onPrioritySwitch,
  onStatusSwitch,
}: WorkspaceProps) => (
  <section className="flex flex-col items-center justify-start space-y-4 mt-2 h-screen text-white">
    <div className="w-fit mx-auto flex flex-col items-end">
      <h2 className="text-3xl bg-amber-50 w-fit p-2">{selectedDate}</h2>
      <ul>
        {tasks
            .filter((task) => task.date === selectedDate)
            .map((task) => (
          <li key={task.id} className="relative z-10">
            <motion.div className="cup_transition grid grid-cols-16 items-center bg-white/40 text-white py-6 px-4 w-screen max-w-[900px] mx-auto mt-6 rounded-full shadow-lg backdrop-blur relative text-2xl gap-2 font-semibold">
              <span className="col-span-7">
                <input
                  type="text"
                  value={task.name.replace(/^~~|~~$/g, "")}
                  onChange={(e) => onRenameTask(task.id, e.target.value)}
                  className="bg-transparent text-white outline-none text-2xl w-full"
                  style={{ border: "none", padding: 0, margin: 0 }}
                />
              </span>

              <span className="col-span-2 text-lg">{task.date}</span>

              <div className="col-span-6 flex justify-center">
                <Select
                  options={[
                    { value: "High", color: "red" },
                    { value: "Normal", color: "green" },
                    { value: "Low", color: "blue" },
                  ]}
                  onChange={(value, color) =>
                    onPrioritySwitch(task.id, { value, color })
                  }
                  color={task.priority?.color ?? "white"}
                  value={task.priority?.value}
                  placeholder={task.priority?.value ?? "Priority"}
                />
              </div>

              {isEditing ? (
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="text-xl hover:scale-110 transition-transform"
                    title="Удалить"
                  >
                    🗑️
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-end">
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
  </section>
);

const WorkspaceWithAuth = (props: WorkspaceProps) => {
  const { user } = useUser();
  return user ? <WorkspaceContent {...props} /> : <Newbie />;
};

const Workspace = (props: WorkspaceProps) => (
  <UserProvider>
    <WorkspaceWithAuth {...props} />
  </UserProvider>
);

export default Workspace;
