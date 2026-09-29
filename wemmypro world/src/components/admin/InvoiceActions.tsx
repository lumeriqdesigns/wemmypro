"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function InvoiceActions({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const router = useRouter();

  async function setStatus(next: string) {
    const supabase = createClient();
    await supabase.from("invoices").update({ status: next }).eq("id", id);
    router.refresh();
  }

  function copyLink() {
    const url = `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/i/${id}`;
    navigator.clipboard.writeText(url);
    alert("Invoice link copied");
  }

  return (
    <div className="flex flex-wrap justify-end gap-2">
      {status === "draft" && (
        <button
          type="button"
          className="text-[0.65rem] uppercase tracking-widest underline"
          onClick={() => setStatus("sent")}
        >
          Mark sent
        </button>
      )}
      {(status === "sent" || status === "overdue") && (
        <button
          type="button"
          className="text-[0.65rem] uppercase tracking-widest underline"
          onClick={() => setStatus("paid")}
        >
          Mark paid
        </button>
      )}
      {status !== "draft" && status !== "void" && (
        <button
          type="button"
          className="text-[0.65rem] uppercase tracking-widest underline"
          onClick={copyLink}
        >
          Copy link
        </button>
      )}
    </div>
  );
}
