"use client";

import { useEffect, useMemo, useState } from "react";
import { publicPhotoUrl } from "@/lib/utils";
import {
  commitDownload,
  isLimitReached,
  readDownloadState,
  remainingDownloads,
  tryReserveDownload,
} from "@/lib/downloadLimit";
import type { Gallery, Photo } from "@/types/database";

const FAV_KEY = (slug: string) => `wp-fav-${slug}`;

export function ClientGallery({
  gallery,
  photos,
}: {
  gallery: Gallery;
  photos: Photo[];
}) {
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [dlCount, setDlCount] = useState(0);
  const [lightbox, setLightbox] = useState<Photo | null>(null);
  const [pwOk, setPwOk] = useState(!gallery.password_hash);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState("");
  const [dlBusy, setDlBusy] = useState(false);
  const [dlMessage, setDlMessage] = useState<string | null>(null);

  const maxDl = gallery.max_downloads;
  const limitHit = useMemo(
    () => isLimitReached(dlCount, maxDl),
    [dlCount, maxDl]
  );
  const remaining = useMemo(
    () => remainingDownloads(dlCount, maxDl),
    [dlCount, maxDl]
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAV_KEY(gallery.slug));
      if (raw) setFavs(new Set(JSON.parse(raw)));
      const state = readDownloadState(gallery.slug);
      setDlCount(state.count);
    } catch {
      /* ignore */
    }
  }, [gallery.slug]);

  function toggleFav(id: string) {
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem(FAV_KEY(gallery.slug), JSON.stringify(Array.from(next)));
      return next;
    });
  }

  function checkPassword(e: React.FormEvent) {
    e.preventDefault();
    if (btoa(pwInput) === gallery.password_hash) {
      setPwOk(true);
      setPwError("");
    } else {
      setPwError("Incorrect password");
    }
  }

  async function downloadPhoto(p: Photo) {
    setDlMessage(null);

    if (!gallery.allow_downloads) {
      setDlMessage("Downloads are disabled for this gallery.");
      return;
    }

    // Re-read from storage so parallel tabs stay in sync
    const live = readDownloadState(gallery.slug);
    setDlCount(live.count);

    const reserve = tryReserveDownload(gallery.slug, maxDl, p.id);
    if (!reserve.ok) {
      setDlCount(reserve.count);
      setDlMessage(reserve.reason);
      return;
    }

    setDlBusy(true);
    const url = publicPhotoUrl(p.storage_path);

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = p.storage_path.split("/").pop() || "photo.jpg";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(a.href);

      // Only count after a successful save
      commitDownload(gallery.slug, reserve.nextCount, p.id);
      setDlCount(reserve.nextCount);

      const left = remainingDownloads(reserve.nextCount, maxDl);
      if (left === 0) {
        setDlMessage("Download saved. You have used all allowed downloads on this device.");
      } else if (left != null) {
        setDlMessage(`Download saved. ${left} remaining on this device.`);
      } else {
        setDlMessage("Download saved.");
      }
    } catch {
      // Failed downloads do not consume the limit
      setDlMessage("Download failed. Please try again or contact the studio.");
    } finally {
      setDlBusy(false);
    }
  }

  function downloadStatusLabel() {
    if (!gallery.allow_downloads) {
      return "Proofing — selects only (downloads off)";
    }
    if (maxDl != null && maxDl > 0) {
      if (limitHit) {
        return `Download limit reached (${dlCount}/${maxDl})`;
      }
      return `Downloads: ${dlCount}/${maxDl} used · ${remaining} left`;
    }
    return "Downloads enabled";
  }

  if (!pwOk) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <form onSubmit={checkPassword} className="w-full max-w-sm space-y-4">
          <h1 className="text-center font-serif text-2xl italic">
            {gallery.title}
          </h1>
          <p className="text-center text-sm text-[#6b6760]">
            This gallery is password protected
          </p>
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={pwInput}
            onChange={(e) => setPwInput(e.target.value)}
            required
          />
          {pwError && <p className="text-sm text-red-700">{pwError}</p>}
          <button type="submit" className="btn btn-gold w-full">
            Enter
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#1a1917] text-[#f7f4ef]">
      <header className="border-b border-white/10 px-6 py-6">
        <p className="text-[0.65rem] uppercase tracking-[0.2em] opacity-50">
          WemmyPro World
        </p>
        <h1 className="mt-2 font-serif text-3xl italic">{gallery.title}</h1>
        <p
          className={`mt-2 text-xs ${
            limitHit && gallery.allow_downloads
              ? "text-amber-200/90"
              : "opacity-50"
          }`}
        >
          {downloadStatusLabel()}
          {favs.size > 0 && ` · ${favs.size} selected`}
        </p>
        {dlMessage && (
          <p className="mt-2 text-xs text-amber-100/80" role="status">
            {dlMessage}
          </p>
        )}
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-2 p-2 sm:grid-cols-3 md:grid-cols-4">
        {photos.map((p) => (
          <div
            key={p.id}
            className="group relative aspect-square overflow-hidden bg-black"
          >
            <button
              type="button"
              className="h-full w-full"
              onClick={() => setLightbox(p)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={publicPhotoUrl(p.thumbnail_path || p.storage_path)}
                alt=""
                className="h-full w-full object-cover transition group-hover:scale-105"
              />
              {gallery.watermark_previews && (
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs uppercase tracking-[0.3em] text-white/25">
                  WemmyPro World
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => toggleFav(p.id)}
              className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-1 text-sm"
              aria-label="Favorite"
            >
              {favs.has(p.id) ? "♥" : "♡"}
            </button>
          </div>
        ))}
      </div>

      {!photos.length && (
        <p className="py-20 text-center text-sm opacity-50">No photos yet</p>
      )}

      <p className="px-6 py-10 text-center text-xs opacity-40">
        Need prints or a package? Contact WemmyPro World for a manual invoice —
        no online checkout.
      </p>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-h-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={publicPhotoUrl(lightbox.storage_path)}
              alt=""
              className="max-h-[85vh] w-auto object-contain"
            />
            {gallery.watermark_previews && (
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm uppercase tracking-[0.4em] text-white/20">
                WemmyPro World
              </span>
            )}
            <div className="mt-4 flex flex-col items-center gap-3">
              {gallery.allow_downloads && maxDl != null && maxDl > 0 && (
                <p className="text-xs text-white/50">
                  {limitHit
                    ? "No downloads left on this device"
                    : `${remaining} download${remaining === 1 ? "" : "s"} left on this device`}
                </p>
              )}
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  className="btn btn-outline border-white text-white"
                  onClick={() => toggleFav(lightbox.id)}
                >
                  {favs.has(lightbox.id) ? "Unselect" : "Select"}
                </button>
                {gallery.allow_downloads && (
                  <button
                    type="button"
                    className="btn btn-gold disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={dlBusy || limitHit}
                    onClick={() => downloadPhoto(lightbox)}
                    title={
                      limitHit
                        ? "Download limit reached on this device"
                        : "Save original to your device"
                    }
                  >
                    {dlBusy
                      ? "Saving…"
                      : limitHit
                        ? "Limit reached"
                        : "Save / Download"}
                  </button>
                )}
                <button
                  type="button"
                  className="btn border border-white/30 text-white/70"
                  onClick={() => setLightbox(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
