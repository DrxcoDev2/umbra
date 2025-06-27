'use client';

import { useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';

export default function WritePost() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!content.trim()) return;

    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert('No estás autenticado');
      setLoading(false);
      return;
    }

    const username = user.user_metadata?.username || user.email;

    const { error } = await supabase.from('posts').insert({
      username,
      content,
      // los demás campos tienen defaults en SQL
    });

    if (error) {
      console.error('Error al publicar:', error);
      alert('Hubo un error al publicar');
    } else {
      setContent('');
    }

    setLoading(false);
  };

  return (
    <div className="space-y-3 bg-neutral-900 p-4 rounded">
      <textarea
        className="w-full bg-neutral-800 text-white p-3 rounded resize-none"
        rows={4}
        placeholder="¿Qué estás pensando?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        onClick={handlePost}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Publicando...' : 'Publicar'}
      </button>
    </div>
  );
}
