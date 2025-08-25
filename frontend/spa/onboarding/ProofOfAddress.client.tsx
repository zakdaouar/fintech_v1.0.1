import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { analytics } from "@/utils/analytics";
import { onboardingApi } from "@/utils/onboardingApi";
import { OnboardingLayout } from "./OnboardingLayout";

export default function ProofOfAddress() {
  const navigate = useNavigate();
  const [fileName, setFileName] = useState<string>("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    await onboardingApi.poa(file);
    analytics.track({ name: "poa_submitted" });
    navigate("/onboarding/phone-status");
  };

  return (
    <OnboardingLayout title="Proof of address" description="Upload a PDF/JPG/PNG showing your name, address, and date." stepIndex={14} totalSteps={18} onBack={() => navigate(-1)}>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <Label htmlFor="poa">Document</Label>
          <Input id="poa" type="file" accept=".pdf,.jpg,.jpeg,.png" ref={fileRef} onChange={(e) => setFileName(e.target.files?.[0]?.name || "")} />
          {fileName && <p className="text-sm text-muted-foreground mt-1">Selected: {fileName}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={!fileName}>Continue</Button>
      </form>
    </OnboardingLayout>
  );
}
