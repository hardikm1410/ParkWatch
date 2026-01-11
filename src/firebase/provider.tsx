'use client';
import { createContext, useContext, useMemo } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { initializeFirebase, type FirebaseInstances } from './index';

// Define the context shape
interface FirebaseContextValue extends FirebaseInstances {
  // We can add more instances here if needed, like storage, functions, etc.
}

// Create the context
const FirebaseContext = createContext<FirebaseContextValue | null>(null);

// Create a provider component
type FirebaseProviderProps = {
  children: React.ReactNode;
};

export function FirebaseProvider({ children }: FirebaseProviderProps) {
  const instances = useMemo(() => initializeFirebase(), []);

  return (
    <FirebaseContext.Provider value={instances}>
      {children}
    </FirebaseContext.Provider>
  );
}

// Create hooks to use the context values
export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const useFirebaseApp = (): FirebaseApp | null => {
    return useContext(FirebaseContext)?.app ?? null;
}

export const useAuth = (): Auth | null => {
    return useContext(FirebaseContext)?.auth ?? null;
}

export const useFirestore = (): Firestore | null => {
    return useContext(FirebaseContext)?.firestore ?? null;
}
