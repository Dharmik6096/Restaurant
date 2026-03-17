import React from "react";
import { type MenuItem } from "@workspace/api-client-react";
import { useAddToCart, useToggleWishlist, useGetWishlist } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Heart, Plus, Leaf } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";

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
      className="glass-panel rounded-xl overflow-hidden group flex flex-col h-full hover-glow"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img 
          src={item.image || `${import.meta.env.BASE_URL}images/dish-pasta.png`} 
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 bg-background/80 backdrop-blur px-2 py-1 rounded-sm border border-white/10 flex items-center gap-1.5">
          {item.isVeg && <Leaf className="w-3 h-3 text-green-500 fill-green-500" />}
          <span className="text-[10px] uppercase tracking-wider font-semibold text-foreground/80">
            {item.category}
          </span>
        </div>
        <button 
          onClick={handleWishlist}
          disabled={toggleWishlistMutation.isPending}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur transition-all ${
            isWished ? 'bg-primary/20 text-primary' : 'bg-black/40 text-white hover:bg-primary/40 hover:text-primary'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWished ? 'fill-primary' : ''}`} />
        </button>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {item.name}
          </h3>
          <span className="font-sans font-semibold text-primary">₹{item.price}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1">
          {item.description || "A signature delicacy crafted with the finest ingredients."}
        </p>
        
        <button 
          onClick={handleAddToCart}
          disabled={!item.isAvailable || addToCartMutation.isPending}
          className="w-full py-3 flex items-center justify-center gap-2 rounded-sm bg-white/5 border border-white/10 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 text-sm tracking-wider font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {item.isAvailable ? (
            <>
              {addToCartMutation.isPending ? "Adding..." : "Add to Order"} <Plus className="w-4 h-4" />
            </>
          ) : "Out of Stock"}
        </button>
      </div>
    </motion.div>
  );
}
