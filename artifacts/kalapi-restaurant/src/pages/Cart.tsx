import React, { useState } from "react";
import { Link } from "wouter";
import { useGetCart, useUpdateCartItem, useRemoveFromCart } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

export default function Cart() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const { data: cartItems, isLoading } = useGetCart({
    query: { enabled: isAuthenticated }
  });

  const updateMutation = useUpdateCartItem({
    mutation: {
      onSettled: () => {
        setUpdatingId(null);
        queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      }
    }
  });

  const removeMutation = useRemoveFromCart({
    mutation: {
      onSuccess: () => {
        toast({ title: "Item removed" });
        queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      }
    }
  });

  const handleUpdateQuantity = (menuItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setUpdatingId(menuItemId);
    updateMutation.mutate({ menuItemId, data: { quantity: newQuantity } });
  };

  const handleRemove = (menuItemId: number) => {
    removeMutation.mutate({ menuItemId });
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-32 pb-24 min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <ShoppingBag className="w-16 h-16 text-primary/50 mb-6" />
        <h2 className="font-display text-3xl mb-4 text-foreground">Sign In to View Cart</h2>
        <p className="text-muted-foreground mb-8 max-w-md">You need to be logged in to manage your order and proceed to checkout.</p>
        <Link href="/login" className="px-8 py-3 bg-primary text-primary-foreground rounded-sm font-semibold uppercase tracking-wider">
          Sign In Now
        </Link>
      </div>
    );
  }

  const subtotal = cartItems?.reduce((sum, item) => sum + (item.quantity * (item.menuItem?.price || 0)), 0) || 0;
  const tax = subtotal * 0.05; // 5% GST
  const total = subtotal + tax;

  return (
    <div className="pt-32 pb-24 min-h-[80vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl text-gold-gradient mb-10">Your Order</h1>

        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-24 bg-white/5 rounded-xl"></div>
            <div className="h-24 bg-white/5 rounded-xl"></div>
          </div>
        ) : !cartItems || cartItems.length === 0 ? (
          <div className="glass-panel rounded-xl p-12 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-display mb-4">Your cart is empty</h3>
            <p className="text-muted-foreground mb-8">Looks like you haven't added any dishes yet.</p>
            <Link href="/menu" className="px-8 py-3 border border-primary text-primary rounded-sm font-semibold uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-colors">
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={item.id} 
                  className="glass-panel p-4 rounded-xl flex gap-4 items-center"
                >
                  <img 
                    src={item.menuItem?.image || `${import.meta.env.BASE_URL}images/dish-pasta.png`} 
                    alt={item.menuItem?.name} 
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">{item.menuItem?.name}</h4>
                    <p className="text-primary font-medium">₹{item.menuItem?.price}</p>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-black/50 border border-white/10 rounded-full px-3 py-1">
                    <button 
                      onClick={() => handleUpdateQuantity(item.menuItemId, item.quantity - 1)}
                      disabled={updatingId === item.menuItemId || item.quantity <= 1}
                      className="text-muted-foreground hover:text-primary disabled:opacity-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => handleUpdateQuantity(item.menuItemId, item.quantity + 1)}
                      disabled={updatingId === item.menuItemId}
                      className="text-muted-foreground hover:text-primary disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => handleRemove(item.menuItemId)}
                    disabled={removeMutation.isPending}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors ml-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="glass-panel p-6 rounded-xl sticky top-32">
                <h3 className="font-display text-xl mb-6 border-b border-white/10 pb-4">Order Summary</h3>
                
                <div className="space-y-4 text-sm mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Taxes (5% GST)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-foreground border-t border-white/10 pt-4">
                    <span>Total</span>
                    <span className="text-primary">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <Link href="/checkout">
                  <button className="w-full py-4 bg-gold-gradient text-primary-foreground rounded-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all">
                    Proceed to Checkout <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
