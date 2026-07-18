"use client";

import React, { useState } from "react";
import styles from "./TaskCard.module.css";
import { 
  TaskWithSubtasks, 
  updateTask, 
  deleteTask, 
  createSubtask, 
  toggleSubtask, 
  deleteSubtask 
} from "@/app/actions";

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
  const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  // Toggle main task completion status
  const handleToggleComplete = async () => {
    try {
      await updateTask(task.id, { completed: !task.completed });
    } catch (error) {
      console.error("Failed to toggle task:", error);
    }
  };

  // Delete main task
  const handleDeleteTask = async () => {
    if (confirm("このタスクを削除してもよろしいですか？")) {
      try {
        await deleteTask(task.id);
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
      await createSubtask(task.id, newSubtaskTitle.trim());
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
      await toggleSubtask(id, !currentCompleted);
    } catch (error) {
      console.error("Failed to toggle subtask:", error);
    }
  };

  // Delete a subtask
  const handleDeleteSubtask = async (id: number) => {
    try {
      await deleteSubtask(id);
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
    ? new Date(task.dueDate).getTime() < new Date().setHours(0, 0, 0, 0) && !task.completed
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
          <h3 className={`${styles.title} ${task.completed ? styles.completedTitle : ""}`}>
            {task.title}
          </h3>
          <div className={styles.metaRow}>
            <span className={styles.categoryBadge}>{task.category}</span>
            
            {task.dueDate && (
              <span className={`${styles.dueDate} ${isOverdue ? styles.overdue : ""}`}>
                <svg
                  className={styles.dueDateIcon}
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
                {formatDate(task.dueDate)} {isOverdue && "(期限超過)"}
              </span>
            )}
            
            {totalSubtasks > 0 && (
              <span className={styles.dueDate}>
                チェックリスト: {completedSubtasks}/{totalSubtasks} ({progressPercent}%)
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
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </button>
          <button
            className={`${styles.actionButton} ${styles.deleteBtn}`}
            onClick={handleDeleteTask}
            title="削除"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
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
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
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
                    <label className={`${styles.subtaskLabel} ${subtask.completed ? styles.subtaskLabelCompleted : ""}`}>
                      <input
                        type="checkbox"
                        className={styles.subtaskCheckbox}
                        checked={subtask.completed}
                        onChange={() => handleToggleSubtask(subtask.id, subtask.completed)}
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
