export const runtime = "nodejs";

import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const data = await req.json(); // ★ Content-Type が無いと落ちる → fetch 側で必ず付ける

    // ① まず存在チェック
    const existing = await prisma.task.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    // ② 更新データ整形
    const updateData: any = { ...data };
    if (data.dueDate !== undefined) {
      updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    }

    // ③ 更新
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

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params;

    // ① 存在チェック
    const existing = await prisma.task.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    // ② 削除
    await prisma.task.delete({
      where: { id: Number(id) },
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/tasks/[id] error:", error);
    return new Response("Delete failed", { status: 400 });
  }
}
