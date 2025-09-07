import { doc, deleteDoc } from "firebase/firestore"; // Removido 'DocumentData' desnecessário
import { useEffect, useReducer, useState } from "react";
import { db } from "../firebase/config";

const initialState: ReducerState = {
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

const deleteReducer = (state: ReducerState, action: Action): ReducerState => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null };
    case "DELETED_DOC":
      return { loading: false, error: null };
    case "ERROR":
      return { loading: false, error: action.payload as string };
    default:
      return state;
  }
};

export const useDeleteDocument = (docCollection: string) => {
  const [response, dispatch] = useReducer(deleteReducer, initialState);
  const [cancelled, setCancelled] = useState(false);

  const checkCancelBeforeDispatch = (action: Action) => {
    if (!cancelled) {
      dispatch(action);
    }
  };

  const deleteDocument = async (id: string) => {
    checkCancelBeforeDispatch({ type: "LOADING" });
    try {
      const docRef = doc(db, docCollection, id);
      await deleteDoc(docRef);

      checkCancelBeforeDispatch({
        type: "DELETED_DOC",
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

  return { deleteDocument, response };
};
