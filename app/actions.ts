"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function addTodo(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) {
    return;
  }
  await prisma.todo.create({ data: { title } });
  revalidatePath("/");
}

export async function toggleTodo(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) {
    return;
  }
  const todo = await prisma.todo.findUnique({ where: { id } });
  if (!todo) {
    return;
  }
  await prisma.todo.update({ where: { id }, data: { done: !todo.done } });
  revalidatePath("/");
}
