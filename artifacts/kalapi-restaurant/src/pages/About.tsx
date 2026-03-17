import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Leaf, Award, Utensils, Heart } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      
      {/* SECTION 1: HERO */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/ambiance.png`} 
            alt="Kalapi Ambiance" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0F2A1D]/70 mix-blend-multiply"></div>
        </div>
        <div className="relative z-10 text-center px-4 mt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-6xl md:text-8xl text-[#F5E9DA] mb-6 drop-shadow-lg"
          >
            Our Story
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-[#F5E9DA]/90 max-w-2xl mx-auto font-light tracking-wide"
          >
            A journey of flavors, heritage, and uncompromising luxury.
          </motion.p>
        </div>
      </section>

      {/* SECTION 2: PHILOSOPHY */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[24px] overflow-hidden soft-shadow relative z-10">
                <img 
                  src={`${import.meta.env.BASE_URL}images/about-thali.png`} 
                  alt="Traditional Thali" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-full h-full bg-[#0F2A1D] rounded-[24px] z-0"></div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="font-display text-5xl text-foreground">Our Philosophy</h2>
              <div className="w-20 h-1 bg-primary"></div>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Kalapi was born from a profound respect for India's culinary heritage and a vision to elevate vegetarian dining to unprecedented heights.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe that true luxury lies in nature. Our master chefs curate seasonal, organic produce to craft authentic Gujarati fusion that resonates with both soul and palate. Every dish is a story, every spice a memory.
              </p>
              <div className="pt-8 border-t border-border">
                <p className="font-display text-2xl text-primary italic">
                  "Honoring the earth, celebrating the harvest."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3: THE EXPERIENCE (Image overlay) */}
      <section className="relative py-40 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Dining Experience" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-5xl md:text-6xl text-[#F5E9DA] mb-8">The Dining Experience</h2>
          <p className="text-2xl text-[#F5E9DA]/80 leading-relaxed font-light">
            Step into a world where earthy warmth meets majestic elegance. 
            The ambiance at Kalapi is designed to transport you, 
            offering an intimate sanctuary right in the bustling heart of Ahmedabad.
          </p>
        </div>
      </section>

      {/* SECTION 4: VALUES */}
      <section className="py-32 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-display text-5xl text-foreground">What Defines Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { icon: Leaf, title: "100% Vegetarian", desc: "Pure, plant-based creations celebrating nature's bounty." },
              { icon: Award, title: "Artisanal Quality", desc: "Hand-crafted techniques and zero-compromise ingredients." },
              { icon: Heart, title: "Heartfelt Service", desc: "Hospitality that anticipates your every need." },
              { icon: Utensils, title: "Culinary Innovation", desc: "Pushing boundaries while respecting traditional roots." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-background p-10 rounded-2xl text-center soft-shadow"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-2xl mb-4 font-bold text-foreground">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-background text-center px-4">
        <h2 className="font-display text-5xl text-foreground mb-10">Be Part of Our Story</h2>
        <Link href="/contact" className="inline-block px-12 py-5 bg-primary text-primary-foreground font-bold tracking-widest uppercase text-lg rounded-lg hover:bg-[#A8522E] transition-all shadow-lg hover:-translate-y-1">
          Reserve Your Table
        </Link>
      </section>

    </div>
  );
}
