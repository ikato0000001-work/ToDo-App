"use client";

import React, { useState } from "react";
import styles from "./Dashboard.module.css";
import StatsCard from "./StatsCard";
import Filters from "./Filters";
import TaskList from "./TaskList";
import TaskModal from "./TaskModal";
import { TaskWithSubtasks } from "@/types/task";

interface DashboardContainerProps {
  initialTasks: TaskWithSubtasks[];
  initialCategories: string[];
}

export default function DashboardContainer({
  initialTasks,
  initialCategories,
}: DashboardContainerProps) {
  const [tasks] = useState<TaskWithSubtasks[]>(initialTasks);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [priority, setPriority] = useState("All");
  const [sortBy, setSortBy] = useState("createdAt_desc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithSubtasks | null>(null);

  // We actually want to use the hot revalidated props tasks directly so that Server Actions update the UI!
  // In Next.js, when server actions call revalidatePath, the page component re-renders with new database data.
  // By using initialTasks directly (which updates when page re-renders), the UI automatically updates!
  const currentTasks = initialTasks;

  // Dynamically extract categories from current tasks to keep it updated
  const categoriesList = Array.from(
    new Set([...initialCategories, ...currentTasks.map((t) => t.category)])
  ).filter(Boolean);

  // Filter tasks
  const filteredTasks = currentTasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      (task.description &&
        task.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = category === "All" || task.category === category;
    const matchesPriority = priority === "All" || task.priority === priority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const [field, direction] = sortBy.split("_");
    const isDesc = direction === "desc";

    if (field === "createdAt") {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return isDesc ? timeB - timeA : timeA - timeB;
    }

    if (field === "dueDate") {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1; // Put tasks without due date at the end
      if (!b.dueDate) return -1;
      const timeA = new Date(a.dueDate).getTime();
      const timeB = new Date(b.dueDate).getTime();
      return isDesc ? timeB - timeA : timeA - timeB;
    }

    if (field === "priority") {
      const weights = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      const weightA = weights[a.priority] || 0;
      const weightB = weights[b.priority] || 0;
      return isDesc ? weightB - weightA : weightA - weightB;
    }

    return 0;
  });

  const handleEditClick = (task: TaskWithSubtasks) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleClearFilters = () => {
    setSearch("");
    setCategory("All");
    setPriority("All");
    setSortBy("createdAt_desc");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Nebula Tasks</h1>
          <p>クリーンなグラスモーフィズムデザインのタスク管理ダッシュボード</p>
        </div>
        <button className={styles.addButton} onClick={handleCreateClick}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          タスクを追加
        </button>
      </header>

      <div className={styles.contentGrid}>
        <aside className={styles.sidebar}>
          <StatsCard tasks={currentTasks} />
          <Filters
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            priority={priority}
            setPriority={setPriority}
            sortBy={sortBy}
            setSortBy={setSortBy}
            categories={categoriesList}
          />
        </aside>

        <main className={styles.mainPanel}>
          {sortedTasks.length > 0 ? (
            <TaskList tasks={sortedTasks} onEdit={handleEditClick} />
          ) : (
            <div className={styles.noTasks}>
              <h3>該当するタスクが見つかりません</h3>
              <p>検索条件やフィルターを変更するか、新しいタスクを追加してください。</p>
              {(search || category !== "All" || priority !== "All") && (
                <button className={styles.clearFilterBtn} onClick={handleClearFilters}>
                  フィルターをリセット
                </button>
              )}
            </div>
          )}
        </main>
      </div>

      {isModalOpen && (
        <TaskModal
          task={editingTask}
          onClose={handleCloseModal}
          categories={categoriesList}
        />
      )}
    </div>
  );
}
