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

  if (cartLoading) return <div className="pt-32 min-h-screen text-center">Loading...</div>;
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
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="font-display text-4xl text-gold-gradient mb-10 text-center">Secure Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="glass-panel p-8 rounded-xl">
              <h2 className="text-xl font-display mb-6 border-b border-white/10 pb-2">Delivery Details</h2>
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Full Name *</label>
                  <input 
                    type="text" required
                    value={form.deliveryName}
                    onChange={e => setForm({...form, deliveryName: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-md py-3 px-4 focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Phone Number *</label>
                  <input 
                    type="tel" required
                    value={form.deliveryPhone}
                    onChange={e => setForm({...form, deliveryPhone: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-md py-3 px-4 focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Complete Address *</label>
                  <textarea 
                    required rows={3}
                    value={form.deliveryAddress}
                    onChange={e => setForm({...form, deliveryAddress: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-md py-3 px-4 focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Pincode</label>
                  <input 
                    type="text" 
                    value={form.deliveryPincode}
                    onChange={e => setForm({...form, deliveryPincode: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-md py-3 px-4 focus:outline-none focus:border-primary"
                  />
                </div>
              </form>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="glass-panel p-8 rounded-xl sticky top-32">
              <h2 className="text-xl font-display mb-6 border-b border-white/10 pb-2">Order Summary</h2>
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-foreground/80">{item.quantity}x {item.menuItem?.name}</span>
                    <span className="font-medium">₹{(item.quantity * (item.menuItem?.price || 0)).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-white/10 pt-4 space-y-2 mb-8">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Taxes (5%)</span>
                  <span>₹{(subtotal * 0.05).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-primary mt-2 pt-2 border-t border-white/5">
                  <span>Total Payable</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                type="submit" form="checkout-form"
                disabled={placeOrderMutation.isPending}
                className="w-full py-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest rounded-sm hover:bg-primary/90 transition-all disabled:opacity-50"
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
