import React from "react";

export default function About() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl text-gold-gradient mb-6">Our Story</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Kalapi was born from a vision to redefine vegetarian fine dining in Ahmedabad. 
            We blend traditional royal heritage with modern culinary techniques.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-primary/10">
            <img 
              src={`${import.meta.env.BASE_URL}images/ambiance.png`} 
              alt="Kalapi Ambiance" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-6">
            <h2 className="font-display text-3xl text-foreground">The Essence of Royalty</h2>
            <p className="text-muted-foreground leading-relaxed">
              Every dish at Kalapi is a testament to India's rich culinary heritage, 
              reimagined for the contemporary palate. Our master chefs handpick the 
              finest organic produce, rare spices, and artisanal ingredients to 
              craft flavors that linger in your memory.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The ambiance reflects the grandeur of Gujarat's palatial history, 
              designed to offer an intimate, luxurious, and unforgettable dining 
              experience.
            </p>
            <div className="pt-4 border-t border-white/10">
              <p className="font-display text-xl text-primary">"Food is not just nourishment, it is an art."</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
