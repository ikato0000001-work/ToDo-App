export const runtime = "nodejs";

import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const data = await req.json();

    const existing = await prisma.task.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    const updateData: any = { ...data };
    if (data.dueDate !== undefined) {
      updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    }

    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return Response.json(task);
  } catch (error) {
    console.error("PUT /api/tasks/[id] error:", error);
    return new Response("Invalid JSON or update failed", { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const existing = await prisma.task.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    await prisma.task.delete({
      where: { id: Number(id) },
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/tasks/[id] error:", error);
    return new Response("Delete failed", { status: 400 });
  }
}
