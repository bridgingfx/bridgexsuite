import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

const STORAGE_KEY = "bridgex-wallets";
const DEFAULT_CURRENCY_KEY = "bridgex-default-currency";

export interface WalletCurrency {
  id: string;
  type: "fiat" | "crypto";
  currency: string;
  symbol: string;
  balance: number;
  isDefault: boolean;
}

export const fiatCurrencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "\u20AC", name: "Euro" },
  { code: "GBP", symbol: "\u00A3", name: "British Pound" },
  { code: "JPY", symbol: "\u00A5", name: "Japanese Yen" },
];

export const cryptoCurrencies = [
  { code: "USDT", symbol: "USDT", name: "Tether" },
  { code: "BTC", symbol: "BTC", name: "Bitcoin" },
  { code: "ETH", symbol: "ETH", name: "Ethereum" },
  { code: "TRX", symbol: "TRX", name: "Tron" },
  { code: "USDC", symbol: "USDC", name: "USD Coin" },
];

export const exchangeRates: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.50,
  USDT: 1,
  BTC: 0.000016,
  ETH: 0.00029,
  TRX: 8.33,
  USDC: 1,
};

const defaultWallets: WalletCurrency[] = [
  { id: "wallet-usd", type: "fiat", currency: "USD", symbol: "$", balance: 24592.50, isDefault: true },
];

interface WalletCurrencyContextType {
  wallets: WalletCurrency[];
  defaultCurrency: string;
  addWallet: (type: "fiat" | "crypto", currencyCode: string, setAsDefault: boolean) => void;
  setDefaultCurrency: (currencyCode: string) => void;
  getSymbol: (currencyCode: string) => string;
  convertFromUSD: (amountUSD: number, toCurrency?: string) => number;
  formatAmount: (amountUSD: number, toCurrency?: string) => string;
  getDefaultSymbol: () => string;
}

const WalletCurrencyContext = createContext<WalletCurrencyContextType | null>(null);

export function WalletCurrencyProvider({ children }: { children: ReactNode }) {
  const [wallets, setWallets] = useState<WalletCurrency[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return defaultWallets;
  });

  const [defaultCurrency, setDefaultCurrencyState] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(DEFAULT_CURRENCY_KEY);
      if (stored) return stored;
    } catch {}
    return "USD";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wallets));
  }, [wallets]);

  useEffect(() => {
    localStorage.setItem(DEFAULT_CURRENCY_KEY, defaultCurrency);
  }, [defaultCurrency]);

  useEffect(() => {
    const hasDefaultWallet = wallets.some((w) => w.currency === defaultCurrency);
    if (!hasDefaultWallet && wallets.length > 0) {
      const usdWallet = wallets.find((w) => w.currency === "USD");
      const fallback = usdWallet ? "USD" : wallets[0].currency;
      setDefaultCurrencyState(fallback);
      setWallets((prev) => prev.map((w) => ({ ...w, isDefault: w.currency === fallback })));
    }
  }, []);

  const getSymbol = (currencyCode: string) => {
    const fiat = fiatCurrencies.find((f) => f.code === currencyCode);
    if (fiat) return fiat.symbol;
    const crypto = cryptoCurrencies.find((c) => c.code === currencyCode);
    if (crypto) return crypto.symbol;
    return currencyCode;
  };

  const convertFromUSD = (amountUSD: number, toCurrency?: string) => {
    const target = toCurrency || defaultCurrency;
    const rate = exchangeRates[target] || 1;
    return amountUSD * rate;
  };

  const formatAmount = (amountUSD: number, toCurrency?: string) => {
    const target = toCurrency || defaultCurrency;
    const converted = convertFromUSD(amountUSD, target);
    const sym = getSymbol(target);
    const isCrypto = cryptoCurrencies.some((c) => c.code === target);
    if (isCrypto) {
      return `${converted.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 8 })} ${sym}`;
    }
    return `${sym}${converted.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  };

  const getDefaultSymbol = () => getSymbol(defaultCurrency);

  const addWallet = (type: "fiat" | "crypto", currencyCode: string, setAsDefault: boolean) => {
    const exists = wallets.find((w) => w.currency === currencyCode);
    if (exists) return;

    const sym = getSymbol(currencyCode);
    const baseBalance = 24592.50;
    const rate = exchangeRates[currencyCode] || 1;
    const convertedBalance = baseBalance * rate;

    const newWallet: WalletCurrency = {
      id: `wallet-${currencyCode.toLowerCase()}-${Date.now()}`,
      type,
      currency: currencyCode,
      symbol: sym,
      balance: convertedBalance,
      isDefault: false,
    };

    if (setAsDefault) {
      setWallets((prev) =>
        [...prev.map((w) => ({ ...w, isDefault: false })), { ...newWallet, isDefault: true }]
      );
      setDefaultCurrencyState(currencyCode);
    } else {
      setWallets((prev) => [...prev, newWallet]);
    }
  };

  const setDefaultCurrency = (currencyCode: string) => {
    setWallets((prev) =>
      prev.map((w) => ({ ...w, isDefault: w.currency === currencyCode }))
    );
    setDefaultCurrencyState(currencyCode);
  };

  return (
    <WalletCurrencyContext.Provider
      value={{ wallets, defaultCurrency, addWallet, setDefaultCurrency, getSymbol, convertFromUSD, formatAmount, getDefaultSymbol }}
    >
      {children}
    </WalletCurrencyContext.Provider>
  );
}

export function useWalletCurrency() {
  const ctx = useContext(WalletCurrencyContext);
  if (!ctx) throw new Error("useWalletCurrency must be used within WalletCurrencyProvider");
  return ctx;
}
