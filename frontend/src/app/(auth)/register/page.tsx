'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { fetchApi } from '../../../../lib/api';
import Card from '../../../../components/ui/Card';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';
import Link from 'next/link';
 

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = await fetchApi('/api/auth/local/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      });
      
      if (data.jwt) {
        localStorage.setItem('jwt', data.jwt);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
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
        <Input
          id="email" 
          label="Email" 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <Input
          id="username" 
          label="User Name" 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        <Input 
          id="password" 
          label="Password" 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full">
          Sign Up
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold  hover:underline">
          Sign in
        </Link>
      </p>
    </Card>
  );
}