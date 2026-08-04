"use client";

import { useState } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";

/** Pass a `key` (e.g. the item id, or "new" when adding) from the parent so
 * this remounts — and its preview resets — whenever `currentUrl` should change. */
export default function ImageUploadField({
  label,
  currentUrl,
  onFileSelected,
  aspect = "aspect-square",
}: {
  label: string;
  currentUrl?: string;
  onFileSelected: (file: File | null) => void;
  aspect?: string;
}) {
  const [preview, setPreview] = useState<string | undefined>(currentUrl);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    onFileSelected(file);
    if (file) setPreview(URL.createObjectURL(file));
  }

  function clear() {
    onFileSelected(null);
    setPreview(undefined);
  }

  return (
    <div>
      <label className="block text-xs uppercase tracking-wide text-ivory/50 mb-1.5">{label}</label>
      <div className={`relative ${aspect} w-32 bg-white/5 border border-white/15 overflow-hidden group`}>
        {preview ? (
          <Image src={preview} alt="" fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ivory/25">
            <ImagePlus size={22} />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        {preview && (
          <button
            type="button"
            onClick={clear}
            className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={12} />
          </button>
        )}
      </div>
    </div>
  );
}
