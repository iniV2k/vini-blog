import {
  addDoc,
  collection,
  Timestamp,
  type DocumentData,
} from "firebase/firestore";
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

const insertReducer = (state: ReducerState, action: Action) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null };
    case "INSERTED_DOC":
      return { loading: false, error: null };
    case "ERROR":
      return { loading: false, error: action.payload as string };
    default:
      return state;
  }
};

export const useInsertDocument = <T extends DocumentData>(
  docCollection: string
) => {
  const [cancelled, setCancelled] = useState(false);
  const [response, dispatch] = useReducer(insertReducer, initialState);

  const checkCancelBeforeDispatch = (action: Action) => {
    if (!cancelled) {
      dispatch(action);
    }
  };

  const insertDocument = async (document: T) => {
    checkCancelBeforeDispatch({ type: "LOADING" });
    try {
      const newDocument = { ...document, createdAt: Timestamp.now() };
      const insertedDocument = await addDoc(
        collection(db, docCollection),
        newDocument
      );

      checkCancelBeforeDispatch({
        type: "INSERTED_DOC",
        payload: insertedDocument,
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

  return { insertDocument, response };
};
