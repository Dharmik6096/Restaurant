import React, { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useGetUserOrders, useGetWishlist, useGetUserProfile } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Package, Heart, User as UserIcon, LogOut, MapPin } from "lucide-react";
import { MenuItemCard } from "@/components/MenuItemCard";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"orders" | "wishlist" | "profile">("orders");

  const { data: orders, isLoading: ordersLoading } = useGetUserOrders();
  const { data: wishlist, isLoading: wishlistLoading } = useGetWishlist();
  const { data: profile } = useGetUserProfile();

  if (!user) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-[#F2A65A]/20 text-[#D97706] border-[#F2A65A]/30'; // soft orange
      case 'preparing': return 'bg-[#E5C158]/20 text-[#B48608] border-[#E5C158]/30'; // soft yellow
      case 'out_for_delivery': return 'bg-primary/20 text-primary border-primary/30'; // terracotta
      case 'delivered': return 'bg-[#2D6A4F]/20 text-[#2D6A4F] border-[#2D6A4F]/30'; // forest green
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="pt-40 pb-32 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12">
          <h1 className="font-display text-5xl text-foreground">My Account</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Sidebar */}
          <div className="w-full md:w-72 shrink-0">
            <div className="bg-card rounded-[24px] p-8 sticky top-32 soft-shadow">
              <div className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-4xl font-display font-bold mb-6 shadow-inner">
                {user.name.charAt(0)}
              </div>
              <h2 className="font-bold text-2xl mb-1 text-foreground">{user.name}</h2>
              <p className="text-base text-muted-foreground mb-10">{user.email}</p>

              <nav className="flex flex-col relative">
                <div className="space-y-2 relative z-10">
                  <button 
                    onClick={() => setActiveTab("orders")}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-base font-bold transition-all ${activeTab === "orders" ? "bg-background text-primary shadow-sm" : "hover:bg-background/50 text-foreground/80"}`}
                  >
                    <Package className="w-5 h-5" /> Order History
                  </button>
                  <button 
                    onClick={() => setActiveTab("wishlist")}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-base font-bold transition-all ${activeTab === "wishlist" ? "bg-background text-primary shadow-sm" : "hover:bg-background/50 text-foreground/80"}`}
                  >
                    <Heart className="w-5 h-5" /> My Wishlist
                  </button>
                  <button 
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-base font-bold transition-all ${activeTab === "profile" ? "bg-background text-primary shadow-sm" : "hover:bg-background/50 text-foreground/80"}`}
                  >
                    <UserIcon className="w-5 h-5" /> Profile Settings
                  </button>
                </div>

                <div className="mt-10 pt-8 border-t border-border">
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-4 px-5 py-4 rounded-xl text-base font-bold text-destructive hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" /> Sign Out
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "orders" && (
                <div className="space-y-8">
                  <h3 className="text-3xl font-display mb-8 text-foreground pb-4 border-b border-border">Recent Orders</h3>
                  
                  {ordersLoading ? (
                    <div className="animate-pulse space-y-6">
                      <div className="h-40 bg-card rounded-2xl"></div>
                      <div className="h-40 bg-card rounded-2xl"></div>
                    </div>
                  ) : orders?.length === 0 ? (
                    <div className="bg-card p-16 rounded-2xl text-center soft-shadow">
                      <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
                      <h4 className="text-2xl font-display mb-2">No orders yet</h4>
                      <p className="text-muted-foreground">When you place an order, it will appear here.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders?.map(order => (
                        <div key={order.id} className="bg-card p-8 rounded-2xl soft-shadow border border-border/50">
                          <div className="flex flex-wrap justify-between items-start mb-6 pb-6 border-b border-border gap-4">
                            <div>
                              <div className="text-sm tracking-widest text-muted-foreground uppercase font-bold mb-1">Order #{order.id}</div>
                              <div className="font-medium text-foreground">
                                {order.createdAt ? format(new Date(order.createdAt), "PPP 'at' p") : "Date unknown"}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-display font-bold text-3xl text-primary mb-2">₹{order.total}</div>
                              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                                {order.status.replace(/_/g, ' ')}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-4 mb-6">
                            <h5 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Items</h5>
                            {order.items?.map(item => (
                              <div key={item.id} className="flex justify-between items-center text-base">
                                <span className="font-medium"><span className="text-muted-foreground mr-3">{item.quantity}x</span> {item.menuItem?.name || 'Item'}</span>
                                <span className="font-bold text-foreground/80">₹{item.price}</span>
                              </div>
                            ))}
                          </div>
                          
                          {(order.deliveryAddress) && (
                            <div className="pt-6 border-t border-border flex items-start gap-3">
                              <MapPin className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                              <span className="text-sm text-muted-foreground leading-relaxed">{order.deliveryAddress}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "wishlist" && (
                <div>
                  <h3 className="text-3xl font-display mb-8 text-foreground pb-4 border-b border-border">My Wishlist</h3>
                  
                  {wishlistLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="h-80 bg-card rounded-2xl animate-pulse"></div>
                      <div className="h-80 bg-card rounded-2xl animate-pulse"></div>
                    </div>
                  ) : wishlist?.length === 0 ? (
                    <div className="bg-card p-16 rounded-2xl text-center soft-shadow">
                      <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
                      <h4 className="text-2xl font-display mb-2">Wishlist is empty</h4>
                      <p className="text-muted-foreground">Save your favorite dishes for later by clicking the heart icon.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {wishlist?.map(item => (
                        <MenuItemCard key={item.id} item={item} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "profile" && (
                <div>
                  <h3 className="text-3xl font-display mb-8 text-foreground pb-4 border-b border-border">Profile Information</h3>
                  
                  <div className="bg-card p-10 rounded-2xl max-w-2xl soft-shadow border border-border/50">
                    <div className="space-y-8">
                      <div>
                        <label className="block text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Full Name</label>
                        <div className="text-xl font-medium bg-background px-5 py-4 rounded-lg border border-border">{profile?.name}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Email Address</label>
                        <div className="text-xl font-medium bg-background px-5 py-4 rounded-lg border border-border">{profile?.email}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Account Type</label>
                        <div className="inline-block bg-[#0F2A1D] text-[#F5E9DA] px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm">
                          {profile?.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
