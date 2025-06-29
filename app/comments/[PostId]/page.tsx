'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/app/lib/supabaseClient';

interface Profile {
  username?: string | null;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles?: Profile;
  username?: string; // extra para mapear username m�s f�cil
}

export default function CommentsPage() {
  const params = useParams();
  const postId = (params?.PostId || params?.postId) as string;

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('id, content, created_at, user_id, profiles(username)')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });


    if (error) {
      console.error('Error al obtener comentarios:', error.message, error.code);
      setLoading(false);
      return;
    }

    // Mapear username directo
    const formatted = (data as Comment[] ?? []).map((c) => ({
      ...c,
      username: c.profiles?.username ?? 'Desconocido',
    }));
    

    setComments(formatted);
    setLoading(false);
  };

  useEffect(() => {
    if (postId) {
      setLoading(true);
      fetchComments();
    }
  }, [postId]);

  const handleSubmit = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;

    if (!userId || newComment.trim() === '') return;

    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      user_id: userId,
      content: newComment.trim(),
    });

    if (error) {
      console.error('Error al comentar:', error);
    } else {
      setNewComment('');
      fetchComments(); // Recargar comentarios
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Comentarios</h1>

      <div className="space-y-4 mb-8">
        {loading ? (
          <p>Cargando...</p>
        ) : comments.length === 0 ? (
          <p>No hay comentarios a�n.</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="p-3 bg-neutral-800 text-white rounded">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">@{c.username}</span>
                <button type="button" className="p-2 rounded-lg text-sm bg-red-500 hover:bg-red-600 transition">
                  Delete
                </button>
              </div>
              <p className="mt-1">{c.content}</p>
              <span className="text-xs text-gray-400">
                {new Date(c.created_at).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-2 rounded bg-neutral-900 text-white"
          placeholder="Escribe tu comentario..."
          rows={4}
        />
        <button
          onClick={handleSubmit}
          className="self-end bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          disabled={newComment.trim() === ''}
        >
          Comentar
        </button>
      </div>
    </div>
  );
}
