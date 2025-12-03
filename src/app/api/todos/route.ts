import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";

const COLLECTION_NAME = "todos";

// GET - Fetch all todos
export async function GET() {
  try {
    const todosRef = collection(db, COLLECTION_NAME);
    const q = query(todosRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    const todos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    }));

    return NextResponse.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}

// POST - Create a new todo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const todoData = {
      text: text.trim(),
      completed: false,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), todoData);

    return NextResponse.json({
      id: docRef.id,
      ...todoData,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error creating todo:", error);
    return NextResponse.json(
      { error: "Failed to create todo" },
      { status: 500 }
    );
  }
}

// PUT - Update a todo
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, text, completed } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Todo ID is required" },
        { status: 400 }
      );
    }

    const todoRef = doc(db, COLLECTION_NAME, id);
    const updateData: { text?: string; completed?: boolean } = {};

    if (text !== undefined) {
      if (typeof text !== "string" || !text.trim()) {
        return NextResponse.json(
          { error: "Text cannot be empty" },
          { status: 400 }
        );
      }
      updateData.text = text.trim();
    }

    if (completed !== undefined) {
      updateData.completed = Boolean(completed);
    }

    await updateDoc(todoRef, updateData);

    return NextResponse.json({ success: true, id, ...updateData });
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json(
      { error: "Failed to update todo" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a todo
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Todo ID is required" },
        { status: 400 }
      );
    }

    const todoRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(todoRef);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}

