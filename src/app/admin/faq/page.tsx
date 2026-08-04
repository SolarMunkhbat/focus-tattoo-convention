"use client";

import { useState, type FormEvent } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useCollection } from "@/lib/hooks/useCollection";
import { addItem, deleteItem, updateItem } from "@/lib/firestore-crud";
import type { FaqItem } from "@/lib/types";

const EMPTY = { question: "", answer: "", order: 0 };

export default function AdminFaq() {
  const { data: faqs, loading } = useCollection<FaqItem>("faq", "order", "asc");
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState<FaqItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function startAdd() {
    setEditing(null);
    setForm({ ...EMPTY, order: faqs.length });
    setShowForm(true);
  }

  function startEdit(item: FaqItem) {
    setEditing(item);
    setForm({ question: item.question, answer: item.answer, order: item.order });
    setShowForm(true);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        await updateItem<FaqItem>("faq", editing.id, form);
      } else {
        await addItem("faq", form);
      }
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(item: FaqItem) {
    if (!confirm("Энэ асуултыг устгах уу?")) return;
    await deleteItem("faq", item.id);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl">FAQ</h1>
        <button
          onClick={startAdd}
          className="inline-flex items-center gap-2 bg-gold text-ink px-4 py-2 text-sm font-semibold uppercase tracking-wide hover:bg-gold-soft transition-colors"
        >
          <Plus size={16} /> Нэмэх
        </button>
      </div>

      {showForm && (
        <form onSubmit={onSubmit} className="glass p-6 mb-8 grid grid-cols-1 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wide text-ivory/50 mb-1.5">Асуулт</label>
            <input
              required
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              className="w-full bg-white/5 border border-white/15 px-3 py-2.5 text-sm outline-none focus:border-gold/60"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-ivory/50 mb-1.5">Хариулт</label>
            <textarea
              required
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              rows={3}
              className="w-full bg-white/5 border border-white/15 px-3 py-2.5 text-sm outline-none focus:border-gold/60"
            />
          </div>
          <div className="w-32">
            <label className="block text-xs uppercase tracking-wide text-ivory/50 mb-1.5">Дараалал</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              className="w-full bg-white/5 border border-white/15 px-3 py-2.5 text-sm outline-none focus:border-gold/60"
            />
          </div>
          <div className="flex gap-3">
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
          {faqs.map((f) => (
            <div key={f.id} className="flex items-start gap-4 p-4">
              <span className="text-xs font-display text-gold-soft w-8 shrink-0">{f.order}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{f.question}</p>
                <p className="text-xs text-ivory/45 mt-1 line-clamp-2">{f.answer}</p>
              </div>
              <button onClick={() => startEdit(f)} className="text-ivory/50 hover:text-gold-soft shrink-0">
                <Pencil size={14} />
              </button>
              <button onClick={() => onDelete(f)} className="text-ivory/50 hover:text-blood-soft shrink-0">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {faqs.length === 0 && <p className="text-ivory/40 text-sm p-4">Асуулт алга байна.</p>}
        </div>
      )}
    </div>
  );
}
