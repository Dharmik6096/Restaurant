import React from "react";
import { type MenuItem } from "@workspace/api-client-react";
import { useAddToCart, useToggleWishlist, useGetWishlist } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Heart, Plus, Leaf } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

export function MenuItemCard({ item, index }: { item: MenuItem, index?: number }) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: wishlist } = useGetWishlist({
    query: { enabled: isAuthenticated }
  });

  const isWished = wishlist?.some((w) => w.id === item.id);

  const addToCartMutation = useAddToCart({
    mutation: {
      onSuccess: () => {
        toast({ title: "Added to Cart", description: `${item.name} added successfully.` });
        queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      },
      onError: () => {
        toast({ title: "Error", description: "Could not add to cart. Try logging in.", variant: "destructive" });
      }
    }
  });

  const toggleWishlistMutation = useToggleWishlist({
    mutation: {
      onSuccess: (data) => {
        toast({ title: data.added ? "Added to Wishlist" : "Removed from Wishlist" });
        queryClient.invalidateQueries({ queryKey: ["/api/user/wishlist"] });
      },
      onError: () => {
        toast({ title: "Error", description: "Could not update wishlist.", variant: "destructive" });
      }
    }
  });

  const handleAddToCart = () => {
    if (!isAuthenticated) return toast({ title: "Please login", variant: "destructive" });
    addToCartMutation.mutate({ data: { menuItemId: item.id, quantity: 1 } });
  };

  const handleWishlist = () => {
    if (!isAuthenticated) return toast({ title: "Please login", variant: "destructive" });
    toggleWishlistMutation.mutate({ data: { menuItemId: item.id } });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index ? index * 0.1 : 0, duration: 0.5 }}
      className="bg-card rounded-[12px] overflow-hidden group flex flex-col h-full soft-shadow hover-lift border border-border"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-background">
        <img 
          src={item.image || `${import.meta.env.BASE_URL}images/dish-pasta.png`} 
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {item.isVeg && (
          <div className="absolute top-3 left-3 bg-background/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-border">
            <Leaf className="w-3 h-3 text-[#2D6A4F] fill-[#2D6A4F]" />
            <span className="text-[10px] uppercase tracking-wider font-bold text-foreground">Veg</span>
          </div>
        )}

        <button 
          onClick={handleWishlist}
          disabled={toggleWishlistMutation.isPending}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur transition-all shadow-sm active:scale-95 ${
            isWished 
              ? 'bg-white text-red-500' 
              : 'bg-background/80 text-foreground/50 hover:bg-white hover:text-red-500'
          }`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isWished ? 'filled' : 'empty'}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Heart className={`w-5 h-5 ${isWished ? 'fill-current' : ''}`} />
            </motion.div>
          </AnimatePresence>
        </button>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-3 gap-4">
          <h3 className="font-display font-bold text-xl text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
            {item.name}
          </h3>
          <span className="font-sans font-bold text-primary text-xl shrink-0">₹{item.price}</span>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-8 flex-1 leading-relaxed">
          {item.description || "A signature delicacy crafted with the finest organic ingredients and traditional spices."}
        </p>
        
        <button 
          onClick={handleAddToCart}
          disabled={!item.isAvailable || addToCartMutation.isPending}
          className="w-full py-4 flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground hover:bg-[#A8522E] transition-all duration-300 text-sm tracking-widest uppercase font-bold shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {item.isAvailable ? (
            <>
              {addToCartMutation.isPending ? "Adding..." : "Add to Cart"} <Plus className="w-4 h-4" />
            </>
          ) : "Out of Stock"}
        </button>
      </div>
    </motion.div>
  );
}
