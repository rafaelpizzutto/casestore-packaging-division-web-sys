-- Add restrictive INSERT policy: only admins can assign roles
CREATE POLICY "Only admins can assign roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add restrictive UPDATE policy: prevent all role updates (roles should be immutable)
CREATE POLICY "Prevent role updates"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (false);

-- Add restrictive DELETE policy: only admins can remove roles
CREATE POLICY "Only admins can remove roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));