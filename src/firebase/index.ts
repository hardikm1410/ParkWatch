
'use client';
// import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
// import { getAuth, type Auth } from 'firebase/auth';
// import { getFirestore, type Firestore } from 'firebase/firestore';
// import { firebaseConfig } from './config';

type FirebaseApp = any;
type Auth = any;
type Firestore = any;


// Providers and hooks
export { FirebaseProvider, useFirebase, useFirebaseApp, useFirestore, useAuth } from './provider';
export { FirebaseClientProvider } from './client-provider';
export { useUser } from './auth/use-user';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';

export type FirebaseInstances = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

let firebaseInstances: FirebaseInstances | null = null;

export function initializeFirebase(): FirebaseInstances {
  if (firebaseInstances) {
    return firebaseInstances;
  }

  // const app =
  //   getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  // const auth = getAuth(app);
  // const firestore = getFirestore(app);

  firebaseInstances = { app: {}, auth: {}, firestore: {} };
  return firebaseInstances;
}
