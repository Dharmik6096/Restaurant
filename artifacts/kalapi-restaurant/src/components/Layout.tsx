import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingBag, User, LogOut, Menu as MenuIcon, X, Crown } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useGetCart } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  
  const { data: cartItems } = useGetCart({
    query: { enabled: isAuthenticated }
  });

  const cartCount = cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? "glass py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img 
              src={`${import.meta.env.BASE_URL}images/logo.png`} 
              alt="Kalapi Logo" 
              className="w-10 h-10 object-contain rounded-full border border-primary/30 group-hover:border-primary transition-colors"
            />
            <span className="font-display font-bold text-xl tracking-widest text-gold-gradient uppercase">
              Kalapi
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.path}
                className={`text-sm tracking-widest uppercase transition-colors hover:text-primary ${
                  location === link.path ? "text-primary font-medium" : "text-foreground/80"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-5">
            <Link href="/cart" className="relative text-foreground/80 hover:text-primary transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors">
                  <User className="w-4 h-4" />
                  <span>{user?.name.split(' ')[0]}</span>
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20 hover:bg-primary/20 transition-colors">
                    <Crown className="w-3 h-3" /> Admin
                  </Link>
                )}
                <button onClick={logout} className="text-muted-foreground hover:text-destructive transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="px-5 py-2 text-sm uppercase tracking-wider border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-sm"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden text-foreground p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <MenuIcon />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-24 px-6 flex flex-col"
          >
            <div className="flex flex-col gap-6 text-center text-lg font-display tracking-widest">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.path}
                  className={`uppercase ${location === link.path ? "text-primary" : "text-foreground"}`}
                >
                  {link.name}
                </Link>
              ))}
              <Link href="/cart" className="uppercase text-foreground flex items-center justify-center gap-2">
                Cart {cartCount > 0 && <span className="text-primary">({cartCount})</span>}
              </Link>
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="uppercase text-foreground">Dashboard</Link>
                  {isAdmin && <Link href="/admin" className="uppercase text-primary">Admin Panel</Link>}
                  <button onClick={logout} className="uppercase text-destructive mt-4">Sign Out</button>
                </>
              ) : (
                <Link href="/login" className="uppercase text-primary mt-4">Sign In</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-[#050505] border-t border-white/5 py-12 md:py-20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          <div className="col-span-1 md:col-span-1">
            <h3 className="font-display text-2xl text-gold-gradient mb-6">KALAPI</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Elevating vegetarian cuisine to an art form. A royal dining experience in the heart of Ahmedabad.
            </p>
          </div>
          <div>
            <h4 className="font-display tracking-widest text-sm text-foreground mb-6 uppercase">Links</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/menu" className="hover:text-primary transition-colors">Menu</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">Our Story</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display tracking-widest text-sm text-foreground mb-6 uppercase">Contact</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>123 Luxury Avenue, SG Highway</li>
              <li>Ahmedabad, Gujarat 380015</li>
              <li>+91 98765 43210</li>
              <li>reservations@kalapi.com</li>
            </ul>
          </div>
          <div>
            <h4 className="font-display tracking-widest text-sm text-foreground mb-6 uppercase">Hours</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>Mon - Fri: 12:00 PM - 11:00 PM</li>
              <li>Sat - Sun: 11:00 AM - 11:30 PM</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-white/5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Kalapi Restaurant. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
