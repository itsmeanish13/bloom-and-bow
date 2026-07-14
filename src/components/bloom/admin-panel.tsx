"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  Plus,
  Pencil,
  Trash2,
  Search,
  Upload,
  Image as ImageIcon,
  MessageSquare,
  Circle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

// ─── Token-based Auth (for iframe/Preview Panel compatibility) ─────────
let adminToken: string | null = null;

function adminFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = new Headers(options.headers);
  if (adminToken) {
    headers.set("x-admin-token", adminToken);
  }
  return fetch(url, { ...options, headers, credentials: "include" });
}

function setAdminToken(token: string | null) {
  adminToken = token;
}

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = "dashboard" | "products" | "categories" | "orders" | "newsletter" | "messages";

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
  totalProducts: number;
  totalCategories: number;
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

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  _count: { products: number };
  createdAt: string;
  updatedAt: string;
}

interface CategoryFormData {
  name: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
}

interface Product {
  id: string;
  title: string;
  description: string | null;
  category: string;
  categoryId: string;
  occasions: string[];
  price: number;
  imageUrl: string | null;
  stockStatus: string;
  badges: string[];
  sortOrder: number;
  categoryRef?: { id: string; name: string; slug: string };
  createdAt: string;
  updatedAt: string;
}

interface ProductFormData {
  title: string;
  description: string;
  categoryId: string;
  price: number;
  imageUrl: string;
  stockStatus: string;
  occasions: string[];
  badges: string;
  sortOrder: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const OCCASIONS_LIST = [
  "birthday",
  "anniversary",
  "just_because",
  "thank_you",
  "sorry",
  "new_home",
];

const OCCASION_LABELS: Record<string, string> = {
  birthday: "Birthday",
  anniversary: "Anniversary",
  just_because: "Just Because",
  thank_you: "Thank You",
  sorry: "Sorry",
  new_home: "New Home",
};

const STOCK_OPTIONS = [
  { value: "in_stock", label: "In Stock" },
  { value: "made_to_order", label: "Made to Order" },
  { value: "sold_out", label: "Sold Out" },
];

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

function formatStockStatus(status: string): string {
  const map: Record<string, string> = {
    in_stock: "In Stock",
    made_to_order: "Made to Order",
    sold_out: "Sold Out",
  };
  return map[status] || status;
}

function stockBadgeClass(status: string): string {
  switch (status) {
    case "in_stock":
      return "bg-sage/15 text-sage border-sage/30";
    case "made_to_order":
      return "bg-butter/20 text-ink border-butter/40";
    case "sold_out":
      return "bg-berry/15 text-berry border-berry/30";
    default:
      return "bg-muted text-ink-soft border-muted";
  }
}

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
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
        setAdminToken(data.token || null);
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
  onClose,
}: {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onLogout: () => void;
  collapsed: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const navItems = [
    { id: "dashboard" as Tab, label: "Dashboard", icon: LayoutDashboard },
    { id: "products" as Tab, label: "Products", icon: Package },
    { id: "categories" as Tab, label: "Categories", icon: Flower2 },
    { id: "orders" as Tab, label: "Orders", icon: ShoppingBag },
    { id: "newsletter" as Tab, label: "Newsletter", icon: Mail },
    { id: "messages" as Tab, label: "Messages", icon: MessageSquare },
  ];

  const handleTabChange = (tab: Tab) => {
    onTabChange(tab);
    if (collapsed) onToggle();
  };

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
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onToggle}>
            <Menu className="w-5 h-5 text-ink" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5 text-ink" />
          </Button>
        </div>
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
                onClick={() => handleTabChange(item.id)}
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

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-twine-light space-y-1">
          <button
            onClick={onClose}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
              text-ink-soft hover:bg-paper-warm hover:text-ink transition-colors
              font-[family-name:var(--font-karla)]"
          >
            <X className="w-5 h-5" />
            <span>Close Panel</span>
          </button>
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
        const res = await adminFetch("/api/admin/stats");
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
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
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
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "text-sage",
      bg: "bg-sage/10",
    },
    {
      label: "Categories",
      value: stats.totalCategories,
      icon: Flower2,
      color: "text-berry",
      bg: "bg-berry/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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

// ─── Categories Tab ──────────────────────────────────────────────────────────

function CategoryFormDialog({
  category,
  open,
  onClose,
  onSaved,
}: {
  category: Category | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<CategoryFormData>({
    name: "",
    description: "",
    sortOrder: 0,
    isActive: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        name: category?.name ?? "",
        description: category?.description ?? "",
        sortOrder: category?.sortOrder ?? 0,
        isActive: category?.isActive ?? true,
      });
    }
  }, [open, category]);

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    setSaving(true);
    try {
      const url = category
        ? `/api/admin/categories/${category.id}`
        : "/api/admin/categories";
      const res = await adminFetch(url, {
        method: category ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success(category ? "Category updated" : "Category created");
        onSaved();
        onClose();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save category");
      }
    } catch {
      toast.error("Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-twine-light bg-white">
        <DialogHeader>
          <DialogTitle className="font-[family-name:var(--font-fraunces)] text-lg text-ink">
            {category ? "Edit Category" : "Add Category"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <Label className="font-[family-name:var(--font-karla)]">Name *</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Flowers"
              className="border-twine-light mt-1.5 font-[family-name:var(--font-karla)]"
            />
          </div>
          <div>
            <Label className="font-[family-name:var(--font-karla)]">Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Brief description..."
              rows={3}
              className="border-twine-light mt-1.5 font-[family-name:var(--font-karla)]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-[family-name:var(--font-karla)]">Sort Order</Label>
              <Input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm((f) => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))}
                className="border-twine-light mt-1.5 font-[family-name:var(--font-space-mono)] text-sm"
              />
            </div>
            <div className="flex items-end pb-2">
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(checked) => setForm((f) => ({ ...f, isActive: checked }))}
                />
                <Label className="font-[family-name:var(--font-karla)]">
                  Active
                </Label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-twine-light text-ink-soft font-[family-name:var(--font-karla)]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !form.name.trim()}
            className="bg-berry hover:bg-berry-deep text-white font-[family-name:var(--font-karla)]"
          >
            {saving ? "Saving..." : category ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CategoriesTab() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      } else {
        toast.error("Failed to load categories");
      }
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await adminFetch(`/api/admin/categories/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Category deleted");
        fetchCategories();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete category");
      }
    } catch {
      toast.error("Failed to delete category");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Flower2 className="w-5 h-5 text-ink-soft" />
          <h2 className="text-sm text-ink-soft font-[family-name:var(--font-karla)]">
            Total Categories:
          </h2>
          <span className="font-[family-name:var(--font-fraunces)] text-xl text-ink font-bold">
            {loading ? (
              <Skeleton className="h-7 w-8 inline-block" />
            ) : (
              categories.length
            )}
          </span>
        </div>
        <Button
          onClick={() => {
            setEditCategory(null);
            setDialogOpen(true);
          }}
          size="sm"
          className="bg-berry hover:bg-berry-deep text-white font-[family-name:var(--font-karla)]"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Category
        </Button>
      </div>

      {/* Categories Table */}
      <Card className="border-twine-light shadow-none">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-5 space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="px-5 py-16 text-center text-ink-soft font-[family-name:var(--font-karla)]">
              <Flower2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No categories yet</p>
            </div>
          ) : (
            <ScrollArea className="max-h-[calc(100vh-320px)]">
              <Table>
                <TableHeader>
                  <TableRow className="border-twine-light hover:bg-transparent">
                    <TableHead className="text-ink-soft font-medium">Name</TableHead>
                    <TableHead className="text-ink-soft font-medium hidden sm:table-cell">Slug</TableHead>
                    <TableHead className="text-ink-soft font-medium">Products</TableHead>
                    <TableHead className="text-ink-soft font-medium hidden md:table-cell">Status</TableHead>
                    <TableHead className="text-ink-soft font-medium hidden lg:table-cell">Sort Order</TableHead>
                    <TableHead className="text-ink-soft font-medium text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((cat) => (
                    <TableRow key={cat.id} className="border-twine-light">
                      <TableCell className="font-medium text-ink font-[family-name:var(--font-karla)]">
                        {cat.name}
                      </TableCell>
                      <TableCell className="font-[family-name:var(--font-space-mono)] text-xs text-ink-soft hidden sm:table-cell">
                        {cat.slug}
                      </TableCell>
                      <TableCell className="font-[family-name:var(--font-space-mono)] text-sm text-ink">
                        {cat._count.products}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                            cat.isActive
                              ? "bg-sage/15 text-sage border-sage/30"
                              : "bg-ink/5 text-ink-soft border-ink/10"
                          }`}
                        >
                          {cat.isActive ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="font-[family-name:var(--font-space-mono)] text-xs text-ink-soft hidden lg:table-cell">
                        {cat.sortOrder}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-ink-soft hover:text-ink hover:bg-paper-warm"
                            onClick={() => {
                              setEditCategory(cat);
                              setDialogOpen(true);
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-ink-soft hover:text-berry hover:bg-berry/10"
                            onClick={() => setDeleteTarget(cat)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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

      <CategoryFormDialog
        category={editCategory}
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditCategory(null);
        }}
        onSaved={fetchCategories}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent className="border-twine-light bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-[family-name:var(--font-fraunces)] text-ink">
              Delete Category
            </AlertDialogTitle>
            <AlertDialogDescription className="font-[family-name:var(--font-karla)] text-ink-soft">
              Are you sure you want to delete &ldquo;{deleteTarget?.name}&rdquo;? This will fail if products exist in this category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-[family-name:var(--font-karla)]">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-berry hover:bg-berry-deep text-white font-[family-name:var(--font-karla)]"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Products Tab ────────────────────────────────────────────────────────────

function ProductFormDialog({
  product,
  open,
  onClose,
  onSaved,
}: {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<ProductFormData>({
    title: "",
    description: "",
    categoryId: "",
    price: 0,
    imageUrl: "",
    stockStatus: "in_stock",
    occasions: [],
    badges: "",
    sortOrder: 0,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      // Fetch categories for dropdown
      (async () => {
        try {
          const res = await adminFetch("/api/admin/categories");
          if (res.ok) setCategories(await res.json());
        } catch {
          // ignore
        }
      })();

      if (product) {
        setForm({
          title: product.title,
          description: product.description ?? "",
          categoryId: product.categoryId,
          price: Math.round(product.price / 100),
          imageUrl: product.imageUrl ?? "",
          stockStatus: product.stockStatus,
          occasions: Array.isArray(product.occasions) ? product.occasions : [],
          badges: Array.isArray(product.badges) ? product.badges.join(", ") : "",
          sortOrder: product.sortOrder,
        });
      } else {
        setForm({
          title: "",
          description: "",
          categoryId: "",
          price: 0,
          imageUrl: "",
          stockStatus: "in_stock",
          occasions: [],
          badges: "",
          sortOrder: 0,
        });
      }
    }
  }, [open, product]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await adminFetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      if (res.ok) {
        const data = await res.json();
        setForm((f) => ({ ...f, imageUrl: data.url }));
        toast.success("Image uploaded");
      } else {
        toast.error("Failed to upload image");
      }
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const toggleOccasion = (occasion: string) => {
    setForm((f) => ({
      ...f,
      occasions: f.occasions.includes(occasion)
        ? f.occasions.filter((o) => o !== occasion)
        : [...f.occasions, occasion],
    }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Product title is required");
      return;
    }
    if (!form.categoryId) {
      toast.error("Please select a category");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description || null,
        category: form.categoryId ? categories.find((c) => c.id === form.categoryId)?.name ?? "" : "",
        categoryId: form.categoryId,
        price: Math.round(form.price * 100),
        imageUrl: form.imageUrl || null,
        stockStatus: form.stockStatus,
        occasions: form.occasions,
        badges: form.badges
          ? form.badges.split(",").map((b) => b.trim()).filter(Boolean)
          : [],
        sortOrder: form.sortOrder,
      };

      const url = product
        ? `/api/admin/products/${product.id}`
        : "/api/admin/products";
      const res = await adminFetch(url, {
        method: product ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success(product ? "Product updated" : "Product created");
        onSaved();
        onClose();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save product");
      }
    } catch {
      toast.error("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto border-twine-light bg-white">
        <DialogHeader>
          <DialogTitle className="font-[family-name:var(--font-fraunces)] text-lg text-ink">
            {product ? "Edit Product" : "Add Product"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Title */}
          <div>
            <Label className="font-[family-name:var(--font-karla)]">Title *</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Rose Bouquet"
              className="border-twine-light mt-1.5 font-[family-name:var(--font-karla)]"
            />
          </div>

          {/* Description */}
          <div>
            <Label className="font-[family-name:var(--font-karla)]">Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Product description..."
              rows={3}
              className="border-twine-light mt-1.5 font-[family-name:var(--font-karla)]"
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="font-[family-name:var(--font-karla)]">Category *</Label>
              <Select
                value={form.categoryId}
                onValueChange={(val) => setForm((f) => ({ ...f, categoryId: val }))}
              >
                <SelectTrigger className="border-twine-light mt-1.5 font-[family-name:var(--font-karla)]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-[family-name:var(--font-karla)]">Price (Rs) *</Label>
              <Input
                type="number"
                min={0}
                step={1}
                value={form.price || ""}
                onChange={(e) => setForm((f) => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
                placeholder="e.g. 1500"
                className="border-twine-light mt-1.5 font-[family-name:var(--font-space-mono)] text-sm"
              />
            </div>
          </div>

          {/* Image */}
          <div>
            <Label className="font-[family-name:var(--font-karla)]">Image URL</Label>
            <div className="flex gap-2 mt-1.5">
              <Input
                value={form.imageUrl}
                onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                placeholder="https://... or upload below"
                className="border-twine-light font-[family-name:var(--font-space-mono)] text-sm"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
              />
              <Button
                type="button"
                variant="outline"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="border-twine-light text-ink-soft hover:bg-paper-warm shrink-0 font-[family-name:var(--font-karla)]"
              >
                {uploading ? (
                  <div className="w-4 h-4 border-2 border-ink-soft border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
              </Button>
            </div>
            {form.imageUrl && (
              <div className="mt-2 relative inline-block">
                <ImageIcon className="w-4 h-4 text-ink-soft mr-1 inline" />
                <span className="text-xs text-ink-soft font-[family-name:var(--font-space-mono)] break-all">
                  {form.imageUrl}
                </span>
              </div>
            )}
          </div>

          {/* Stock Status & Sort Order */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="font-[family-name:var(--font-karla)]">Stock Status</Label>
              <Select
                value={form.stockStatus}
                onValueChange={(val) => setForm((f) => ({ ...f, stockStatus: val }))}
              >
                <SelectTrigger className="border-twine-light mt-1.5 font-[family-name:var(--font-karla)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STOCK_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-[family-name:var(--font-karla)]">Sort Order</Label>
              <Input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm((f) => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))}
                className="border-twine-light mt-1.5 font-[family-name:var(--font-space-mono)] text-sm"
              />
            </div>
          </div>

          {/* Occasions */}
          <div>
            <Label className="font-[family-name:var(--font-karla)]">Occasions</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1.5">
              {OCCASIONS_LIST.map((occasion) => (
                <div key={occasion} className="flex items-center gap-2">
                  <Checkbox
                    id={`occ-${occasion}`}
                    checked={form.occasions.includes(occasion)}
                    onCheckedChange={() => toggleOccasion(occasion)}
                  />
                  <Label
                    htmlFor={`occ-${occasion}`}
                    className="text-sm font-normal text-ink-soft cursor-pointer font-[family-name:var(--font-karla)]"
                  >
                    {OCCASION_LABELS[occasion]}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div>
            <Label className="font-[family-name:var(--font-karla)]">Badges</Label>
            <Input
              value={form.badges}
              onChange={(e) => setForm((f) => ({ ...f, badges: e.target.value }))}
              placeholder="Comma-separated, e.g. bestseller, new"
              className="border-twine-light mt-1.5 font-[family-name:var(--font-karla)]"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-twine-light text-ink-soft font-[family-name:var(--font-karla)]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !form.title.trim() || !form.categoryId}
            className="bg-berry hover:bg-berry-deep text-white font-[family-name:var(--font-karla)]"
          >
            {saving ? "Saving..." : product ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryFilter !== "all") params.set("category", categoryFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      const query = params.toString() ? `?${params.toString()}` : "";
      const res = await adminFetch(`/api/admin/products${query}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        toast.error("Failed to load products");
      }
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, statusFilter, searchQuery]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await adminFetch("/api/admin/categories");
      if (res.ok) setCategories(await res.json());
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (value: string) => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setSearchQuery(value);
    }, 300);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await adminFetch(`/api/admin/products/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Product deleted");
        fetchProducts();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete product");
      }
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px] border-twine-light font-[family-name:var(--font-karla)] text-sm h-9">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] border-twine-light font-[family-name:var(--font-karla)] text-sm h-9">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {STOCK_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft" />
            <Input
              placeholder="Search products..."
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 border-twine-light font-[family-name:var(--font-karla)] text-sm h-9 w-[200px]"
            />
          </div>
        </div>

        <Button
          onClick={() => {
            setEditProduct(null);
            setDialogOpen(true);
          }}
          size="sm"
          className="bg-berry hover:bg-berry-deep text-white font-[family-name:var(--font-karla)]"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Product
        </Button>
      </div>

      {/* Products Table */}
      <Card className="border-twine-light shadow-none">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-5 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="px-5 py-16 text-center text-ink-soft font-[family-name:var(--font-karla)]">
              <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No products found</p>
            </div>
          ) : (
            <ScrollArea className="max-h-[calc(100vh-360px)]">
              <Table>
                <TableHeader>
                  <TableRow className="border-twine-light hover:bg-transparent">
                    <TableHead className="text-ink-soft font-medium">Title</TableHead>
                    <TableHead className="text-ink-soft font-medium hidden sm:table-cell">Category</TableHead>
                    <TableHead className="text-ink-soft font-medium">Price</TableHead>
                    <TableHead className="text-ink-soft font-medium hidden md:table-cell">Status</TableHead>
                    <TableHead className="text-ink-soft font-medium hidden lg:table-cell">Badges</TableHead>
                    <TableHead className="text-ink-soft font-medium hidden xl:table-cell">Sort</TableHead>
                    <TableHead className="text-ink-soft font-medium text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((prod) => (
                    <TableRow key={prod.id} className="border-twine-light">
                      <TableCell className="font-medium text-ink font-[family-name:var(--font-karla)] max-w-[180px] truncate">
                        {prod.title}
                      </TableCell>
                      <TableCell className="text-ink-soft text-sm font-[family-name:var(--font-karla)] hidden sm:table-cell">
                        {prod.categoryRef?.name ?? prod.category}
                      </TableCell>
                      <TableCell className="font-[family-name:var(--font-space-mono)] text-xs text-ink">
                        {formatPrice(prod.price)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${stockBadgeClass(prod.stockStatus)}`}
                        >
                          {formatStockStatus(prod.stockStatus)}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(prod.badges) &&
                            prod.badges.map((badge, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="text-xs border-butter/40 bg-butter/10 text-ink-soft font-[family-name:var(--font-karla)]"
                              >
                                {badge}
                              </Badge>
                            ))}
                        </div>
                      </TableCell>
                      <TableCell className="font-[family-name:var(--font-space-mono)] text-xs text-ink-soft hidden xl:table-cell">
                        {prod.sortOrder}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-ink-soft hover:text-ink hover:bg-paper-warm"
                            onClick={() => {
                              setEditProduct(prod);
                              setDialogOpen(true);
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-ink-soft hover:text-berry hover:bg-berry/10"
                            onClick={() => setDeleteTarget(prod)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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

      <ProductFormDialog
        product={editProduct}
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditProduct(null);
        }}
        onSaved={fetchProducts}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent className="border-twine-light bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-[family-name:var(--font-fraunces)] text-ink">
              Delete Product
            </AlertDialogTitle>
            <AlertDialogDescription className="font-[family-name:var(--font-karla)] text-ink-soft">
              Are you sure you want to delete &ldquo;{deleteTarget?.title}&rdquo;? This will fail if the product has existing order items.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-[family-name:var(--font-karla)]">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-berry hover:bg-berry-deep text-white font-[family-name:var(--font-karla)]"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
      const res = await adminFetch(`/api/admin/orders${query}`);
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
      const res = await adminFetch(`/api/admin/orders/${orderId}`, {
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
                                : `\u2192 ${formatStatus(nextStatus)}`}
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
        const res = await adminFetch("/api/admin/newsletter");
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

// ─── Messages Tab ────────────────────────────────────────────────────────────

function MessagesTab() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const loadMessages = useCallback(async () => {
    try {
      const res = await adminFetch("/api/admin/contact");
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      } else {
        toast.error("Failed to load messages");
      }
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleOpen = async (msg: ContactMessage) => {
    setSelected(msg);
    if (!msg.isRead) {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m))
      );
      try {
        await adminFetch(`/api/admin/contact/${msg.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isRead: true }),
        });
      } catch {
        // Non-critical; ignore failure to mark as read
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await adminFetch(`/api/admin/contact/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setMessages((prev) => prev.filter((m) => m.id !== id));
      setSelected(null);
      toast.success("Message deleted");
    } catch {
      toast.error("Failed to delete message");
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <MessageSquare className="w-5 h-5 text-ink-soft" />
        <h2 className="text-sm text-ink-soft font-[family-name:var(--font-karla)]">
          Total Messages:
        </h2>
        <span className="font-[family-name:var(--font-fraunces)] text-xl text-ink font-bold">
          {loading ? <Skeleton className="h-7 w-8 inline-block" /> : messages.length}
        </span>
        {!loading && unreadCount > 0 && (
          <Badge className="bg-berry text-white border-none">
            {unreadCount} unread
          </Badge>
        )}
      </div>

      <Card className="border-twine-light shadow-none">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-5 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="px-5 py-16 text-center text-ink-soft font-[family-name:var(--font-karla)]">
              <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No messages yet</p>
            </div>
          ) : (
            <ScrollArea className="max-h-[calc(100vh-260px)]">
              <Table>
                <TableHeader>
                  <TableRow className="border-twine-light hover:bg-transparent">
                    <TableHead className="text-ink-soft font-medium w-8"></TableHead>
                    <TableHead className="text-ink-soft font-medium">Name</TableHead>
                    <TableHead className="text-ink-soft font-medium">Email</TableHead>
                    <TableHead className="text-ink-soft font-medium">Message</TableHead>
                    <TableHead className="text-ink-soft font-medium">Received</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((msg) => (
                    <TableRow
                      key={msg.id}
                      className="border-twine-light cursor-pointer hover:bg-paper-warm"
                      onClick={() => handleOpen(msg)}
                    >
                      <TableCell>
                        {!msg.isRead && (
                          <Circle className="w-2 h-2 fill-berry text-berry" />
                        )}
                      </TableCell>
                      <TableCell
                        className={`font-[family-name:var(--font-karla)] ${
                          msg.isRead ? "text-ink-soft" : "text-ink font-bold"
                        }`}
                      >
                        {msg.name}
                      </TableCell>
                      <TableCell className="text-ink-soft font-[family-name:var(--font-karla)]">
                        {msg.email}
                      </TableCell>
                      <TableCell className="text-ink-soft font-[family-name:var(--font-karla)] max-w-xs truncate">
                        {msg.message}
                      </TableCell>
                      <TableCell className="text-ink-soft text-sm font-[family-name:var(--font-karla)] whitespace-nowrap">
                        {format(new Date(msg.createdAt), "MMM d, yyyy")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-[family-name:var(--font-fraunces)]">
                  {selected.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <p className="text-sm text-ink-soft font-[family-name:var(--font-karla)]">
                  {selected.email} &middot;{" "}
                  {format(new Date(selected.createdAt), "MMM d, yyyy h:mm a")}
                </p>
                <p className="text-sm text-ink font-[family-name:var(--font-karla)] whitespace-pre-wrap">
                  {selected.message}
                </p>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  className="border-twine-light text-ink-soft hover:bg-paper-warm hover:text-ink"
                  onClick={() => handleDelete(selected.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1.5" />
                  Delete
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Admin Overlay Component ──────────────────────────────────────────────

interface AdminPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function AdminPanel({ open, onClose }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check existing auth when opened
  useEffect(() => {
    if (!open) return;
    setCheckingAuth(true);
    (async () => {
      try {
        const res = await adminFetch("/api/admin/stats");
        if (res.ok) {
          setIsAuthenticated(true);
        }
      } catch {
        // Not authenticated
      } finally {
        setCheckingAuth(false);
      }
    })();
  }, [open]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    setAdminToken(null);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    toast.success("Logged out");
    onClose();
  };

  if (!open) return null;

  const TAB_META: Record<Tab, { title: string; description: string }> = {
    dashboard: {
      title: "Dashboard",
      description: "Overview of your store performance",
    },
    products: {
      title: "Products",
      description: "Manage your product catalog",
    },
    categories: {
      title: "Categories",
      description: "Organize products into categories",
    },
    orders: {
      title: "Orders",
      description: "Manage and track all customer orders",
    },
    newsletter: {
      title: "Newsletter",
      description: "View your email subscribers",
    },
    messages: {
      title: "Messages",
      description: "View messages sent from the contact form",
    },
  };

  const content = checkingAuth ? (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-10 h-10 rounded-full bg-berry/20 animate-pulse" />
    </div>
  ) : !isAuthenticated ? (
    <LoginScreen onLogin={handleLogin} />
  ) : (
    <div className="flex-1 flex min-h-0">
      <SidebarNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        collapsed={sidebarOpen}
        onToggle={() => setSidebarOpen((p) => !p)}
        onClose={onClose}
      />

      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Mobile header spacer */}
        <div className="h-14 lg:hidden" />

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="font-[family-name:var(--font-fraunces)] text-2xl sm:text-3xl text-ink">
              {TAB_META[activeTab].title}
            </h1>
            <p className="text-sm text-ink-soft mt-1 font-[family-name:var(--font-karla)]">
              {TAB_META[activeTab].description}
            </p>
          </div>

          {/* Tab Content */}
          {activeTab === "dashboard" && <DashboardTab />}
          {activeTab === "products" && <ProductsTab />}
          {activeTab === "categories" && <CategoriesTab />}
          {activeTab === "orders" && <OrdersTab />}
          {activeTab === "newsletter" && <NewsletterTab />}
          {activeTab === "messages" && <MessagesTab />}
        </div>
      </main>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] bg-paper flex flex-col">
      {/* Close button (when not authenticated) */}
      {!isAuthenticated && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[110] w-9 h-9 rounded-full bg-white border border-twine-light flex items-center justify-center cursor-pointer text-ink-soft hover:text-ink hover:bg-paper-warm transition-colors"
          aria-label="Close admin"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {content}
    </div>
  );
}