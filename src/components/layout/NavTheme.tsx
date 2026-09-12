"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface NavTheme {
  inverse: boolean;
  setInverse: (v: boolean) => void;
}

const Ctx = createContext<NavTheme>({ inverse: false, setInverse: () => {} });

export function NavThemeProvider({ children }: { children: ReactNode }) {
  const [inverse, setInverse] = useState(false);
  return (
    <Ctx.Provider value={{ inverse, setInverse }}>{children}</Ctx.Provider>
  );
}

export const useNavTheme = () => useContext(Ctx);

/**
 * Call from a hero that sits under the nav with dark imagery so the
 * transparent nav renders in inverse (light) text. Resets on unmount.
 */
export function useNavInverse(active = true) {
  const { setInverse } = useContext(Ctx);
  useEffect(() => {
    setInverse(active);
    return () => setInverse(false);
  }, [active, setInverse]);
}
