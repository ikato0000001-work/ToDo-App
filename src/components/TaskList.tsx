"use client";

import React from "react";
import TaskCard from "./TaskCard";
import { TaskWithSubtasks } from "@/app/actions";

interface TaskListProps {
  tasks: TaskWithSubtasks[];
  onEdit: (task: TaskWithSubtasks) => void;
}

export default function TaskList({ tasks, onEdit }: TaskListProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onEdit={onEdit} />
      ))}
    </div>
  );
}
