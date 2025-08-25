import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { analytics } from "@/utils/analytics";
import { OnboardingLayout } from "./OnboardingLayout";

export default function Overview() {
  const navigate = useNavigate();

  const onNext = () => {
    analytics.track({ name: "overview_viewed" });
    navigate("/onboarding/document-setup");
  };

  return (
    <OnboardingLayout title="What’s next" description="You’ll provide an identity document, complete a liveness check, and submit proof of address." stepIndex={11} totalSteps={18} onBack={() => navigate(-1)}>
      <div className="space-y-4 text-sm text-muted-foreground">
        <ul className="list-disc pl-5 space-y-1">
          <li>Provide identity document</li>
          <li>Liveness (selfie)</li>
          <li>Proof of address</li>
          <li>Phone verification (auto-complete if done)</li>
        </ul>
        <Button className="w-full" onClick={onNext}>Continue</Button>
      </div>
    </OnboardingLayout>
  );
}
