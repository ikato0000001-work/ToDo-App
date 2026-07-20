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
  const [tasks, setTasks] = useState<TaskWithSubtasks[]>(initialTasks);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [priority, setPriority] = useState("All");
  const [sortBy, setSortBy] = useState("createdAt_desc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithSubtasks | null>(null);

  // ★ BASE を使わない（これが正しい）
  const refreshTasks = async () => {
    const res = await fetch("/api/tasks", { cache: "no-store" });
    const updated = await res.json();
    setTasks(updated);
  };

  const currentTasks = tasks;

  const categoriesList = Array.from(
    new Set([...initialCategories, ...currentTasks.map((t) => t.category)])
  ).filter(Boolean);

  const filteredTasks = currentTasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      (task.description &&
        task.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = category === "All" || task.category === category;
    const matchesPriority = priority === "All" || task.priority === priority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const [field, direction] = sortBy.split("_");
    const isDesc = direction === "desc";

    if (field === "createdAt") {
      return isDesc
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }

    if (field === "dueDate") {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return isDesc
        ? new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
        : new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }

    if (field === "priority") {
      const weights = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      return isDesc
        ? weights[b.priority] - weights[a.priority]
        : weights[a.priority] - weights[b.priority];
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
    refreshTasks(); // ★ モーダル閉じたら最新化
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
          ＋ タスクを追加
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
            <TaskList
              tasks={sortedTasks}
              onEdit={handleEditClick}
              onChange={refreshTasks} // ★ TaskCard と連携
            />
          ) : (
            <div className={styles.noTasks}>
              <h3>該当するタスクが見つかりません</h3>
              <p>検索条件やフィルターを変更するか、新しいタスクを追加してください。</p>
              {(search || category !== "All" || priority !== "All") && (
                <button
                  className={styles.clearFilterBtn}
                  onClick={handleClearFilters}
                >
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
