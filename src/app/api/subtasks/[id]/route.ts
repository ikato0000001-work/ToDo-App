export const runtime = "nodejs";

import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const { completed } = await req.json();

  const subtask = await prisma.subtask.update({
    where: { id },
    data: { completed },
  });

  return Response.json(subtask);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);

  await prisma.subtask.delete({
    where: { id },
  });

  return Response.json({ ok: true });
}
