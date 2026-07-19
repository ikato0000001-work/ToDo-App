"use client";

import React, { useEffect, useState } from "react";
import DashboardContainer from "@/components/DashboardContainer";

export default function Home() {
  const [initialTasks, setInitialTasks] = useState([]);
  const [initialCategories, setInitialCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        // タスク取得
        const tasksRes = await fetch("/api/tasks", {
          headers: { "Content-Type": "application/json" },
        });

        if (!tasksRes.ok) {
          setError("タスクの取得に失敗しました。");
          return;
        }

        const tasks = await tasksRes.json();
        setInitialTasks(tasks);

        // カテゴリ取得
        const categoriesRes = await fetch("/api/categories", {
          headers: { "Content-Type": "application/json" },
        });

        if (categoriesRes.ok) {
          const categories = await categoriesRes.json();
          setInitialCategories(categories);
        }
      } catch (err) {
        console.error("Home page error:", err);
        setError("ページの読み込みに失敗しました。");
      }
    }

    load();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <DashboardContainer
      initialTasks={initialTasks}
      initialCategories={initialCategories}
    />
  );
}
