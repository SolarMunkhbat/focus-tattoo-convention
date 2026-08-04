"use client";

import { useState, type FormEvent } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useCollection } from "@/lib/hooks/useCollection";
import { addItem, deleteItem, updateItem } from "@/lib/content-client";
import { useContentStore } from "@/lib/content-context";
import type { ScheduleItem } from "@/lib/types";

const EMPTY = { day: 1 as 1 | 2, time: "", stage: "", title: "", description: "" };

export default function AdminSchedule() {
  const { data: items, loading } = useCollection<ScheduleItem>("schedule", "day", "asc");
  const { refresh } = useContentStore();
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState<ScheduleItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startAdd() {
    setEditing(null);
    setForm(EMPTY);
    setShowForm(true);
  }

  function startEdit(item: ScheduleItem) {
    setEditing(item);
    setForm({ day: item.day, time: item.time, stage: item.stage, title: item.title, description: item.description });
    setShowForm(true);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (editing) {
        await updateItem<ScheduleItem>("schedule", editing.id, form);
      } else {
        await addItem("schedule", form);
      }
      setShowForm(false);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Алдаа гарлаа");
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(item: ScheduleItem) {
    if (!confirm(`"${item.title}"-г устгах уу?`)) return;
    await deleteItem("schedule", item.id);
    await refresh();
  }

  const sorted = [...items].sort((a, b) => a.day - b.day || a.time.localeCompare(b.time));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl">ХӨТӨЛБӨР</h1>
        <button
          onClick={startAdd}
          className="inline-flex items-center gap-2 bg-gold text-ink px-4 py-2 text-sm font-semibold uppercase tracking-wide hover:bg-gold-soft transition-colors"
        >
          <Plus size={16} /> Нэмэх
        </button>
      </div>

      {showForm && (
        <form onSubmit={onSubmit} className="glass p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wide text-ivory/50 mb-1.5">Өдөр</label>
            <select
              value={form.day}
              onChange={(e) => setForm({ ...form, day: Number(e.target.value) as 1 | 2 })}
              className="w-full bg-white/5 border border-white/15 px-3 py-2.5 text-sm outline-none focus:border-gold/60"
            >
              <option value={1} className="bg-ink">Day 1</option>
              <option value={2} className="bg-ink">Day 2</option>
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-ivory/50 mb-1.5">Цаг</label>
            <input
              type="time"
              required
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="w-full bg-white/5 border border-white/15 px-3 py-2.5 text-sm outline-none focus:border-gold/60"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-ivory/50 mb-1.5">Тайз</label>
            <input
              value={form.stage}
              onChange={(e) => setForm({ ...form, stage: e.target.value })}
              className="w-full bg-white/5 border border-white/15 px-3 py-2.5 text-sm outline-none focus:border-gold/60"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-ivory/50 mb-1.5">Гарчиг</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-white/5 border border-white/15 px-3 py-2.5 text-sm outline-none focus:border-gold/60"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs uppercase tracking-wide text-ivory/50 mb-1.5">Тайлбар</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full bg-white/5 border border-white/15 px-3 py-2.5 text-sm outline-none focus:border-gold/60"
            />
          </div>
          {error && <p className="sm:col-span-2 text-blood-soft text-sm">{error}</p>}
          <div className="sm:col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="bg-gold text-ink px-5 py-2.5 text-sm font-semibold uppercase tracking-wide hover:bg-gold-soft transition-colors disabled:opacity-50"
            >
              {submitting ? "Хадгалж байна…" : "Хадгалах"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 text-sm border border-white/15 hover:border-white/30"
            >
              Цуцлах
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-ivory/40 text-sm">Ачааллаж байна…</p>
      ) : (
        <div className="glass divide-y divide-white/10">
          {sorted.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4">
              <span className="text-xs font-display text-gold-soft w-14 shrink-0">D{item.day}</span>
              <span className="text-sm font-display text-gold-soft w-16 shrink-0">{item.time}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">{item.title}</p>
                <p className="text-xs text-ivory/45 truncate">{item.stage}</p>
              </div>
              <button onClick={() => startEdit(item)} className="text-ivory/50 hover:text-gold-soft">
                <Pencil size={14} />
              </button>
              <button onClick={() => onDelete(item)} className="text-ivory/50 hover:text-blood-soft">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {sorted.length === 0 && <p className="text-ivory/40 text-sm p-4">Хөтөлбөрийн мэдээлэл алга байна.</p>}
        </div>
      )}
    </div>
  );
}
