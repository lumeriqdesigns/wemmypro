"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const statuses = ["inquiry", "confirmed", "completed", "cancelled"] as const;

export function BookingStatusSelect({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const router = useRouter();

  async function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const supabase = createClient();
    await supabase.from("bookings").update({ status: e.target.value }).eq("id", id);
    router.refresh();
  }

  return (
    <select
      className="border border-[#ddd6cb] bg-transparent px-2 py-1 text-xs uppercase tracking-wider"
      value={status}
      onChange={onChange}
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
