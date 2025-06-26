'use client';

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import Link from 'next/link';

export default function Profile() {
    const [username, setUsername] = useState<string | null>(null)

    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user },
                error
            } = await supabase.auth.getUser()

            if (user) {
                setUsername(user.user_metadata?.username || user.email)
            }
        }

        getUser()
    }, [])

    return(
        <div className="">
            <div className="w-[100%] h-[300px] bg-gray-300">
                <img src="" alt="" />
            </div>
            <div className="w-[200px] h-[200px] bg-gray-500 rounded-full p-10 relative -mt-[100px] ml-[100px]">
                    <img src="" alt="" />
            </div>
            <div className="ml-[400px] -mt-[50px] space-y-10">
                <span className='text-2xl'>User</span>
                <h1 className='text-lg '>{username}</h1>
            </div>
        </div>
    );
}