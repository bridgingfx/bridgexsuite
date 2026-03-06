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
  Package,
  Truck,
  CheckCircle,
  Eye,
  XCircle,
  Clock,
  MapPin,
  Calendar,
  Star,
  ArrowLeftRight,
  ShieldCheck,
  Mail,
  Hash,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type OrderStatus = "Pending" | "Approved" | "Shipped" | "Delivered" | "Cancelled";

interface Order {
  id: string;
  item: string;
  category: string;
  date: string;
  points: number;
  status: OrderStatus;
  approvedDate: string | null;
  trackingNumber: string | null;
  carrier: string | null;
  estimatedDelivery: string | null;
  deliveredDate: string | null;
  shippingAddress: string | null;
}

const orders: Order[] = [
  {
    id: "ORD-20240120-001",
    item: "BridgeX Premium T-Shirt",
    category: "Apparel",
    date: "2024-01-20",
    points: 2000,
    status: "Delivered",
    approvedDate: "2024-01-21",
    trackingNumber: "BX1234567890",
    carrier: "FedEx",
    estimatedDelivery: "2024-01-28",
    deliveredDate: "2024-01-27",
    shippingAddress: "123 Trading St, New York, NY 10001",
  },
  {
    id: "ORD-20240115-002",
    item: "Trader's Coffee Mug",
    category: "Accessories",
    date: "2024-01-15",
    points: 800,
    status: "Shipped",
    approvedDate: "2024-01-16",
    trackingNumber: "BX9876543210",
    carrier: "DHL",
    estimatedDelivery: "2024-01-25",
    deliveredDate: null,
    shippingAddress: "123 Trading St, New York, NY 10001",
  },
  {
    id: "ORD-20240110-003",
    item: "BridgeX Hoodie",
    category: "Apparel",
    date: "2024-01-10",
    points: 3500,
    status: "Approved",
    approvedDate: "2024-01-11",
    trackingNumber: null,
    carrier: null,
    estimatedDelivery: null,
    deliveredDate: null,
    shippingAddress: "123 Trading St, New York, NY 10001",
  },
  {
    id: "ORD-20240108-004",
    item: "Wireless Charging Pad",
    category: "Tech",
    date: "2024-01-08",
    points: 2500,
    status: "Pending",
    approvedDate: null,
    trackingNumber: null,
    carrier: null,
    estimatedDelivery: null,
    deliveredDate: null,
    shippingAddress: null,
  },
  {
    id: "ORD-20240105-005",
    item: "Trading Desk Mouse Pad",
    category: "Accessories",
    date: "2024-01-05",
    points: 1500,
    status: "Pending",
    approvedDate: null,
    trackingNumber: null,
    carrier: null,
    estimatedDelivery: null,
    deliveredDate: null,
    shippingAddress: "123 Trading St, New York, NY 10001",
  },
  {
    id: "ORD-20231228-006",
    item: "BridgeX Cap",
    category: "Apparel",
    date: "2023-12-28",
    points: 1200,
    status: "Cancelled",
    approvedDate: null,
    trackingNumber: null,
    carrier: null,
    estimatedDelivery: null,
    deliveredDate: null,
    shippingAddress: null,
  },
];

