import React from "react";
import { Link, useRoute } from "wouter";
import { CheckCircle2, Receipt, Home } from "lucide-react";
import { useProcessPayment, useGetUserOrders } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";

export default function OrderSuccess() {
  const [, params] = useRoute("/order-success/:id");
  const orderId = Number(params?.id);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders } = useGetUserOrders();
  const order = orders?.find(o => o.id === orderId);

  const paymentMutation = useProcessPayment({
    mutation: {
      onSuccess: () => {
        toast({ title: "Payment Successful!" });
        queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      }
    }
  });

  const handleMockPayment = () => {
    paymentMutation.mutate({
      id: orderId,
      data: {
        razorpayPaymentId: `mock_pay_${Math.random().toString(36).substring(7)}`,
      }
    });
  };

  if (!orderId) return null;

  return (
    <div className="pt-40 pb-32 min-h-screen flex items-center justify-center px-4 bg-background">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-card p-10 md:p-16 rounded-2xl max-w-2xl w-full text-center relative overflow-hidden soft-shadow"
      >
        <div className="absolute top-0 left-0 w-full h-3 bg-primary"></div>
        
        <div className="w-24 h-24 bg-[#2D6A4F]/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-12 h-12 text-[#2D6A4F]" />
        </div>
        
        <h1 className="font-display text-5xl mb-4 text-foreground">Order Placed Successfully!</h1>
        <p className="text-muted-foreground text-lg mb-12">Thank you for choosing Kalapi. Your royal feast is being prepared.</p>

        <div className="bg-background rounded-xl p-8 mb-10 text-left border border-border shadow-inner">
          <div className="flex justify-between items-center mb-6 pb-6 border-b border-border">
            <div>
              <p className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-1">Order Number</p>
              <p className="font-display text-2xl text-foreground">#{orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-1">Total Amount</p>
              <p className="font-bold text-2xl text-primary">₹{order?.total}</p>
            </div>
          </div>
          
          {order && order.paymentStatus === 'unpaid' && (
            <div className="bg-[#0F2A1D] rounded-xl p-6 text-center text-[#F5E9DA]">
              <h3 className="text-xl font-display mb-2">Complete Your Payment</h3>
              <p className="text-[#F5E9DA]/70 mb-6">Securely pay for your order to confirm.</p>
              <button 
                onClick={handleMockPayment}
                disabled={paymentMutation.isPending}
                className="w-full py-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest rounded-lg hover:bg-[#A8522E] transition-all shadow-lg hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {paymentMutation.isPending ? "Processing..." : "Pay Now (Mock)"}
              </button>
            </div>
          )}

          {order?.paymentStatus === 'paid' && (
            <div className="bg-[#2D6A4F]/10 border border-[#2D6A4F]/20 text-[#2D6A4F] rounded-xl p-5 text-center font-bold text-lg flex items-center justify-center gap-3">
              <CheckCircle2 className="w-6 h-6" /> Payment Completed Successfully
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link href="/dashboard" className="flex items-center justify-center gap-3 px-8 py-4 bg-foreground text-background font-semibold uppercase tracking-wider rounded-lg hover:bg-foreground/90 transition-all">
            <Receipt className="w-5 h-5" /> Track Order
          </Link>
          <Link href="/" className="flex items-center justify-center gap-3 px-8 py-4 border-2 border-primary text-primary font-semibold uppercase tracking-wider rounded-lg hover:bg-primary/10 transition-all">
            <Home className="w-5 h-5" /> Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
