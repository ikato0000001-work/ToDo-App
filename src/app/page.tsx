import React from "react";
import DashboardContainer from "@/components/DashboardContainer";

export const dynamic = "force-dynamic";

export default async function Home() {
  try {
    const tasksRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });

    if (!tasksRes.ok) {
      console.error("Failed to fetch tasks:", await tasksRes.text());
      return <div>タスクの取得に失敗しました。</div>;
    }

    const initialTasks = await tasksRes.json();

    const categoriesRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });

    let initialCategories = [];
    if (categoriesRes.ok) {
      initialCategories = await categoriesRes.json();
    }

    return (
      <DashboardContainer
        initialTasks={initialTasks}
        initialCategories={initialCategories}
      />
    );
  } catch (error) {
    console.error("Home page error:", error);
    return <div>ページの読み込みに失敗しました。</div>;
  }
}
