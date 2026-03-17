import React from "react";
import { Link, useRoute } from "wouter";
import { CheckCircle2, Receipt } from "lucide-react";
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
    <div className="pt-32 pb-24 min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-panel p-10 md:p-16 rounded-2xl max-w-lg w-full text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gold-gradient"></div>
        
        <CheckCircle2 className="w-20 h-20 text-primary mx-auto mb-6" />
        <h1 className="font-display text-4xl mb-2 text-foreground">Order Received!</h1>
        <p className="text-muted-foreground mb-8">Thank you for choosing Kalapi. Your order #{orderId} is being processed.</p>

        {order && order.paymentStatus === 'unpaid' && (
          <div className="bg-white/5 border border-primary/20 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-bold mb-2">Complete Your Payment</h3>
            <p className="text-sm text-muted-foreground mb-4">Amount Due: <span className="text-primary font-bold">₹{order.total}</span></p>
            <button 
              onClick={handleMockPayment}
              disabled={paymentMutation.isPending}
              className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-sm hover:bg-primary/90 disabled:opacity-50"
            >
              {paymentMutation.isPending ? "Processing..." : "Pay Now (Mock)"}
            </button>
          </div>
        )}

        {order?.paymentStatus === 'paid' && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl p-4 mb-8 font-medium">
            Payment Completed Successfully
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/dashboard" className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 rounded-sm font-medium hover:bg-white/20 transition-colors">
            <Receipt className="w-4 h-4" /> Track Order
          </Link>
          <Link href="/menu" className="px-6 py-3 border border-primary text-primary rounded-sm font-medium hover:bg-primary/10 transition-colors">
            Back to Menu
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
