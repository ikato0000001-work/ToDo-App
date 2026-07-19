export const runtime = "nodejs";

import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { taskId, title } = await req.json();

  const subtask = await prisma.subtask.create({
    data: { title, taskId },
  });

  return Response.json(subtask);
}
