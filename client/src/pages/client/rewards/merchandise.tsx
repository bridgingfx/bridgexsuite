import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ShoppingBag,
  Star,
  ShoppingCart,
  CheckCircle,
  Search,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface MerchItem {
  id: number;
  name: string;
  description: string;
  pointsCost: number;
  category: string;
  image: string;
  inStock: boolean;
  featured: boolean;
}

const merchItems: MerchItem[] = [
  { id: 1, name: "BridgeX Premium T-Shirt", description: "High-quality cotton t-shirt with embroidered BridgeX logo. Available in multiple sizes.", pointsCost: 2000, category: "Apparel", image: "tshirt", inStock: true, featured: true },
  { id: 2, name: "Trader's Coffee Mug", description: "Ceramic mug with candlestick chart design. 350ml capacity, dishwasher safe.", pointsCost: 800, category: "Accessories", image: "mug", inStock: true, featured: false },
  { id: 3, name: "BridgeX Cap", description: "Adjustable snapback cap with woven BridgeX logo. One size fits all.", pointsCost: 1200, category: "Apparel", image: "cap", inStock: true, featured: true },
  { id: 4, name: "Trading Desk Mouse Pad", description: "Extended mouse pad with forex chart pattern. Anti-slip rubber base, 800x300mm.", pointsCost: 1500, category: "Accessories", image: "mousepad", inStock: true, featured: false },
  { id: 5, name: "Bull & Bear Figurine Set", description: "Premium metal figurines of bull and bear, perfect for your trading desk.", pointsCost: 5000, category: "Collectibles", image: "figurine", inStock: false, featured: true },
  { id: 6, name: "BridgeX Hoodie", description: "Comfortable fleece hoodie with embroidered BridgeX branding. Unisex sizing.", pointsCost: 3500, category: "Apparel", image: "hoodie", inStock: true, featured: true },
  { id: 7, name: "Wireless Charging Pad", description: "Sleek wireless charger with BridgeX branding. Compatible with all Qi devices.", pointsCost: 2500, category: "Tech", image: "charger", inStock: true, featured: false },
  { id: 8, name: "Premium Notebook Set", description: "Set of 3 leather-bound notebooks with trading grid pages and gold foil logo.", pointsCost: 1800, category: "Accessories", image: "notebook", inStock: true, featured: false },
  { id: 9, name: "BridgeX Water Bottle", description: "Insulated stainless steel water bottle, 750ml. Keeps drinks hot 12h / cold 24h.", pointsCost: 1000, category: "Accessories", image: "bottle", inStock: true, featured: false },
  { id: 10, name: "VIP Trader Badge", description: "Exclusive enamel pin badge. Limited edition collectible for top-tier members.", pointsCost: 4000, category: "Collectibles", image: "badge", inStock: true, featured: false },
];

const categories = ["All", "Apparel", "Accessories", "Tech", "Collectibles"];

const categoryColors: Record<string, string> = {
  Apparel: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  Accessories: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
  Tech: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
  Collectibles: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
};

const imageGradients: Record<string, string> = {
  tshirt: "from-blue-500 to-indigo-600",
  mug: "from-amber-500 to-orange-600",
  cap: "from-slate-500 to-gray-700",
  mousepad: "from-emerald-500 to-teal-600",
  figurine: "from-yellow-500 to-amber-600",
  hoodie: "from-indigo-500 to-purple-600",
  charger: "from-cyan-500 to-blue-600",
  notebook: "from-rose-500 to-pink-600",
  bottle: "from-teal-500 to-cyan-600",
  badge: "from-fuchsia-500 to-purple-600",
};

type RedeemStep = "review" | "otp" | "verified";

