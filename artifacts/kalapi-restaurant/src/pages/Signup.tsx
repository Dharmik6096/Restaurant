import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useSignup } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Signup() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signupMutation = useSignup({
    mutation: {
      onSuccess: (data) => {
        login(data.token, data.user);
        toast({ title: "Account created successfully!" });
        setLocation("/");
      },
      onError: (error: any) => {
        toast({ title: "Signup Failed", description: error.message || "Could not create account", variant: "destructive" });
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signupMutation.mutate({ data: { name, email, password } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24 bg-background relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#0F2A1D]/5 blur-[120px]"></div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card p-12 rounded-[24px] w-full max-w-md relative z-10 soft-shadow border border-border"
      >
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl text-foreground mb-3">Join Kalapi</h1>
          <p className="text-lg text-muted-foreground">Experience luxury vegetarian dining</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold tracking-wide text-foreground mb-2 uppercase">Full Name</label>
            <input 
              type="text" required
              value={name} onChange={e => setName(e.target.value)}
              className="w-full bg-background border border-border rounded-lg py-4 px-5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner"
            />
          </div>
          <div>
            <label className="block text-sm font-bold tracking-wide text-foreground mb-2 uppercase">Email Address</label>
            <input 
              type="email" required
              value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-background border border-border rounded-lg py-4 px-5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner"
            />
          </div>
          <div>
            <label className="block text-sm font-bold tracking-wide text-foreground mb-2 uppercase">Password</label>
            <input 
              type="password" required minLength={6}
              value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-background border border-border rounded-lg py-4 px-5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner"
            />
          </div>

          <button 
            type="submit" disabled={signupMutation.isPending}
            className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-bold tracking-widest uppercase text-lg hover:bg-[#A8522E] shadow-lg hover:-translate-y-1 transition-all disabled:opacity-50 mt-8"
          >
            {signupMutation.isPending ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-10 text-center border-t border-border pt-6">
          <p className="text-base text-muted-foreground">
            Already have an account? <Link href="/login" className="text-[#0F2A1D] font-bold hover:underline hover:text-primary transition-colors">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
