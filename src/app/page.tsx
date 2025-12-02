"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Edit2, Check, X, Plus } from "lucide-react"

interface Todo {
  id: number
  text: string
  completed: boolean
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputValue, setInputValue] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingText, setEditingText] = useState("")

  // Add new todo
  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
      }
      setTodos([...todos, newTodo])
      setInputValue("")
    }
  }

  // Delete todo
  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  // Toggle completion
  const toggleComplete = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  // Start editing
  const startEditing = (todo: Todo) => {
    setEditingId(todo.id)
    setEditingText(todo.text)
  }

  // Save edit
  const saveEdit = () => {
    if (editingText.trim() && editingId !== null) {
      setTodos(todos.map((todo) => (todo.id === editingId ? { ...todo, text: editingText.trim() } : todo)))
      setEditingId(null)
      setEditingText("")
    }
  }

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null)
    setEditingText("")
  }

  const activeTodos = todos.filter((todo) => !todo.completed).length
  const completedTodos = todos.filter((todo) => todo.completed).length

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          <h1 className="text-3xl font-bold text-foreground">Task Manager</h1>
          <p className="text-sm text-muted-foreground mt-1">Organize your tasks efficiently</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-8 w-full">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 bg-accent/50">
            <div className="text-2xl font-bold text-foreground">{activeTodos}</div>
            <div className="text-sm text-muted-foreground">Active Tasks</div>
          </Card>
          <Card className="p-4 bg-accent/50">
            <div className="text-2xl font-bold text-foreground">{completedTodos}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </Card>
        </div>

        {/* Add Todo Form */}
        <Card className="p-4 mb-6">
          <div className="flex gap-2">
            <Input
              placeholder="Add a new task..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addTodo()
              }}
              className="flex-1"
            />
            <Button onClick={addTodo} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Todo List */}
        <div className="space-y-2">
          {todos.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No tasks yet. Add one to get started!</p>
            </Card>
          ) : (
            todos.map((todo) => (
              <Card key={todo.id} className="p-4 hover:bg-accent/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Checkbox checked={todo.completed} onCheckedChange={() => toggleComplete(todo.id)} />

                  {editingId === todo.id ? (
                    <div className="flex-1 flex gap-2">
                      <Input
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit()
                          if (e.key === "Escape") cancelEdit()
                        }}
                        className="flex-1"
                        autoFocus
                      />
                      <Button onClick={saveEdit} size="icon" variant="ghost" className="h-9 w-9">
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button onClick={cancelEdit} size="icon" variant="ghost" className="h-9 w-9">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span
                        className={`flex-1 text-foreground ${
                          todo.completed ? "line-through text-muted-foreground" : ""
                        }`}
                      >
                        {todo.text}
                      </span>
                      <Button onClick={() => startEditing(todo)} size="icon" variant="ghost" className="h-9 w-9">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => deleteTodo(todo.id)}
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 text-destructive hover:text-destructive"
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
      <footer className="border-t border-border bg-card mt-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <p className="text-sm text-muted-foreground text-center">Built with Next.js • {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  )
}
