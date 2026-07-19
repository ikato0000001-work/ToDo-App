"use client";

import React from "react";
import TaskCard from "./TaskCard";
import { TaskWithSubtasks } from "@/types/task";

interface TaskListProps {
  tasks: TaskWithSubtasks[];
  onEdit: (task: TaskWithSubtasks) => void;
  onChange: () => void; // ★ 追加
}

export default function TaskList({ tasks, onEdit, onChange }: TaskListProps) {
  return (
    <div>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onChange={onChange} // ★ TaskCard に渡す
        />
      ))}
    </div>
  );
}
