import { Gift, Zap, Sparkles } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white text-sm py-2 overflow-hidden relative z-20 shrink-0 border-b border-blue-800 shadow-md" data-testid="announcement-bar">
      <div className="flex animate-marquee whitespace-nowrap items-center">
        <div className="flex items-center mx-8">
          <Gift size={14} className="mr-2 text-yellow-400" />
          <span className="font-medium tracking-wide">
            Special Offer: Get{" "}
            <span className="text-yellow-400 font-bold">100% Deposit Bonus</span>{" "}
            on your first funding!
          </span>
        </div>
        <span className="opacity-30 text-blue-300">•</span>
        <div className="flex items-center mx-8">
          <Zap size={14} className="mr-2 text-yellow-400" />
          <span className="font-medium tracking-wide">
            New Feature: Prop Firm Challenges now up to{" "}
            <span className="text-white font-bold">$200k Funding</span>.
          </span>
        </div>
        <span className="opacity-30 text-blue-300">•</span>
        <div className="flex items-center mx-8">
          <Sparkles size={14} className="mr-2 text-yellow-400" />
          <span className="font-medium tracking-wide">
            AI Signals: Access{" "}
            <span className="text-white font-bold">GPT-4 Market Analysis</span>{" "}
            in AI Center.
          </span>
        </div>
        <span className="opacity-30 text-blue-300">•</span>
        <div className="flex items-center mx-8">
          <Gift size={14} className="mr-2 text-yellow-400" />
          <span className="font-medium tracking-wide">
            Special Offer: Get{" "}
            <span className="text-yellow-400 font-bold">100% Deposit Bonus</span>{" "}
            on your first funding!
          </span>
        </div>
        <span className="opacity-30 text-blue-300">•</span>
        <div className="flex items-center mx-8">
          <Zap size={14} className="mr-2 text-yellow-400" />
          <span className="font-medium tracking-wide">
            New Feature: Prop Firm Challenges now up to{" "}
            <span className="text-white font-bold">$200k Funding</span>.
          </span>
        </div>
        <span className="opacity-30 text-blue-300">•</span>
        <div className="flex items-center mx-8">
          <Sparkles size={14} className="mr-2 text-yellow-400" />
          <span className="font-medium tracking-wide">
            AI Signals: Access{" "}
            <span className="text-white font-bold">GPT-4 Market Analysis</span>{" "}
            in AI Center.
          </span>
        </div>
      </div>
    </div>
  );
}
