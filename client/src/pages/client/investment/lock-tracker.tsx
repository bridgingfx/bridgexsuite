import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, CalendarClock, Timer, CalendarCheck } from "lucide-react";

interface LockInvestment {
  id: string;
  product: string;
  assetType: string;
  startDate: string;
  lockPeriodDays: number;
  maturityDate: string;
  investmentAmount: number;
}

const demoLockData: LockInvestment[] = [
  {
    id: "LK-001",
    product: "Gold Saver Plan",
    assetType: "Gold",
    startDate: "2024-06-15",
    lockPeriodDays: 365,
    maturityDate: "2025-06-15",
    investmentAmount: 5000,
  },
  {
    id: "LK-002",
    product: "BTC Growth Plan",
    assetType: "Crypto",
    startDate: "2024-09-01",
    lockPeriodDays: 180,
    maturityDate: "2025-02-28",
    investmentAmount: 10000,
  },
  {
    id: "LK-003",
    product: "USD Income Plan",
    assetType: "Currency",
    startDate: "2025-01-10",
    lockPeriodDays: 90,
    maturityDate: "2025-04-10",
    investmentAmount: 3000,
  },
  {
    id: "LK-004",
    product: "Gold Growth Plan",
    assetType: "Gold",
    startDate: "2024-03-01",
    lockPeriodDays: 365,
    maturityDate: "2025-03-01",
    investmentAmount: 15000,
  },
  {
    id: "LK-005",
    product: "Crypto Index Fund",
    assetType: "Crypto",
    startDate: "2024-11-15",
    lockPeriodDays: 270,
    maturityDate: "2025-08-12",
    investmentAmount: 8000,
  },
  {
    id: "LK-006",
    product: "Forex Alpha Strategy",
    assetType: "Currency",
    startDate: "2025-02-01",
    lockPeriodDays: 120,
    maturityDate: "2025-06-01",
    investmentAmount: 6000,
  },
];

function getProgress(startDate: string, lockPeriodDays: number): { percent: number; remainingDays: number } {
  const start = new Date(startDate).getTime();
  const now = Date.now();
  const elapsed = now - start;
  const totalMs = lockPeriodDays * 24 * 60 * 60 * 1000;
  const percent = Math.min(100, Math.max(0, (elapsed / totalMs) * 100));
  const remainingMs = Math.max(0, totalMs - elapsed);
  const remainingDays = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
  return { percent: Math.round(percent), remainingDays };
}

function getProgressColor(percent: number): string {
  if (percent > 50) return "bg-emerald-500 dark:bg-emerald-400";
  if (percent >= 25) return "bg-amber-500 dark:bg-amber-400";
  return "bg-red-500 dark:bg-red-400";
}

function getProgressTextColor(percent: number): string {
  if (percent > 50) return "text-emerald-600 dark:text-emerald-400";
  if (percent >= 25) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function getStatusLabel(percent: number): { label: string; className: string } {
  if (percent >= 100) return { label: "Matured", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" };
  if (percent > 50) return { label: "On Track", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" };
  if (percent >= 25) return { label: "In Progress", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" };
  return { label: "Early Stage", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function InvestmentLockTracker() {
  const totalLocked = demoLockData.reduce((sum, d) => sum + d.investmentAmount, 0);
  const maturedCount = demoLockData.filter((d) => getProgress(d.startDate, d.lockPeriodDays).percent >= 100).length;
  const avgProgress = Math.round(
    demoLockData.reduce((sum, d) => sum + getProgress(d.startDate, d.lockPeriodDays).percent, 0) / demoLockData.length
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1
          className="text-lg font-bold text-gray-900 dark:text-white"
          data-testid="text-lock-tracker-title"
        >
          Lock-in Tracker
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Monitor the lock-in periods and maturity status of your investments
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6" data-testid="stat-total-locked">
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Total Locked Capital
              </p>
              <h3
                className="text-2xl font-bold text-gray-900 dark:text-white"
                data-testid="text-total-locked"
              >
                ${totalLocked.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-3 rounded-lg bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400">
              <Lock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Across {demoLockData.length} investments
          </div>
        </Card>

        <Card className="p-6" data-testid="stat-matured">
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Matured Investments
              </p>
              <h3
                className="text-2xl font-bold text-gray-900 dark:text-white"
                data-testid="text-matured-count"
              >
                {maturedCount}
              </h3>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Ready for withdrawal
          </div>
        </Card>

        <Card className="p-6" data-testid="stat-avg-progress">
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Average Progress
              </p>
              <h3
                className="text-2xl font-bold text-gray-900 dark:text-white"
                data-testid="text-avg-progress"
              >
                {avgProgress}%
              </h3>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
              <Timer className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Portfolio lock-in completion
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden" data-testid="section-lock-tracker">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
          <CalendarClock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h2 className="font-bold text-gray-900 dark:text-white">
            Investment Lock-in Status
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left" data-testid="table-lock-tracker">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Investment Product
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Lock Period
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Remaining Days
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Maturity Date
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[200px]">
                  Progress
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {demoLockData.map((item) => {
                const { percent, remainingDays } = getProgress(item.startDate, item.lockPeriodDays);
                const barColor = getProgressColor(percent);
                const textColor = getProgressTextColor(percent);
                const status = getStatusLabel(percent);
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/30"
                    data-testid={`row-lock-${item.id}`}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p
                          className="text-sm font-medium text-gray-900 dark:text-white"
                          data-testid={`text-product-${item.id}`}
                        >
                          {item.product}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.assetType}
                        </p>
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400"
                      data-testid={`text-start-${item.id}`}
                    >
                      {formatDate(item.startDate)}
                    </td>
                    <td
                      className="px-6 py-4 text-sm text-gray-900 dark:text-white"
                      data-testid={`text-lock-period-${item.id}`}
                    >
                      {item.lockPeriodDays} days
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-bold ${textColor}`}
                        data-testid={`text-remaining-${item.id}`}
                      >
                        {remainingDays} days
                      </span>
                    </td>
                    <td
                      className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400"
                      data-testid={`text-maturity-${item.id}`}
                    >
                      {formatDate(item.maturityDate)}
                    </td>
                    <td className="px-6 py-4" data-testid={`progress-bar-${item.id}`}>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className={`text-xs font-bold min-w-[36px] text-right ${textColor}`}>
                          {percent}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="secondary"
                        className={`${status.className} no-default-hover-elevate no-default-active-elevate`}
                        data-testid={`badge-status-${item.id}`}
                      >
                        {status.label}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
