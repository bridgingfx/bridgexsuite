import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Download,
  Monitor,
  Smartphone,
  Globe,
  ExternalLink,
} from "lucide-react";
import { SiApple, SiAndroid } from "react-icons/si";

const platforms = [
  {
    name: "MetaTrader 5 - Windows",
    description: "Full-featured desktop trading platform with advanced charting, automated trading, and multi-asset support.",
    icon: Monitor,
    brandIcon: Monitor,
    version: "5.0.45",
    size: "42 MB",
    os: "Windows 10+",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    recommended: true,
  },
  {
    name: "MetaTrader 5 - macOS",
    description: "Native desktop trading platform optimized for macOS with Retina display support and smooth performance.",
    icon: Monitor,
    brandIcon: SiApple,
    version: "5.0.45",
    size: "55 MB",
    os: "macOS 12+",
    color: "text-gray-700 dark:text-gray-300",
    bg: "bg-gray-100 dark:bg-gray-800/40",
    recommended: false,
  },
  {
    name: "MetaTrader 5 - Android",
    description: "Trade on the go with full charting capabilities, real-time quotes, and one-tap trading on your Android device.",
    icon: Smartphone,
    brandIcon: SiAndroid,
    version: "5.0.4260",
    size: "28 MB",
    os: "Android 7.0+",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    recommended: false,
  },
  {
    name: "MetaTrader 5 - iOS",
    description: "Trade seamlessly on your iPhone or iPad with an intuitive interface, Touch ID support, and push notifications.",
    icon: Smartphone,
    brandIcon: SiApple,
    version: "5.0.4260",
    size: "32 MB",
    os: "iOS 14+",
    color: "text-gray-700 dark:text-gray-300",
    bg: "bg-gray-100 dark:bg-gray-800/40",
    recommended: false,
  },
  {
    name: "Web Terminal",
    description: "Access your trading account instantly from any modern browser. No installation required — trade anywhere, anytime.",
    icon: Globe,
    brandIcon: Globe,
    version: "Latest",
    size: "N/A",
    os: "Any Browser",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    recommended: false,
  },
];

export default function DownloadPlatformPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-800 dark:from-blue-700 dark:to-indigo-900 rounded-2xl p-6 md:p-8 text-white shadow-lg" data-testid="download-hero">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-white/60 text-sm mb-1">Trading Platforms</p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight" data-testid="text-page-title">Download Platform</h1>
            <p className="text-white/70 text-sm mt-1">Download MetaTrader 5 for your preferred device and start trading</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <p className="text-white/60 text-xs mb-1">Supported Platforms</p>
            <p className="text-2xl font-bold">{platforms.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((platform, i) => (
          <div
            key={i}
            className={`bg-card rounded-xl border shadow-sm hover:shadow-md transition-all p-6 relative ${platform.recommended ? "border-blue-400 dark:border-blue-600 ring-2 ring-blue-500/20" : ""}`}
            data-testid={`platform-card-${i}`}
          >
            {platform.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-blue-600 dark:bg-blue-700">Recommended</Badge>
              </div>
            )}
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-lg ${platform.bg}`}>
                <platform.brandIcon className={`w-6 h-6 ${platform.color}`} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{platform.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{platform.os}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">{platform.description}</p>
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <Badge variant="secondary">v{platform.version}</Badge>
              <Badge variant="secondary">{platform.size}</Badge>
            </div>
            <Button className="w-full" data-testid={`button-download-${i}`}>
              {platform.name.includes("Web") ? (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Launch Web Terminal
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </>
              )}
            </Button>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border shadow-sm p-6" data-testid="system-requirements">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">System Requirements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Monitor className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Desktop (Windows/macOS)
            </h3>
            <ul className="space-y-1.5 text-sm text-gray-500 dark:text-gray-400">
              <li>Processor: 1 GHz or faster</li>
              <li>RAM: 2 GB minimum (4 GB recommended)</li>
              <li>Storage: 200 MB free disk space</li>
              <li>Internet: Broadband connection</li>
              <li>Display: 1024x768 minimum resolution</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Mobile (Android/iOS)
            </h3>
            <ul className="space-y-1.5 text-sm text-gray-500 dark:text-gray-400">
              <li>Android 7.0+ or iOS 14+</li>
              <li>RAM: 1 GB minimum</li>
              <li>Storage: 100 MB free space</li>
              <li>Internet: Wi-Fi or mobile data</li>
              <li>Screen: 4.7" or larger recommended</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
