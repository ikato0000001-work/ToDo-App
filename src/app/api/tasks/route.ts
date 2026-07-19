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
