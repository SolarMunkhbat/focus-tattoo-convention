"use client";

import { useState, type FormEvent } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useCollection } from "@/lib/hooks/useCollection";
import { addItem, deleteItem, updateItem } from "@/lib/firestore-crud";
import type { BattleCategory } from "@/lib/types";

const EMPTY = { day: 1 as 1 | 2, groupName: "", itemNumber: "", itemText: "" };

export default function AdminBattles() {
  const { data: items, loading } = useCollection<BattleCategory>("battles", "order", "asc");
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState<BattleCategory | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function startAdd() {
    setEditing(null);
    setForm(EMPTY);
    setShowForm(true);
  }

  function startEdit(item: BattleCategory) {
    setEditing(item);
    setForm({
      day: item.day,
      groupName: item.groupName,
      itemNumber: item.itemNumber,
      itemText: item.itemText,
    });
    setShowForm(true);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        await updateItem<BattleCategory>("battles", editing.id, form);
      } else {
        const maxOrder = items.reduce((m, i) => Math.max(m, i.order), -1);
        await addItem("battles", { ...form, order: maxOrder + 1 });
      }
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(item: BattleCategory) {
    if (!confirm(`"${item.itemText}"-г устгах уу?`)) return;
    await deleteItem("battles", item.id);
  }

  const sorted = [...items].sort((a, b) => a.day - b.day || a.order - b.order);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl">ТЭМЦЭЭНИЙ АНГИЛАЛ</h1>
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
            <label className="block text-xs uppercase tracking-wide text-ivory/50 mb-1.5">Дугаар</label>
            <input
              value={form.itemNumber}
              onChange={(e) => setForm({ ...form, itemNumber: e.target.value })}
              placeholder="1, 2, 3 эсвэл хоосон"
              className="w-full bg-white/5 border border-white/15 px-3 py-2.5 text-sm outline-none focus:border-gold/60"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs uppercase tracking-wide text-ivory/50 mb-1.5">
              Бүлгийн нэр (жишээ: Healed Tattoo Competition)
            </label>
            <input
              required
              value={form.groupName}
              onChange={(e) => setForm({ ...form, groupName: e.target.value })}
              className="w-full bg-white/5 border border-white/15 px-3 py-2.5 text-sm outline-none focus:border-gold/60"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs uppercase tracking-wide text-ivory/50 mb-1.5">
              Ангиллын нэр (жишээ: Best Traditional Tattoo)
            </label>
            <input
              required
              value={form.itemText}
              onChange={(e) => setForm({ ...form, itemText: e.target.value })}
              className="w-full bg-white/5 border border-white/15 px-3 py-2.5 text-sm outline-none focus:border-gold/60"
            />
          </div>
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
              <span className="text-xs font-display text-gold-soft w-10 shrink-0">D{item.day}</span>
              <span className="text-xs font-display text-ivory/50 w-8 shrink-0">{item.itemNumber || "—"}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">{item.itemText}</p>
                <p className="text-xs text-ivory/45 truncate">{item.groupName}</p>
              </div>
              <button onClick={() => startEdit(item)} className="text-ivory/50 hover:text-gold-soft">
                <Pencil size={14} />
              </button>
              <button onClick={() => onDelete(item)} className="text-ivory/50 hover:text-blood-soft">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {sorted.length === 0 && <p className="text-ivory/40 text-sm p-4">Ангилал алга байна.</p>}
        </div>
      )}
    </div>
  );
}
