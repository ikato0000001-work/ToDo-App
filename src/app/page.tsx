import React from "react";
import DashboardContainer from "@/components/DashboardContainer";

export const dynamic = "force-dynamic";

export default async function Home() {
  const tasksRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks`, {
    cache: "no-store",
  });
  const initialTasks = await tasksRes.json();

  const categoriesRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`, {
    cache: "no-store",
  });
  const initialCategories = await categoriesRes.json();

  return (
    <DashboardContainer
      initialTasks={initialTasks}
      initialCategories={initialCategories}
    />
  );
}
