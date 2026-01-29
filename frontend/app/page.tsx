"use client";

import { useState, useEffect } from "react";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  const fetchTodos = () =>
    fetch("http://127.0.0.1:5000/todos")
      .then((res) => res.json())
      .then(setTodos);

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!input) return;
    await fetch("http://127.0.0.1:5000/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: input }),
    });
    setInput("");
    fetchTodos();
  };

  const toggleTodo = async (id: string) => {
    await fetch(`http://127.0.0.1:5000/todos/${id}/toggle`, {
      method: "PATCH",
    });
    fetchTodos();
  };

  const deleteTodo = async (id: string) => {
    await fetch(`http://127.0.0.1:5000/todos/${id}`, {
      method: "DELETE",
    });
    fetchTodos();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-10">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Todo App</h1>
        <div className="flex mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border rounded-l-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Add a new todo"
          />
          <button
            onClick={addTodo}
            className="bg-blue-500 text-white px-4 rounded-r-xl hover:bg-blue-600 transition"
          >
            Add
          </button>
        </div>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id} className="flex justify-between items-center">
              <span
                onClick={() => toggleTodo(todo.id)}
                className={`cursor-pointer ${
                  todo.completed ? "line-through text-gray-400" : ""
                }`}
              >
                {todo.title}
              </span>
              <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
