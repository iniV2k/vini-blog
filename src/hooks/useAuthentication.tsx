// Firebase
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";

// React Hooks
import { useEffect, useState } from "react";

export const useAuthentication = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [cancelled, setCancelled] = useState(false);
  const auth = getAuth();

  function checkIfIsCancelled() {
    if (cancelled) {
      return;
    }
  }

  const createUser = async (data: {
    email: string;
    password: string;
    displayName: string;
  }) => {
    checkIfIsCancelled();

    setLoading(true);
    setError(null);

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      await updateProfile(user, { displayName: data.displayName });

      return user;
    } catch (error) {
      let systemErrorMessage: string;
      if (error instanceof Error) {
        if (error.message.includes("Password")) {
          systemErrorMessage =
            "A senha precisa conter pelo menos 6 caracteres.";
        } else if (error.message.includes("email-already")) {
          systemErrorMessage = "E-mail já cadastrado";
        } else {
          systemErrorMessage =
            "Ocorreu um erro, por favor, tente novamente mais tarde.";
        }
        setError(systemErrorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    checkIfIsCancelled();
    signOut(auth);
  };

  const login = async (data: { email: string; password: string }) => {
    checkIfIsCancelled();

    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (error) {
      let systemErrorMessage: string;
      if (error instanceof Error) {
        if (error.message.includes("auth/invalid-credential")) {
          systemErrorMessage = "E-mail não cadastrado e/ou senha incorreta";
        } else if (error.message.includes("wrong-password")) {
          systemErrorMessage = "E-mail não encontrado e/ou senha incorreta";
        } else {
          systemErrorMessage =
            "Ocorreu um erro, por favor, tente novamente mais tarde.";
        }
        setError(systemErrorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return { auth, createUser, error, loading, logout, login };
};
