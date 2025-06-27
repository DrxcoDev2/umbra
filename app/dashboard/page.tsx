'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';
import SlideBar from '@/app/dashboard/components/slidebar';
import Feed from '@/app/dashboard/components/feed';
import Link from 'next/link';

interface ProfileData {
  username: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        router.push('/login');
        return;
      }

      const userId = userData.user.id;
      const defaultUsername =
        userData.user.user_metadata.username || userData.user.email || 'user';

      console.log('User ID:', userId);

      let { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // Ignora error 404 si no existe
        console.error('Error consultando perfil:', error);
        setLoading(false);
        return;
      }

      if (!data) {
        // No hay perfil, lo creamos autom�ticamente
        const { error: insertError } = await supabase.from('profiles').insert([
          {
            id: userId,
            username: defaultUsername,
          },
        ]);
        if (insertError) {
          console.error('Error creando perfil:', insertError);
          setLoading(false);
          return;
        }
        data = { username: defaultUsername };
      }

      setProfile(data);
      setLoading(false);
    };

    getProfile();
  }, [router]);

  if (loading) {
    return <div className="p-4">Cargando...</div>;
  }

  if (!profile) {
    return <div className="p-4">No se pudo cargar el perfil.</div>;
  }

  return (
    <div className="flex pl-10 space-x-[200px]">
      <SlideBar />
      <Feed />
      <div className="mt-10">
        <Link
          href={`/dashboard/perfil/${profile.username}`}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Ver mi perfil
        </Link>
      </div>
    </div>
  );
}
