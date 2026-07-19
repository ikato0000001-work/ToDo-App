"use server";

export async function getTasks() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks`, {
    cache: "no-store",
  });
  return res.json();
}

export async function createTask(data: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateTask(id: number, data: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteTask(id: number) {
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks/${id}`, {
    method: "DELETE",
  });
}

export async function createSubtask(taskId: number, title: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/subtasks`, {
    method: "POST",
    body: JSON.stringify({ taskId, title }),
  });
  return res.json();
}

export async function toggleSubtask(id: number, completed: boolean) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/subtasks/${id}`, {
    method: "PUT",
    body: JSON.stringify({ completed }),
  });
  return res.json();
}

export async function deleteSubtask(id: number) {
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/subtasks/${id}`, {
    method: "DELETE",
  });
}
