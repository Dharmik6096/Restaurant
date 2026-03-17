import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useLogin } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useLogin({
    mutation: {
      onSuccess: (data) => {
        login(data.token, data.user);
        toast({ title: "Welcome back!" });
        setLocation("/");
      },
      onError: (error: any) => {
        toast({ title: "Login Failed", description: error.message || "Invalid credentials", variant: "destructive" });
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ data: { email, password } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24 bg-background relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#0F2A1D]/5 blur-[120px]"></div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card p-12 rounded-[24px] w-full max-w-md relative z-10 soft-shadow border border-border"
      >
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl text-foreground mb-3">Welcome Back</h1>
          <p className="text-lg text-muted-foreground">Sign in to your royal dining account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              type="password" required
              value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-background border border-border rounded-lg py-4 px-5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner"
            />
          </div>

          <button 
            type="submit" disabled={loginMutation.isPending}
            className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-bold tracking-widest uppercase text-lg hover:bg-[#A8522E] shadow-lg hover:-translate-y-1 transition-all disabled:opacity-50 mt-8"
          >
            {loginMutation.isPending ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-10 text-center border-t border-border pt-6">
          <p className="text-base text-muted-foreground">
            Don't have an account? <Link href="/signup" className="text-[#0F2A1D] font-bold hover:underline hover:text-primary transition-colors">Create one</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
