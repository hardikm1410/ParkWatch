
'use client';

// import { FirebaseProvider } from './provider';

// This provider ensures that Firebase is only initialized once on the client.
export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
