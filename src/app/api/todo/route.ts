import { readFileSync, writeFile } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { Todo } from "../../../../types/todo";

export const path = join(process.cwd(), "public", "data.json");
export let todos = JSON.parse(readFileSync(path, "utf-8")).todos as Todo[]; // an array of todo

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const createdAt = new Date().toISOString();
  const data = {
    id: uuidv4(),
    title: formData.get("title"),
    description: formData.get("description"),
    priority: formData.get("priority") ? formData.get("priority") : "None",
    deadline: formData.get("deadline"),
    createdAt: createdAt,
  } as Todo;

  try {
    await new Promise<void>((resolve, reject) => {
      todos.push(data);
      const newTodos = { todos: todos };
      console.log(newTodos);
      writeFile(path, JSON.stringify(newTodos), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    return NextResponse.json({ message: "ok", status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "fail", status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "ok", status: 200, todos: todos });
}
