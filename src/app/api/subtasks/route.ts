export const runtime = "nodejs";

import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { taskId, title } = await req.json();

    const subtask = await prisma.subtask.create({
      data: { title, taskId },
    });

    return Response.json(subtask);
  } catch (error) {
    console.error("Failed to parse JSON or create subtask:", error);
    return new Response("Invalid JSON", { status: 400 });
  }
}
