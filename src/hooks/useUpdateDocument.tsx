import { updateDoc, doc, type DocumentData } from "firebase/firestore";
import { useEffect, useReducer, useState } from "react";
import { db } from "../firebase/config";

const initialState = {
  loading: false,
  error: null,
};

interface ReducerState {
  loading: boolean;
  error: string | null;
}

interface Action {
  type: string;
  payload?: any;
}

const updateReducer = (state: ReducerState, action: Action) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null };
    case "UPDATED_DOC":
      return { loading: false, error: null };
    case "ERROR":
      return { loading: false, error: action.payload as string };
    default:
      return state;
  }
};

export const useUpdateDocument = <T extends DocumentData>(
  docCollection: string
) => {
  // deal with memory leak
  const [cancelled, setCancelled] = useState(false);
  const [response, dispatch] = useReducer(updateReducer, initialState);

  const checkCancelBeforeDispatch = (action: Action) => {
    if (!cancelled) {
      dispatch(action);
    }
  };

  const updateDocument = async (uid: string, document: T) => {
    checkCancelBeforeDispatch({ type: "LOADING" });
    try {
      const docRef = doc(db, docCollection, uid);

      const updatedDocument = await updateDoc(docRef, document);

      checkCancelBeforeDispatch({
        type: "UPDATED_DOC",
        payload: updatedDocument,
      });
    } catch (error) {
      if (error instanceof Error) {
        checkCancelBeforeDispatch({ type: "ERROR", payload: error.message });
      } else {
        checkCancelBeforeDispatch({
          type: "ERROR",
          payload: "Ocorreu um erro inesperado.",
        });
      }
    }
  };

  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return { updateDocument, response };
};
