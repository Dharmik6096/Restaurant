import React, { useState } from "react";
import { useLocation } from "wouter";
import { useGetCart, usePlaceOrder, useGetUserProfile } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cartItems, isLoading: cartLoading } = useGetCart({
    query: { enabled: isAuthenticated }
  });
  
  const { data: userProfile } = useGetUserProfile({
    query: { enabled: isAuthenticated }
  });

  const placeOrderMutation = usePlaceOrder({
    mutation: {
      onSuccess: (order) => {
        toast({ title: "Order Placed Successfully!" });
        queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
        queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
        setLocation(`/order-success/${order.id}`);
      },
      onError: (err) => {
        toast({ title: "Checkout Failed", description: err.message, variant: "destructive" });
      }
    }
  });

  const [form, setForm] = useState({
    deliveryName: userProfile?.name || "",
    deliveryPhone: "",
    deliveryAddress: "",
    deliveryPincode: "",
  });

  React.useEffect(() => {
    if (!isAuthenticated) setLocation("/login");
  }, [isAuthenticated, setLocation]);

  if (cartLoading) return <div className="pt-40 min-h-screen text-center font-display text-2xl">Loading checkout...</div>;
  if (!cartItems?.length) {
    setLocation("/cart");
    return null;
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.quantity * (item.menuItem?.price || 0)), 0);
  const total = subtotal + (subtotal * 0.05);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.deliveryName || !form.deliveryPhone || !form.deliveryAddress) {
      return toast({ title: "Please fill all required fields", variant: "destructive" });
    }
    
    placeOrderMutation.mutate({
      data: {
        ...form,
      }
    });
  };

  return (
    <div className="pt-40 pb-32 min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h1 className="font-display text-5xl text-foreground mb-16 text-center">Secure Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="bg-card p-10 rounded-2xl soft-shadow">
              <h2 className="text-3xl font-display mb-8 text-foreground border-b border-border pb-4">Delivery Details</h2>
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold tracking-wide text-foreground mb-2 uppercase">Full Name *</label>
                  <input 
                    type="text" required
                    value={form.deliveryName}
                    onChange={e => setForm({...form, deliveryName: e.target.value})}
                    className="w-full bg-background border border-border rounded-lg py-4 px-5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold tracking-wide text-foreground mb-2 uppercase">Phone Number *</label>
                  <input 
                    type="tel" required
                    value={form.deliveryPhone}
                    onChange={e => setForm({...form, deliveryPhone: e.target.value})}
                    className="w-full bg-background border border-border rounded-lg py-4 px-5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold tracking-wide text-foreground mb-2 uppercase">Complete Address *</label>
                  <textarea 
                    required rows={3}
                    value={form.deliveryAddress}
                    onChange={e => setForm({...form, deliveryAddress: e.target.value})}
                    className="w-full bg-background border border-border rounded-lg py-4 px-5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold tracking-wide text-foreground mb-2 uppercase">Pincode</label>
                    <input 
                      type="text" 
                      value={form.deliveryPincode}
                      onChange={e => setForm({...form, deliveryPincode: e.target.value})}
                      className="w-full bg-background border border-border rounded-lg py-4 px-5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold tracking-wide text-foreground mb-2 uppercase">Coupon Code</label>
                    <input 
                      type="text" 
                      placeholder="Optional"
                      className="w-full bg-transparent border-2 border-primary/30 border-dashed rounded-lg py-4 px-5 text-foreground focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>
              </form>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="bg-card p-10 rounded-2xl sticky top-32 soft-shadow">
              <h2 className="text-3xl font-display mb-8 text-foreground border-b border-border pb-4">Order Summary</h2>
              
              <div className="space-y-5 mb-8 max-h-80 overflow-y-auto pr-4 custom-scrollbar">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-background p-4 rounded-xl shadow-sm">
                    <div className="flex items-center gap-4">
                      <span className="bg-muted text-muted-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                        {item.quantity}
                      </span>
                      <span className="font-medium text-foreground">{item.menuItem?.name}</span>
                    </div>
                    <span className="font-bold text-primary">₹{(item.quantity * (item.menuItem?.price || 0)).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="bg-background p-6 rounded-xl shadow-inner mb-8">
                <div className="space-y-3">
                  <div className="flex justify-between text-base text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-medium text-foreground">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base text-muted-foreground">
                    <span>Taxes (5% GST)</span>
                    <span className="font-medium text-foreground">₹{(subtotal * 0.05).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-2xl font-display font-bold text-foreground pt-4 mt-2 border-t border-border">
                    <span>Total Payable</span>
                    <span className="text-primary">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button 
                type="submit" form="checkout-form"
                disabled={placeOrderMutation.isPending}
                className="w-full py-5 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-lg rounded-lg hover:bg-[#A8522E] transition-all shadow-lg hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {placeOrderMutation.isPending ? "Processing..." : "Place Order"}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
