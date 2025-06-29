'use client';

import { useEffect, useState, useRef } from 'react';
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    const getProfile = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        router.push('/login');
        return;
      }

      const userId = userData.user.id;
      const defaultUsername = userData.user.user_metadata.username || userData.user.email || 'user';

      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error consultando perfil:', error);
        setLoading(false);
        return;
      }

      let finalUsername = data?.username;

      if (!data) {
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

        finalUsername = defaultUsername;
      }

      setProfile({ username: finalUsername! });
      setLoading(false);
    };

    getProfile();
  }, [router]);

  if (loading) return <div className="p-4">Cargando...</div>;
  if (!profile) return <div className="p-4">No se pudo cargar el perfil.</div>;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-neutral-900 text-white">
      {/* Sidebar para PC */}
      <div className="hidden lg:block w-[250px] p-4 border-r border-neutral-700">
        <SlideBar />
      </div>

      {/* Topbar con bot�n hamburguesa (solo m�vil) */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-neutral-700 bg-neutral-900 z-50">
        <h1 className="text-xl font-bold">Umbra</h1>
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-white focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Overlay y men� hamburguesa m�vil */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" />
          <div
            ref={menuRef}
            className="fixed top-0 left-0 w-[250px] h-full bg-neutral-800 z-50 p-4 border-r border-neutral-700 animate-slide-in lg:hidden"
          >
            <SlideBar />
          </div>
        </>
      )}

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col items-center pt-6 pb-12 md:-pl-[200px]">
        <Feed />
        <Link
          href={`/dashboard/perfil/${profile.username}`}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Ver mi perfil
        </Link>
      </div>
    </div>
  );
}
