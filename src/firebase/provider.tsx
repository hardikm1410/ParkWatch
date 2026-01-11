'use client';

import { createContext, useContext } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

const FirebaseContext = createContext<
  | {
      app?: FirebaseApp;
      auth?: Auth;
      firestore?: Firestore;
    }
  | undefined
>(undefined);

export function FirebaseProvider(props: {
  children: React.ReactNode;
  app?: FirebaseApp;
  auth?: Auth;
  firestore?: Firestore;
}) {
  const { app, auth, firestore } = props;
  return (
    <FirebaseContext.Provider value={{ app, auth, firestore }}>
      {props.children}
    </FirebaseContext.Provider>
  );
}

export function useFirebaseApp() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebaseApp must be used within a FirebaseProvider');
  }
  return context.app;
}

export function useAuth() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a FirebaseProvider');
  }
  return context.auth;
}

export function useFirestore() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirestore must be used within a FirebaseProvider');
  }
  return context.firestore;
}