export default function MerchandisePage() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<MerchItem | null>(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [redeemStep, setRedeemStep] = useState<RedeemStep>("review");
  const [otpCode, setOtpCode] = useState("");
  const userPoints = 3250;

  const filteredItems = merchItems.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleRedeem = (item: MerchItem) => {
    if (userPoints < item.pointsCost) {
      toast({ title: "Insufficient points", description: `You need ${(item.pointsCost - userPoints).toLocaleString()} more points to redeem this item.`, variant: "destructive" });
      return;
    }
    setSelectedItem(item);
    setRedeemStep("review");
    setOtpCode("");
    setOrderDialogOpen(true);
  };

  const handleSendOtp = () => {
    setRedeemStep("otp");
    toast({ title: "OTP sent", description: "A verification code has been sent to your registered email." });
  };

  const handleVerifyOtp = () => {
    if (otpCode.length === 6) {
      setRedeemStep("verified");
      toast({ title: "OTP verified", description: "Your identity has been confirmed." });
    } else {
      toast({ title: "Invalid OTP", description: "Please enter a valid 6-digit code.", variant: "destructive" });
    }
  };

  const confirmOrder = () => {
    if (selectedItem) {
      toast({ title: "Order placed successfully", description: `${selectedItem.name} will be shipped to your registered address.` });
      setOrderDialogOpen(false);
      setSelectedItem(null);
      setRedeemStep("review");
      setOtpCode("");
    }
  };

  const resetDialog = () => {
    setOrderDialogOpen(false);
    setSelectedItem(null);
    setRedeemStep("review");
    setOtpCode("");
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="bg-gradient-to-br from-purple-600 to-indigo-800 dark:from-purple-700 dark:to-indigo-900 rounded-2xl p-6 md:p-8 text-white shadow-lg" data-testid="merchandise-hero">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-white/60 text-sm mb-1">Rewards Store</p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight" data-testid="text-page-title">Merchandise</h1>
            <p className="text-white/70 text-sm mt-1">Redeem your loyalty points for exclusive branded merchandise</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center min-w-[120px]">
              <p className="text-white/60 text-xs mb-1">Available Points</p>
              <p className="text-2xl font-bold" data-testid="text-available-points">{userPoints.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center min-w-[120px]">
              <p className="text-white/60 text-xs mb-1">Items Available</p>
              <p className="text-2xl font-bold" data-testid="text-items-count">{merchItems.filter((i) => i.inStock).length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-brand-600 text-white"
                  : "bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
              data-testid={`button-category-${cat.toLowerCase()}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search merchandise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-merchandise"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredItems.map((item) => {
          const canAfford = userPoints >= item.pointsCost;
          return (
            <div
              key={item.id}
              className={`bg-white dark:bg-dark-card rounded-xl border shadow-sm hover:shadow-md transition-all overflow-hidden ${
                !item.inStock ? "opacity-60" : ""
              } ${item.featured ? "border-brand-300 dark:border-brand-700" : "border-gray-100 dark:border-gray-800"}`}
              data-testid={`card-merch-${item.id}`}
            >
              <div className={`h-40 bg-gradient-to-br ${imageGradients[item.image] || "from-gray-400 to-gray-600"} flex items-center justify-center relative`}>
                <ShoppingBag className="w-12 h-12 text-white/40" />
                {item.featured && (
                  <Badge className="absolute top-3 left-3 bg-yellow-500 text-white border-0 no-default-hover-elevate no-default-active-elevate" data-testid={`badge-featured-${item.id}`}>
                    <Star className="w-3 h-3 mr-1" /> Featured
                  </Badge>
                )}
                {!item.inStock && (
                  <Badge className="absolute top-3 right-3 bg-red-500 text-white border-0 no-default-hover-elevate no-default-active-elevate" data-testid={`badge-outofstock-${item.id}`}>
                    Out of Stock
                  </Badge>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className={categoryColors[item.category] || ""} data-testid={`badge-category-${item.id}`}>
                    {item.category}
                  </Badge>
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1" data-testid={`text-points-${item.id}`}>
                    <Star className="w-3.5 h-3.5" />
                    {item.pointsCost.toLocaleString()}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1" data-testid={`text-name-${item.id}`}>{item.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{item.description}</p>
                <Button
                  className="w-full"
                  disabled={!item.inStock || !canAfford}
                  onClick={() => handleRedeem(item)}
                  data-testid={`button-redeem-${item.id}`}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {!item.inStock ? "Out of Stock" : !canAfford ? "Not Enough Points" : "Redeem"}
                </Button>
              </div>
            </div>
          );
        })}
        {filteredItems.length === 0 && (
          <div className="col-span-full text-center py-12">
            <ShoppingBag className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No items found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search or category filter</p>
          </div>
        )}
      </div>

      <Dialog open={orderDialogOpen} onOpenChange={(open) => { if (!open) resetDialog(); }}>
        <DialogContent className="max-w-md bg-[#0f172a] border-gray-800 text-white" data-testid="dialog-confirm-order">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-brand-400" />
              {redeemStep === "review" ? "Confirm Redemption" : redeemStep === "otp" ? "Email Verification" : "Order Confirmed"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {redeemStep === "review"
                ? "Review your order and verify via OTP to process."
                : redeemStep === "otp"
                  ? "Enter the verification code sent to your email."
                  : "Your identity has been verified. Confirm to place the order."}
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              {redeemStep === "review" && (
                <>
                  <div className={`h-32 bg-gradient-to-br ${imageGradients[selectedItem.image] || "from-gray-400 to-gray-600"} rounded-xl flex items-center justify-center`}>
                    <ShoppingBag className="w-10 h-10 text-white/40" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg" data-testid="text-redeem-item">{selectedItem.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">{selectedItem.description}</p>
                  </div>
                  <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Item Cost</span>
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <Star className="w-3.5 h-3.5" /> {selectedItem.pointsCost.toLocaleString()} pts
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Your Balance</span>
                      <span className="text-white font-medium">{userPoints.toLocaleString()} pts</span>
                    </div>
                    <div className="border-t border-gray-700 pt-2 flex justify-between text-sm">
                      <span className="text-gray-400">Remaining</span>
                      <span className="text-emerald-400 font-bold">{(userPoints - selectedItem.pointsCost).toLocaleString()} pts</span>
                    </div>
                  </div>
                  <Button className="w-full" onClick={handleSendOtp} data-testid="button-send-otp">
                    <Mail className="w-4 h-4 mr-2" />
                    Send OTP to Email
                  </Button>
                </>
              )}

              {redeemStep === "otp" && (
                <>
                  <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Redeeming</p>
                        <p className="text-white font-semibold">{selectedItem.name}</p>
                      </div>
                      <span className="text-amber-400 font-bold text-sm flex items-center gap-1">
                        <Star className="w-3.5 h-3.5" /> {selectedItem.pointsCost.toLocaleString()} pts
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-300 text-sm">Enter 6-digit OTP</Label>
                    <Input
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="000000"
                      maxLength={6}
                      className="mt-1 bg-gray-900 border-gray-700 text-white text-center text-2xl font-mono tracking-[0.5em]"
                      data-testid="input-otp"
                    />
                    <p className="text-[11px] text-gray-500 mt-2">A verification code has been sent to your registered email address.</p>
                  </div>
                  <Button
                    className="w-full"
                    disabled={otpCode.length !== 6}
                    onClick={handleVerifyOtp}
                    data-testid="button-verify-otp"
                  >
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    Verify OTP
                  </Button>
                </>
              )}

              {redeemStep === "verified" && (
                <>
                  <div className="p-4 bg-emerald-900/20 border border-emerald-800/50 rounded-xl flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-emerald-300 font-medium text-sm">Identity Verified</p>
                      <p className="text-emerald-400/70 text-xs">Your email has been confirmed via OTP</p>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Item</span>
                      <span className="text-white font-medium">{selectedItem.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Points Deducted</span>
                      <span className="text-amber-400 font-bold">{selectedItem.pointsCost.toLocaleString()} pts</span>
                    </div>
                    <div className="border-t border-gray-700 pt-2 flex justify-between text-sm">
                      <span className="text-gray-400">Remaining Balance</span>
                      <span className="text-emerald-400 font-bold">{(userPoints - selectedItem.pointsCost).toLocaleString()} pts</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Item will be shipped to your registered address within 5-10 business days.</p>
                  <Button className="w-full" onClick={confirmOrder} data-testid="button-confirm-redeem">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Order
                  </Button>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
