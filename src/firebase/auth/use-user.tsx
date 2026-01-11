'use client';

import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { useAuth } from '../provider';

interface UseUser {
  user: User | null;
  loading: boolean;
}

export function useUser(): UseUser {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(auth?.currentUser || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    // Set initial state faster
    if (auth.currentUser) {
      setUser(auth.currentUser);
    }
    setLoading(false);


    return () => unsubscribe();
  }, [auth]);

  return { user, loading };
}
