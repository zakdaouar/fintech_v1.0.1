import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { analytics } from "@/utils/analytics";
import { onboardingApi } from "@/utils/onboardingApi";
import { OnboardingLayout } from "./OnboardingLayout";

export default function Review() {
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);

  const onSubmit = async () => {
    if (!confirm) return;
    analytics.track({ name: "review_submitted" });
    const res = await onboardingApi.review();
    if (res.status === "submitted") navigate("/onboarding/submitted");
  };

  return (
    <OnboardingLayout title="Review & submit" description="Check your details and confirm." stepIndex={16} totalSteps={18} onBack={() => navigate(-1)}>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="confirm" checked={confirm} onCheckedChange={(v) => setConfirm(Boolean(v))} />
          <label htmlFor="confirm" className="text-sm leading-none">I confirm the information is accurate.</label>
        </div>
        <Button className="w-full" onClick={onSubmit} disabled={!confirm}>Submit</Button>
      </div>
    </OnboardingLayout>
  );
}
