-- WemmyPro World Studio Gallery
-- Idempotent schema + RLS + storage policies
-- Paste into Supabase SQL Editor

-- Extensions
create extension if not exists "pgcrypto";

-- Clients
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  notes text,
  created_at timestamptz not null default now()
);

-- Galleries
create table if not exists public.galleries (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete set null,
  title text not null,
  event_date date,
  cover_photo_url text,
  slug text not null unique,
  password_hash text,
  expires_at timestamptz,
  is_published boolean not null default false,
  allow_downloads boolean not null default false,
  max_downloads integer,
  watermark_previews boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists galleries_slug_idx on public.galleries (slug);
create index if not exists galleries_client_id_idx on public.galleries (client_id);

-- Photos
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  gallery_id uuid not null references public.galleries(id) on delete cascade,
  storage_path text not null,
  thumbnail_path text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists photos_gallery_id_idx on public.photos (gallery_id);

-- Bookings
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete set null,
  gallery_id uuid references public.galleries(id) on delete set null,
  title text,
  event_date date,
  location text,
  status text not null default 'inquiry'
    check (status in ('inquiry', 'confirmed', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists bookings_client_id_idx on public.bookings (client_id);
create index if not exists bookings_status_idx on public.bookings (status);

-- Invoices
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete set null,
  booking_id uuid references public.bookings(id) on delete set null,
  invoice_number text not null unique,
  status text not null default 'draft'
    check (status in ('draft', 'sent', 'paid', 'overdue', 'void')),
  line_items jsonb not null default '[]'::jsonb,
  amount_total numeric(12, 2) not null default 0,
  currency text not null default 'NGN',
  due_date date,
  created_at timestamptz not null default now()
);

create index if not exists invoices_client_id_idx on public.invoices (client_id);
create index if not exists invoices_status_idx on public.invoices (status);

-- Storage bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'gallery-photos',
  'gallery-photos',
  true,
  52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- RLS
alter table public.clients enable row level security;
alter table public.galleries enable row level security;
alter table public.photos enable row level security;
alter table public.bookings enable row level security;
alter table public.invoices enable row level security;

-- Drop existing policies if re-running
do $$
declare r record;
begin
  for r in (
    select policyname, tablename from pg_policies
    where schemaname = 'public'
      and tablename in ('clients', 'galleries', 'photos', 'bookings', 'invoices')
  ) loop
    execute format('drop policy if exists %I on public.%I', r.policyname, r.tablename);
  end loop;
end $$;

-- Admin (authenticated): full access
create policy "admin_all_clients" on public.clients
  for all to authenticated using (true) with check (true);

create policy "admin_all_galleries" on public.galleries
  for all to authenticated using (true) with check (true);

create policy "admin_all_photos" on public.photos
  for all to authenticated using (true) with check (true);

create policy "admin_all_bookings" on public.bookings
  for all to authenticated using (true) with check (true);

create policy "admin_all_invoices" on public.invoices
  for all to authenticated using (true) with check (true);

-- Anon: read published galleries (not expired)
create policy "anon_read_published_galleries" on public.galleries
  for select to anon using (
    is_published = true
    and (expires_at is null or expires_at > now())
  );

create policy "anon_read_photos_of_published" on public.photos
  for select to anon using (
    exists (
      select 1 from public.galleries g
      where g.id = photos.gallery_id
        and g.is_published = true
        and (g.expires_at is null or g.expires_at > now())
    )
  );

-- Anon: insert clients + inquiry bookings (public book form)
create policy "anon_insert_clients" on public.clients
  for insert to anon with check (true);

create policy "anon_insert_inquiry_bookings" on public.bookings
  for insert to anon with check (status = 'inquiry');

-- Anon: read invoices that are sent / paid / overdue
create policy "anon_read_visible_invoices" on public.invoices
  for select to anon using (status in ('sent', 'paid', 'overdue'));

-- Storage policies
do $$
begin
  drop policy if exists "auth_upload_gallery_photos" on storage.objects;
  drop policy if exists "auth_update_gallery_photos" on storage.objects;
  drop policy if exists "auth_delete_gallery_photos" on storage.objects;
  drop policy if exists "public_read_gallery_photos" on storage.objects;
exception when others then null;
end $$;

create policy "auth_upload_gallery_photos" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'gallery-photos');

create policy "auth_update_gallery_photos" on storage.objects
  for update to authenticated
  using (bucket_id = 'gallery-photos');

create policy "auth_delete_gallery_photos" on storage.objects
  for delete to authenticated
  using (bucket_id = 'gallery-photos');

create policy "public_read_gallery_photos" on storage.objects
  for select to public
  using (bucket_id = 'gallery-photos');
