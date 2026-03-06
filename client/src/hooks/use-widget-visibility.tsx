import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

const STORAGE_KEY = "bridgex-widget-visibility";

const defaultVisibility: Record<string, boolean> = {
  "Forex Trading": true,
  "Prop Trading": true,
  "Leagues": true,
  "Investments": true,
  "Rewards": true,
  "Download Platform": true,
  "Crypto Exchange": true,
  "Economic Calendar": true,
  "Live Charts": true,
  "Market News": true,
  "Currency Converter": false,
  "AI Center": true,
  "Trading Signals": false,
};

interface WidgetVisibilityContextType {
  visibility: Record<string, boolean>;
  setVisibility: (key: string, enabled: boolean) => void;
  isVisible: (key: string) => boolean;
}

const WidgetVisibilityContext = createContext<WidgetVisibilityContextType | null>(null);

export function WidgetVisibilityProvider({ children }: { children: ReactNode }) {
  const [visibility, setVisibilityState] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return { ...defaultVisibility, ...JSON.parse(stored) };
    } catch {}
    return defaultVisibility;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visibility));
  }, [visibility]);

  const setVisibility = (key: string, enabled: boolean) => {
    setVisibilityState((prev) => ({ ...prev, [key]: enabled }));
  };

  const isVisible = (key: string) => visibility[key] !== false;

  return (
    <WidgetVisibilityContext.Provider value={{ visibility, setVisibility, isVisible }}>
      {children}
    </WidgetVisibilityContext.Provider>
  );
}

export function useWidgetVisibility() {
  const ctx = useContext(WidgetVisibilityContext);
  if (!ctx) throw new Error("useWidgetVisibility must be used within WidgetVisibilityProvider");
  return ctx;
}
