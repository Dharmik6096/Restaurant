import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingBag, User, LogOut, Menu as MenuIcon, X, Crown, Instagram, Facebook, Twitter } from "lucide-react";
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
          isScrolled ? "bg-background/95 backdrop-blur shadow-sm py-4" : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <span className={`font-display font-bold text-2xl tracking-widest ${isScrolled ? 'text-foreground' : 'text-foreground'} transition-colors`}>
              Kalapi
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.path}
                className={`text-sm tracking-widest uppercase transition-colors relative group font-medium ${
                  location === link.path ? "text-primary" : "text-foreground hover:text-primary"
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 w-full h-[2px] bg-primary transition-transform origin-left ${location === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/cart" className="relative text-foreground hover:text-primary transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                  <User className="w-4 h-4" />
                  <span>{user?.name.split(' ')[0]}</span>
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20 hover:bg-primary/20 transition-colors">
                    <Crown className="w-3 h-3" /> Admin
                  </Link>
                )}
                <button onClick={logout} className="text-foreground hover:text-destructive transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="px-6 py-2.5 text-sm uppercase tracking-wider font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-lg"
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-[72px] left-0 w-full z-40 bg-background/95 backdrop-blur-xl border-b border-border shadow-lg overflow-hidden md:hidden"
          >
            <div className="flex flex-col py-6 px-6 gap-6 text-center text-lg font-display tracking-widest">
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
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-[#0F2A1D] text-[#F5E9DA] py-16 md:py-24 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          <div className="text-center md:text-left">
            <h3 className="font-display text-3xl mb-6">Kalapi</h3>
            <p className="text-[#F5E9DA]/80 text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
              Elevating vegetarian cuisine to an art form. A royal dining experience in the heart of Ahmedabad, bringing earth to table.
            </p>
          </div>
          <div className="text-center md:text-left">
            <h4 className="font-display tracking-widest text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-[#F5E9DA]/80">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/menu" className="hover:text-primary transition-colors">Our Menu</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">Our Story</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Reservations</Link></li>
            </ul>
          </div>
          <div className="text-center md:text-left">
            <h4 className="font-display tracking-widest text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm text-[#F5E9DA]/80">
              <li>123, SG Highway, Ahmedabad, Gujarat 380054</li>
              <li>+91 79 2630 1234</li>
              <li>Mon-Sun: 11am - 11pm</li>
            </ul>
            <div className="flex justify-center md:justify-start gap-4 mt-6">
              <a href="#" className="p-2 rounded-full border border-[#F5E9DA]/20 hover:border-primary hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full border border-[#F5E9DA]/20 hover:border-primary hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full border border-[#F5E9DA]/20 hover:border-primary hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-[#F5E9DA]/10 text-center text-xs text-[#F5E9DA]/60">
          © {new Date().getFullYear()} Kalapi Restaurant. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
