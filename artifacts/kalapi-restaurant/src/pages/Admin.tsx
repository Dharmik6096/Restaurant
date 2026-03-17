import React, { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useGetMenu, useCreateMenuItem, useDeleteMenuItem, useGetAllOrders, useUpdateOrderStatus } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Trash2, Edit } from "lucide-react";

export default function Admin() {
  const { user, isAdmin } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"menu" | "orders">("menu");

  React.useEffect(() => {
    if (user && !isAdmin) {
      setLocation("/");
      toast({ title: "Access Denied", variant: "destructive" });
    }
  }, [user, isAdmin, setLocation, toast]);

  const { data: menuItems, isLoading: menuLoading } = useGetMenu();
  const { data: orders, isLoading: ordersLoading } = useGetAllOrders({ query: { enabled: activeTab === "orders" } });

  const deleteMenuMutation = useDeleteMenuItem({
    mutation: {
      onSuccess: () => {
        toast({ title: "Item deleted" });
        queryClient.invalidateQueries({ queryKey: ["/api/menu"] });
      }
    }
  });

  const updateStatusMutation = useUpdateOrderStatus({
    mutation: {
      onSuccess: () => {
        toast({ title: "Status updated" });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      }
    }
  });

  if (!isAdmin) return null;

  return (
    <div className="pt-32 pb-24 min-h-screen max-w-7xl mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-4xl text-primary">Admin Control Panel</h1>
        <div className="flex gap-2">
          <button onClick={() => setActiveTab("menu")} className={`px-4 py-2 rounded-md text-sm font-bold uppercase tracking-wider ${activeTab === "menu" ? "bg-primary text-primary-foreground" : "bg-white/10"}`}>Menu</button>
          <button onClick={() => setActiveTab("orders")} className={`px-4 py-2 rounded-md text-sm font-bold uppercase tracking-wider ${activeTab === "orders" ? "bg-primary text-primary-foreground" : "bg-white/10"}`}>Orders</button>
        </div>
      </div>

      {activeTab === "menu" && (
        <div className="glass-panel p-6 rounded-xl overflow-x-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Menu Items</h2>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-sm text-sm font-bold">Add New Item</button>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuLoading ? <tr><td colSpan={5} className="p-4">Loading...</td></tr> : menuItems?.map(item => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4 text-muted-foreground">#{item.id}</td>
                  <td className="p-4 font-medium">{item.name}</td>
                  <td className="p-4">{item.category}</td>
                  <td className="p-4 text-primary">₹{item.price}</td>
                  <td className="p-4 flex gap-2">
                    <button className="p-2 text-blue-400 hover:bg-blue-400/10 rounded"><Edit className="w-4 h-4"/></button>
                    <button 
                      onClick={() => {
                        if(confirm('Delete this item?')) deleteMenuMutation.mutate({ id: item.id });
                      }}
                      className="p-2 text-red-400 hover:bg-red-400/10 rounded"
                    >
                      <Trash2 className="w-4 h-4"/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="glass-panel p-6 rounded-xl overflow-x-auto">
          <h2 className="text-xl font-bold mb-6">All Orders</h2>
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="p-4">Order #</th>
                <th className="p-4">Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {ordersLoading ? <tr><td colSpan={6} className="p-4">Loading...</td></tr> : orders?.map(order => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4 text-muted-foreground">#{order.id}</td>
                  <td className="p-4">{order.createdAt ? format(new Date(order.createdAt), "dd MMM, HH:mm") : "-"}</td>
                  <td className="p-4">{order.deliveryName}</td>
                  <td className="p-4 text-primary font-bold">₹{order.total}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs uppercase ${order.paymentStatus === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <select 
                      value={order.status}
                      onChange={(e) => updateStatusMutation.mutate({ id: order.id, data: { status: e.target.value as any }})}
                      className="bg-black border border-white/20 rounded px-2 py-1 text-xs uppercase"
                    >
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
