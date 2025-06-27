'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { useParams } from 'next/navigation';
import ProfileImageUploader from './ProfileImageUploader';

interface ProfileData {
  username: string | null;
  avatar_url: string | null;
  banner_url: string | null;
}

export default function Profile() {
  const { username: usernameParam } = useParams() as { username: string };
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!usernameParam) {
        console.warn('No se recibió username en params');
        setLoading(false);
        setProfile(null);
        return;
      }

      const usernameTrimmed = usernameParam.trim();

      console.log('Buscando perfil para username:', usernameTrimmed);

      // Busca el username exacto ignorando mayúsculas/minúsculas
      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url, banner_url')
        .ilike('username', usernameTrimmed)  // Exacto case-insensitive
        .maybeSingle();

      if (error) {
        console.error('Error al consultar perfil:', error);
        setProfile(null);
      } else if (!data) {
        console.warn('Perfil no encontrado para username:', usernameTrimmed);
        setProfile(null);
      } else {
        console.log('Perfil encontrado:', data);
        setProfile(data);
      }

      setLoading(false);
    };

    fetchProfile();
  }, [usernameParam]);

  if (loading) return <div>Cargando perfil...</div>;
  if (!profile) return <div>Perfil no encontrado</div>;

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
