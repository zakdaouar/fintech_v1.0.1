import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { analytics } from "@/utils/analytics";
import { onboardingApi } from "@/utils/onboardingApi";
import { OnboardingLayout } from "./OnboardingLayout";

export default function Liveness() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const session = params.get("session") || "mock-session";

  const onNext = async () => {
    await onboardingApi.kycLiveness({ sessionId: session });
    analytics.track({ name: "liveness_ok" });
    navigate("/onboarding/poa");
  };

  return (
    <OnboardingLayout title="Liveness check" description="Start the liveness check with our provider. Return here when complete." stepIndex={13} totalSteps={18} onBack={() => navigate(-1)}>
      <div className="space-y-4">
        <Button className="w-full" onClick={onNext}>Start and continue</Button>
      </div>
    </OnboardingLayout>
  );
}
