"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Edit2, Check, X, Plus, Loader2 } from "lucide-react";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all todos from the API
  const fetchTodos = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch("/api/todos");
      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      console.error("Error fetching todos:", err);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Add new todo
  const addTodo = async () => {
    if (!inputValue.trim()) return;

    setIsAdding(true);
    setError(null);

    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputValue.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to create todo");
      }

      const newTodo = await response.json();
      setTodos([newTodo, ...todos]);
      setInputValue("");
    } catch (err) {
      console.error("Error adding todo:", err);
      setError("Failed to add task. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  // Delete todo
  const deleteTodo = async (id: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/todos?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }

      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
      setError("Failed to delete task. Please try again.");
    }
  };

  // Toggle completion
  const toggleComplete = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    try {
      setError(null);
      const response = await fetch("/api/todos", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, completed: !todo.completed }),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }

      setTodos(
        todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
    } catch (err) {
      console.error("Error toggling todo:", err);
      setError("Failed to update task. Please try again.");
    }
  };

  // Start editing
  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
  };

  // Save edit
  const saveEdit = async () => {
    if (!editingText.trim() || editingId === null) return;

    try {
      setError(null);
      const response = await fetch("/api/todos", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: editingId, text: editingText.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }

      setTodos(
        todos.map((todo) =>
          todo.id === editingId ? { ...todo, text: editingText.trim() } : todo
        )
      );
      setEditingId(null);
      setEditingText("");
    } catch (err) {
      console.error("Error saving edit:", err);
      setError("Failed to update task. Please try again.");
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const activeTodos = todos.filter((todo) => !todo.completed).length;
  const completedTodos = todos.filter((todo) => todo.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-emerald-500/20 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            Task Manager
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Organize your tasks efficiently
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-8 w-full">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 bg-slate-800/50 border-emerald-500/20 backdrop-blur-sm">
            <div className="text-2xl font-bold text-emerald-400">
              {activeTodos}
            </div>
            <div className="text-sm text-slate-400">Active Tasks</div>
          </Card>
          <Card className="p-4 bg-slate-800/50 border-emerald-500/20 backdrop-blur-sm">
            <div className="text-2xl font-bold text-teal-400">
              {completedTodos}
            </div>
            <div className="text-sm text-slate-400">Completed</div>
          </Card>
        </div>

        {/* Add Todo Form */}
        <Card className="p-4 mb-6 bg-slate-800/50 border-emerald-500/20 backdrop-blur-sm">
          <div className="flex gap-2">
            <Input
              placeholder="Add a new task..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isAdding) addTodo();
              }}
              disabled={isAdding}
              className="flex-1 bg-slate-900/50 border-slate-700 text-slate-200 placeholder:text-slate-500 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
            />
            <Button
              onClick={addTodo}
              size="icon"
              disabled={isAdding || !inputValue.trim()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              {isAdding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          </div>
        </Card>

        {/* Todo List */}
        <div className="space-y-2">
          {isLoading ? (
            <Card className="p-8 text-center bg-slate-800/50 border-emerald-500/20">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-400 mx-auto" />
              <p className="text-slate-400 mt-2">Loading tasks...</p>
            </Card>
          ) : todos.length === 0 ? (
            <Card className="p-8 text-center bg-slate-800/50 border-emerald-500/20">
              <div className="text-4xl mb-2">📝</div>
              <p className="text-slate-400">
                No tasks yet. Add one to get started!
              </p>
            </Card>
          ) : (
            todos.map((todo) => (
              <Card
                key={todo.id}
                className="p-4 bg-slate-800/50 border-emerald-500/20 hover:bg-slate-800/70 transition-all duration-200 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleComplete(todo.id)}
                    className="border-slate-600 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                  />

                  {editingId === todo.id ? (
                    <div className="flex-1 flex gap-2">
                      <Input
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit();
                          if (e.key === "Escape") cancelEdit();
                        }}
                        className="flex-1 bg-slate-900/50 border-slate-700 text-slate-200 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
                        autoFocus
                      />
                      <Button
                        onClick={saveEdit}
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={cancelEdit}
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 text-slate-400 hover:text-slate-300 hover:bg-slate-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span
                        className={`flex-1 text-slate-200 ${
                          todo.completed
                            ? "line-through text-slate-500"
                            : ""
                        }`}
                      >
                        {todo.text}
                      </span>
                      <Button
                        onClick={() => startEditing(todo)}
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/20"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => deleteTodo(todo.id)}
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 text-slate-400 hover:text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-500/20 bg-slate-900/50 backdrop-blur-sm mt-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <p className="text-sm text-slate-500 text-center">
            Built with Next.js & Firebase • {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
