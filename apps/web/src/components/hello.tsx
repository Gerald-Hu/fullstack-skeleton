'use client';

import { useEffect, useState } from 'react';
import { AuthButton } from './auth/AuthButton';
import { trpc } from '@/utils/trpc';

export function Hello() {
  const [greeting, setGreeting] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trpc.hi.sayHi.query().then((result) => {
      setGreeting(result);
      setLoading(false);
    });
  }, []);

  return (
    <div className="py-4 px-6 bg-slate-700 rounded-lg shadow-md">
      <div className="flex flex-col gap-4 justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">API Test</h2>
      </div>
      
      {loading ? (
        <p className="text-yellow-400">Loading...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <p className="text-green-400"> <span className='text-gray-400/50 text-sm'>From the API - </span>{greeting}</p>
      )}
    </div>
  );
}
