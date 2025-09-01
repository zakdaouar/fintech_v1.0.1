import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from 'next/link';
import { analytics } from "@/utils/analytics";
import { OnboardingLayout } from "./OnboardingLayout";

function LegalName() {
  const navigate = useRouter();
  const [name, setName] = useState("");

  const onNext = () => {
    if (!name.trim()) return;
    analytics.track({ name: "name_confirmed" });
    router.push("/onboarding/contact");
  };

  return (
    <OnboardingLayout title="Legal name" description="Use your  legal name as it appears on your ID." stepIndex={5} totalSteps={18} onBack={() => router.push(-1)}>
      <div className="space-y-4">
        <Label htmlFor="legalName">Full legal name</Label>
        <Input id="legalName" value={name} onChange={(e) => setName(e.target.value)} />
        <Button className="w-full" onClick={onNext}>Continue</Button>
      </div>
    </OnboardingLayout>
  );
}

export default dynamic(() => Promise.resolve(LegalName), { ssr: false });