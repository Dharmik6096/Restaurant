import React, { useState } from "react";
import { useSubmitContact } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", bookingDate: "" });

  const contactMutation = useSubmitContact({
    mutation: {
      onSuccess: () => {
        toast({ title: "Message Sent", description: "We will get back to you shortly." });
        setForm({ name: "", email: "", phone: "", message: "", bookingDate: "" });
      },
      onError: () => toast({ title: "Failed to send", variant: "destructive" })
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate({ data: form });
  };

  return (
    <div className="pt-40 pb-32 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="font-display text-5xl md:text-6xl text-foreground mb-6">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Reach out to reserve your table, inquire about private events, or simply say hello.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form Side */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card p-10 md:p-12 rounded-[24px] soft-shadow"
          >
            <h2 className="text-3xl font-display mb-8 text-foreground">Send an Inquiry</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold tracking-wide text-foreground mb-2 uppercase">Name *</label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} type="text" 
                    className="w-full bg-background border border-border rounded-lg py-4 px-5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner" />
                </div>
                <div>
                  <label className="block text-sm font-bold tracking-wide text-foreground mb-2 uppercase">Email *</label>
                  <input required value={form.email} onChange={e => setForm({...form, email: e.target.value})} type="email" 
                    className="w-full bg-background border border-border rounded-lg py-4 px-5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold tracking-wide text-foreground mb-2 uppercase">Phone</label>
                  <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} type="tel" 
                    className="w-full bg-background border border-border rounded-lg py-4 px-5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner" />
                </div>
                <div>
                  <label className="block text-sm font-bold tracking-wide text-foreground mb-2 uppercase">Preferred Date</label>
                  <input value={form.bookingDate} onChange={e => setForm({...form, bookingDate: e.target.value})} type="date" 
                    className="w-full bg-background border border-border rounded-lg py-4 px-5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold tracking-wide text-foreground mb-2 uppercase">Message *</label>
                <textarea required value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={5} 
                  className="w-full bg-background border border-border rounded-lg py-4 px-5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner resize-none"></textarea>
              </div>
              <button disabled={contactMutation.isPending} type="submit" 
                className="w-full py-5 bg-primary text-primary-foreground font-bold tracking-widest uppercase text-lg rounded-lg hover:bg-[#A8522E] shadow-lg hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0 mt-4">
                {contactMutation.isPending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </motion.div>

          {/* Info Side */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8 flex flex-col"
          >
            <div className="bg-[#0F2A1D] text-[#F5E9DA] p-10 rounded-[24px] shadow-xl flex-1">
              <h2 className="text-3xl font-display mb-10 text-[#F5E9DA]">Restaurant Information</h2>
              
              <div className="space-y-10">
                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                    <MapPin className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2 tracking-wide uppercase">Address</h3>
                    <p className="text-[#F5E9DA]/80 text-lg leading-relaxed">123, SG Highway,<br/>Ahmedabad, Gujarat 380054</p>
                    <a href="https://maps.google.com/?q=Ahmedabad,Gujarat" target="_blank" rel="noreferrer" className="inline-block mt-3 px-5 py-2 bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wider rounded">Get Directions</a>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                    <Phone className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2 tracking-wide uppercase">Reservations</h3>
                    <a href="tel:+917926301234" className="text-[#F5E9DA]/80 text-lg hover:text-primary transition-colors">+91 79 2630 1234</a>
                    <div className="mt-4">
                      <a href="tel:+917926301234" className="inline-block px-5 py-2 bg-[#F5E9DA]/10 border border-[#F5E9DA]/20 text-[#F5E9DA] text-sm font-bold uppercase tracking-wider rounded hover:bg-[#F5E9DA]/20">Call Now</a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                    <Clock className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2 tracking-wide uppercase">Hours</h3>
                    <p className="text-[#F5E9DA]/80 text-lg">Mon-Sun: 11:00 AM - 11:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Embed */}
            <div className="h-64 rounded-[24px] overflow-hidden soft-shadow border border-border">
              <iframe 
                src="https://maps.google.com/maps?q=SG%20Highway,Ahmedabad,Gujarat&t=&z=13&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
