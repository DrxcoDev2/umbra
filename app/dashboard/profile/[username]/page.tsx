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
        setLoading(false);
        setProfile(null);
        setPosts([]);
        return;
      }

      const usernameTrimmed = usernameParam.trim();

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, banner_url')
        .ilike('username', usernameTrimmed)
        .maybeSingle();

      if (profileError || !profileData) {
        setProfile(null);
        setPosts([]);
        setLoading(false);
        return;
      }

      setProfile(profileData);

      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .eq('username', profileData.username)
        .order('created_at', { ascending: false });

      setPosts(postsError ? [] : postsData || []);
      setLoading(false);
    };

    fetchProfileAndPosts();
  }, [usernameParam]);

  if (loading) return <div className="p-4 text-center">Cargando perfil...</div>;
  if (!profile) return <div className="p-4 text-center">Perfil no encontrado</div>;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      {/* Banner */}
      <div className="w-full h-48 sm:h-64 bg-gray-300 rounded-lg overflow-hidden">
        {profile.banner_url ? (
          <img src={profile.banner_url} alt="Banner" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-400 flex items-center justify-center text-white">Sin banner</div>
        )}
      </div>

      {/* Avatar e Info */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start mt-[-4rem] sm:mt-[-6rem] sm:space-x-6">
        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white bg-gray-500 overflow-hidden -mt-10">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">Sin avatar</div>
          )}
        </div>
        <div className="mt-4 sm:mt-0 text-center sm:text-left">
          <h1 className="text-2xl font-semibold">{profile.username}</h1>
          <div className="mt-2">
            <ProfileImageUploader />
          </div>
        </div>
      </div>

      {/* Publicaciones */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Publicaciones</h2>
        {posts.length === 0 ? (
          <p>Este usuario no ha hecho ninguna publicaci�n.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="mb-4 p-4 bg-neutral-800 rounded-md text-white">
              <p className="whitespace-pre-wrap">{post.content}</p>
              <div className="mt-3 text-sm text-gray-400 grid grid-cols-2 sm:grid-cols-3 gap-2">
                <span>\u2764\ufe0f Likes: {post.likes ?? 0}</span>
                <span>\U0001f4ac Comentarios: {post.comments ?? 0}</span>
                <span>\U0001f441\ufe0f Vistas: {post.views ?? 0}</span>
                <span>\U0001f501 Compartidos: {post.shares ?? 0}</span>
                <span className="col-span-2 sm:col-span-1">
                  \U0001f552 {new Date(post.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
