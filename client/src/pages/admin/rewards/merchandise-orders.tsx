import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Package,
  ShoppingCart,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Search,
  Eye,
} from "lucide-react";

type OrderStatus = "Pending" | "Approved" | "Shipped" | "Delivered" | "Cancelled";

interface MerchOrder {
  id: string;
  clientName: string;
  item: string;
  pointsSpent: number;
  status: OrderStatus;
  orderDate: string;
  shippingAddress: string;
  trackingNumber: string;
}

const initialOrders: MerchOrder[] = [
  { id: "ORD-001", clientName: "James Wilson", item: "Branded Trading Hoodie (L)", pointsSpent: 2500, status: "Pending", orderDate: "2025-01-15", shippingAddress: "123 Wall St, New York, NY 10005", trackingNumber: "" },
  { id: "ORD-002", clientName: "Sarah Chen", item: "Premium Wireless Mouse", pointsSpent: 1800, status: "Approved", orderDate: "2025-01-14", shippingAddress: "456 Market Ave, San Francisco, CA 94105", trackingNumber: "" },
  { id: "ORD-003", clientName: "Michael Brown", item: "Leather Portfolio Bag", pointsSpent: 5000, status: "Shipped", orderDate: "2025-01-10", shippingAddress: "789 Finance Blvd, Chicago, IL 60601", trackingNumber: "TRK-20250110-003" },
  { id: "ORD-004", clientName: "Emma Davis", item: "Branded Water Bottle", pointsSpent: 800, status: "Delivered", orderDate: "2025-01-05", shippingAddress: "321 Trade St, London, UK EC2V 7AN", trackingNumber: "TRK-20250105-004" },
  { id: "ORD-005", clientName: "Ahmed Hassan", item: "Mechanical Keyboard", pointsSpent: 3200, status: "Cancelled", orderDate: "2025-01-12", shippingAddress: "55 Corniche Rd, Dubai, UAE", trackingNumber: "" },
  { id: "ORD-006", clientName: "Lisa Park", item: "Branded Polo Shirt (M)", pointsSpent: 1500, status: "Pending", orderDate: "2025-01-16", shippingAddress: "88 Gangnam-daero, Seoul, South Korea", trackingNumber: "" },
  { id: "ORD-007", clientName: "David Miller", item: "Noise Cancelling Headphones", pointsSpent: 4500, status: "Shipped", orderDate: "2025-01-08", shippingAddress: "12 Bay St, Toronto, ON M5J 2R8", trackingNumber: "TRK-20250108-007" },
  { id: "ORD-008", clientName: "Maria Garcia", item: "Trading Desk Mat (XL)", pointsSpent: 1200, status: "Approved", orderDate: "2025-01-13", shippingAddress: "Av. Reforma 222, Mexico City, MX 06600", trackingNumber: "" },
  { id: "ORD-009", clientName: "Robert Taylor", item: "Smart Watch Pro", pointsSpent: 8000, status: "Delivered", orderDate: "2024-12-28", shippingAddress: "45 Pitt St, Sydney, NSW 2000", trackingNumber: "TRK-20241228-009" },
  { id: "ORD-010", clientName: "Yuki Tanaka", item: "Branded Cap", pointsSpent: 600, status: "Pending", orderDate: "2025-01-17", shippingAddress: "1-1 Marunouchi, Chiyoda, Tokyo 100-0005", trackingNumber: "" },
  { id: "ORD-011", clientName: "Oliver Smith", item: "USB-C Hub (7-in-1)", pointsSpent: 2000, status: "Cancelled", orderDate: "2025-01-09", shippingAddress: "10 Downing St, London, UK SW1A 2AA", trackingNumber: "" },
  { id: "ORD-012", clientName: "Fatima Al-Rashid", item: "Branded Backpack", pointsSpent: 3500, status: "Delivered", orderDate: "2024-12-20", shippingAddress: "King Fahad Rd, Riyadh, SA 12271", trackingNumber: "TRK-20241220-012" },
];

