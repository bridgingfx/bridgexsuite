import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Monitor, Smartphone, Globe, Apple } from "lucide-react";
import { SiApple, SiAndroid } from "react-icons/si";

const platforms = [
  {
    name: "MetaTrader 5 - Windows",
    description: "Full-featured desktop trading platform for Windows",
    icon: Monitor,
    brandIcon: Monitor,
    version: "5.0.45",
    size: "42 MB",
    os: "Windows 10+",
  },
  {
    name: "MetaTrader 5 - macOS",
    description: "Native desktop trading platform for macOS",
    icon: Apple,
    brandIcon: SiApple,
    version: "5.0.45",
    size: "55 MB",
    os: "macOS 12+",
  },
  {
    name: "MetaTrader 5 - Android",
    description: "Trade on the go with the Android mobile app",
    icon: Smartphone,
    brandIcon: SiAndroid,
    version: "5.0.4260",
    size: "28 MB",
    os: "Android 7.0+",
  },
  {
    name: "MetaTrader 5 - iOS",
    description: "Trade on your iPhone or iPad",
    icon: Smartphone,
    brandIcon: SiApple,
    version: "5.0.4260",
    size: "32 MB",
    os: "iOS 14+",
  },
  {
    name: "MetaTrader 5 - Web Terminal",
    description: "Access your trading account from any browser",
    icon: Globe,
    brandIcon: Globe,
    version: "Latest",
    size: "N/A",
    os: "Any browser",
  },
];

export default function DownloadPlatformPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-page-title">Download Platform</h1>
        <p className="text-sm text-muted-foreground">Download the trading platform for your device</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((platform, i) => (
          <Card key={i}>
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center shrink-0">
                  <platform.brandIcon className="w-5 h-5" />
                </div>
                <CardTitle className="text-base leading-tight">{platform.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{platform.description}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary">v{platform.version}</Badge>
                <Badge variant="secondary">{platform.size}</Badge>
                <Badge variant="secondary">{platform.os}</Badge>
              </div>
              <Button className="w-full" data-testid={`button-download-${i}`}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
