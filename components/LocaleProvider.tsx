"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Locale } from "@/lib/i18n";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "zh",
  setLocale: () => {},
});

export function useLocale() {
  return useContext(LocaleContext);
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("zh");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read initial locale from cookie
    try {
      const match = document.cookie.match(/(?:^|;\s*)locale=([^;]*)/);
      if (match) {
        const val = decodeURIComponent(match[1]);
        if (val === "zh" || val === "en") setLocaleState(val);
      }
    } catch { /* ignore */ }
    setMounted(true);
  }, []);

  const setLocale = async (l: Locale) => {
    setLocaleState(l);
    // Persist cookie via API
    try {
      await fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: l }),
      });
    } catch { /* ignore */ }
    // Also set client-side for immediate effect
    document.cookie = `locale=${l}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  };

  // Avoid hydration mismatch — render children only after mount
  if (!mounted) return <>{children}</>;

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}
