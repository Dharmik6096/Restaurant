import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useLogin } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

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
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 bg-background relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="glass-panel p-10 rounded-2xl w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl text-gold-gradient mb-2">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">Sign in to access your royal dining account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Email Address</label>
            <input 
              type="email" required
              value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-md py-3 px-4 focus:outline-none focus:border-primary text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Password</label>
            <input 
              type="password" required
              value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-md py-3 px-4 focus:outline-none focus:border-primary text-foreground"
            />
          </div>

          <button 
            type="submit" disabled={loginMutation.isPending}
            className="w-full py-3 bg-primary text-primary-foreground rounded-sm font-bold tracking-widest uppercase hover:bg-primary/90 transition-colors disabled:opacity-50 mt-4"
          >
            {loginMutation.isPending ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Don't have an account? <Link href="/signup" className="text-primary hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
