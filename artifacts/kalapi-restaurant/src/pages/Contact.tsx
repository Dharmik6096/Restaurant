import React, { useState } from "react";
import { useSubmitContact } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

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
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl text-gold-gradient mb-6">Contact Us</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Book a table or reach out for private events and catering inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-10">
            <div className="glass-panel p-8 rounded-xl space-y-8">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Visit Us</h3>
                  <p className="text-muted-foreground">123 Luxury Avenue, SG Highway<br/>Ahmedabad, Gujarat 380015</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Call Us</h3>
                  <p className="text-muted-foreground">+91 98765 43210<br/>+91 98765 01234</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Email</h3>
                  <p className="text-muted-foreground">reservations@kalapi.com<br/>info@kalapi.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Opening Hours</h3>
                  <p className="text-muted-foreground">Mon-Fri: 12:00 PM - 11:00 PM<br/>Sat-Sun: 11:00 AM - 11:30 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-xl">
            <h2 className="text-2xl font-display mb-6 border-b border-white/10 pb-4">Send an Inquiry</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Name *</label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} type="text" className="w-full bg-black/50 border border-white/10 rounded-md py-3 px-4 focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Email *</label>
                  <input required value={form.email} onChange={e => setForm({...form, email: e.target.value})} type="email" className="w-full bg-black/50 border border-white/10 rounded-md py-3 px-4 focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Phone</label>
                  <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} type="tel" className="w-full bg-black/50 border border-white/10 rounded-md py-3 px-4 focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Preferred Date (Optional)</label>
                  <input value={form.bookingDate} onChange={e => setForm({...form, bookingDate: e.target.value})} type="date" className="w-full bg-black/50 border border-white/10 rounded-md py-3 px-4 focus:outline-none focus:border-primary text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Message *</label>
                <textarea required value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={4} className="w-full bg-black/50 border border-white/10 rounded-md py-3 px-4 focus:outline-none focus:border-primary"></textarea>
              </div>
              <button disabled={contactMutation.isPending} type="submit" className="w-full py-4 bg-gold-gradient text-primary-foreground font-bold tracking-widest uppercase rounded-sm hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all disabled:opacity-50">
                {contactMutation.isPending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
