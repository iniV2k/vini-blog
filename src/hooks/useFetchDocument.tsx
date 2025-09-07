// src/hooks/useFetchDocument.ts

import { doc, getDoc, type DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";

export const useFetchDocument = <T extends DocumentData>(
  docCollection: string,
  id: string | undefined
) => {
  const [document, setDocument] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchDoc = async () => {
      setLoading(true);
      setError(null);

      try {
        const docRef = doc(db, docCollection, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDocument({
            id: docSnap.id,
            ...docSnap.data(),
          } as unknown as T);
        } else {
          setError("O post não foi encontrado.");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Ocorreu um erro ao buscar o documento.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();
  }, [docCollection, id]);

  return { document, loading, error };
};
