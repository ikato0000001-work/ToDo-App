import React from "react";
import DashboardContainer from "@/components/DashboardContainer";
import { getTasks, getCategories } from "./actions";

export const dynamic = "force-dynamic";

export default async function Home() {
  const initialTasks = await getTasks();
  const initialCategories = await getCategories();

  return (
    <DashboardContainer
      initialTasks={initialTasks}
      initialCategories={initialCategories}
    />
  );
}
