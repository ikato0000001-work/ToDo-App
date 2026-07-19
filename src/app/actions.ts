"use server";

import prisma from "@/lib/prisma";
import { Priority, Task, Subtask } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

export type TaskWithSubtasks = Task & {
  subtasks: Subtask[];
};

export async function getTasks(filters?: {
  search?: string;
  category?: string;
  priority?: string;
  sortBy?: string;
}): Promise<TaskWithSubtasks[]> {
  const { search, category, priority, sortBy } = filters || {};

  const where: any = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (category && category !== "All") {
    where.category = category;
  }

  if (priority && priority !== "All") {
    where.priority = priority as Priority;
  }

  let orderBy: any = { createdAt: "desc" };
  if (sortBy) {
    const [field, direction] = sortBy.split("_");
    if (field !== "priority") {
      orderBy = { [field]: direction };
    }
  }

  const tasks = await prisma.task.findMany({
    where,
    include: {
      subtasks: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy,
  }) as TaskWithSubtasks[];

  // Custom priority sorting: HIGH -> MEDIUM -> LOW
  if (sortBy && sortBy.startsWith("priority")) {
    const isDesc = sortBy.endsWith("desc");
    const priorityWeight: Record<Priority, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    tasks.sort((a, b) => {
      const weightA = priorityWeight[a.priority] || 0;
      const weightB = priorityWeight[b.priority] || 0;
      return isDesc ? weightB - weightA : weightA - weightB;
    });
  }

  return tasks;
}

export async function createTask(data: {
  title: string;
  description?: string;
  priority: Priority;
  category: string;
  dueDate?: string | null;
}) {
  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description || null,
      priority: data.priority,
      category: data.category || "General",
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    },
  });
  revalidatePath("/");
  return task;
}

export async function updateTask(
  id: number,
  data: {
    title?: string;
    description?: string | null;
    completed?: boolean;
    priority?: Priority;
    category?: string;
    dueDate?: string | null;
  }
) {
  const updateData: any = { ...data };
  if (data.dueDate !== undefined) {
    updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  }
  const task = await prisma.task.update({
    where: { id },
    data: updateData,
  });
  revalidatePath("/");
  return task;
}

export async function deleteTask(id: number) {
  await prisma.task.delete({
    where: { id },
  });
  revalidatePath("/");
}

export async function createSubtask(taskId: number, title: string) {
  const subtask = await prisma.subtask.create({
    data: {
      title,
      taskId,
    },
  });
  revalidatePath("/");
  return subtask;
}

export async function toggleSubtask(id: number, completed: boolean) {
  const subtask = await prisma.subtask.update({
    where: { id },
    data: { completed },
  });
  revalidatePath("/");
  return subtask;
}

export async function deleteSubtask(id: number) {
  await prisma.subtask.delete({
    where: { id },
  });
  revalidatePath("/");
}

export async function getCategories(): Promise<string[]> {
  const tasks = await prisma.task.findMany({
    select: {
      category: true,
    },
    distinct: ["category"],
  });
  const dbCategories = tasks.map((t) => t.category);
  const defaults = ["General", "Work", "Personal", "Health", "Shopping"];
  return Array.from(new Set([...defaults, ...dbCategories]));
}
