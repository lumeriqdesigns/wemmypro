import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GalleryManage } from "@/components/admin/GalleryManage";
import type { Gallery, Photo } from "@/types/database";

export default async function GalleryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const { data: gallery } = await supabase
    .from("galleries")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!gallery) notFound();

  const { data: photos } = await supabase
    .from("photos")
    .select("*")
    .eq("gallery_id", params.id)
    .order("position");

  return (
    <GalleryManage
      gallery={gallery as Gallery}
      photos={(photos ?? []) as Photo[]}
    />
  );
}
