export type Role = "admin" | "user";

export interface User {
  id: number;
  name: string;
  password: string;
  role: Role;
}

export type TaskStatus = "todo" | "progress" | "done";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  assignedTo: number;
  projectId: number | null;
  createdAt: string;
  dueDate: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  members: number[];
}