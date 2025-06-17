
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/app-provider';
import { Eye, Wheat, BrainCircuit } from 'lucide-react';

export function LoginForm() {
  const [email, setEmail] = useState('demo@agrovision.ai');
  const [password, setPassword] = useState('password');
  const router = useRouter();
  const { login } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd validate credentials here
    login();
    router.replace('/dashboard/fields');
  };

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="text-center">
        <div className="inline-flex items-center justify-center gap-2 mb-4">
          <Wheat className="h-10 w-10 text-primary" />
          <BrainCircuit className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-3xl font-headline">Welcome to AgroVision AI</CardTitle>
        <CardDescription>Sign in to manage your fields and get AI insights.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="text-base"
            />
          </div>
          <Button type="submit" className="w-full text-lg py-6">
            Login
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-center text-sm">
        <p className="text-muted-foreground">
          Use demo@agrovision.ai / password for demo access.
        </p>
      </CardFooter>
    </Card>
  );
}
