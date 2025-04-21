// app/login/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { Newbie } from '@/components/user/new';

export default function LoginPage() {
  const { user } = useUser();
  const router = useRouter();

  // as soon as user registers, bounce to home
  useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [user, router]);

  // always show Newbie until we have a real user
  return <Newbie />;
}
