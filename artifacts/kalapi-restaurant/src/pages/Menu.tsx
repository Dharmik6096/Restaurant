import React, { useState } from "react";
import { useGetMenu } from "@workspace/api-client-react";
import { MenuItemCard } from "@/components/MenuItemCard";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";

const CATEGORIES = ["All", "Starters", "Soups", "Main Course", "Pizza & Pasta", "Rice & Dal", "Breads", "Desserts", "Beverages"];

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: menuItems, isLoading, error } = useGetMenu({
    query: {
      queryKey: ["/api/menu", activeCategory, debouncedSearch]
    }
  }, {
    query: {
      category: activeCategory !== "All" ? activeCategory : undefined,
      search: debouncedSearch || undefined
    }
  });

  // Since the hook config above might misalign with the openapi spec strictly depending on how Orval types it,
  // I will do client-side filtering as a bulletproof fallback if the API doesn't filter perfectly.
  const filteredItems = menuItems?.filter(item => {
    const matchCat = activeCategory === "All" || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
                        (item.description && item.description.toLowerCase().includes(debouncedSearch.toLowerCase()));
    return matchCat && matchSearch;
  }) || [];

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl text-gold-gradient mb-4">Our Menu</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our carefully curated selection of royal vegetarian delicacies, prepared with the finest ingredients and boundless passion.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="w-full md:w-auto overflow-x-auto pb-2 flex gap-2 hide-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-5 py-2 rounded-full border text-sm font-medium transition-all ${
                  activeCategory === cat 
                    ? "bg-primary border-primary text-primary-foreground" 
                    : "bg-transparent border-white/10 text-foreground hover:border-primary/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="glass-panel h-80 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 text-destructive">
            Failed to load menu. Please try again later.
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-xl">
            <h3 className="text-xl font-display text-primary mb-2">No dishes found</h3>
            <p className="text-muted-foreground">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, i) => (
              <MenuItemCard key={item.id} item={item} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
