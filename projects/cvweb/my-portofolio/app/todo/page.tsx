"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * TODO APP (Mini)
 * Tujuan project ini:
 * - nunjukin basic React/Next: state, event handler, rendering list
 * - nunjukin kebiasaan IT Support yang rapi: catatan/organisasi kerja
 * - simpan data ke localStorage (jadi gak hilang pas refresh)
 */

type Todo = {
  id: string;
  text: string;
  done: boolean;
  createdAt: string; // ISO string, biar enak dibaca & diurutkan
};

type Filter = "all" | "active" | "done";

const STORAGE_KEY = "cvweb:todo:v1";

/**
 * ID generator sederhana.
 * Catatan pemula: cukup untuk demo, tapi bukan ID aman untuk sistem produksi.
 */
function uid() {
  return Math.random().toString(16).slice(2) + "-" + Date.now().toString(16);
}

export default function TodoPage() {
  // input text untuk todo baru
  const [text, setText] = useState("");

  /**
   * todos diset pakai lazy initializer supaya:
   * - localStorage dibaca sekali saat awal render
   * - gak perlu setState di useEffect (lebih clean + lolos lint)
   */
  const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Todo[]) : [];
    } catch {
      return [];
    }
  });

  // filter tampilan list
  const [filter, setFilter] = useState<Filter>("all");

  /**
   * Simpan todos ke localStorage setiap kali berubah.
   * useEffect dipakai untuk sinkronisasi ke "sistem luar" (localStorage).
   */
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // ignore
    }
  }, [todos]);

  // hitung sisa todo yang belum done
  const remaining = useMemo(() => todos.filter((t) => !t.done).length, [todos]);

  // hitung todo yang selesai
  const doneCount = useMemo(() => todos.filter((t) => t.done).length, [todos]);

  // list sesuai filter
  const filteredTodos = useMemo(() => {
    if (filter === "active") return todos.filter((t) => !t.done);
    if (filter === "done") return todos.filter((t) => t.done);
    return todos;
  }, [todos, filter]);

  /**
   * Tambah todo (submit form)
   * Catatan pemula:
   * - e.preventDefault() biar page gak reload
   * - setTodos((prev) => ...) supaya pasti pakai state terbaru
   */
  function addTodo(e: React.FormEvent) {
    e.preventDefault();

    const value = text.trim();
    if (!value) return;

    const newTodo: Todo = {
      id: uid(),
      text: value,
      done: false,
      createdAt: new Date().toISOString(),
    };

    setTodos((prev) => [newTodo, ...prev]);
    setText("");
  }

  // toggle selesai/belum
  function toggle(id: string) {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  // hapus 1 item
  function remove(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  // hapus semua yang sudah done
  function clearDone() {
    setTodos((prev) => prev.filter((t) => !t.done));
  }

  return (
    <>
      <header className="text-center">
        <h1 className="text-3xl font-bold">Todo App</h1>
        <p className="text-gray-300 mt-2">
          Mini project: tambah task, filter, dan simpan otomatis ke LocalStorage.
        </p>
        <p className="text-gray-400 mt-1 text-sm">
          Remaining: <span className="text-white font-semibold">{remaining}</span>
        </p>
      </header>

      <section className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 max-w-2xl mx-auto w-full">
        <form onSubmit={addTodo} className="flex gap-3 mb-6">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tulis todo..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-gray-500"
          />
          <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-semibold">
            Add
          </button>
        </form>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div className="flex gap-2">
            {(["all", "active", "done"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={
                  "px-3 py-1 rounded-lg text-sm border " +
                  (filter === f
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "bg-transparent border-gray-700 text-gray-300 hover:border-gray-500")
                }
                type="button"
              >
                {f === "all" ? "All" : f === "active" ? "Active" : "Done"}
              </button>
            ))}
          </div>

          <div className="text-sm text-gray-400">
            Total: <span className="text-white font-semibold">{todos.length}</span> • Done:{" "}
            <span className="text-white font-semibold">{doneCount}</span>
          </div>
        </div>

        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="text-gray-500">Tidak ada todo untuk filter ini.</div>
          ) : (
            filteredTodos.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between bg-gray-950/40 border border-gray-800 rounded-xl p-4"
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => toggle(t.id)}
                    className="w-4 h-4"
                  />
                  <div>
                    <div className={t.done ? "line-through text-gray-500" : ""}>{t.text}</div>
                    <div className="text-xs text-gray-500">{new Date(t.createdAt).toLocaleString()}</div>
                  </div>
                </label>

                <button onClick={() => remove(t.id)} className="text-sm text-red-400 hover:text-red-300">
                  Hapus
                </button>
              </div>
            ))
          )}
        </div>

        {todos.some((t) => t.done) && (
          <button onClick={clearDone} className="mt-6 text-sm text-gray-300 hover:text-white underline">
            Hapus semua yang selesai
          </button>
        )}
      </section>

      {/*
        Catatan pembelajaran:
        - useState: nyimpen data yang berubah-ubah (text, todos, filter)
        - useEffect: sinkronisasi ke localStorage setiap todos berubah
        - useMemo: nge-cache perhitungan (remaining/doneCount/filteredTodos) supaya lebih rapi & efisien
      */}
    </>
  );
}
