import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { completed } = await req.json();

  const subtask = await prisma.subtask.update({
    where: { id: Number(id) },
    data: { completed },
  });

  return Response.json(subtask);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  await prisma.subtask.delete({
    where: { id: Number(id) },
  });

  return Response.json({ ok: true });
}
