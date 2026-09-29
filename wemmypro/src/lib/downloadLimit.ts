/**
 * Client-side download limit tracker (per gallery slug, per browser).
 * Stored in localStorage — not a server enforcement layer.
 */

const PREFIX = "wp-dl-v2:";

export type DownloadState = {
  /** Total successful downloads in this browser for the gallery */
  count: number;
  /** Photo ids already downloaded at least once (optional analytics) */
  photoIds: string[];
  updatedAt: string;
};

function storageKey(slug: string) {
  return `${PREFIX}${slug}`;
}

export function readDownloadState(slug: string): DownloadState {
  if (typeof window === "undefined") {
    return { count: 0, photoIds: [], updatedAt: "" };
  }
  try {
    const raw = localStorage.getItem(storageKey(slug));
    if (!raw) return { count: 0, photoIds: [], updatedAt: "" };
    const parsed = JSON.parse(raw) as Partial<DownloadState>;
    return {
      count: Math.max(0, Number(parsed.count) || 0),
      photoIds: Array.isArray(parsed.photoIds)
        ? parsed.photoIds.map(String)
        : [],
      updatedAt: parsed.updatedAt || "",
    };
  } catch {
    // Migrate legacy key `wp-dl-${slug}` if present
    try {
      const legacy = localStorage.getItem(`wp-dl-${slug}`);
      if (legacy) {
        const count = Math.max(0, Number(legacy) || 0);
        const state: DownloadState = {
          count,
          photoIds: [],
          updatedAt: new Date().toISOString(),
        };
        writeDownloadState(slug, state);
        localStorage.removeItem(`wp-dl-${slug}`);
        return state;
      }
    } catch {
      /* ignore */
    }
    return { count: 0, photoIds: [], updatedAt: "" };
  }
}

export function writeDownloadState(slug: string, state: DownloadState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    storageKey(slug),
    JSON.stringify({
      ...state,
      updatedAt: new Date().toISOString(),
    })
  );
}

/** null max = unlimited */
export function isLimitReached(
  count: number,
  maxDownloads: number | null | undefined
): boolean {
  if (maxDownloads == null || maxDownloads <= 0) return false;
  return count >= maxDownloads;
}

export function remainingDownloads(
  count: number,
  maxDownloads: number | null | undefined
): number | null {
  if (maxDownloads == null || maxDownloads <= 0) return null;
  return Math.max(0, maxDownloads - count);
}

/**
 * Atomically check limit and reserve one download slot.
 * Returns { ok, state, reason } — only call after a successful file save.
 * Use tryReserve before fetch; commit after blob success; rollback on failure.
 */
export function tryReserveDownload(
  slug: string,
  maxDownloads: number | null | undefined,
  photoId?: string
): { ok: true; nextCount: number } | { ok: false; reason: string; count: number } {
  const state = readDownloadState(slug);
  if (isLimitReached(state.count, maxDownloads)) {
    return {
      ok: false,
      reason: "Download limit reached for this gallery on this device.",
      count: state.count,
    };
  }
  return { ok: true, nextCount: state.count + 1 };
}

export function commitDownload(
  slug: string,
  nextCount: number,
  photoId?: string
) {
  const state = readDownloadState(slug);
  const photoIds = photoId
    ? Array.from(new Set(state.photoIds.concat(photoId)))
    : state.photoIds;
  writeDownloadState(slug, {
    count: nextCount,
    photoIds,
    updatedAt: new Date().toISOString(),
  });
}
