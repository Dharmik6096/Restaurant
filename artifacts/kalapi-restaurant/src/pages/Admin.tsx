import React, { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useGetMenu, useDeleteMenuItem, useGetAllOrders, useUpdateOrderStatus } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Trash2, Edit, LayoutDashboard, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { motion } from "framer-motion";

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
    <div className="flex min-h-screen bg-background pt-24">
      {/* Sidebar */}
      <div className="w-64 bg-[#0F2A1D] text-[#F5E9DA] fixed h-full shadow-2xl z-10">
        <div className="p-8">
          <h2 className="font-display text-2xl mb-2 text-[#D6B98C]">Kalapi Admin</h2>
          <p className="text-sm text-[#F5E9DA]/60">Management Console</p>
        </div>
        
        <nav className="mt-8 flex flex-col gap-2 px-4">
          <button 
            onClick={() => setActiveTab("menu")} 
            className={`flex items-center gap-3 px-4 py-4 rounded-xl text-sm font-bold tracking-wide transition-all ${activeTab === "menu" ? "bg-primary text-primary-foreground shadow-lg" : "hover:bg-[#F5E9DA]/10"}`}
          >
            <UtensilsCrossed className="w-5 h-5" /> Menu Manager
          </button>
          <button 
            onClick={() => setActiveTab("orders")} 
            className={`flex items-center gap-3 px-4 py-4 rounded-xl text-sm font-bold tracking-wide transition-all ${activeTab === "orders" ? "bg-primary text-primary-foreground shadow-lg" : "hover:bg-[#F5E9DA]/10"}`}
          >
            <ShoppingBag className="w-5 h-5" /> Order Center
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-10">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {activeTab === "menu" && (
            <div>
              <div className="flex justify-between items-center mb-10">
                <h1 className="font-display text-4xl text-foreground">Menu Items</h1>
                <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wider shadow-md hover:-translate-y-1 transition-all">
                  + Add New Dish
                </button>
              </div>
              
              <div className="bg-card rounded-[24px] overflow-hidden soft-shadow border border-border">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-base">
                    <thead className="bg-muted text-muted-foreground">
                      <tr>
                        <th className="p-6 font-bold uppercase tracking-wider text-xs">ID</th>
                        <th className="p-6 font-bold uppercase tracking-wider text-xs">Name</th>
                        <th className="p-6 font-bold uppercase tracking-wider text-xs">Category</th>
                        <th className="p-6 font-bold uppercase tracking-wider text-xs">Price</th>
                        <th className="p-6 font-bold uppercase tracking-wider text-xs text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {menuLoading ? <tr><td colSpan={5} className="p-8 text-center font-display text-xl">Loading menu...</td></tr> : menuItems?.map((item, i) => (
                        <tr key={item.id} className={i % 2 === 0 ? "bg-card" : "bg-background/50 hover:bg-background transition-colors"}>
                          <td className="p-6 text-sm text-muted-foreground font-mono">#{item.id}</td>
                          <td className="p-6 font-bold text-foreground">{item.name}</td>
                          <td className="p-6 text-sm"><span className="bg-muted px-3 py-1 rounded-full font-medium">{item.category}</span></td>
                          <td className="p-6 font-bold text-primary">₹{item.price}</td>
                          <td className="p-6 flex justify-end gap-3">
                            <button className="p-2.5 text-[#0F2A1D] hover:bg-[#0F2A1D]/10 rounded-lg transition-colors"><Edit className="w-5 h-5"/></button>
                            <button 
                              onClick={() => {
                                if(confirm('Delete this item?')) deleteMenuMutation.mutate({ id: item.id });
                              }}
                              className="p-2.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5"/>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <h1 className="font-display text-4xl text-foreground mb-10">Live Orders</h1>
              
              <div className="bg-card rounded-[24px] overflow-hidden soft-shadow border border-border">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-base">
                    <thead className="bg-muted text-muted-foreground">
                      <tr>
                        <th className="p-6 font-bold uppercase tracking-wider text-xs">Order #</th>
                        <th className="p-6 font-bold uppercase tracking-wider text-xs">Date & Time</th>
                        <th className="p-6 font-bold uppercase tracking-wider text-xs">Customer</th>
                        <th className="p-6 font-bold uppercase tracking-wider text-xs">Amount</th>
                        <th className="p-6 font-bold uppercase tracking-wider text-xs">Payment</th>
                        <th className="p-6 font-bold uppercase tracking-wider text-xs">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {ordersLoading ? <tr><td colSpan={6} className="p-8 text-center font-display text-xl">Loading orders...</td></tr> : orders?.map((order, i) => (
                        <tr key={order.id} className={i % 2 === 0 ? "bg-card" : "bg-background/50 hover:bg-background transition-colors"}>
                          <td className="p-6 text-sm font-mono font-bold">#{order.id}</td>
                          <td className="p-6 text-sm">{order.createdAt ? format(new Date(order.createdAt), "dd MMM, HH:mm") : "-"}</td>
                          <td className="p-6 font-medium">{order.deliveryName}</td>
                          <td className="p-6 font-bold text-primary">₹{order.total}</td>
                          <td className="p-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${order.paymentStatus === 'paid' ? 'bg-[#2D6A4F]/10 text-[#2D6A4F] border-[#2D6A4F]/20' : 'bg-orange-100 text-orange-700 border-orange-200'}`}>
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="p-6">
                            <select 
                              value={order.status}
                              onChange={(e) => updateStatusMutation.mutate({ id: order.id, data: { status: e.target.value as any }})}
                              className="bg-background border border-border rounded-lg px-4 py-2 text-sm font-bold uppercase tracking-wider text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
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
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
