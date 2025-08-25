import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { analytics } from "@/utils/analytics";
import { OnboardingLayout } from "./OnboardingLayout";

export default function Submitted() {
  const navigate = useNavigate();

  const onNext = () => {
    analytics.track({ name: "onboarding_done" });
    navigate("/dashboard");
  };

  return (
    <OnboardingLayout title="Submitted" description="We’re reviewing your details. You’ll have limited access until approval." stepIndex={17} totalSteps={18}>
      <div className="space-y-4">
        <Button className="w-full" onClick={onNext}>Go to dashboard</Button>
      </div>
    </OnboardingLayout>
  );
}
