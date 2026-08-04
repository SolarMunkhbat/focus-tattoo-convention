"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useCollection } from "@/lib/hooks/useCollection";
import { addItem, deleteImage, deleteItem, updateItem, uploadImage } from "@/lib/content-client";
import { useContentStore } from "@/lib/content-context";
import ImageUploadField from "@/components/admin/ImageUploadField";
import type { Sponsor } from "@/lib/types";

const EMPTY = { name: "", website: "", description: "" };

export default function AdminSponsors() {
  const { data: sponsors, loading } = useCollection<Sponsor>("sponsors", "createdAt", "asc");
  const { refresh } = useContentStore();
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState<File | null>(null);
  const [editing, setEditing] = useState<Sponsor | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startAdd() {
    setEditing(null);
    setForm(EMPTY);
    setFile(null);
    setShowForm(true);
  }

  function startEdit(sponsor: Sponsor) {
    setEditing(sponsor);
    setForm({ name: sponsor.name, website: sponsor.website, description: sponsor.description });
    setFile(null);
    setShowForm(true);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      let logoUrl = editing?.logoUrl ?? "";
      let logoPath = editing?.logoPath ?? "";

      if (file) {
        const oldPath = logoPath;
        const uploaded = await uploadImage("sponsors", file);
        logoUrl = uploaded.url;
        logoPath = uploaded.path;
        if (oldPath) await deleteImage(oldPath);
      }

      if (editing) {
        await updateItem<Sponsor>("sponsors", editing.id, { ...form, logoUrl, logoPath });
      } else {
        await addItem("sponsors", { ...form, logoUrl, logoPath });
      }
      setShowForm(false);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Алдаа гарлаа");
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(sponsor: Sponsor) {
    if (!confirm(`"${sponsor.name}"-г устгах уу?`)) return;
    await deleteItem("sponsors", sponsor.id);
    if (sponsor.logoPath) await deleteImage(sponsor.logoPath);
    await refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl">SPONSOR</h1>
        <button
          onClick={startAdd}
          className="inline-flex items-center gap-2 bg-gold text-ink px-4 py-2 text-sm font-semibold uppercase tracking-wide hover:bg-gold-soft transition-colors"
        >
          <Plus size={16} /> Нэмэх
        </button>
      </div>

      {showForm && (
        <form onSubmit={onSubmit} className="glass p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ImageUploadField
            key={editing?.id ?? "new"}
            label="Лого"
            currentUrl={editing?.logoUrl}
            onFileSelected={setFile}
          />
          <div className="grid grid-cols-1 gap-3 content-start">
            <div>
              <label className="block text-xs uppercase tracking-wide text-ivory/50 mb-1.5">Нэр</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white/5 border border-white/15 px-3 py-2.5 text-sm outline-none focus:border-gold/60"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-ivory/50 mb-1.5">Website</label>
              <input
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="https://"
                className="w-full bg-white/5 border border-white/15 px-3 py-2.5 text-sm outline-none focus:border-gold/60"
              />
            </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sponsors.map((s) => (
            <div key={s.id} className="glass p-4 flex gap-4">
              <div className="relative w-16 h-16 shrink-0 bg-white/5">
                {s.logoUrl && <Image src={s.logoUrl} alt={s.name} fill className="object-contain" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm truncate">{s.name}</p>
                <p className="text-xs text-ivory/45 truncate">{s.website}</p>
                <div className="flex gap-3 mt-2">
                  <button onClick={() => startEdit(s)} className="text-ivory/50 hover:text-gold-soft">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => onDelete(s)} className="text-ivory/50 hover:text-blood-soft">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {sponsors.length === 0 && <p className="text-ivory/40 text-sm">Sponsor алга байна.</p>}
        </div>
      )}
    </div>
  );
}
