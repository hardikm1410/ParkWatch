
'use client';

import { useState, useEffect, useRef } from 'react';
// import { onSnapshot, Query, DocumentData } from 'firebase/firestore';

type Query = any;
type DocumentData = any;

interface UseCollection<T> {
  data: T[] | null;
  loading: boolean;
  error: Error | null;
  setData: React.Dispatch<React.SetStateAction<T[] | null>>;
}

export function useCollection<T extends DocumentData>(
  query: Query | null
): UseCollection<T> {
  const [data, setData] = useState<T[] | null>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const queryRef = useRef(query);

  useEffect(() => {
    setLoading(false);
    // // Deep comparison of queries to avoid re-running the effect
    // if (JSON.stringify(queryRef.current) !== JSON.stringify(query)) {
    //     queryRef.current = query;
    // }
  }, [query]);


  useEffect(() => {
    setLoading(false);
    // if (!queryRef.current) {
    //   setLoading(false);
    //   setData([]);
    //   return;
    // }

    // setLoading(true);

    // const unsubscribe = onSnapshot(
    //   queryRef.current,
    //   (querySnapshot) => {
    //     const data: T[] = [];
    //     querySnapshot.forEach((doc) => {
    //       data.push({ id: doc.id, ...doc.data() } as T);
    //     });
    //     setData(data);
    //     setLoading(false);
    //     setError(null);
    //   },
    //   (err) => {
    //     console.error("Error fetching collection: ", err);
    //     setError(err);
    //     setLoading(false);
    //   }
    // );

    // return () => unsubscribe();
  }, [queryRef.current]);

  return { data, loading, error, setData };
}
