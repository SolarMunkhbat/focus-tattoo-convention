"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Realtime Firestore collection subscription. Because this uses onSnapshot
 * (not a one-time getDocs), admin changes made in /admin appear on the
 * public site immediately, with no redeploy.
 */
export function useCollection<T>(
  name: string,
  orderByField?: string,
  direction: "asc" | "desc" = "asc"
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ref = collection(db, name);
    const q = orderByField ? query(ref, orderBy(orderByField, direction)) : query(ref);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setData(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T));
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [name, orderByField, direction]);

  return { data, loading, error };
}
