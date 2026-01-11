'use client';

import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';

// This is a workaround for a bug in Next.js where the provider is not
// correctly identifying that it is running on the client.
const firebase = typeof window !== 'undefined' ? initializeFirebase() : undefined;

export function FirebaseClientProvider(props: { children: React.ReactNode }) {
  return <FirebaseProvider {...firebase}>{props.children}</FirebaseProvider>;
}
