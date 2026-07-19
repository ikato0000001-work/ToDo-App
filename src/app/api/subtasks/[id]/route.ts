export const runtime = "nodejs";

import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { completed } = await req.json();

    const subtask = await prisma.subtask.update({
      where: { id: Number(id) },
      data: { completed },
    });

    return Response.json(subtask);
  } catch (error) {
    console.error("PUT /api/subtasks/[id] error:", error);
    return new Response("Invalid JSON or update failed", { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.subtask.delete({
      where: { id: Number(id) },
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/subtasks/[id] error:", error);
    return new Response("Delete failed", { status: 400 });
  }
}
