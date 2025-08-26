import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

export function useFavorites() {
  const [codes, setCodes] = useLocalStorage("favorites", []);

  const has = useCallback(
    (code) => codes.includes(code),
    [codes]
  );
  const add = useCallback(
    (code) => setCodes((prev) => (prev.includes(code) ? prev : [...prev, code])),
    [setCodes]
  );
  const remove = useCallback(
    (code) => setCodes((prev) => prev.filter((c) => c !== code)),
    [setCodes]
  );
  const toggle = useCallback(
    (code) =>
      setCodes((prev) =>
        prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
      ),
    [setCodes]
  );

  return { codes, has, add, remove, toggle };
}
