insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'flat-images',
  'flat-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read flat-images" on storage.objects;
create policy "Public read flat-images"
on storage.objects
for select
to public
using (bucket_id = 'flat-images');

drop policy if exists "Authenticated upload own folder flat-images" on storage.objects;
create policy "Authenticated upload own folder flat-images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'flat-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);
