import dynamic from 'next/dynamic';
import { useState } from 'react';


function ComplianceLocale() {
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
export default dynamic(() => Promise.resolve(ComplianceLocale), { ssr: false });
