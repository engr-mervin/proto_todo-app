"use client";

import { useEffect, useState } from "react";
import { Todo } from "../../types/todo";
const Home = function () {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [deadline, setDeadline] = useState<string>("");

  useEffect(() => {
    const getTodos = async function () {
      const response = await fetch("/api/todo");

      const data = await response.json();

      const todos = data.todos as Todo[];

      setTodos(todos);
    };

    getTodos();
  });

  const deleteTodo = async function (id: string) {
    const response = await fetch(`/api/todo/${id}`, {
      method: "DELETE",
    });

    const body = await response.json();
    console.log(body);
  };

  const sendTodo = async function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const body = new FormData();

    body.append("title", title);
    body.append("description", description);
    body.append("priority", priority);
    body.append("deadline", deadline);

    const response = await fetch("/api/todo", {
      method: "POST",
      body,
    });
  };
  return (
    <>
      <h1>Todo App</h1>
      <form onSubmit={sendTodo}>
        <div>
          <label>Title</label>
          <input
            type="text"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </div>
        <div>
          <label>Priority</label>
          <select
            defaultValue="None"
            onChange={(e) => {
              setPriority(e.target.value);
            }}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
            <option value="None">None</option>
          </select>
        </div>
        <div>
          <label>Deadline</label>
          <input
            type="date"
            onChange={(e) => setDeadline(e.target.value)}
          ></input>
        </div>
        <button type="submit">Save</button>
      </form>
      <ul>
        {todos
          ? todos.map((el) => (
              <li key={el.id}>
                <h2>{el.title}</h2>
                <p>{el.description}</p>
                <p>{el.priority}</p>
                <p>{el.deadline}</p>
                <p>{el.createdAt}</p>
                <button type="button">Edit</button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    deleteTodo(el.id);
                  }}
                >
                  Delete
                </button>
              </li>
            ))
          : ""}
      </ul>
    </>
  );
};

export default Home;
