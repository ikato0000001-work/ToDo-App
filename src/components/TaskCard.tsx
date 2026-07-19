"use client";

import React, { useState } from "react";
import styles from "./TaskCard.module.css";
import { TaskWithSubtasks } from "@/types/task";

interface TaskCardProps {
  task: TaskWithSubtasks;
  onEdit: (task: TaskWithSubtasks) => void;
}

export default function TaskCard({ task, onEdit }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = task.subtasks.length;
  const progressPercent =
    totalSubtasks > 0
      ? Math.round((completedSubtasks / totalSubtasks) * 100)
      : 0;

  // -----------------------------
  // API Route 呼び出しに完全移行
  // -----------------------------

  const BASE = process.env.NEXT_PUBLIC_BASE_URL;

  // Toggle main task completion status
  const handleToggleComplete = async () => {
    try {
      await fetch(`${BASE}/api/tasks/${task.id}`, {
        method: "PUT",
        body: JSON.stringify({ completed: !task.completed }),
      });
    } catch (error) {
      console.error("Failed to toggle task:", error);
    }
  };

  // Delete main task
  const handleDeleteTask = async () => {
    if (confirm("このタスクを削除してもよろしいですか？")) {
      try {
        await fetch(`${BASE}/api/tasks/${task.id}`, {
          method: "DELETE",
        });
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  // Add a subtask
  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim() || isAddingSubtask) return;

    setIsAddingSubtask(true);
    try {
      await fetch(`${BASE}/api/subtasks`, {
        method: "POST",
        body: JSON.stringify({
          taskId: task.id,
          title: newSubtaskTitle.trim(),
        }),
      });
      setNewSubtaskTitle("");
    } catch (error) {
      console.error("Failed to add subtask:", error);
    } finally {
      setIsAddingSubtask(false);
    }
  };

  // Toggle subtask status
  const handleToggleSubtask = async (id: number, currentCompleted: boolean) => {
    try {
      await fetch(`${BASE}/api/subtasks/${id}`, {
        method: "PUT",
        body: JSON.stringify({ completed: !currentCompleted }),
      });
    } catch (error) {
      console.error("Failed to toggle subtask:", error);
    }
  };

  // Delete a subtask
  const handleDeleteSubtask = async (id: number) => {
    try {
      await fetch(`${BASE}/api/subtasks/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to delete subtask:", error);
    }
  };

  // Format due date and check if overdue
  const formatDate = (dateString: Date | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}/${mm}/${dd}`;
  };

  const isOverdue = task.dueDate
    ? new Date(task.dueDate).getTime() <
        new Date().setHours(0, 0, 0, 0) && !task.completed
    : false;

  return (
    <div className={`${styles.card} ${styles[`priority_${task.priority}`]}`}>
      <div className={styles.header}>
        {/* Checkbox */}
        <label className={styles.checkboxContainer}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggleComplete}
          />
          <span className={styles.checkmark} />
        </label>

        {/* Title and Meta */}
        <div className={styles.titleArea}>
          <h3
            className={`${styles.title} ${
              task.completed ? styles.completedTitle : ""
            }`}
          >
            {task.title}
          </h3>
          <div className={styles.metaRow}>
            <span className={styles.categoryBadge}>{task.category}</span>

            {task.dueDate && (
              <span
                className={`${styles.dueDate} ${
                  isOverdue ? styles.overdue : ""
                }`}
              >
                {formatDate(task.dueDate)} {isOverdue && "(期限超過)"}
              </span>
            )}

            {totalSubtasks > 0 && (
              <span className={styles.dueDate}>
                チェックリスト: {completedSubtasks}/{totalSubtasks} (
                {progressPercent}%)
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <button
            className={styles.actionButton}
            onClick={() => onEdit(task)}
            title="編集"
          >
            ✏️
          </button>
          <button
            className={`${styles.actionButton} ${styles.deleteBtn}`}
            onClick={handleDeleteTask}
            title="削除"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Toggle Details Button */}
      {(task.description || totalSubtasks >= 0) && (
        <button
          className={styles.expandButton}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span>{isExpanded ? "詳細を閉じる" : "詳細を表示"}</span>
        </button>
      )}

      {/* Expanded Body */}
      {isExpanded && (
        <div className={styles.body}>
          {task.description && (
            <p className={styles.description}>{task.description}</p>
          )}

          {/* Subtasks Section */}
          <div className={styles.subtasksSection}>
            <div className={styles.subtasksHeader}>
              <span>チェックリスト</span>
              <span>{progressPercent}% 完了</span>
            </div>

            {totalSubtasks > 0 && (
              <div className={styles.subtasksList}>
                {task.subtasks.map((subtask) => (
                  <div key={subtask.id} className={styles.subtaskItem}>
                    <label
                      className={`${styles.subtaskLabel} ${
                        subtask.completed ? styles.subtaskLabelCompleted : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        className={styles.subtaskCheckbox}
                        checked={subtask.completed}
                        onChange={() =>
                          handleToggleSubtask(subtask.id, subtask.completed)
                        }
                      />
                      {subtask.title}
                    </label>
                    <button
                      className={styles.deleteSubtaskBtn}
                      onClick={() => handleDeleteSubtask(subtask.id)}
                      title="サブタスクを削除"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Subtask Form */}
            <form onSubmit={handleAddSubtask} className={styles.subtaskForm}>
              <input
                type="text"
                className={styles.subtaskInput}
                placeholder="新しいチェックアイテム..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
              />
              <button
                type="submit"
                className={styles.subtaskAddBtn}
                disabled={isAddingSubtask}
              >
                追加
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
