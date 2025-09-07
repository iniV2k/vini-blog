import { useContext } from "react";
import { AuthContext, type AuthContextType } from "../context/AuthContext";

const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Contexto não inicializado/ encontrado");
  }

  return context;
};

export default useAuthContext;
