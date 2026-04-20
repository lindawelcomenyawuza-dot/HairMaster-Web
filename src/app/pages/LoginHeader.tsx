'use client';

import { Scissors } from 'lucide-react';
import { CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import type { LoginHeaderProps } from './login.types';

export function LoginHeader({ title, description }: LoginHeaderProps) {
  return (
    <CardHeader className="text-center">
      <div className="flex justify-center mb-4">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-full">
          <Scissors className="w-8 h-8 text-white" />
        </div>
      </div>
      <CardTitle className="text-3xl">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  );
}
