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
      <div className="pt-40 pb-32 min-h-[80vh] flex flex-col items-center justify-center text-center px-4 bg-background">
        <ShoppingBag className="w-20 h-20 text-muted-foreground/50 mb-8" />
        <h2 className="font-display text-4xl mb-6 text-foreground">Sign In to View Cart</h2>
        <p className="text-muted-foreground text-lg mb-10 max-w-md leading-relaxed">You need to be logged in to manage your order and proceed to checkout.</p>
        <Link href="/login" className="px-10 py-4 bg-primary text-primary-foreground rounded-lg font-semibold uppercase tracking-wider shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
          Sign In Now
        </Link>
      </div>
    );
  }

  const subtotal = cartItems?.reduce((sum, item) => sum + (item.quantity * (item.menuItem?.price || 0)), 0) || 0;
  const tax = subtotal * 0.05; // 5% GST
  const total = subtotal + tax;

  return (
    <div className="pt-40 pb-32 min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-5xl text-foreground mb-12">Your Order</h1>

        {isLoading ? (
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-card rounded-xl"></div>
            <div className="h-32 bg-card rounded-xl"></div>
          </div>
        ) : !cartItems || cartItems.length === 0 ? (
          <div className="bg-card rounded-2xl p-16 text-center soft-shadow">
            <div className="w-24 h-24 bg-background rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <ShoppingBag className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-3xl font-display mb-4 text-foreground">Your cart is empty</h3>
            <p className="text-muted-foreground text-lg mb-10">Looks like you haven't added any dishes yet.</p>
            <Link href="/menu" className="px-10 py-4 bg-primary text-primary-foreground rounded-lg font-semibold uppercase tracking-wider hover:bg-[#A8522E] transition-colors inline-block shadow-md">
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={item.id} 
                  className="bg-card p-5 rounded-2xl flex gap-6 items-center soft-shadow"
                >
                  <img 
                    src={item.menuItem?.image || `${import.meta.env.BASE_URL}images/dish-pasta.png`} 
                    alt={item.menuItem?.name} 
                    className="w-28 h-28 object-cover rounded-xl shadow-sm"
                  />
                  <div className="flex-1">
                    <h4 className="font-display font-bold text-2xl text-foreground mb-1">{item.menuItem?.name}</h4>
                    <p className="text-primary font-bold text-lg">₹{item.menuItem?.price}</p>
                  </div>
                  
                  <div className="flex items-center gap-4 bg-background rounded-full px-2 py-1.5 shadow-inner">
                    <button 
                      onClick={() => handleUpdateQuantity(item.menuItemId, item.quantity - 1)}
                      disabled={updatingId === item.menuItemId || item.quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center rounded-full text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-6 text-center text-lg font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => handleUpdateQuantity(item.menuItemId, item.quantity + 1)}
                      disabled={updatingId === item.menuItemId}
                      className="w-8 h-8 flex items-center justify-center rounded-full text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => handleRemove(item.menuItemId)}
                    disabled={removeMutation.isPending}
                    className="p-3 text-muted-foreground hover:bg-red-50 hover:text-destructive rounded-full transition-colors ml-2"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-[#0F2A1D] text-[#F5E9DA] p-8 rounded-2xl sticky top-32 shadow-xl">
                <h3 className="font-display text-2xl mb-8 border-b border-[#F5E9DA]/10 pb-6">Order Summary</h3>
                
                <div className="space-y-5 text-base mb-8">
                  <div className="flex justify-between text-[#F5E9DA]/80">
                    <span>Subtotal</span>
                    <span className="font-medium text-[#F5E9DA]">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#F5E9DA]/80">
                    <span>Taxes (5% GST)</span>
                    <span className="font-medium text-[#F5E9DA]">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-2xl font-display font-bold border-t border-[#F5E9DA]/10 pt-6 mt-6">
                    <span>Total</span>
                    <span className="text-primary">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <Link href="/checkout">
                  <button className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#A8522E] transition-all shadow-lg hover:-translate-y-1">
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
