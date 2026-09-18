'use client';

import {
  IconSearch,
  IconEye,
  IconClock,
  IconCircleCheck,
  IconCurrencyDollar,
  IconPackage,
  IconPrinter,
  IconMapPin,
  IconCreditCard,
  IconLoader2
} from '@tabler/icons-react';
import { X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

// UI Components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { API_BASE_URL } from '@/constants';
import { PaginatedOrderResponse } from '@/types';

const initial = {
  content: [],
  pageNumber: 0,
  pageSize: 10,
  totalElements: 2,
  totalPages: 1,
  last: true
};
export default function OrdersPage() {
  const [orders, setOrders] = useState<PaginatedOrderResponse>(initial);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | number | null>(null);
  const [orderAnalytics, setOrderAnalytics] = useState<{
    totalCanceledOrders: number;
    totalCompletedOrders: number;
    totalOrders: number;
    totalPendingOrders: number;
  }>({
    totalCanceledOrders: 0,
    totalCompletedOrders: 0,
    totalOrders: 0,
    totalPendingOrders: 0
  });

  // In-place status update handler with loading state tracking
  const handleStatusChange = async (orderId: string | number, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('status', newStatus.toUpperCase());

      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        toast.success(`Order #${orderId} status updated to ${newStatus.toLowerCase()}`);
        await fetchOrders();
      } else {
        toast.error('Failed to update order status');
      }
    } catch (error) {
      toast.error('An error occurred while updating status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const fetchOrders = useCallback(async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(API_BASE_URL + '/orders/paged?page=0&size=10&sort=id%2CASC', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      setOrders(data);
    }
  }, []);

  const fetchOrderAnalysis = useCallback(async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(API_BASE_URL + '/analytics/orders', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      setOrderAnalytics(data);
    }
  }, []);

  // Filter Orders
  const filteredOrders = orders.content.filter((order) => {
    const matchesSearch =
      order.id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab = activeTab === 'all' || order.orderStatus === activeTab;

    return matchesSearch && matchesTab;
  });

  // KPI Calculations
  const totalRevenue = orders.content
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingCount = orders.content.filter((o) => o.orderStatus === 'pending').length;
  const processingCount = orders.content.filter(
    (o) => o.orderStatus === 'processing' || o.orderStatus === 'shipped'
  ).length;
  const completedCount = orders.content.filter((o) => o.orderStatus === 'delivered').length;

  // Status Badge Colors (Case-Insensitive & Standardized)
  const getOrderStatusBadge = (status: string) => {
    const normalizedStatus = status?.toLowerCase();

    switch (normalizedStatus) {
      case 'delivered':
      case 'completed':
        return (
          <Badge className="border-emerald-500/20 bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 dark:bg-emerald-500/20 dark:text-emerald-400">
            Delivered
          </Badge>
        );
      case 'shipped':
        return (
          <Badge className="border-blue-500/20 bg-blue-500/15 text-blue-700 hover:bg-blue-500/25 dark:bg-blue-500/20 dark:text-blue-400">
            Shipped
          </Badge>
        );
      case 'processing':
      case 'in_fulfillment':
        return (
          <Badge className="border-indigo-500/20 bg-indigo-500/15 text-indigo-700 hover:bg-indigo-500/25 dark:bg-indigo-500/20 dark:text-indigo-400">
            Processing
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="border-amber-500/20 bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 dark:bg-amber-500/20 dark:text-amber-400">
            Pending
          </Badge>
        );
      case 'cancelled':
      case 'canceled':
        return (
          <Badge className="border-rose-500/20 bg-rose-500/15 text-rose-700 hover:bg-rose-500/25 dark:bg-rose-500/20 dark:text-rose-400">
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    const normalizedStatus = status?.toLowerCase();

    switch (normalizedStatus) {
      case 'paid':
      case 'completed':
        return (
          <Badge className="border-emerald-500/20 bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 dark:bg-emerald-500/20 dark:text-emerald-400">
            Paid
          </Badge>
        );
      case 'pending':
      case 'unpaid':
        return (
          <Badge className="border-amber-500/20 bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 dark:bg-amber-500/20 dark:text-amber-400">
            Pending
          </Badge>
        );
      case 'refunded':
        return (
          <Badge className="border-purple-500/20 bg-purple-500/15 text-purple-700 hover:bg-purple-500/25 dark:bg-purple-500/20 dark:text-purple-400">
            Refunded
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="border-rose-500/20 bg-rose-500/15 text-rose-700 hover:bg-rose-500/25 dark:bg-rose-500/20 dark:text-rose-400">
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchOrderAnalysis();
  }, [fetchOrders, fetchOrderAnalysis]);
  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground text-sm">
            Track customer orders, manage fulfillment pipelines, and issue invoices.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => window.print()}
          className="flex items-center gap-2"
        >
          <IconPrinter className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <IconCurrencyDollar className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${orderAnalytics.totalOrders}</div>
            <p className="text-muted-foreground text-xs">+18.2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <IconClock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderAnalytics.totalPendingOrders}</div>
            <p className="text-muted-foreground text-xs">Requires immediate review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Canceled Orders</CardTitle>
            <X className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderAnalytics.totalCompletedOrders}</div>
            <p className="text-muted-foreground text-xs">Order termiated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <IconCircleCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderAnalytics.totalCompletedOrders}</div>
            <p className="text-muted-foreground text-xs">Successfully delivered</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Tabs */}
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full md:w-auto"
            >
              <TabsList>
                <TabsTrigger value="all">All Orders</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="shipped">Shipped</TabsTrigger>
                <TabsTrigger value="delivered">Delivered</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Search */}
            <div className="relative w-full md:w-72">
              <IconSearch className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                placeholder="Search order ID or customer..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status (In-Place Edit)</TableHead>
                  <TableHead className="text-center">Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                  <TableHead className="text-right">View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-muted-foreground h-24 text-center">
                      No orders found matching criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => {
                    const isUpdating = updatingOrderId === order.id;

                    return (
                      <TableRow key={order.id}>
                        {/* Order ID */}
                        <TableCell className="font-mono font-medium">#{order.id}</TableCell>

                        {/* Customer */}
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.userId}</p>
                            <p className="text-muted-foreground text-xs">{order.customerEmail}</p>
                          </div>
                        </TableCell>

                        {/* Payment Status */}
                        <TableCell>{getPaymentStatusBadge(order.status)}</TableCell>

                        {/* In-place Status Selector with Spinner */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Select
                              disabled={isUpdating}
                              value={order.orderStatus?.toLowerCase() || 'pending'}
                              onValueChange={(val) => handleStatusChange(order.id, val)}
                            >
                              <SelectTrigger className="h-8 w-32.5 text-xs">
                                {isUpdating ? (
                                  <div className="text-muted-foreground flex items-center gap-1.5">
                                    <IconLoader2 className="h-3.5 w-3.5 animate-spin" />
                                    <span>Updating...</span>
                                  </div>
                                ) : (
                                  <SelectValue />
                                )}
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>

                        {/* Items Count */}
                        <TableCell className="text-center font-medium">
                          {order.items.reduce((acc, item) => acc + item.quantity, 0)}
                        </TableCell>

                        {/* Total */}
                        <TableCell className="text-right font-mono font-medium">
                          ${order.totalAmount.toFixed(2)}
                        </TableCell>

                        {/* Date */}
                        <TableCell className="text-muted-foreground text-right font-mono text-xs">
                          {order.createdAt}
                        </TableCell>

                        {/* View Details Action Button */}
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setSelectedOrder(order)}
                            title="View Details"
                          >
                            <IconEye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details & Invoice Modal */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-162.5">
            <DialogHeader className="border-b pb-4">
              <div className="flex items-center justify-between pr-4">
                <div>
                  <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                    Order {selectedOrder.id}
                    {getOrderStatusBadge(selectedOrder.orderStatus)}
                  </DialogTitle>
                  <DialogDescription className="text-xs">
                    Placed on {selectedOrder.createdAt}
                  </DialogDescription>
                </div>
                <Select
                  value={selectedOrder.orderStatus}
                  onValueChange={(val) => handleStatusChange(selectedOrder.id, val)}
                >
                  <SelectTrigger className="h-8 w-35 text-xs">
                    <SelectValue placeholder="Update status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Shipping & Payment Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-muted/30 space-y-2 rounded-lg border p-3">
                  <p className="text-muted-foreground flex items-center gap-1 text-xs font-semibold">
                    <IconMapPin className="h-3.5 w-3.5" /> Shipping Address
                  </p>
                  <p className="text-sm font-medium">{selectedOrder.customerName}</p>
                  <p className="text-muted-foreground text-xs">{selectedOrder.shippingAddress}</p>
                  <p className="text-muted-foreground text-xs">{selectedOrder.customerEmail}</p>
                </div>

                <div className="bg-muted/30 space-y-2 rounded-lg border p-3">
                  <p className="text-muted-foreground flex items-center gap-1 text-xs font-semibold">
                    <IconCreditCard className="h-3.5 w-3.5" /> Payment Summary
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{selectedOrder.paymentMethod}</p>
                    {getPaymentStatusBadge(selectedOrder.paymentStatus)}
                  </div>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-3">
                <p className="flex items-center gap-1 text-sm font-semibold">
                  <IconPackage className="text-primary h-4 w-4" /> Order Items
                </p>
                <div className="divide-y rounded-md border">
                  {selectedOrder.items.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-3 text-sm">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-muted-foreground font-mono text-xs">SKU: {item.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono">
                          {item.quantity} x ${item.price.toFixed(2)}
                        </p>
                        <p className="font-mono font-medium">
                          ${(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost Calculations */}
              <div className="space-y-1.5 border-t pt-3 text-sm">
                <div className="text-muted-foreground flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono">${selectedOrder.subtotal}</span>
                </div>
                <div className="text-muted-foreground flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="font-mono">${selectedOrder.tax}</span>
                </div>
                <div className="text-muted-foreground flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-mono">${selectedOrder.shippingFee}</span>
                </div>
                <div className="mt-2 flex justify-between border-t pt-2 text-base font-bold">
                  <span>Total Amount</span>
                  <span className="text-primary font-mono">${selectedOrder.totalAmount}</span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
