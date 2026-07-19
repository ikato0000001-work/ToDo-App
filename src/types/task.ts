import { Task, Subtask } from "@prisma/client";

export type TaskWithSubtasks = Task & {
  subtasks: Subtask[];
};
