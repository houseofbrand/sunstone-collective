
CREATE POLICY "Admins manage catalogue files" ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'catalogues' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'catalogues' AND public.has_role(auth.uid(), 'admin'));
