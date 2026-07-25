UPDATE public.founder_profile
SET
  achievements = COALESCE(
    (
      SELECT jsonb_agg(item)
      FROM jsonb_array_elements(achievements) AS item
      WHERE item ->> 'value' <> '03'
    ),
    '[]'::jsonb
  ),
  updated_at = now()
WHERE id = 'default';
