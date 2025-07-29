
-- ✅ Enable RLS on both tables if not already enabled
ALTER TABLE public.content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;

-- ✅ Update content_sections SELECT (only admins/editors)
DROP POLICY IF EXISTS "Combined content sections access" ON public.content_sections;

CREATE POLICY "Admins and editors can read content_sections"
ON public.content_sections
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND (users.role = 'admin' OR users.role = 'editor')
  )
);

-- ✅ Replace existing INSERT policy for navigation_items
DROP POLICY IF EXISTS "Admins can insert navigation items" ON public.navigation_items;

CREATE POLICY "Only admins can insert navigation items"
ON public.navigation_items
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
)
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- ✅ Update DELETE policy for navigation_items
DROP POLICY IF EXISTS "Admins can delete navigation items" ON public.navigation_items;

CREATE POLICY "Only admins can delete navigation items"
ON public.navigation_items
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- ✅ Update UPDATE policy for navigation_items
DROP POLICY IF EXISTS "Admins can update navigation items" ON public.navigation_items;

CREATE POLICY "Only admins can update navigation items"
ON public.navigation_items
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- ✅ Restrict SELECT to authenticated users only (remove anon)
DROP POLICY IF EXISTS "Read navigation items" ON public.navigation_items;

CREATE POLICY "Authenticated users can read navigation items"
ON public.navigation_items
FOR SELECT
TO authenticated
USING (
  is_active = true
  OR EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'editor')
  )
);
