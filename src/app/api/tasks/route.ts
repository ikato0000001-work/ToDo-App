export const runtime = "nodejs";

import prisma from "@/lib/prisma";

export async function GET() {
  console.log("API /api/tasks called");

  try {
    const tasks = await prisma.task.findMany({
      include: {
        subtasks: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    console.log("tasks:", tasks);
    return Response.json(tasks);
  } catch (error) {
    console.error("GET /api/tasks error:", error);
    return new Response("Failed to fetch tasks", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json(); // ★ JSON パース失敗時に例外が出る

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
  } catch (error) {
    console.error("POST /api/tasks error:", error);
    return new Response("Invalid JSON or failed to create task", { status: 400 });
  }
}
