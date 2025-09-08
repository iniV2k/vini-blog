// React Hook
import { useMemo } from "react";

// Navegacao
import { useLocation } from "react-router-dom";

export function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}
