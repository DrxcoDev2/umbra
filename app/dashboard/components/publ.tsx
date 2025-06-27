'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { useParams } from 'next/navigation';

interface ProfileData {
  id: string;
  username: string;
  avatar_url?: string | null;
}

interface PostData {
  id: string;
  content: string;
  created_at: string;
  likes: number;
  comments: number;
  views: number;
  shares: number;
  // agrega otros campos que tengas
}

export default function Publ() {
  const { username: usernameParam } = useParams() as { username?: string };
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      if (!usernameParam) {
        setErrorMsg('No se proporcion� usuario.');
        setLoading(false);
        return;
      }

      const usernameLower = usernameParam.toLowerCase();

      // Buscar perfil por username (lowercase exact match)
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .ilike('username', usernameLower)
        .single();

      if (profileError || !profileData) {
        setErrorMsg('Perfil no encontrado');
        setLoading(false);
        return;
      }

      setProfile(profileData);

      // Buscar publicaciones del perfil por user_id
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', profileData.id)
        .order('created_at', { ascending: false });

      if (postsError) {
        setErrorMsg('Error al cargar publicaciones');
      } else {
        setPosts(postsData || []);
      }

      setLoading(false);
    };

    fetchProfileAndPosts();
  }, [usernameParam]);

  if (loading) return <div>Cargando perfil y publicaciones...</div>;
  if (errorMsg) return <div>{errorMsg}</div>;

  return (
    <div className="w-[600px] h-auto bg-neutral-800 rounded-md p-5">
      <div className="flex space-x-5 items-center mb-5">
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt="Avatar"
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center">
            ?
          </div>
        )}
        <span className="font-bold text-lg">@{profile?.username}</span>
      </div>

      {posts.length === 0 && <p>No hay publicaciones a�n.</p>}

      {posts.map((post) => (
        <div key={post.id} className="mb-4 border-b border-gray-700 pb-2">
          <p>{post.content}</p>
          <small className="text-gray-400 text-xs">
            {new Date(post.created_at).toLocaleString()}
          </small>
          {/* Aqu� puedes mostrar likes, comentarios, etc */}
        </div>
      ))}
    </div>
  );
}
