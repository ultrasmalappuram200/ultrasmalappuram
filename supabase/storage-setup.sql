-- Create team-logos storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'team-logos',
  'team-logos',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
);

-- Create storage policies for team-logos bucket
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'team-logos');

CREATE POLICY "Authenticated users can upload team logos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'team-logos' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update team logos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'team-logos' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete team logos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'team-logos' 
  AND auth.role() = 'authenticated'
);

