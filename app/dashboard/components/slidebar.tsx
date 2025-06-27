'use client';

import { useState } from 'react';
import WritePost from './WritePost';

export default function SlideBar() {
  const [showPost, setShowPost] = useState(false);

  return (
    <div className="max-w-[300px] flex flex-col items-center">
      <div className="pt-20 space-y-5">
        <div className="flex space-x-5 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="..."/></svg>
          <h1 className="text-xl">Feed</h1>
        </div>

        <div className="flex space-x-5 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="..."/></svg>
          <h1 className="text-xl">Profile</h1>
        </div>

        <div className="flex space-x-5 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="currentColor" fillOpacity="0">...</g><path fill="currentColor" d="..."/></svg>
          <h1 className="text-xl">Moon.AI</h1>
        </div>

        <div className="flex space-x-5 cursor-pointer" onClick={() => setShowPost(!showPost)}>
          <h1 className="text-xl">Write Post</h1>
        </div>
      </div>

      {/* Mostrar WritePost solo si showPost es true */}
      {showPost && (
        <div className="mt-6 w-full">
          <WritePost />
        </div>
      )}
    </div>
  );
}
