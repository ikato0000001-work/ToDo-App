export const runtime = "nodejs";

import prisma from "@/lib/prisma";

export async function GET() {
  const tasks = await prisma.task.findMany({
    include: {
      subtasks: {
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(tasks);
}

export async function POST(req: Request) {
  const data = await req.json();

  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description || null,
      priority: data.priority,
      category: data.category || "General",
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    },
  });

  return Response.json(task);
}
