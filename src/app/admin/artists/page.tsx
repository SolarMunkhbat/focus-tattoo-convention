"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useCollection } from "@/lib/hooks/useCollection";
import { addItem, deleteImage, deleteItem, updateItem, uploadImage } from "@/lib/content-client";
import { useContentStore } from "@/lib/content-context";
import ImageUploadField from "@/components/admin/ImageUploadField";
import type { Artist } from "@/lib/types";

const EMPTY = { name: "", country: "", studio: "", style: "", instagram: "", bio: "" };

export default function AdminArtists() {
  const { data: artists, loading } = useCollection<Artist>("artists", "name", "asc");
  const { refresh } = useContentStore();
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState<File | null>(null);
  const [editing, setEditing] = useState<Artist | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startAdd() {
    setEditing(null);
    setForm(EMPTY);
    setFile(null);
    setShowForm(true);
  }

  function startEdit(artist: Artist) {
    setEditing(artist);
    setForm({
      name: artist.name,
      country: artist.country,
      studio: artist.studio,
      style: artist.style,
      instagram: artist.instagram,
      bio: artist.bio,
    });
    setFile(null);
    setShowForm(true);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      let photoUrl = editing?.photoUrl ?? "";
      let photoPath = editing?.photoPath ?? "";

      if (file) {
        const oldPath = photoPath;
        const uploaded = await uploadImage("artists", file);
        photoUrl = uploaded.url;
        photoPath = uploaded.path;
        if (oldPath) await deleteImage(oldPath);
      }

      if (editing) {
        await updateItem<Artist>("artists", editing.id, { ...form, photoUrl, photoPath });
      } else {
        await addItem("artists", { ...form, photoUrl, photoPath });
      }
      setShowForm(false);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Алдаа гарлаа");
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(artist: Artist) {
    if (!confirm(`"${artist.name}"-г устгах уу?`)) return;
    await deleteItem("artists", artist.id);
    if (artist.photoPath) await deleteImage(artist.photoPath);
    await refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl">АРТИСТУУД</h1>
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
            label="Зураг"
            currentUrl={editing?.photoUrl}
            onFileSelected={setFile}
          />
          <div className="grid grid-cols-1 gap-3 content-start">
            <Input label="Нэр" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <Input label="Улс" value={form.country} onChange={(v) => setForm({ ...form, country: v })} />
            <Input label="Студи" value={form.studio} onChange={(v) => setForm({ ...form, studio: v })} />
            <Input label="Style" value={form.style} onChange={(v) => setForm({ ...form, style: v })} />
            <Input
              label="Instagram"
              value={form.instagram}
              onChange={(v) => setForm({ ...form, instagram: v })}
              placeholder="@handle"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs uppercase tracking-wide text-ivory/50 mb-1.5">Танилцуулга</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
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
          {artists.map((a) => (
            <div key={a.id} className="glass p-4 flex gap-4">
              <div className="relative w-16 h-16 shrink-0 bg-white/5">
                {a.photoUrl && <Image src={a.photoUrl} alt={a.name} fill className="object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm truncate">{a.name}</p>
                <p className="text-xs text-ivory/45 truncate">{[a.studio, a.country].filter(Boolean).join(" · ")}</p>
                <div className="flex gap-3 mt-2">
                  <button onClick={() => startEdit(a)} className="text-ivory/50 hover:text-gold-soft">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => onDelete(a)} className="text-ivory/50 hover:text-blood-soft">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {artists.length === 0 && <p className="text-ivory/40 text-sm">Артист алга байна.</p>}
        </div>
      )}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wide text-ivory/50 mb-1.5">{label}</label>
      <input
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/15 px-3 py-2.5 text-sm outline-none focus:border-gold/60"
      />
    </div>
  );
}