const statusConfig: Record<OrderStatus, { color: string; icon: typeof Clock; label: string }> = {
  Pending: { color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300", icon: Clock, label: "Pending" },
  Approved: { color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300", icon: CheckCircle, label: "Approved" },
  Shipped: { color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300", icon: Truck, label: "Shipped" },
  Delivered: { color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300", icon: CheckCircle, label: "Delivered" },
  Cancelled: { color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300", icon: XCircle, label: "Cancelled" },
};

const statusTabs: (OrderStatus | "All")[] = ["All", "Pending", "Approved", "Shipped", "Delivered", "Cancelled"];

export default function RewardsTransactionsPage() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState<OrderStatus | "All">("All");
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [addressForm, setAddressForm] = useState({ street: "", city: "", state: "", zip: "", country: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const filteredOrders = selectedTab === "All" ? orders : orders.filter((o) => o.status === selectedTab);

  const handleCancel = (order: Order) => {
    toast({ title: "Order cancelled", description: `${order.points.toLocaleString()} loyalty points have been refunded to your balance.` });
    setCancelConfirm(false);
    setViewOrder(null);
  };

  const handleSendOtp = () => {
    setOtpSent(true);
    toast({ title: "OTP sent", description: "A verification code has been sent to your registered email." });
  };

  const handleVerifyOtp = () => {
    if (otpCode.length === 6) {
      setOtpVerified(true);
      toast({ title: "Address verified", description: "Your shipping address has been confirmed. Order will be processed." });
    } else {
      toast({ title: "Invalid OTP", description: "Please enter a valid 6-digit code.", variant: "destructive" });
    }
  };

  const handleConfirmAddress = () => {
    const isEdit = viewOrder?.shippingAddress;
    toast({
      title: isEdit ? "Address updated" : "Order processing",
      description: isEdit
        ? "Your shipping address has been updated and the order is being processed."
        : "Your shipping address has been saved successfully.",
    });
    setAddressDialogOpen(false);
    setOtpSent(false);
    setOtpCode("");
    setOtpVerified(false);
    setAddressForm({ street: "", city: "", state: "", zip: "", country: "" });
    setViewOrder(null);
  };

  const resetAddressDialog = () => {
    setAddressDialogOpen(false);
    setOtpSent(false);
    setOtpCode("");
    setOtpVerified(false);
    setAddressForm({ street: "", city: "", state: "", zip: "", country: "" });
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="bg-gradient-to-br from-purple-600 to-indigo-800 dark:from-purple-700 dark:to-indigo-900 rounded-2xl p-6 md:p-8 text-white shadow-lg" data-testid="transactions-hero">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-white/60 text-sm mb-1">Rewards</p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight" data-testid="text-page-title">Transaction History</h1>
            <p className="text-white/70 text-sm mt-1">Track your merchandise orders and delivery status</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center min-w-[100px]">
              <p className="text-white/60 text-xs mb-1">Total Orders</p>
              <p className="text-2xl font-bold" data-testid="text-total-orders">{orders.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center min-w-[100px]">
              <p className="text-white/60 text-xs mb-1">Points Spent</p>
              <p className="text-2xl font-bold" data-testid="text-total-points-spent">
                {orders.filter((o) => o.status !== "Cancelled").reduce((sum, o) => sum + o.points, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center min-w-[100px]">
              <p className="text-white/60 text-xs mb-1">Delivered</p>
              <p className="text-2xl font-bold" data-testid="text-delivered-count">{orders.filter((o) => o.status === "Delivered").length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {statusTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedTab === tab
                ? "bg-brand-600 text-white"
                : "bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
            data-testid={`button-tab-${tab.toLowerCase()}`}
          >
            {tab}
            {tab !== "All" && (
              <span className="ml-1.5 text-xs opacity-70">
                ({orders.filter((o) => o.status === tab).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden" data-testid="transactions-table">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 dark:bg-gray-800/50 text-left">
                <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Order ID</th>
                <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Item</th>
                <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Date</th>
                <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Points</th>
                <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, i) => {
                const cfg = statusConfig[order.status];
                return (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors" data-testid={`order-row-${i}`}>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400" data-testid={`text-order-id-${i}`}>{order.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-400 shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white" data-testid={`text-order-item-${i}`}>{order.item}</p>
                          <p className="text-xs text-gray-400">{order.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{order.date}</td>
                    <td className="px-6 py-4 text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {order.points.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={`${cfg.color} border-0 no-default-hover-elevate no-default-active-elevate`} data-testid={`badge-status-${i}`}>
                        <cfg.icon className="w-3 h-3 mr-1" />
                        {cfg.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewOrder(order)}
                        data-testid={`button-view-${i}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Package className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">No orders found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!viewOrder && !addressDialogOpen} onOpenChange={(open) => { if (!open) { setViewOrder(null); setCancelConfirm(false); } }}>
        <DialogContent className="max-w-lg bg-[#0f172a] border-gray-800 text-white" data-testid="dialog-view-order">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-brand-400" />
              Order Details
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {viewOrder?.id}
            </DialogDescription>
          </DialogHeader>
          {viewOrder && (() => {
            const cfg = statusConfig[viewOrder.status];
            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-lg" data-testid="text-detail-item">{viewOrder.item}</h3>
                    <p className="text-sm text-gray-400">{viewOrder.category}</p>
                  </div>
                  <Badge className={`${cfg.color} border-0 no-default-hover-elevate no-default-active-elevate`} data-testid="badge-detail-status">
                    <cfg.icon className="w-3 h-3 mr-1" />
                    {cfg.label}
                  </Badge>
                </div>

                <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500 shrink-0" />
                    <span className="text-gray-400 w-32">Order Date</span>
                    <span className="text-white font-medium" data-testid="text-detail-date">{viewOrder.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Star className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-gray-400 w-32">Points</span>
                    <span className="text-amber-400 font-bold" data-testid="text-detail-points">{viewOrder.points.toLocaleString()} pts</span>
                  </div>
                  {viewOrder.approvedDate && (
                    <div className="flex items-center gap-3 text-sm">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-gray-400 w-32">Approved Date</span>
                      <span className="text-emerald-400 font-medium" data-testid="text-detail-approved">{viewOrder.approvedDate}</span>
                    </div>
                  )}
                </div>

                {(viewOrder.status === "Shipped" || viewOrder.status === "Delivered") && (
                  <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl space-y-3" data-testid="section-tracking">
                    <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Truck className="w-4 h-4 text-brand-400" />
                      Tracking Details
                    </h4>
                    {viewOrder.trackingNumber && (
                      <div className="flex items-center gap-3 text-sm">
                        <Hash className="w-4 h-4 text-gray-500 shrink-0" />
                        <span className="text-gray-400 w-32">Tracking #</span>
                        <span className="text-white font-mono text-xs" data-testid="text-detail-tracking">{viewOrder.trackingNumber}</span>
                      </div>
                    )}
                    {viewOrder.carrier && (
                      <div className="flex items-center gap-3 text-sm">
                        <Truck className="w-4 h-4 text-gray-500 shrink-0" />
                        <span className="text-gray-400 w-32">Carrier</span>
                        <span className="text-white font-medium" data-testid="text-detail-carrier">{viewOrder.carrier}</span>
                      </div>
                    )}
                    {viewOrder.estimatedDelivery && (
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-gray-500 shrink-0" />
                        <span className="text-gray-400 w-32">Est. Delivery</span>
                        <span className="text-white font-medium" data-testid="text-detail-est-delivery">{viewOrder.estimatedDelivery}</span>
                      </div>
                    )}
                    {viewOrder.deliveredDate && (
                      <div className="flex items-center gap-3 text-sm">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-gray-400 w-32">Delivered On</span>
                        <span className="text-emerald-400 font-medium" data-testid="text-detail-delivered">{viewOrder.deliveredDate}</span>
                      </div>
                    )}
                  </div>
                )}

                {viewOrder.shippingAddress && (
                  <div className="flex items-center justify-between text-sm p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                    <div className="flex items-center gap-3 min-w-0">
                      <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
                      <span className="text-gray-400 truncate" data-testid="text-detail-address">{viewOrder.shippingAddress}</span>
                    </div>
                    {(viewOrder.status === "Pending" || viewOrder.status === "Approved") && (
                      <button
                        onClick={() => {
                          const parts = viewOrder.shippingAddress?.split(", ") || [];
                          setAddressForm({
                            street: parts[0] || "",
                            city: parts[1] || "",
                            state: parts[2]?.replace(/\s+\d+$/, "") || "",
                            zip: parts[2]?.match(/\d+$/)?.[0] || "",
                            country: parts[3] || "",
                          });
                          setAddressDialogOpen(true);
                        }}
                        className="text-xs text-brand-400 hover:text-brand-300 font-medium hover:underline shrink-0 ml-3"
                        data-testid="button-edit-address"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                )}

                {viewOrder.status === "Pending" && (
                  <div className="space-y-3 pt-2">
                    {!viewOrder.shippingAddress && (
                      <Button
                        className="w-full bg-brand-600 hover:bg-brand-700"
                        onClick={() => setAddressDialogOpen(true)}
                        data-testid="button-add-address"
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        Add Shipping Address (Optional)
                      </Button>
                    )}
                    {!cancelConfirm ? (
                      <Button
                        variant="outline"
                        className="w-full border-red-500/50 text-red-400 hover:bg-red-900/20 hover:text-red-300"
                        onClick={() => setCancelConfirm(true)}
                        data-testid="button-cancel-order"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancel Order & Refund Points
                      </Button>
                    ) : (
                      <div className="p-4 bg-red-900/20 border border-red-800/50 rounded-xl space-y-3">
                        <p className="text-sm text-red-300">
                          Are you sure you want to cancel this order? <span className="font-bold">{viewOrder.points.toLocaleString()} points</span> will be refunded to your balance.
                        </p>
                        <div className="flex gap-2">
                          <Button
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => handleCancel(viewOrder)}
                            data-testid="button-confirm-cancel"
                          >
                            <ArrowLeftRight className="w-4 h-4 mr-2" />
                            Confirm Cancel & Refund
                          </Button>
                          <Button
                            variant="outline"
                            className="border-gray-600 text-gray-300"
                            onClick={() => setCancelConfirm(false)}
                            data-testid="button-dismiss-cancel"
                          >
                            Keep
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      <Dialog open={addressDialogOpen} onOpenChange={(open) => { if (!open) resetAddressDialog(); }}>
        <DialogContent className="max-w-md bg-[#0f172a] border-gray-800 text-white" data-testid="dialog-add-address">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-400" />
              {!otpSent ? "Shipping Address" : !otpVerified ? "Verify Email" : "Address Confirmed"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {!otpSent
                ? viewOrder?.shippingAddress ? "Update your shipping address. OTP verification required." : "Add a shipping address for this order. OTP verification required."
                : !otpVerified
                  ? "Enter the OTP sent to your registered email."
                  : "Your address has been verified. Confirm to process."}
            </DialogDescription>
          </DialogHeader>

          {!otpSent && (
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300 text-sm">Street Address</Label>
                <Input
                  value={addressForm.street}
                  onChange={(e) => setAddressForm((p) => ({ ...p, street: e.target.value }))}
                  placeholder="123 Main Street, Apt 4B"
                  className="mt-1 bg-gray-900 border-gray-700 text-white"
                  data-testid="input-street"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-gray-300 text-sm">City</Label>
                  <Input
                    value={addressForm.city}
                    onChange={(e) => setAddressForm((p) => ({ ...p, city: e.target.value }))}
                    placeholder="New York"
                    className="mt-1 bg-gray-900 border-gray-700 text-white"
                    data-testid="input-city"
                  />
                </div>
                <div>
                  <Label className="text-gray-300 text-sm">State / Province</Label>
                  <Input
                    value={addressForm.state}
                    onChange={(e) => setAddressForm((p) => ({ ...p, state: e.target.value }))}
                    placeholder="NY"
                    className="mt-1 bg-gray-900 border-gray-700 text-white"
                    data-testid="input-state"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-gray-300 text-sm">ZIP / Postal Code</Label>
                  <Input
                    value={addressForm.zip}
                    onChange={(e) => setAddressForm((p) => ({ ...p, zip: e.target.value }))}
                    placeholder="10001"
                    className="mt-1 bg-gray-900 border-gray-700 text-white"
                    data-testid="input-zip"
                  />
                </div>
                <div>
                  <Label className="text-gray-300 text-sm">Country</Label>
                  <Input
                    value={addressForm.country}
                    onChange={(e) => setAddressForm((p) => ({ ...p, country: e.target.value }))}
                    placeholder="United States"
                    className="mt-1 bg-gray-900 border-gray-700 text-white"
                    data-testid="input-country"
                  />
                </div>
              </div>
              <Button
                className="w-full"
                disabled={!addressForm.street || !addressForm.city || !addressForm.zip || !addressForm.country}
                onClick={handleSendOtp}
                data-testid="button-send-otp"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send OTP to Email
              </Button>
            </div>
          )}

          {otpSent && !otpVerified && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
                <p className="text-sm text-gray-300 mb-1">Shipping to:</p>
                <p className="text-white font-medium text-sm">{addressForm.street}, {addressForm.city}, {addressForm.state} {addressForm.zip}, {addressForm.country}</p>
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
            </div>
          )}

          {otpVerified && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-900/20 border border-emerald-800/50 rounded-xl flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-emerald-300 font-medium text-sm">Address Verified</p>
                  <p className="text-emerald-400/70 text-xs">{addressForm.street}, {addressForm.city}, {addressForm.state} {addressForm.zip}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Item</span>
                  <span className="text-white font-medium">{viewOrder?.item}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Points</span>
                  <span className="text-amber-400 font-bold">{viewOrder?.points.toLocaleString()} pts</span>
                </div>
              </div>
              <Button
                className="w-full"
                onClick={handleConfirmAddress}
                data-testid="button-confirm-address"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm & Process Order
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
