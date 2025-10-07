'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { flushSync } from 'react-dom';
import { fetchApi } from '../../../../lib/api';
import Card from '../../../../components/ui/Card';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('jakariacoc8980@gmail.com');
  const [password, setPassword] = useState('J@kariyaalimss23cse');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await fetchApi('/api/auth/local', {
        method: 'POST',
        body: JSON.stringify({ identifier, password }),
      });

      if (data.jwt) {
        // Force React to sync state updates BEFORE navigation
        flushSync(() => {
          localStorage.setItem('jwt', data.jwt);
          localStorage.setItem('user', JSON.stringify(data.user));
        });

        // Navigate immediately
        router.replace('/dashboard');
      } else {
        throw new Error('Invalid login response');
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-8 max-w-md mx-auto mt-20">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-sky-400 dark:to-cyan-400 bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-muted-foreground">Sign in to access your dashboard.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col gap-4">
          <Input
            id="identifier"
            label="Email or Username"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            className="input w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
          />
          <Input
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </Card>
  );
}
