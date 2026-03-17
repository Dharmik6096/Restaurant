import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useSignup } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

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
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 bg-background relative overflow-hidden">
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="glass-panel p-10 rounded-2xl w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl text-gold-gradient mb-2">Join Kalapi</h1>
          <p className="text-sm text-muted-foreground">Experience luxury vegetarian dining</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Full Name</label>
            <input 
              type="text" required
              value={name} onChange={e => setName(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-md py-3 px-4 focus:outline-none focus:border-primary text-foreground"
            />
          </div>
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
              type="password" required minLength={6}
              value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-md py-3 px-4 focus:outline-none focus:border-primary text-foreground"
            />
          </div>

          <button 
            type="submit" disabled={signupMutation.isPending}
            className="w-full py-3 bg-primary text-primary-foreground rounded-sm font-bold tracking-widest uppercase hover:bg-primary/90 transition-colors disabled:opacity-50 mt-6"
          >
            {signupMutation.isPending ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Already have an account? <Link href="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
