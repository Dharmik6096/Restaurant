import React, { useState } from "react";
import { useGetMenu } from "@workspace/api-client-react";
import { MenuItemCard } from "@/components/MenuItemCard";
import { Search } from "lucide-react";
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

  const filteredItems = menuItems?.filter(item => {
    const matchCat = activeCategory === "All" || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
                        (item.description && item.description.toLowerCase().includes(debouncedSearch.toLowerCase()));
    return matchCat && matchSearch;
  }) || [];

  return (
    <div className="pt-40 pb-32 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-5xl md:text-6xl text-foreground mb-6">Our Menu</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Discover our carefully curated selection of royal vegetarian delicacies, prepared with organic ingredients and boundless passion.
          </p>
        </motion.div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
          <div className="w-full md:w-auto overflow-x-auto pb-4 flex gap-3 hide-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full border-2 text-sm font-semibold tracking-wide transition-all ${
                  activeCategory === cat 
                    ? "bg-primary border-primary text-primary-foreground shadow-md" 
                    : "bg-transparent border-foreground text-foreground hover:bg-foreground/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card border-none shadow-[0_4px_20px_rgba(15,42,29,0.05)] rounded-full py-3.5 pl-12 pr-6 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="bg-card h-96 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-24 text-destructive bg-card rounded-xl soft-shadow">
            <p className="text-lg font-medium">Failed to load menu. Please try again later.</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-24 bg-card rounded-xl soft-shadow">
            <h3 className="text-2xl font-display text-foreground mb-3">No dishes found</h3>
            <p className="text-muted-foreground text-lg">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredItems.map((item, i) => (
              <MenuItemCard key={item.id} item={item} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
