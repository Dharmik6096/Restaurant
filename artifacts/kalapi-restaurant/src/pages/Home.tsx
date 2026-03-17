import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Star, Leaf, Award, Utensils } from "lucide-react";
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
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Kalapi Interior" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0F2A1D]/55 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-[#F5E9DA] mb-6 leading-tight drop-shadow-lg"
          >
            A Royal Vegetarian Dining Experience in Ahmedabad
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-2xl text-[#F5E9DA]/90 font-light mb-12 max-w-3xl mx-auto drop-shadow-md"
          >
            Elevating vegetarian cuisine to an art form, blending earthly traditions with luxurious flavors.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/menu" className="px-10 py-4 bg-primary text-primary-foreground font-semibold tracking-widest uppercase text-sm w-full sm:w-auto hover:bg-[#A8522E] rounded-lg transition-all shadow-lg">
              Explore Menu
            </Link>
            <Link href="/contact" className="px-10 py-4 border-2 border-[#F5E9DA] text-[#F5E9DA] font-semibold tracking-widest uppercase text-sm w-full sm:w-auto hover:bg-[#F5E9DA] hover:text-foreground rounded-lg transition-all shadow-lg backdrop-blur-sm">
              Book a Table
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FEATURED DISHES */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}}>
              <h2 className="text-sm font-sans tracking-[0.3em] text-primary uppercase mb-4 font-semibold">Chef's Signatures</h2>
              <h3 className="font-display text-4xl md:text-5xl text-foreground">Featured Dishes</h3>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { img: "dish-pasta.png", name: "Truffle Stuffed Pasta", desc: "Hand-rolled pasta with wild mushroom duxelles", price: "₹850" },
              { img: "dish-pizza.png", name: "Charcoal Burrata Pizza", desc: "Artisan activated charcoal crust with fresh burrata", price: "₹950" },
              { img: "dish-dal.png", name: "Signature Dal Kalapi", desc: "Slow-cooked over 24 hours with pure ghee", price: "₹650" },
              { img: "dish-dessert.png", name: "The Gold Chocolate", desc: "70% dark chocolate dome with 24k edible gold", price: "₹1200" },
            ].map((dish, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer bg-card rounded-[12px] p-4 soft-shadow hover-lift"
              >
                <div className="aspect-[4/5] overflow-hidden mb-5 rounded-lg relative">
                  <img 
                    src={`${import.meta.env.BASE_URL}images/${dish.img}`} 
                    alt={dish.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-background/90 backdrop-blur px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    <Leaf className="w-3 h-3 text-[#2D6A4F] fill-[#2D6A4F]" />
                    <span className="text-[10px] uppercase tracking-wider font-bold text-foreground">Veg</span>
                  </div>
                </div>
                <div className="px-2">
                  <h4 className="font-display text-xl text-foreground mb-2 group-hover:text-primary transition-colors">{dish.name}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{dish.desc}</p>
                  <p className="font-sans font-bold text-primary text-lg">{dish.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-32 bg-[#0F2A1D] text-[#F5E9DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h3 className="font-display text-4xl md:text-5xl">Our Philosophy</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:0.1}} className="text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-[#F5E9DA]/10 flex items-center justify-center mb-6">
                <Leaf className="w-10 h-10 text-primary" />
              </div>
              <h4 className="font-display text-2xl mb-4">Organic Ingredients</h4>
              <p className="text-[#F5E9DA]/80 leading-relaxed">Sourced directly from local farms, ensuring the freshest, most vibrant flavors while respecting the earth.</p>
            </motion.div>
            <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:0.2}} className="text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-[#F5E9DA]/10 flex items-center justify-center mb-6">
                <Award className="w-10 h-10 text-primary" />
              </div>
              <h4 className="font-display text-2xl mb-4">Premium Experience</h4>
              <p className="text-[#F5E9DA]/80 leading-relaxed">Impeccable service, luxurious ambiance, and attention to every detail to make your visit unforgettable.</p>
            </motion.div>
            <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:0.3}} className="text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-[#F5E9DA]/10 flex items-center justify-center mb-6">
                <Utensils className="w-10 h-10 text-primary" />
              </div>
              <h4 className="font-display text-2xl mb-4">Fusion Cuisine</h4>
              <p className="text-[#F5E9DA]/80 leading-relaxed">Traditional Gujarati roots elegantly intertwined with modern global culinary techniques.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* REVIEWS & TIMES */}
      <section className="py-32 bg-background relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            
            {/* Reviews */}
            <div>
              <div className="flex items-center gap-6 mb-12">
                <div className="text-6xl font-display font-bold text-foreground">4.3</div>
                <div>
                  <div className="flex text-primary mb-2">
                    {[1,2,3,4,5].map(star => <Star key={star} className={`w-6 h-6 ${star === 5 ? 'fill-primary/30' : 'fill-primary'}`} />)}
                  </div>
                  <div className="text-sm font-medium tracking-widest uppercase text-muted-foreground">Guest Reviews</div>
                </div>
              </div>
              
              <div className="space-y-6">
                {[
                  { name: "Rahul Patel", quote: "An absolute masterpiece of flavors. The ambiance is regal and warm." },
                  { name: "Sneha Desai", quote: "The best vegetarian fine dining in Ahmedabad. Hands down." },
                  { name: "Vikram Shah", quote: "Incredible fusion dishes. The presentation is just breathtaking." }
                ].map((review, i) => (
                  <motion.div 
                    key={i}
                    initial={{opacity:0, x:-20}} whileInView={{opacity:1, x:0}} viewport={{once:true}} transition={{delay:i*0.1}}
                    className="bg-card p-8 rounded-[12px] soft-shadow"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-display font-bold text-xl">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <h5 className="font-bold text-foreground">{review.name}</h5>
                        <div className="flex text-primary">
                          {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-current" />)}
                        </div>
                      </div>
                    </div>
                    <p className="italic text-foreground/80 font-serif text-lg">"{review.quote}"</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Popular Times */}
            <div className="flex flex-col justify-center">
              <h3 className="font-display text-4xl mb-4 text-foreground">Plan Your Visit</h3>
              <p className="text-muted-foreground mb-12 text-lg">Discover the perfect time to enjoy our serene atmosphere.</p>
              
              <div className="bg-card p-8 rounded-[12px] soft-shadow h-[400px]">
                <h4 className="text-sm uppercase tracking-widest text-muted-foreground mb-8 font-semibold">Popular Hours</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={popularTimesData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis dataKey="time" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      cursor={{fill: 'var(--color-muted)'}}
                      contentStyle={{ backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: '8px' }}
                    />
                    <Bar dataKey="visitors" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-32 bg-[#0F2A1D] text-center px-4">
        <motion.div initial={{opacity:0, scale:0.95}} whileInView={{opacity:1, scale:1}} viewport={{once:true}}>
          <h2 className="font-display text-5xl md:text-6xl text-[#F5E9DA] mb-8">Reserve Your Table</h2>
          <p className="text-[#F5E9DA]/80 max-w-2xl mx-auto text-xl mb-12 font-light">Join us for an unforgettable culinary journey.</p>
          <Link href="/contact" className="inline-block px-12 py-5 bg-primary text-primary-foreground font-semibold tracking-widest uppercase text-sm rounded-lg hover:bg-[#A8522E] transition-all shadow-lg hover:-translate-y-1">
            Book a Table
          </Link>
        </motion.div>
      </section>

    </div>
  );
}
