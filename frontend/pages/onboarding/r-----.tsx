import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useNavigate } from 'next/link';
import { analytics } from "@/utils/analytics";
import { onboardingApi } from "@/utils/onboardingApi";
import { OnboardingLayout } from "./OnboardingLayout";

function Review() {
  const navigate = useRouter();
  const [confirm, setConfirm] = useState(false);

  const onSubmit = async () => {
    if (!confirm) return;
    analytics.track({ name: "review_submitted" });
    const res = await onboardingApi.review();
    if (res.status === "submitted") router.push("/onboarding/submitted");
  };

  return (
    <OnboardingLayout title="Review & submit" description="Check your details and confirm." stepIndex={16} totalSteps={18} onBack={() => router.push(-1)}>
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

export default dynamic(() => Promise.resolve(Review), { ssr: false });