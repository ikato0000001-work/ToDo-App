"use client";

import React, { useState, useEffect } from "react";
import styles from "./TaskModal.module.css";
import { createTask, updateTask, TaskWithSubtasks } from "@/app/actions";
import { Priority } from "@prisma/client";

interface TaskModalProps {
  task: TaskWithSubtasks | null; // Null means we are creating a new task
  onClose: () => void;
  categories: string[];
}

export default function TaskModal({ task, onClose, categories }: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [category, setCategory] = useState("General");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setPriority(task.priority);
      setCategory(task.category);
      if (task.dueDate) {
        // Convert Date to YYYY-MM-DD for input[type="date"]
        const date = new Date(task.dueDate);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        setDueDate(`${yyyy}-${mm}-${dd}`);
      } else {
        setDueDate("");
      }
    } else {
      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setCategory("General");
      setDueDate("");
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        category: category.trim() || "General",
        dueDate: dueDate || null,
      };

      if (task) {
        await updateTask(task.id, payload);
      } else {
        await createTask(payload);
      }
      onClose();
    } catch (error) {
      console.error("Failed to save task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{task ? "タスクを編集" : "新規タスク作成"}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Title */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="title">
              タイトル
            </label>
            <input
              type="text"
              id="title"
              className={styles.input}
              placeholder="タスクの名前を入力..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="description">
              説明
            </label>
            <textarea
              id="description"
              className={`${styles.input} ${styles.textarea}`}
              placeholder="タスクの詳細を入力..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
            />
          </div>

          <div className={styles.row}>
            {/* Priority */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="priority">
                優先度
              </label>
              <select
                id="priority"
                className={styles.input}
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                <option value="HIGH">HIGH (高)</option>
                <option value="MEDIUM">MEDIUM (中)</option>
                <option value="LOW">LOW (低)</option>
              </select>
            </div>

            {/* Category */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="category">
                カテゴリー
              </label>
              <input
                type="text"
                id="category"
                className={styles.input}
                placeholder="例: Work, Personal"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                list="category-suggestions"
              />
              <datalist id="category-suggestions">
                {categories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Due Date */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="dueDate">
              期限日
            </label>
            <input
              type="date"
              id="dueDate"
              className={styles.input}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className={styles.actions}>
            <button
              type="button"
              className={`${styles.button} ${styles.cancelBtn}`}
              onClick={onClose}
              disabled={isSubmitting}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className={`${styles.button} ${styles.saveBtn}`}
              disabled={isSubmitting}
            >
              {task ? "更新する" : "作成する"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
