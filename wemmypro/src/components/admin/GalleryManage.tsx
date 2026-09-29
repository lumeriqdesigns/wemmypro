"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { publicPhotoUrl } from "@/lib/utils";
import type { Gallery, Photo } from "@/types/database";

export function GalleryManage({
  gallery,
  photos: initialPhotos,
}: {
  gallery: Gallery;
  photos: Photo[];
}) {
  const router = useRouter();
  const [photos, setPhotos] = useState(initialPhotos);
  const [g, setG] = useState(gallery);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const [password, setPassword] = useState("");

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/g/${g.slug}`
      : `/g/${g.slug}`;

  async function saveSettings(patch: Partial<Gallery> & { password_plain?: string }) {
    setMsg("");
    const supabase = createClient();
    const { password_plain, ...rest } = patch;
    const update: Record<string, unknown> = { ...rest };
    if (password_plain !== undefined) {
      update.password_hash = password_plain
        ? btoa(password_plain) // simple obfuscation; replace with bcrypt edge fn in production
        : null;
    }
    const { error } = await supabase.from("galleries").update(update).eq("id", g.id);
    if (error) {
      setMsg(error.message);
      return;
    }
    setG((prev) => ({ ...prev, ...rest } as Gallery));
    setMsg("Saved");
    router.refresh();
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    setMsg("");
    const supabase = createClient();
    const newPhotos: Photo[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${g.id}/${Date.now()}-${i}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("gallery-photos")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) {
        setMsg(upErr.message);
        continue;
      }
      const { data, error } = await supabase
        .from("photos")
        .insert({
          gallery_id: g.id,
          storage_path: path,
          thumbnail_path: path,
          position: photos.length + newPhotos.length,
        })
        .select("*")
        .single();
      if (!error && data) newPhotos.push(data as Photo);
    }

    setPhotos((p) => [...p, ...newPhotos]);
    if (!g.cover_photo_url && newPhotos[0]) {
      await saveSettings({
        cover_photo_url: publicPhotoUrl(newPhotos[0].storage_path),
      });
    }
    setUploading(false);
    setMsg(`Uploaded ${newPhotos.length} photo(s)`);
    router.refresh();
    e.target.value = "";
  }

  async function removePhoto(id: string, storagePath: string) {
    const supabase = createClient();
    await supabase.storage.from("gallery-photos").remove([storagePath]);
    await supabase.from("photos").delete().eq("id", id);
    setPhotos((p) => p.filter((x) => x.id !== id));
    router.refresh();
  }

  function copyLink() {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/g/${g.slug}`
    );
    setMsg("Share link copied");
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl italic">{g.title}</h1>
          <p className="mt-1 font-mono text-xs text-[#6b6760]">/g/{g.slug}</p>
        </div>
        <button type="button" className="btn btn-outline" onClick={copyLink}>
          Copy share link
        </button>
      </div>

      {msg && <p className="text-sm text-[#6b6760]">{msg}</p>}

      {/* Settings */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="card space-y-4">
          <h2 className="font-serif text-xl">Visibility</h2>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={g.is_published}
              onChange={(e) => {
                setG({ ...g, is_published: e.target.checked });
                saveSettings({ is_published: e.target.checked });
              }}
            />
            Published (visible via share link)
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={g.allow_downloads}
              onChange={(e) => {
                setG({ ...g, allow_downloads: e.target.checked });
                saveSettings({ allow_downloads: e.target.checked });
              }}
            />
            Allow downloads
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={g.watermark_previews}
              onChange={(e) => {
                setG({ ...g, watermark_previews: e.target.checked });
                saveSettings({ watermark_previews: e.target.checked });
              }}
            />
            Watermark previews
          </label>
          <div>
            <label className="label">Max downloads (blank = unlimited)</label>
            <input
              className="input"
              type="number"
              min={1}
              value={g.max_downloads ?? ""}
              onChange={(e) =>
                setG({
                  ...g,
                  max_downloads: e.target.value ? Number(e.target.value) : null,
                })
              }
              onBlur={() =>
                saveSettings({ max_downloads: g.max_downloads })
              }
            />
          </div>
          <div>
            <label className="label">Expiry date</label>
            <input
              className="input"
              type="date"
              value={g.expires_at?.slice(0, 10) ?? ""}
              onChange={(e) =>
                saveSettings({
                  expires_at: e.target.value
                    ? new Date(e.target.value).toISOString()
                    : null,
                })
              }
            />
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="font-serif text-xl">Password protect</h2>
          <p className="text-sm text-[#6b6760]">
            Optional. Leave blank and save to remove password.
          </p>
          <input
            className="input"
            type="password"
            placeholder="Set gallery password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="btn btn-ink"
            onClick={() => {
              saveSettings({ password_plain: password });
              setPassword("");
            }}
          >
            Save password
          </button>
          {g.password_hash && (
            <p className="text-xs text-green-800">Password is set</p>
          )}
        </div>
      </div>

      {/* Upload */}
      <div className="card">
        <h2 className="mb-4 font-serif text-xl">Photos</h2>
        <label className="btn btn-gold cursor-pointer">
          {uploading ? "Uploading…" : "Upload photos"}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={onUpload}
          />
        </label>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {photos.map((p) => (
            <div key={p.id} className="group relative aspect-square overflow-hidden bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={publicPhotoUrl(p.thumbnail_path || p.storage_path)}
                alt=""
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removePhoto(p.id, p.storage_path)}
                className="absolute right-2 top-2 bg-black/70 px-2 py-1 text-[0.6rem] uppercase tracking-wider text-white opacity-0 group-hover:opacity-100"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        {!photos.length && (
          <p className="mt-4 text-sm text-[#6b6760]">No photos yet</p>
        )}
      </div>
    </div>
  );
}
