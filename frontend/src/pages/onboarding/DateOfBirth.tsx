import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { analytics } from "@/utils/analytics";
import { onboardingApi } from "@/utils/onboardingApi";
import { OnboardingLayout } from "./OnboardingLayout";

export default function DateOfBirth() {
  const navigate = useNavigate();
  const [dob, setDob] = useState("");

  const onNext = async () => {
    await onboardingApi.dob({ dateOfBirth: dob });
    analytics.track({ name: "dob_saved" });
    navigate("/onboarding/idv-intro");
  };

  return (
    <OnboardingLayout title="Date of birth" description="Use the same date as on your ID." stepIndex={8} totalSteps={18} onBack={() => navigate(-1)}>
      <div className="space-y-4">
        <Label htmlFor="dob">Date of birth</Label>
        <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
        <Button className="w-full" onClick={onNext} disabled={!dob}>Continue</Button>
      </div>
    </OnboardingLayout>
  );
}
