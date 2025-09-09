"use client";

import { useState } from "react";
import { RefundDonorButton } from "@/components/refund-donor-button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RefundPage() {
  const [campaignId, setCampaignId] = useState<number | "">("");

  return (
    <div className="container py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Claim Refund</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="number"
            placeholder="Enter Campaign ID"
            value={campaignId}
            onChange={(e) => setCampaignId(Number(e.target.value) || "")}
          />
          {campaignId !== "" && <RefundDonorButton campaignId={campaignId} />}
        </CardContent>
      </Card>
    </div>
  );
}
