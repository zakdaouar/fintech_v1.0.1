import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { analytics } from "@/utils/analytics";
import { onboardingApi, Region } from "@/utils/onboardingApi";
import { OnboardingLayout } from "./OnboardingLayout";

export default function ComplianceLocale() {
  const navigate = useNavigate();
  const [region, setRegion] = useState<Region>("us");

  const onNext = async () => {
    analytics.track({ name: "region_set", props: { region } });
    await onboardingApi.kycSession({ region });
    navigate("/onboarding/overview");
  };

  return (
    <OnboardingLayout title="Compliance locale" description="Choose your applicable region." stepIndex={10} totalSteps={18} onBack={() => navigate(-1)}>
      <div className="space-y-4">
        <RadioGroup value={region} onValueChange={(v) => setRegion(v as Region)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="us" id="us" />
            <Label htmlFor="us">United States</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="other" />
            <Label htmlFor="other">Other</Label>
          </div>
        </RadioGroup>
        <Button className="w-full" onClick={onNext}>Continue</Button>
      </div>
    </OnboardingLayout>
  );
}
