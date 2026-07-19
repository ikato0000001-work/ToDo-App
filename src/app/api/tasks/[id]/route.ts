import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const data = await req.json();

  // ① まず存在チェック
  const existing = await prisma.task.findUnique({
    where: { id: Number(id) },
  });

  if (!existing) {
    return new Response(JSON.stringify({ error: "Task not found" }), { status: 404 });
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
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  // ① 存在チェック
  const existing = await prisma.task.findUnique({
    where: { id: Number(id) },
  });

  if (!existing) {
    return new Response(JSON.stringify({ error: "Task not found" }), { status: 404 });
  }

  // ② 削除
  await prisma.task.delete({
    where: { id: Number(id) },
  });

  return Response.json({ ok: true });
}
