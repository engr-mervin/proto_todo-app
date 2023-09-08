import { NextResponse, NextRequest } from "next/server";
import { todos, path } from "../route";
import { writeFile } from "fs";

type Params = {
  params: { id: string };
};

export async function DELETE(req: NextRequest, { params }: Params) {
  const id = params.id;
  const index = todos.findIndex((el) => {
    return el.id === id;
  });

  if (index === -1) {
    return NextResponse.json({ message: "fail", status: 404 });
  }

  todos.splice(index, 1);

  try {
    await new Promise<void>((resolve, reject) => {
      writeFile(path, JSON.stringify({ todos: todos }), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    return NextResponse.json({ message: "ok", status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "fail", status: 500, error: err });
  }
}
