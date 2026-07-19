export const runtime = "nodejs";

import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();
  const id = Number(params.id);

  const updateData: any = { ...data };
  if (data.dueDate !== undefined) {
    updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  }

  const task = await prisma.task.update({
    where: { id },
    data: updateData,
  });

  return Response.json(task);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);

  await prisma.task.delete({
    where: { id },
  });

  return Response.json({ ok: true });
}