const statusConfig: Record<OrderStatus, { variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof Clock }> = {
  Pending: { variant: "secondary", icon: Clock },
  Approved: { variant: "default", icon: CheckCircle },
  Shipped: { variant: "outline", icon: Truck },
  Delivered: { variant: "default", icon: CheckCircle },
  Cancelled: { variant: "destructive", icon: XCircle },
};

export default function MerchandiseOrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<MerchOrder[]>(initialOrders);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [shippingDialogOpen, setShippingDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [trackingInput, setTrackingInput] = useState("");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewOrder, setViewOrder] = useState<MerchOrder | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === "All" || order.status === activeTab;
    const matchesSearch =
      searchQuery === "" ||
      order.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "Pending").length,
    shipped: orders.filter((o) => o.status === "Shipped").length,
    delivered: orders.filter((o) => o.status === "Delivered").length,
    cancelled: orders.filter((o) => o.status === "Cancelled").length,
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, trackingNumber?: string) => {
    setOrders(orders.map((o) => {
      if (o.id === orderId) {
        return { ...o, status: newStatus, trackingNumber: trackingNumber || o.trackingNumber };
      }
      return o;
    }));
  };

  const handleApprove = (orderId: string) => {
    updateOrderStatus(orderId, "Approved");
    toast({ title: `Order ${orderId} approved` });
  };

  const handleCancelRefund = (orderId: string) => {
    updateOrderStatus(orderId, "Cancelled");
    toast({ title: `Order ${orderId} cancelled and points refunded` });
  };

  const handleMarkShipped = (orderId: string) => {
    setSelectedOrderId(orderId);
    setTrackingInput("");
    setShippingDialogOpen(true);
  };

  const confirmShipped = () => {
    if (!trackingInput.trim()) {
      toast({ title: "Please enter a tracking number", variant: "destructive" });
      return;
    }
    if (selectedOrderId) {
      updateOrderStatus(selectedOrderId, "Shipped", trackingInput);
      toast({ title: `Order ${selectedOrderId} marked as shipped` });
    }
    setShippingDialogOpen(false);
  };

  const handleMarkDelivered = (orderId: string) => {
    updateOrderStatus(orderId, "Delivered");
    toast({ title: `Order ${orderId} marked as delivered` });
  };

  const handleViewOrder = (order: MerchOrder) => {
    setViewOrder(order);
    setViewDialogOpen(true);
  };

  const statCards = [
    { label: "Total Orders", value: stats.total, icon: ShoppingCart, color: "text-foreground" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-600 dark:text-yellow-400" },
    { label: "Shipped", value: stats.shipped, icon: Truck, color: "text-blue-600 dark:text-blue-400" },
    { label: "Delivered", value: stats.delivered, icon: CheckCircle, color: "text-emerald-600 dark:text-emerald-400" },
    { label: "Cancelled", value: stats.cancelled, icon: XCircle, color: "text-red-600 dark:text-red-400" },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="rounded-md bg-gradient-to-r from-pink-600 to-rose-700 p-6">
        <div className="flex items-center gap-3 flex-wrap">
          <Package className="w-8 h-8 text-white" />
          <div>
            <h1 className="text-2xl font-bold text-white" data-testid="text-merchandise-orders-title">
              Merchandise Orders
            </h1>
            <p className="text-sm text-pink-200">
              Manage and track loyalty merchandise redemption orders
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${stat.color}`} data-testid={`text-stat-${stat.label.toLowerCase().replace(/\s/g, "-")}`}>
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="All" data-testid="tab-filter-all">All</TabsTrigger>
                <TabsTrigger value="Pending" data-testid="tab-filter-pending">Pending</TabsTrigger>
                <TabsTrigger value="Approved" data-testid="tab-filter-approved">Approved</TabsTrigger>
                <TabsTrigger value="Shipped" data-testid="tab-filter-shipped">Shipped</TabsTrigger>
                <TabsTrigger value="Delivered" data-testid="tab-filter-delivered">Delivered</TabsTrigger>
                <TabsTrigger value="Cancelled" data-testid="tab-filter-cancelled">Cancelled</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search by name or order ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-orders"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Points Spent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Tracking</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const config = statusConfig[order.status];
                return (
                  <TableRow key={order.id} data-testid={`row-order-${order.id}`}>
                    <TableCell className="font-medium" data-testid={`text-order-id-${order.id}`}>
                      {order.id}
                    </TableCell>
                    <TableCell data-testid={`text-order-client-${order.id}`}>{order.clientName}</TableCell>
                    <TableCell data-testid={`text-order-item-${order.id}`}>{order.item}</TableCell>
                    <TableCell data-testid={`text-order-points-${order.id}`}>
                      {order.pointsSpent.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={config.variant} data-testid={`badge-order-status-${order.id}`}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell data-testid={`text-order-date-${order.id}`}>{order.orderDate}</TableCell>
                    <TableCell data-testid={`text-order-tracking-${order.id}`}>
                      {order.trackingNumber || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 flex-wrap">
                        {order.status === "Pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(order.id)}
                              data-testid={`button-approve-${order.id}`}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleCancelRefund(order.id)}
                              data-testid={`button-cancel-refund-${order.id}`}
                            >
                              Cancel & Refund
                            </Button>
                          </>
                        )}
                        {order.status === "Approved" && (
                          <Button
                            size="sm"
                            onClick={() => handleMarkShipped(order.id)}
                            data-testid={`button-mark-shipped-${order.id}`}
                          >
                            <Truck className="w-4 h-4 mr-1" />
                            Mark Shipped
                          </Button>
                        )}
                        {order.status === "Shipped" && (
                          <Button
                            size="sm"
                            onClick={() => handleMarkDelivered(order.id)}
                            data-testid={`button-mark-delivered-${order.id}`}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Mark Delivered
                          </Button>
                        )}
                        {(order.status === "Cancelled" || order.status === "Delivered") && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleViewOrder(order)}
                            data-testid={`button-view-${order.id}`}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={shippingDialogOpen} onOpenChange={setShippingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle data-testid="text-shipping-dialog-title">Enter Tracking Number</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Provide the tracking number for order {selectedOrderId}
            </p>
            <div className="space-y-2">
              <Label>Tracking Number</Label>
              <Input
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="e.g. TRK-20250117-001"
                data-testid="input-tracking-number"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShippingDialogOpen(false)} data-testid="button-shipping-cancel">
              Cancel
            </Button>
            <Button onClick={confirmShipped} data-testid="button-shipping-confirm">
              Confirm Shipped
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle data-testid="text-view-dialog-title">Order Details - {viewOrder?.id}</DialogTitle>
          </DialogHeader>
          {viewOrder && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Client:</span>
                <span data-testid="text-view-client">{viewOrder.clientName}</span>
                <span className="text-muted-foreground">Item:</span>
                <span data-testid="text-view-item">{viewOrder.item}</span>
                <span className="text-muted-foreground">Points Spent:</span>
                <span data-testid="text-view-points">{viewOrder.pointsSpent.toLocaleString()}</span>
                <span className="text-muted-foreground">Status:</span>
                <span data-testid="text-view-status">
                  <Badge variant={statusConfig[viewOrder.status].variant}>{viewOrder.status}</Badge>
                </span>
                <span className="text-muted-foreground">Order Date:</span>
                <span data-testid="text-view-date">{viewOrder.orderDate}</span>
                <span className="text-muted-foreground">Shipping Address:</span>
                <span data-testid="text-view-address">{viewOrder.shippingAddress}</span>
                <span className="text-muted-foreground">Tracking Number:</span>
                <span data-testid="text-view-tracking">{viewOrder.trackingNumber || "-"}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)} data-testid="button-view-close">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}