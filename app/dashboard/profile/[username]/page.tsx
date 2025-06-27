'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { useParams } from 'next/navigation';
import ProfileImageUploader from './ProfileImageUploader';

interface ProfileData {
  id?: string;
  username: string | null;
  avatar_url: string | null;
  banner_url: string | null;
}

interface Post {
  id: string;
  content: string;
  created_at: string;
  likes: number;
  comments: number;
  views: number;
  shares: number;
}

export default function Profile() {
  const { username: usernameParam } = useParams() as { username: string };
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      if (!usernameParam) {
        console.warn('No se recibi� username en params');
        setLoading(false);
        setProfile(null);
        setPosts([]);
        return;
      }

      const usernameTrimmed = usernameParam.trim();

      // 1. Buscar perfil por username (case-insensitive)
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, banner_url')
        .ilike('username', usernameTrimmed)
        .maybeSingle();

      if (profileError || !profileData) {
        console.error('Error al consultar perfil:', profileError);
        setProfile(null);
        setPosts([]);
        setLoading(false);
        return;
      }

      setProfile(profileData);

      // Dentro de fetchProfileAndPosts, tras obtener profileData...

      const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .eq('username', profileData.username)  // Cambia 'username' si tu columna tiene otro nombre
      .order('created_at', { ascending: false });

      if (postsError) {
      console.error('Error al consultar publicaciones:', postsError.message, postsError.code);
      setPosts([]);
      } else {
      setPosts(postsData || []);
      }


      setLoading(false);
    };

    fetchProfileAndPosts();
  }, [usernameParam]);

  if (loading) return <div>Cargando perfil...</div>;
  if (!profile) return <div>Perfil no encontrado</div>;

  return (
    <div>
      {/* Banner */}
      <div className="w-full h-[300px] bg-gray-300 relative overflow-hidden">
        {profile.banner_url ? (
          <img src={profile.banner_url} alt="Banner" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-400 flex items-center justify-center text-white">Sin banner</div>
        )}
      </div>

      {/* Avatar */}
      <div className="w-[200px] h-[200px] rounded-full overflow-hidden border-4 border-white relative -mt-[100px] ml-[100px] bg-gray-500">
        {profile.avatar_url ? (
          <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">Sin avatar</div>
        )}
      </div>

      {/* Info y uploader */}
      <div className="ml-[400px] -mt-[50px] space-y-4">
        <span className="text-2xl font-semibold">Usuario</span>
        <h1 className="text-lg">{profile.username}</h1>
        <ProfileImageUploader />
      </div>

      {/* Publicaciones */}
      <div className="mt-10 ml-[400px] max-w-[600px]">
        <h2 className="text-xl font-semibold mb-4">Publicaciones</h2>
        {posts.length === 0 ? (
          <p>Este usuario no ha hecho ninguna publicaci�n.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="mb-4 p-4 bg-neutral-800 rounded-md text-white"
            >
              <p>{post.content}</p>
              <div className="mt-2 text-sm text-gray-400 flex justify-between">
                <span>Likes: {post.likes ?? 0}</span>
                <span>Comentarios: {post.comments ?? 0}</span>
                <span>Vistas: {post.views ?? 0}</span>
                <span>Compartidos: {post.shares ?? 0}</span>
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
