'use client';

import { useState, useEffect, useRef } from 'react';
import { onSnapshot, DocumentReference, DocumentData } from 'firebase/firestore';

interface UseDoc<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useDoc<T extends DocumentData>(
  docRef: DocumentReference | null
): UseDoc<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const docRefRef = useRef(docRef);

  useEffect(() => {
    // Comparison to avoid re-running the effect if the reference object changes but path is the same
    if (docRefRef.current?.path !== docRef?.path) {
        docRefRef.current = docRef;
    }
  }, [docRef]);


  useEffect(() => {
    if (!docRefRef.current) {
      setLoading(false);
      setData(null);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      docRefRef.current,
      (doc) => {
        if (doc.exists()) {
          setData({ id: doc.id, ...doc.data() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching document: ", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [docRefRef.current]);

  return { data, loading, error };
}
