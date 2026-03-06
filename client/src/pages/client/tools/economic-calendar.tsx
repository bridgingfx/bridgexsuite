import { Calendar, Clock, TrendingUp, AlertTriangle, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const impactColors = {
  High: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

type Impact = keyof typeof impactColors;

interface CalendarEvent {
  id: string;
  time: string;
  currency: string;
  event: string;
  impact: Impact;
  forecast: string;
  previous: string;
  actual: string;
  country: string;
}

const demoEvents: CalendarEvent[] = [
  { id: "e1", time: "08:30", currency: "USD", event: "Non-Farm Payrolls", impact: "High", forecast: "185K", previous: "175K", actual: "192K", country: "US" },
  { id: "e2", time: "08:30", currency: "USD", event: "Unemployment Rate", impact: "High", forecast: "3.8%", previous: "3.7%", actual: "3.9%", country: "US" },
  { id: "e3", time: "10:00", currency: "EUR", event: "ECB Interest Rate Decision", impact: "High", forecast: "4.50%", previous: "4.50%", actual: "--", country: "EU" },
  { id: "e4", time: "09:00", currency: "GBP", event: "GDP Growth Rate QoQ", impact: "Medium", forecast: "0.3%", previous: "0.1%", actual: "0.2%", country: "UK" },
  { id: "e5", time: "02:00", currency: "JPY", event: "BOJ Interest Rate Decision", impact: "High", forecast: "-0.10%", previous: "-0.10%", actual: "--", country: "JP" },
  { id: "e6", time: "11:00", currency: "USD", event: "ISM Manufacturing PMI", impact: "Medium", forecast: "49.5", previous: "49.1", actual: "50.3", country: "US" },
  { id: "e7", time: "14:00", currency: "USD", event: "FOMC Meeting Minutes", impact: "High", forecast: "--", previous: "--", actual: "--", country: "US" },
  { id: "e8", time: "05:00", currency: "AUD", event: "Employment Change", impact: "Medium", forecast: "25.0K", previous: "61.5K", actual: "--", country: "AU" },
  { id: "e9", time: "04:30", currency: "CHF", event: "CPI MoM", impact: "Low", forecast: "0.1%", previous: "0.2%", actual: "0.0%", country: "CH" },
  { id: "e10", time: "08:15", currency: "EUR", event: "French Flash Manufacturing PMI", impact: "Low", forecast: "44.5", previous: "44.2", actual: "44.8", country: "FR" },
];

const filterOptions = ["All", "High", "Medium", "Low"] as const;

export default function EconomicCalendarPage() {
  const [impactFilter, setImpactFilter] = useState<string>("All");

  const filtered = impactFilter === "All" ? demoEvents : demoEvents.filter((e) => e.impact === impactFilter);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white" data-testid="text-economic-calendar-title">
            Economic Calendar
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Stay informed with key economic events and data releases
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300" data-testid="text-calendar-date">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">High Impact</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white" data-testid="text-high-impact-count">
                {demoEvents.filter((e) => e.impact === "High").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Medium Impact</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white" data-testid="text-medium-impact-count">
                {demoEvents.filter((e) => e.impact === "Medium").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Globe className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Events</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white" data-testid="text-total-events-count">
                {demoEvents.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {filterOptions.map((opt) => (
          <Button
            key={opt}
            variant={impactFilter === opt ? "default" : "outline"}
            size="sm"
            onClick={() => setImpactFilter(opt)}
            data-testid={`button-filter-${opt.toLowerCase()}`}
          >
            {opt === "All" ? "All Events" : `${opt} Impact`}
          </Button>
        ))}
      </div>

      <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" data-testid="table-calendar-events">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Currency</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Event</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Impact</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Forecast</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Previous</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actual</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((event) => (
                <tr key={event.id} className="border-b border-gray-100 dark:border-gray-800 last:border-b-0" data-testid={`row-event-${event.id}`}>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {event.time}
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline" className="font-mono font-semibold">{event.currency}</Badge>
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-900 dark:text-white">{event.event}</td>
                  <td className="p-4">
                    <Badge className={impactColors[event.impact]}>{event.impact}</Badge>
                  </td>
                  <td className="p-4 text-sm font-mono text-gray-700 dark:text-gray-300">{event.forecast}</td>
                  <td className="p-4 text-sm font-mono text-gray-700 dark:text-gray-300">{event.previous}</td>
                  <td className="p-4 text-sm font-mono font-semibold text-gray-900 dark:text-white">{event.actual}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
