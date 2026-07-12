"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  Mail,
  Package,
  ChevronRight,
  Eye,
  X,
  Copy,
  Check,
  Menu,
  Flower2,
  Users,
  TrendingUp,
  Clock,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

// ─── Types ───────────────────────────────────────────────────────────────────

interface OrderItem {
  title: string;
  price: number;
  qty: number;
}

interface Order {
  id: string;
  orderNumber: string;
  recipientName: string;
  recipientPhone: string;
  address: string;
  city: string;
  landmark: string | null;
  giftNote: string | null;
  deliverySlot: string;
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

interface Stats {
  totalOrders: number;
  todayOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  todayRevenue: number;
  recentOrders: {
    id: string;
    orderNumber: string;
    recipientName: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }[];
}

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

type Tab = "dashboard" | "orders" | "newsletter";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPrice(paisa: number): string {
  const rupees = paisa / 100;
  return `Rs ${rupees.toLocaleString("en-NP")}`;
}

function formatSlot(slot: string): string {
  const map: Record<string, string> = {
    same_day: "Same Day",
    next_day: "Next Day",
    scheduled: "Scheduled",
  };
  return map[slot] || slot;
}

function formatStatus(status: string): string {
  const map: Record<string, string> = {
    placed: "Placed",
    preparing: "Preparing",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  return map[status] || status;
}

function statusBadgeClass(status: string): string {
  switch (status) {
    case "placed":
      return "bg-butter text-ink border-butter";
    case "preparing":
      return "bg-butter/70 text-ink border-butter/70";
    case "out_for_delivery":
      return "bg-sage text-white border-sage";
    case "delivered":
      return "bg-ink/10 text-ink border-ink/10";
    case "cancelled":
      return "bg-berry/15 text-berry border-berry/15";
    default:
      return "bg-muted text-ink-soft border-muted";
  }
}

const STATUS_FLOW: Record<string, string[]> = {
  placed: ["preparing", "cancelled"],
  preparing: ["out_for_delivery", "cancelled"],
  out_for_delivery: ["delivered", "cancelled"],
  delivered: ["cancelled"],
  cancelled: [],
};

const FILTER_TABS = [
  { value: "all", label: "All" },
  { value: "placed", label: "Placed" },
  { value: "preparing", label: "Preparing" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

// ─── Login Screen ────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onLogin();
        toast.success("Welcome back!");
      } else {
        setError(data.error || "Invalid password");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4">
      <Card className="w-full max-w-sm border-twine-light shadow-none">
        <CardContent className="pt-8 pb-6 px-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-full bg-berry flex items-center justify-center mb-4">
              <Flower2 className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-[family-name:var(--font-fraunces)] text-2xl text-ink">
              Bloom &amp; Bow
            </h1>
            <p className="text-ink-soft text-sm mt-1 font-[family-name:var(--font-karla)]">
              Admin Panel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5 font-[family-name:var(--font-karla)]">
                Password
              </label>
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-twine-light bg-white focus-visible:ring-berry/30 font-[family-name:var(--font-karla)]"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-berry text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-berry hover:bg-berry-deep text-white font-[family-name:var(--font-karla)]"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function SidebarNav({
  activeTab,
  onTabChange,
  onLogout,
  collapsed,
  onToggle,
}: {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onLogout: () => void;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const navItems = [
    { id: "dashboard" as Tab, label: "Dashboard", icon: LayoutDashboard },
    { id: "orders" as Tab, label: "Orders", icon: ShoppingBag },
    { id: "newsletter" as Tab, label: "Newsletter", icon: Mail },
  ];

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-twine-light px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-berry flex items-center justify-center">
            <Flower2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-[family-name:var(--font-fraunces)] text-lg text-ink">
            B&amp;B
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={onToggle}>
          <Menu className="w-5 h-5 text-ink" />
        </Button>
      </div>

      {/* Mobile overlay */}
      {collapsed && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full bg-white border-r border-twine-light
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${collapsed ? "translate-x-0" : "-translate-x-full"}
          w-64 flex flex-col
        `}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-twine-light">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-berry flex items-center justify-center">
                <Flower2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-[family-name:var(--font-fraunces)] text-lg text-ink leading-tight">
                  Bloom &amp; Bow
                </h2>
                <span className="text-xs text-ink-soft font-[family-name:var(--font-karla)]">
                  Admin
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onToggle}
            >
              <X className="w-4 h-4 text-ink" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onToggle();
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-colors font-[family-name:var(--font-karla)]
                  ${
                    isActive
                      ? "bg-berry/10 text-berry"
                      : "text-ink-soft hover:bg-paper-warm hover:text-ink"
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
                {isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-twine-light">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
              text-ink-soft hover:bg-berry/10 hover:text-berry transition-colors
              font-[family-name:var(--font-karla)]"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── Dashboard Tab ───────────────────────────────────────────────────────────

function DashboardTab() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        } else {
          toast.error("Failed to load dashboard");
        }
      } catch {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-twine-light shadow-none">
              <CardContent className="p-5">
                <Skeleton className="h-4 w-24 mb-3" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="border-twine-light shadow-none">
          <CardContent className="p-5">
            <Skeleton className="h-5 w-40 mb-4" />
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "text-berry",
      bg: "bg-berry/10",
    },
    {
      label: "Today's Orders",
      value: stats.todayOrders,
      icon: Clock,
      color: "text-sage",
      bg: "bg-sage/10",
    },
    {
      label: "Total Revenue",
      value: formatPrice(stats.totalRevenue),
      icon: TrendingUp,
      color: "text-ink",
      bg: "bg-ink/10",
      mono: true,
    },
    {
      label: "Pending Deliveries",
      value: stats.pendingOrders,
      icon: Package,
      color: "text-ink-soft",
      bg: "bg-butter/20",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.label}
              className="border-twine-light shadow-none hover:shadow-sm transition-shadow"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-ink-soft font-[family-name:var(--font-karla)]">
                      {card.label}
                    </p>
                    <p
                      className={`text-2xl font-bold mt-1 ${
                        card.mono
                          ? "font-[family-name:var(--font-space-mono)]"
                          : "font-[family-name:var(--font-fraunces)]"
                      } ${card.color}`}
                    >
                      {card.value}
                    </p>
                  </div>
                  <div className={`p-2.5 rounded-lg ${card.bg}`}>
                    <Icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Orders */}
      <Card className="border-twine-light shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="font-[family-name:var(--font-fraunces)] text-lg text-ink">
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {stats.recentOrders.length === 0 ? (
            <div className="px-5 py-10 text-center text-ink-soft font-[family-name:var(--font-karla)]">
              No orders yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-twine-light hover:bg-transparent">
                  <TableHead className="text-ink-soft font-medium">Order #</TableHead>
                  <TableHead className="text-ink-soft font-medium">Recipient</TableHead>
                  <TableHead className="text-ink-soft font-medium">Total</TableHead>
                  <TableHead className="text-ink-soft font-medium">Status</TableHead>
                  <TableHead className="text-ink-soft font-medium">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentOrders.map((order) => (
                  <TableRow key={order.id} className="border-twine-light">
                    <TableCell className="font-[family-name:var(--font-space-mono)] text-xs text-ink">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell className="font-[family-name:var(--font-karla)] text-ink">
                      {order.recipientName}
                    </TableCell>
                    <TableCell className="font-[family-name:var(--font-space-mono)] text-xs text-ink">
                      {formatPrice(order.totalAmount)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${statusBadgeClass(order.status)}`}
                      >
                        {formatStatus(order.status)}
                      </span>
                    </TableCell>
                    <TableCell className="text-ink-soft text-sm font-[family-name:var(--font-karla)]">
                      {format(new Date(order.createdAt), "MMM d, yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Order Detail Dialog ─────────────────────────────────────────────────────

function OrderDetailDialog({
  order,
  open,
  onClose,
}: {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto border-twine-light bg-white">
        <DialogHeader>
          <DialogTitle className="font-[family-name:var(--font-fraunces)] text-lg text-ink">
            Order {order.orderNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink-soft font-[family-name:var(--font-karla)]">
              Status
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${statusBadgeClass(order.status)}`}
            >
              {formatStatus(order.status)}
            </span>
          </div>

          <Separator className="bg-twine-light" />

          {/* Recipient Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-ink font-[family-name:var(--font-karla)]">
              Recipient
            </h4>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
              <span className="text-ink-soft">Name</span>
              <span className="text-ink font-[family-name:var(--font-karla)]">
                {order.recipientName}
              </span>
              <span className="text-ink-soft">Phone</span>
              <span className="text-ink font-[family-name:var(--font-space-mono)] text-xs">
                {order.recipientPhone}
              </span>
              <span className="text-ink-soft">Address</span>
              <span className="text-ink font-[family-name:var(--font-karla)]">
                {order.address}
                {order.city ? `, ${order.city}` : ""}
                {order.landmark ? ` (${order.landmark})` : ""}
              </span>
            </div>
          </div>

          <Separator className="bg-twine-light" />

          {/* Delivery Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-ink font-[family-name:var(--font-karla)]">
              Delivery
            </h4>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
              <span className="text-ink-soft">Slot</span>
              <span className="text-ink font-[family-name:var(--font-karla)]">
                {formatSlot(order.deliverySlot)}
              </span>
              <span className="text-ink-soft">Payment</span>
              <span className="text-ink font-[family-name:var(--font-karla)]">
                {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod}
              </span>
              <span className="text-ink-soft">Payment Status</span>
              <span className="text-ink font-[family-name:var(--font-karla)] capitalize">
                {order.paymentStatus}
              </span>
            </div>
          </div>

          <Separator className="bg-twine-light" />

          {/* Gift Note */}
          {order.giftNote && (
            <>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-ink font-[family-name:var(--font-karla)]">
                  Gift Note
                </h4>
                <p className="text-sm text-ink-soft bg-paper-warm rounded-lg p-3 font-[family-name:var(--font-karla)] italic">
                  &ldquo;{order.giftNote}&rdquo;
                </p>
              </div>
              <Separator className="bg-twine-light" />
            </>
          )}

          {/* Items */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-ink font-[family-name:var(--font-karla)]">
              Items
            </h4>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm py-1.5 border-b border-twine-light/50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-sage/15 text-sage flex items-center justify-center text-xs font-bold">
                      {item.qty}
                    </span>
                    <span className="text-ink font-[family-name:var(--font-karla)]">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-ink font-[family-name:var(--font-space-mono)] text-xs">
                    {formatPrice(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-twine-light">
              <span className="text-sm font-semibold text-ink font-[family-name:var(--font-karla)]">
                Total
              </span>
              <span className="text-base font-bold text-ink font-[family-name:var(--font-space-mono)]">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>

          {/* Timestamps */}
          <div className="text-xs text-ink-soft font-[family-name:var(--font-space-mono)] pt-2">
            Created: {format(new Date(order.createdAt), "MMM d, yyyy 'at' h:mm a")}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Orders Tab ──────────────────────────────────────────────────────────────

function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async (status: string) => {
    setLoading(true);
    try {
      const query = status !== "all" ? `?status=${status}` : "";
      const res = await fetch(`/api/admin/orders${query}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else if (res.status === 401) {
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error("Failed to load orders");
      }
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(activeFilter);
  }, [activeFilter, fetchOrders]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success(`Order updated to ${formatStatus(newStatus)}`);
        fetchOrders(activeFilter);
      } else {
        toast.error("Failed to update order");
      }
    } catch {
      toast.error("Failed to update order");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => (
          <Button
            key={tab.value}
            variant={activeFilter === tab.value ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(tab.value)}
            className={
              activeFilter === tab.value
                ? "bg-berry hover:bg-berry-deep text-white border-berry font-[family-name:var(--font-karla)]"
                : "border-twine-light text-ink-soft hover:bg-paper-warm hover:text-ink font-[family-name:var(--font-karla)]"
            }
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Orders Table */}
      <Card className="border-twine-light shadow-none">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-5 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="px-5 py-16 text-center text-ink-soft font-[family-name:var(--font-karla)]">
              <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No orders found</p>
            </div>
          ) : (
            <ScrollArea className="max-h-[calc(100vh-320px)]">
              <Table>
                <TableHeader>
                  <TableRow className="border-twine-light hover:bg-transparent">
                    <TableHead className="text-ink-soft font-medium">Order #</TableHead>
                    <TableHead className="text-ink-soft font-medium">Recipient</TableHead>
                    <TableHead className="text-ink-soft font-medium hidden md:table-cell">Phone</TableHead>
                    <TableHead className="text-ink-soft font-medium hidden lg:table-cell">Items</TableHead>
                    <TableHead className="text-ink-soft font-medium">Total</TableHead>
                    <TableHead className="text-ink-soft font-medium">Status</TableHead>
                    <TableHead className="text-ink-soft font-medium hidden sm:table-cell">Date</TableHead>
                    <TableHead className="text-ink-soft font-medium text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} className="border-twine-light">
                      <TableCell className="font-[family-name:var(--font-space-mono)] text-xs text-ink">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell className="font-[family-name:var(--font-karla)] text-ink max-w-[120px] truncate">
                        {order.recipientName}
                      </TableCell>
                      <TableCell className="font-[family-name:var(--font-space-mono)] text-xs text-ink-soft hidden md:table-cell">
                        {order.recipientPhone}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-xs text-ink-soft font-[family-name:var(--font-karla)]">
                          {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                        </span>
                      </TableCell>
                      <TableCell className="font-[family-name:var(--font-space-mono)] text-xs text-ink">
                        {formatPrice(order.totalAmount)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${statusBadgeClass(order.status)}`}
                        >
                          {formatStatus(order.status)}
                        </span>
                      </TableCell>
                      <TableCell className="text-ink-soft text-sm font-[family-name:var(--font-karla)] hidden sm:table-cell">
                        {format(new Date(order.createdAt), "MMM d")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-ink-soft hover:text-ink hover:bg-paper-warm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {STATUS_FLOW[order.status]?.map((nextStatus) => (
                            <Button
                              key={nextStatus}
                              variant="ghost"
                              size="sm"
                              disabled={updatingId === order.id}
                              onClick={() => handleStatusUpdate(order.id, nextStatus)}
                              className="h-8 text-xs font-[family-name:var(--font-karla)] text-sage hover:text-sage-deep hover:bg-sage/10"
                            >
                              {nextStatus === "cancelled"
                                ? "Cancel"
                                : `→ ${formatStatus(nextStatus)}`}
                            </Button>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <OrderDetailDialog
        order={selectedOrder}
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}

// ─── Newsletter Tab ──────────────────────────────────────────────────────────

function NewsletterTab() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/newsletter");
        if (res.ok) {
          const data = await res.json();
          setSubscribers(data);
        } else {
          toast.error("Failed to load subscribers");
        }
      } catch {
        toast.error("Failed to load subscribers");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCopyAll = async () => {
    const emails = subscribers.map((s) => s.email).join(", ");
    try {
      await navigator.clipboard.writeText(emails);
      setCopied(true);
      toast.success(`${subscribers.length} emails copied to clipboard`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy emails");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with count and copy */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-ink-soft" />
          <h2 className="text-sm text-ink-soft font-[family-name:var(--font-karla)]">
            Total Subscribers:
          </h2>
          <span className="font-[family-name:var(--font-fraunces)] text-xl text-ink font-bold">
            {loading ? (
              <Skeleton className="h-7 w-8 inline-block" />
            ) : (
              subscribers.length
            )}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyAll}
          disabled={subscribers.length === 0 || copied}
          className="border-twine-light text-ink-soft hover:bg-paper-warm hover:text-ink font-[family-name:var(--font-karla)]"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-1.5 text-sage" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-1.5" />
              Copy All Emails
            </>
          )}
        </Button>
      </div>

      {/* Subscribers List */}
      <Card className="border-twine-light shadow-none">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-5 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : subscribers.length === 0 ? (
            <div className="px-5 py-16 text-center text-ink-soft font-[family-name:var(--font-karla)]">
              <Mail className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No subscribers yet</p>
            </div>
          ) : (
            <ScrollArea className="max-h-[calc(100vh-260px)]">
              <Table>
                <TableHeader>
                  <TableRow className="border-twine-light hover:bg-transparent">
                    <TableHead className="text-ink-soft font-medium">#</TableHead>
                    <TableHead className="text-ink-soft font-medium">Email</TableHead>
                    <TableHead className="text-ink-soft font-medium">Subscribed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers.map((sub, i) => (
                    <TableRow key={sub.id} className="border-twine-light">
                      <TableCell className="text-ink-soft text-xs font-[family-name:var(--font-space-mono)]">
                        {i + 1}
                      </TableCell>
                      <TableCell className="text-ink font-[family-name:var(--font-karla)]">
                        {sub.email}
                      </TableCell>
                      <TableCell className="text-ink-soft text-sm font-[family-name:var(--font-karla)]">
                        {format(new Date(sub.createdAt), "MMM d, yyyy")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Admin Page ─────────────────────────────────────────────────────────

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check existing auth on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          setIsAuthenticated(true);
        }
      } catch {
        // Not authenticated
      } finally {
        setCheckingAuth(false);
      }
    })();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    toast.success("Logged out");
  };

  // Show loading while checking auth
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-berry/20 animate-pulse" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-paper flex">
      <SidebarNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        collapsed={sidebarOpen}
        onToggle={() => setSidebarOpen((p) => !p)}
      />

      <main className="flex-1 min-w-0">
        {/* Mobile header spacer */}
        <div className="h-14 lg:hidden" />

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="font-[family-name:var(--font-fraunces)] text-2xl sm:text-3xl text-ink">
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "orders" && "Orders"}
              {activeTab === "newsletter" && "Newsletter"}
            </h1>
            <p className="text-sm text-ink-soft mt-1 font-[family-name:var(--font-karla)]">
              {activeTab === "dashboard" && "Overview of your store performance"}
              {activeTab === "orders" && "Manage and track all customer orders"}
              {activeTab === "newsletter" && "View your email subscribers"}
            </p>
          </div>

          {/* Tab Content */}
          {activeTab === "dashboard" && <DashboardTab />}
          {activeTab === "orders" && <OrdersTab />}
          {activeTab === "newsletter" && <NewsletterTab />}
        </div>
      </main>
    </div>
  );
}