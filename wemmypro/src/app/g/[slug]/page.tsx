import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ClientGallery } from "@/components/gallery/ClientGallery";
import type { Gallery, Photo } from "@/types/database";

export default async function PublicGalleryPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = await createClient();
  const { data: gallery } = await supabase
    .from("galleries")
    .select("*")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single();

  if (!gallery) notFound();

  if (gallery.expires_at && new Date(gallery.expires_at) < new Date()) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-center">
        <div>
          <h1 className="font-serif text-2xl italic">Gallery expired</h1>
          <p className="mt-2 text-sm text-[#6b6760]">
            Contact WemmyPro World if you need access again.
          </p>
        </div>
      </main>
    );
  }

  const { data: photos } = await supabase
    .from("photos")
    .select("*")
    .eq("gallery_id", gallery.id)
    .order("position");

  return (
    <ClientGallery
      gallery={gallery as Gallery}
      photos={(photos ?? []) as Photo[]}
    />
  );
}
