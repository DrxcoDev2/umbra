CREATE POLICY "Permitir modificar solo tus comentarios"
ON comments
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Permitir borrar solo tus comentarios"
ON comments
FOR DELETE USING (auth.uid() = user_id);