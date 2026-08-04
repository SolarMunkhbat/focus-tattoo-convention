"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Trash2, Upload } from "lucide-react";
import { useCollection } from "@/lib/hooks/useCollection";
import { addItem, deleteImage, deleteItem, uploadImage } from "@/lib/content-client";
import { useContentStore } from "@/lib/content-context";
import type { GalleryImage } from "@/lib/types";

export default function AdminGallery() {
  const { data: images, loading } = useCollection<GalleryImage>("gallery", "createdAt", "desc");
  const { refresh } = useContentStore();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    setUploading(true);
    setError(null);
    setProgress({ done: 0, total: files.length });

    try {
      for (const file of files) {
        const { url, path } = await uploadImage("gallery", file);
        await addItem("gallery", { imageUrl: url, storagePath: path, caption: "" });
        setProgress((p) => ({ ...p, done: p.done + 1 }));
      }
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Алдаа гарлаа");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function onDelete(img: GalleryImage) {
    if (!confirm("Энэ зургийг устгах уу?")) return;
    await deleteItem("gallery", img.id);
    if (img.storagePath) await deleteImage(img.storagePath);
    await refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl">GALLERY</h1>
        <label className="inline-flex items-center gap-2 bg-gold text-ink px-4 py-2 text-sm font-semibold uppercase tracking-wide hover:bg-gold-soft transition-colors cursor-pointer">
          <Upload size={16} /> Зураг нэмэх
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => onFiles(e.target.files)}
            className="hidden"
          />
        </label>
      </div>

      {uploading && (
        <p className="text-sm text-gold-soft mb-6">
          Байршуулж байна… {progress.done}/{progress.total}
        </p>
      )}
      {error && <p className="text-sm text-blood-soft mb-6">{error}</p>}

      {loading ? (
        <p className="text-ivory/40 text-sm">Ачааллаж байна…</p>
      ) : images.length === 0 ? (
        <p className="text-ivory/40 text-sm">Зураг алга байна.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {images.map((img) => (
            <div key={img.id} className="relative aspect-square bg-white/5 group">
              <Image src={img.imageUrl} alt={img.caption || ""} fill className="object-cover" />
              <button
                onClick={() => onDelete(img)}
                className="absolute top-1.5 right-1.5 bg-black/70 text-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Устгах"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
