'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import ProfileImageUploader from './ProfileImageUploader';

interface ProfileData {
  username: string | null;
  avatar_url: string | null;
  banner_url: string | null;
}

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData>({
    username: null,
    avatar_url: null,
    banner_url: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      // Obtener usuario actual
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error('Error obteniendo usuario:', userError);
        setLoading(false);
        return;
      }
      if (!user) {
        setLoading(false);
        return;
      }

      // Consultar perfil en tabla 'profiles'
      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url, banner_url')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error obteniendo perfil:', error);
      } else if (data) {
        setProfile({
          username: data.username || user.user_metadata?.username || user.email,
          avatar_url: data.avatar_url,
          banner_url: data.banner_url,
        });
      } else {
        // Si no hay perfil, poner username básico
        setProfile({
          username: user.user_metadata?.username || user.email,
          avatar_url: null,
          banner_url: null,
        });
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div>Cargando perfil...</div>;
  }

  return (
    <div>
      {/* Banner */}
      <div className="w-full h-[300px] bg-gray-300 relative overflow-hidden">
        {profile.banner_url ? (
          <img
            src={profile.banner_url}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-400 flex items-center justify-center text-white">
            Sin banner
          </div>
        )}
      </div>

      {/* Avatar */}
      <div className="w-[200px] h-[200px] rounded-full overflow-hidden border-4 border-white relative -mt-[100px] ml-[100px] bg-gray-500">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">
            Sin avatar
          </div>
        )}
      </div>

      {/* Info y uploader */}
      <div className="ml-[400px] -mt-[50px] space-y-4">
        <span className="text-2xl font-semibold">Usuario</span>
        <h1 className="text-lg">{profile.username}</h1>
        <ProfileImageUploader />
      </div>
    </div>
  );
}
