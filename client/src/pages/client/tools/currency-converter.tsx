import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeftRight, RefreshCw } from "lucide-react";

const currencies = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "CHF", name: "Swiss Franc", flag: "🇨🇭" },
  { code: "NZD", name: "New Zealand Dollar", flag: "🇳🇿" },
];

const demoRates: Record<string, Record<string, number>> = {
  USD: { EUR: 0.9215, GBP: 0.7893, JPY: 149.52, AUD: 1.5312, CAD: 1.3587, CHF: 0.8821, NZD: 1.6428, USD: 1 },
  EUR: { USD: 1.0852, GBP: 0.8566, JPY: 162.21, AUD: 1.6615, CAD: 1.4745, CHF: 0.9572, NZD: 1.7826, EUR: 1 },
  GBP: { USD: 1.2669, EUR: 1.1674, JPY: 189.39, AUD: 1.9400, CAD: 1.7216, CHF: 1.1175, NZD: 2.0813, GBP: 1 },
  JPY: { USD: 0.00669, EUR: 0.00616, GBP: 0.00528, AUD: 0.01024, CAD: 0.00909, CHF: 0.00590, NZD: 0.01099, JPY: 1 },
  AUD: { USD: 0.6531, EUR: 0.6019, GBP: 0.5155, JPY: 97.67, CAD: 0.8873, CHF: 0.5760, NZD: 1.0729, AUD: 1 },
  CAD: { USD: 0.7360, EUR: 0.6782, GBP: 0.5809, JPY: 110.06, AUD: 1.1270, CHF: 0.6492, NZD: 1.2090, CAD: 1 },
  CHF: { USD: 1.1337, EUR: 1.0447, GBP: 0.8948, JPY: 169.50, AUD: 1.7361, CAD: 1.5404, NZD: 1.8622, CHF: 1 },
  NZD: { USD: 0.6087, EUR: 0.5610, GBP: 0.4805, JPY: 91.01, AUD: 0.9321, CAD: 0.8271, CHF: 0.5370, NZD: 1 },
};

export default function CurrencyConverterPage() {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState("1000");

  const rate = demoRates[fromCurrency]?.[toCurrency] ?? 1;
  const convertedAmount = parseFloat(amount || "0") * rate;

  function handleSwap() {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white" data-testid="text-currency-converter-title">
          Currency Converter
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Convert between major currencies at live market rates
        </p>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-end">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">From</label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-sm text-gray-900 dark:text-white"
              data-testid="select-from-currency"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>{c.flag} {c.code} - {c.name}</option>
              ))}
            </select>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="text-lg font-mono"
              data-testid="input-amount"
            />
          </div>

          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSwap}
              className="rounded-full w-10 h-10 p-0"
              data-testid="button-swap-currencies"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">To</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-sm text-gray-900 dark:text-white"
              data-testid="select-to-currency"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>{c.flag} {c.code} - {c.name}</option>
              ))}
            </select>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <p className="text-lg font-mono font-bold text-gray-900 dark:text-white" data-testid="text-converted-amount">
                {convertedAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400" data-testid="text-exchange-rate">
            1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <RefreshCw className="w-3 h-3" />
            <span>Rates updated in real-time</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Popular Rates vs {fromCurrency}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full" data-testid="table-popular-rates">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Currency</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Rate</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{parseFloat(amount || "0").toLocaleString()} {fromCurrency} =</th>
              </tr>
            </thead>
            <tbody>
              {currencies.filter((c) => c.code !== fromCurrency).map((c) => {
                const r = demoRates[fromCurrency]?.[c.code] ?? 1;
                return (
                  <tr key={c.code} className="border-b border-gray-100 dark:border-gray-800 last:border-b-0" data-testid={`row-rate-${c.code.toLowerCase()}`}>
                    <td className="p-4 text-sm font-medium text-gray-900 dark:text-white">
                      {c.flag} {c.code} <span className="text-gray-400 font-normal">({c.name})</span>
                    </td>
                    <td className="p-4 text-sm font-mono text-gray-700 dark:text-gray-300">{r.toFixed(4)}</td>
                    <td className="p-4 text-sm font-mono font-semibold text-gray-900 dark:text-white">
                      {(parseFloat(amount || "0") * r).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {c.code}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
