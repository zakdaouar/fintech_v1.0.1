import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { analytics } from "@/utils/analytics";
import { OnboardingLayout } from "./OnboardingLayout";

export default function IdvIntro() {
  const navigate = useNavigate();

  const onNext = () => {
    analytics.track({ name: "idv_intro_viewed" });
    navigate("/onboarding/compliance-locale");
  };

  return (
    <OnboardingLayout title="Identity verification" description="Complete a few checks. Beware of phishing; we’ll never ask for your full email code." stepIndex={9} totalSteps={18} onBack={() => navigate(-1)}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">You’ll verify your document, liveness, and proof of address. You can continue on your phone later.</p>
        <Button className="w-full" onClick={onNext}>Continue</Button>
      </div>
    </OnboardingLayout>
  );
}
