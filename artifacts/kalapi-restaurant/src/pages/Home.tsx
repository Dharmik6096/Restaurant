import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Star, ChevronRight, Clock, MapPin, Phone } from "lucide-react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const popularTimesData = [
  { time: "12 PM", visitors: 30 },
  { time: "2 PM", visitors: 80 },
  { time: "4 PM", visitors: 20 },
  { time: "6 PM", visitors: 40 },
  { time: "8 PM", visitors: 100 },
  { time: "10 PM", visitors: 85 },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* HERO SECTION */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Kalapi Interior" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-gold-gradient mb-6 leading-tight"
          >
            A Royal Dining <br/>Experience
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-foreground/80 font-light mb-10 max-w-2xl mx-auto"
          >
            Elevating vegetarian cuisine to an art form in the heart of Ahmedabad. 
            Immerse yourself in unparalleled luxury and flavors.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/menu" className="px-8 py-4 bg-gold-gradient text-primary-foreground font-semibold tracking-widest uppercase text-sm w-full sm:w-auto hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all">
              Explore Menu
            </Link>
            <Link href="/contact" className="px-8 py-4 border border-primary text-primary font-semibold tracking-widest uppercase text-sm w-full sm:w-auto hover:bg-primary/10 transition-all">
              Book a Table
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FEATURED DISHES */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-sans tracking-[0.3em] text-primary uppercase mb-3">Chef's Signatures</h2>
            <h3 className="font-display text-4xl md:text-5xl text-foreground">Culinary Masterpieces</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { img: "dish-pasta.png", name: "Truffle Stuffed Pasta", desc: "Hand-rolled pasta with wild mushroom duxelles" },
              { img: "dish-pizza.png", name: "Charcoal Burrata Pizza", desc: "Artisan activated charcoal crust with fresh burrata" },
              { img: "dish-dal.png", name: "Signature Dal Kalapi", desc: "Slow-cooked over 24 hours with pure ghee" },
              { img: "dish-dessert.png", name: "The Gold Chocolate", desc: "70% dark chocolate dome with 24k edible gold" },
            ].map((dish, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[4/5] overflow-hidden mb-4 rounded-sm">
                  <img 
                    src={`${import.meta.env.BASE_URL}images/${dish.img}`} 
                    alt={dish.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h4 className="font-display text-xl text-primary mb-2">{dish.name}</h4>
                <p className="text-sm text-muted-foreground">{dish.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INFO & REVIEWS */}
      <section className="py-24 bg-card border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
          
          {/* Reviews */}
          <div>
            <h3 className="font-display text-3xl mb-8">What Our Guests Say</h3>
            <div className="glass-panel p-8 rounded-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-5xl font-display font-bold text-gold-gradient">4.8</div>
                <div>
                  <div className="flex text-primary mb-1">
                    {[1,2,3,4,5].map(star => <Star key={star} className="w-5 h-5 fill-current" />)}
                  </div>
                  <div className="text-sm text-muted-foreground">Based on 1,240+ reviews</div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="border-t border-white/10 pt-6">
                  <p className="italic text-foreground/90 mb-4">"Absolutely stunning experience. The charcoal pizza was a revelation, and the ambiance makes you feel like royalty."</p>
                  <div className="text-sm font-semibold text-primary">- Anjali Desai</div>
                </div>
              </div>
              <Link href="/about" className="inline-flex items-center gap-2 text-sm text-primary mt-6 hover:underline">
                Read our story <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Popular Times */}
          <div className="flex flex-col justify-center">
            <h3 className="font-display text-3xl mb-8">Plan Your Visit</h3>
            <div className="glass-panel p-8 rounded-xl h-[300px]">
              <h4 className="text-sm uppercase tracking-widest text-muted-foreground mb-6">Popular Times</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={popularTimesData}>
                  <XAxis dataKey="time" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: 'rgba(212,175,55,0.1)'}}
                    contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(212,175,55,0.2)' }}
                  />
                  <Bar dataKey="visitors" fill="hsl(46 65% 52%)" radius={[4, 4, 0, 0]} opacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </section>

      {/* QUICK INFO */}
      <section className="py-16 bg-background">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8 divide-y md:divide-y-0 md:divide-x divide-white/10">
          <div className="flex items-center gap-4 flex-1 justify-center py-4">
            <MapPin className="w-8 h-8 text-primary" />
            <div>
              <h4 className="font-bold text-foreground">Location</h4>
              <p className="text-sm text-muted-foreground">SG Highway, Ahmedabad</p>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-1 justify-center py-4">
            <Clock className="w-8 h-8 text-primary" />
            <div>
              <h4 className="font-bold text-foreground">Open Daily</h4>
              <p className="text-sm text-muted-foreground">11:00 AM - 11:30 PM</p>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-1 justify-center py-4">
            <Phone className="w-8 h-8 text-primary" />
            <div>
              <h4 className="font-bold text-foreground">Reservations</h4>
              <p className="text-sm text-muted-foreground">+91 98765 43210</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
