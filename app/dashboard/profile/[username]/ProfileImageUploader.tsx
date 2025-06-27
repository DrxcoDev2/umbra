'use client';

import React, { useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';

// Función para subir imagen a bucket
async function uploadImage(
  file: File,
  bucket: 'avatars' | 'banners',
  userId: string
): Promise<string> {
  const filePath = `${userId}/${file.name}`;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { upsert: true });

  if (error) throw new Error(error.message);

  // Obtener la URL pública después de subir
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

// Actualizar la tabla de perfiles con las URLs
async function updateProfile(
  userId: string,
  avatarUrl?: string,
  bannerUrl?: string
): Promise<void> {
  const updates: {
    id: string;
    updated_at: string;
    avatar_url?: string;
    banner_url?: string;
  } = {
    id: userId,
    updated_at: new Date().toISOString(),
  };

  if (avatarUrl) updates.avatar_url = avatarUrl;
  if (bannerUrl) updates.banner_url = bannerUrl;

  const { error } = await supabase.from('profiles').upsert(updates);
  if (error) throw new Error(error.message);
}

// Componente principal
export default function ProfileImageUploader() {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      alert('No user logged in');
      return;
    }

    const userId = user.id;
    setLoading(true);

    try {
      let avatarUrl: string | undefined;
      let bannerUrl: string | undefined;

      if (avatarFile) {
        avatarUrl = await uploadImage(avatarFile, 'avatars', userId);
      }

      if (bannerFile) {
        bannerUrl = await uploadImage(bannerFile, 'banners', userId);
      }

      await updateProfile(userId, avatarUrl, bannerUrl);
      alert('¡Perfil actualizado con éxito!');
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert('Error al subir imágenes: ' + err.message);
      } else {
        alert('Error desconocido al subir imágenes');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2 mt-4">
      <div>
        <label className="block font-medium mb-1">Avatar:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Banner:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setBannerFile(e.target.files?.[0] ?? null)}
        />
      </div>
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Subiendo...' : 'Subir imágenes'}
      </button>
    </div>
  );
}
