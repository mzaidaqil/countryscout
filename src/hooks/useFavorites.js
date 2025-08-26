import { useState, useEffect } from "react";

const STORAGE_KEY = "countryscout-favorites";

export function useFavorites() {
  const [codes, setCodes] = useState([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCodes(parsed);
        }
      }
    } catch (err) {
      console.warn("Failed to load favorites from localStorage:", err);
    }
  }, []);

  // Save to localStorage whenever codes change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(codes));
    } catch (err) {
      console.warn("Failed to save favorites to localStorage:", err);
    }
  }, [codes]);

  const add = (code) => {
    if (!codes.includes(code)) {
      setCodes(prev => [...prev, code]);
    }
  };

  const remove = (code) => {
    setCodes(prev => prev.filter(c => c !== code));
  };

  const toggle = (code) => {
    if (codes.includes(code)) {
      remove(code);
    } else {
      add(code);
    }
  };

  const has = (code) => {
    return codes.includes(code);
  };

  return {
    codes,
    add,
    remove,
    toggle,
    has
  };
}
