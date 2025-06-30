'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import Link from 'next/link';

interface Post {
  id: string;
  username: string;
  content: string;
  created_at: string;
  likes: number;
  comments: number;
  views: number;
  shares: number;
  likedByMe?: boolean;
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setLoading(false);
        return;
      }

      setUserId(user.id);

      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*');

      if (postsError || !postsData) {
        console.error('Error al cargar publicaciones:', postsError);
        setLoading(false);
        return;
      }

      const { data: commentsData } = await supabase
        .from('comments')
        .select('post_id');

      const commentCountMap = commentsData?.reduce((acc: Record<string, number>, comment) => {
        acc[comment.post_id] = (acc[comment.post_id] || 0) + 1;
        return acc;
      }, {}) || {};

      const { data: likesData } = await supabase
        .from('likes')
        .select('post_id, user_id');

      const likeCountMap: Record<string, number> = {};
      const likedPostsSet = new Set<string>();

      likesData?.forEach((like) => {
        likeCountMap[like.post_id] = (likeCountMap[like.post_id] || 0) + 1;
        if (like.user_id === user.id) {
          likedPostsSet.add(like.post_id);
        }
      });

      const finalPosts = postsData.map((post) => ({
        ...post,
        comments: commentCountMap[post.id] || 0,
        likes: likeCountMap[post.id] || 0,
        likedByMe: likedPostsSet.has(post.id),
      }));

      setPosts(shuffleArray(finalPosts));
      setLoading(false);
    };

    fetchUserAndPosts();
  }, []);

  const toggleLike = async (postId: string) => {
    if (!userId) return;

    const liked = posts.find((p) => p.id === postId)?.likedByMe;

    if (liked) {
      await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);
    } else {
      await supabase.from('likes').insert({
        post_id: postId,
        user_id: userId,
      });
    }

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: post.likes + (liked ? -1 : 1),
              likedByMe: !liked,
            }
          : post
      )
    );
  };

  if (loading) return <div>Cargando publicaciones...</div>;

  return (
    <div className="max-w-[600px] h-auto py-5 px-4">
      <h1 className="text-4xl flex justify-center pb-5">Feed</h1>
      <div className="pl-8 pr-8 pt-10 space-y-6" style={{ maxHeight: '600px', overflowY: 'auto' }}>
        {posts.length === 0 && <p>No hay publicaciones a�n.</p>}
        {posts.map((post) => (
          <div key={post.id} className="p-4 w-[400px] h-[400px] border rounded-md bg-neutral-800 text-white flex flex-col justify-between">
            <div>
              <div className="font-bold">@{post.username}</div>
              <div className="mt-2 whitespace-pre-wrap">{post.content}</div>
            </div>

            <div className="mt-4 text-xs text-gray-400">
              Publicado: {new Date(post.created_at).toLocaleString()}
            </div>

            <div className="mt-2 flex justify-between text-sm text-gray-300">
            <button
                onClick={() => toggleLike(post.id)}
                className={`flex items-center space-x-2 ${post.likedByMe ? 'text-red-400' : ''}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <path fill="currentColor" d="m12 21l-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812T2.388 10.4T2 8.15Q2 5.8 3.575 4.225T7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55t2.475-.55q2.35 0 3.925 1.575T22 8.15q0 1.15-.387 2.25t-1.363 2.412t-2.625 2.963T13.45 19.7z" />
                </svg>
                <span>{post.likes}</span>
              </button>

              <Link href={`/comments/${post.id}`} className="flex items-center space-x-2 hover:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9h8m-8 4h6m4-9a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-5l-5 3v-3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z" />
                </svg>
                <span>{post.comments}</span>
              </Link>

              <span className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M4.75 5.5c.427 0 .791.163 1.075.45c-.145-.778-.37-1.415-.64-1.894C4.72 3.236 4.216 3 3.75 3s-.97.237-1.434 1.056C1.835 4.906 1.5 6.25 1.5 8s.335 3.094.816 3.944c.463.82.967 1.056 1.434 1.056s.97-.237 1.434-1.056c.272-.48.496-1.116.64-1.895a1.47 1.47 0 0 1-1.074.451C3.674 10.5 3 9.47 3 8s.674-2.5 1.75-2.5M7.5 8c0 3.822-1.445 6.5-3.75 6.5S0 11.822 0 8s1.445-6.5 3.75-6.5S7.5 4.178 7.5 8m6.825 2.05c-.145.778-.37 1.415-.64 1.894c-.464.82-.968 1.056-1.435 1.056s-.97-.237-1.434-1.056C10.335 11.094 10 9.75 10 8s.335-3.094.816-3.944C11.279 3.236 11.783 3 12.25 3s.97.237 1.434 1.056c.272.48.496 1.116.64 1.895A1.47 1.47 0 0 0 13.25 5.5c-1.076 0-1.75 1.03-1.75 2.5s.674 2.5 1.75 2.5a1.47 1.47 0 0 0 1.075-.45M16 8c0 3.822-1.445 6.5-3.75 6.5S8.5 11.822 8.5 8s1.445-6.5 3.75-6.5S16 4.178 16 8"
                    clipRule="evenodd"
                  />
                </svg>
                {post.views}
              </span>

              <span className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="-2 -2 24 24">
                  <path
                    fill="currentColor"
                    d="M7.928 9.24a4 4 0 0 1-.026 1.644l5.04 2.537a4 4 0 1 1-.867 1.803l-5.09-2.562a4 4 0 1 1 .083-5.228l5.036-2.522a4 4 0 1 1 .929 1.772z"
                  />
                </svg>
                {post.shares}
              </span>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
