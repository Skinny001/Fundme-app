"use client";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { useState } from "react";
import { getFundMeContract } from "@/lib/web3";
import { showTransactionToast } from "@/lib/enhanced-toast";

interface CancelCampaignButtonProps {
  campaignId: number;
  onCancelSuccess?: () => void;
}

export function CancelCampaignButton({ campaignId, onCancelSuccess }: CancelCampaignButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCancel = async () => {
    try {
      setIsLoading(true);
      const contract = await getFundMeContract();
      const tx = await contract.cancelCampaign(campaignId);
      showTransactionToast({
        title: "Cancellation Submitted",
        description: "Your campaign cancellation is being processed. Please wait for confirmation.",
      });
      await tx.wait();
      showTransactionToast({
        title: "Campaign Cancelled",
        description: "The campaign has been successfully cancelled, and all funds have been refunded to donors.",
      });
      onCancelSuccess?.();
    } catch (error: any) {
      showTransactionToast({
        title: "Cancellation Failed",
        description: error.message || "Failed to cancel the campaign.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)} variant="destructive">
        Cancel Campaign
      </Button>
      <ConfirmModal
        isOpen={isModalOpen}
        title="Cancel Campaign"
        description="Are you sure you want to cancel this campaign? All funds will be refunded to the donors."
        onConfirm={handleCancel}
        onCancel={() => setIsModalOpen(false)}
        isLoading={isLoading}
      />
    </>
  );
}
