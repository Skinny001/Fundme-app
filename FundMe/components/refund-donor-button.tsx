"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { getFundMeContract } from "@/lib/web3";
import { showTransactionToast } from "@/lib/enhanced-toast";

interface RefundDonorButtonProps {
  campaignId: number;
  onRefundSuccess?: () => void;
}

export function RefundDonorButton({ campaignId, onRefundSuccess }: RefundDonorButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleRefund = async () => {
    try {
      setIsLoading(true);
      const contract = await getFundMeContract();
      const tx = await contract.refundDonor(campaignId);
      showTransactionToast({
        title: "Refund Submitted",
        description: "Your refund request is being processed. Please wait for confirmation.",
      });
      await tx.wait();
      showTransactionToast({
        title: "Refund Successful",
        description: "You have been successfully refunded.",
      });
      onRefundSuccess?.();
    } catch (error: any) {
      showTransactionToast({
        title: "Refund Failed",
        description: error.message || "Failed to process the refund.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleRefund} disabled={isLoading} variant="secondary">
      {isLoading ? "Processing Refund..." : "Claim Refund"}
    </Button>
  );
}
