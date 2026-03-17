import React, { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useGetUserOrders, useGetWishlist, useGetUserProfile } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Package, Heart, User as UserIcon, LogOut } from "lucide-react";
import { MenuItemCard } from "@/components/MenuItemCard";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"orders" | "wishlist" | "profile">("orders");

  const { data: orders, isLoading: ordersLoading } = useGetUserOrders();
  const { data: wishlist, isLoading: wishlistLoading } = useGetWishlist();
  const { data: profile } = useGetUserProfile();

  if (!user) return null;

  return (
    <div className="pt-32 pb-24 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-10">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="glass-panel rounded-xl p-6 sticky top-32">
            <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center text-2xl font-display font-bold mb-4">
              {user.name.charAt(0)}
            </div>
            <h2 className="font-bold text-lg">{user.name}</h2>
            <p className="text-sm text-muted-foreground mb-8">{user.email}</p>

            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "orders" ? "bg-primary text-primary-foreground" : "hover:bg-white/5 text-foreground/80"}`}
              >
                <Package className="w-4 h-4" /> My Orders
              </button>
              <button 
                onClick={() => setActiveTab("wishlist")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "wishlist" ? "bg-primary text-primary-foreground" : "hover:bg-white/5 text-foreground/80"}`}
              >
                <Heart className="w-4 h-4" /> Wishlist
              </button>
              <button 
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "profile" ? "bg-primary text-primary-foreground" : "hover:bg-white/5 text-foreground/80"}`}
              >
                <UserIcon className="w-4 h-4" /> Profile Settings
              </button>
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors mt-8"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "orders" && (
            <div className="space-y-6">
              <h3 className="text-2xl font-display mb-6 border-b border-white/10 pb-4">Order History</h3>
              {ordersLoading ? (
                <div>Loading orders...</div>
              ) : orders?.length === 0 ? (
                <div className="text-muted-foreground p-8 glass-panel rounded-xl text-center">No orders found.</div>
              ) : (
                orders?.map(order => (
                  <div key={order.id} className="glass-panel p-6 rounded-xl">
                    <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-4">
                      <div>
                        <div className="font-bold text-lg mb-1">Order #{order.id}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.createdAt ? format(new Date(order.createdAt), "PPP p") : "Date unknown"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary text-lg">₹{order.total}</div>
                        <div className="text-xs px-2 py-1 bg-white/10 rounded uppercase tracking-wider mt-1 inline-block">
                          {order.status}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {order.items?.map(item => (
                        <div key={item.id} className="text-sm flex justify-between">
                          <span>{item.quantity}x {item.menuItem?.name || 'Item'}</span>
                          <span className="text-muted-foreground">₹{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "wishlist" && (
            <div>
              <h3 className="text-2xl font-display mb-6 border-b border-white/10 pb-4">My Wishlist</h3>
              {wishlistLoading ? (
                <div>Loading wishlist...</div>
              ) : wishlist?.length === 0 ? (
                <div className="text-muted-foreground p-8 glass-panel rounded-xl text-center">Your wishlist is empty.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {wishlist?.map(item => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="glass-panel p-8 rounded-xl max-w-xl">
              <h3 className="text-2xl font-display mb-6 border-b border-white/10 pb-4">Profile Info</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Full Name</label>
                  <div className="text-lg font-medium">{profile?.name}</div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Email</label>
                  <div className="text-lg font-medium">{profile?.email}</div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Account Type</label>
                  <div className="capitalize text-primary font-medium">{profile?.role}</div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
