import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { analytics } from "@/utils/analytics";
import { OnboardingLayout } from "./OnboardingLayout";

export default function LegalName() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const onNext = () => {
    if (!name.trim()) return;
    analytics.track({ name: "name_confirmed" });
    navigate("/onboarding/contact");
  };

  return (
    <OnboardingLayout title="Legal name" description="Use your exact legal name as it appears on your ID." stepIndex={5} totalSteps={18} onBack={() => navigate(-1)}>
      <div className="space-y-4">
        <Label htmlFor="legalName">Full legal name</Label>
        <Input id="legalName" value={name} onChange={(e) => setName(e.target.value)} />
        <Button className="w-full" onClick={onNext}>Continue</Button>
      </div>
    </OnboardingLayout>
  );
}
