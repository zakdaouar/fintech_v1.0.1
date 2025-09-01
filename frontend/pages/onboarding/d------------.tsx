import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useNavigate } from 'next/link';
import { analytics } from "@/utils/analytics";
import { onboardingApi } from "@/utils/onboardingApi";
import { OnboardingLayout } from "./OnboardingLayout";
import { Button, Input, Label, OnboardingLayout, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'lucide-react';


function DocumentSetup() {
  const navigate = useRouter();
  const [issuingCountry, setIssuingCountry] = useState("");
  const [documentType, setDocumentType] = useState<"id_card" | "residence_permit" | "passport" | "">("");

  const onNext = async () => {
    if (!issuingCountry || !documentType) return;
    await onboardingApi.kycDocument({ issuingCountry, documentType: documentType as any });
    analytics.track({ name: "doc_setup_saved" });
    router.push("/onboarding/liveness");
  };

  return (
    <OnboardingLayout title="Document setup" description="Select issuing country and document type." stepIndex={12} totalSteps={18} onBack={() => router.push(-1)}>
      <div className="space-y-4">
        <div>
          <Label>Issuing country</Label>
          <Input placeholder="e.g., United States" value={issuingCountry} onChange={(e) => setIssuingCountry(e.target.value)} />
        </div>
        <div>
          <Label>Document type</Label>
          <Select value={documentType} onValueChange={(v) => setDocumentType(v as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="id_card">ID card</SelectItem>
              <SelectItem value="residence_permit">Residence permit</SelectItem>
              <SelectItem value="passport">Passport</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">Prefer your phone? Copy this link to continue later.</div>
        <Button className="w-full" onClick={onNext}>Continue</Button>
      </div>
    </OnboardingLayout>
  );
}

export default dynamic(() => Promise.resolve(DocumentSetup), { ssr: false });