'use client';

import React, { useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';

// Función para subir imagen a bucket
async function uploadImage(
  file: File,
  bucket: 'avatars' | 'banners',
  userId: string
) {
  const filePath = `${userId}/${file.name}`;
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { upsert: true });

  if (error) throw error;
  return data;
}

// Obtener URL pública del archivo subido
function getPublicUrl(
  bucket: 'avatars' | 'banners',
  userId: string,
  fileName: string
) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(`${userId}/${fileName}`);

  return data.publicUrl;
}

// Actualizar la tabla de perfiles con las URLs
async function updateProfile(
  userId: string,
  avatarUrl?: string,
  bannerUrl?: string
) {
  const updates: any = {
    id: userId,
    updated_at: new Date().toISOString(),
  };
  if (avatarUrl) updates.avatar_url = avatarUrl;
  if (bannerUrl) updates.banner_url = bannerUrl;

  const { error } = await supabase.from('profiles').upsert(updates);
  if (error) throw error;
}

// Componente principal
export default function ProfileImageUploader() {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  
  const handleUpload = async () => {
    // Obtener usuario
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
      let avatarUrl, bannerUrl;
  
      if (avatarFile) {
        // Sube la imagen
        await uploadImage(avatarFile, 'avatars', userId);
  
        // Obtén la URL pública y úsala para actualizar el perfil
        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(`${userId}/${avatarFile.name}`);
  
        avatarUrl = data.publicUrl;
      }
  
      if (bannerFile) {
        await uploadImage(bannerFile, 'banners', userId);
        const { data } = supabase.storage
          .from('banners')
          .getPublicUrl(`${userId}/${bannerFile.name}`);
  
        bannerUrl = data.publicUrl;
      }
  
      await updateProfile(userId, avatarUrl, bannerUrl);
  
      alert('¡Perfil actualizado con éxito!');
    } catch (error: any) {
      alert('Error al subir imágenes: ' + error.message);
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
