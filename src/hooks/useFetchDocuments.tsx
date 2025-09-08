// Firebase
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  type DocumentData,
} from "firebase/firestore";
import { db } from "../firebase/config";

// React Hooks
import { useEffect, useState } from "react";

export const useFetchDocuments = <T extends DocumentData>(
  docCollection: string,
  search: string | null = null,
  uid: string | null = null
) => {
  const [documents, setDocuments] = useState<T[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const collectionRef = collection(db, docCollection);
    let q;

    try {
      if (search) {
        q = query(
          collectionRef,
          where("tags", "array-contains", search),
          orderBy("createdAt", "desc")
        );
      } else if (uid) {
        q = query(
          collectionRef,
          where("uid", "==", uid),
          orderBy("createdAt", "desc")
        );
      } else {
        q = query(collectionRef, orderBy("createdAt", "desc"));
      }

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const fetchedPosts = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as unknown as T[];

          setDocuments(fetchedPosts);
          setLoading(false);
        },
        (err) => {
          console.error("HOOK: ERRO DENTRO DO LISTENER!", err);
          setError(err.message);
          setLoading(false);
        }
      );

      return () => {
        unsubscribe();
      };
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
      setLoading(false);
    }
  }, [docCollection, search, uid]);

  return { documents, loading, error };
};
