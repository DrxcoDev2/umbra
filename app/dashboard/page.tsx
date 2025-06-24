'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';
import SlideBar from '@/app/dashboard/components/slidebar';
import Feed from '@/app/dashboard/components/feed';


export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login');
      }
    });
  }, []);

  return(
    <div className="flex pl-10 space-x-[200px]">
        <SlideBar></SlideBar>
        <Feed></Feed>
    </div>
    
  );
}
