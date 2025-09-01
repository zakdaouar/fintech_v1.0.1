import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from 'next/link';
import { analytics } from "@/utils/analytics";
import { onboardingApi } from "@/utils/onboardingApi";
import { OnboardingLayout } from "./OnboardingLayout";
import { Button, OnboardingLayout } from 'lucide-react';


function Liveness() {
  const navigate = useRouter();
  const [params] = useSearchParams();
  const session = params.get("session") || "mock-session";

  const onNext = async () => {
    await onboardingApi.kycLiveness({ sessionId: session });
    analytics.track({ name: "liveness_ok" });
    router.push("/onboarding/poa");
  };

  return (
    <OnboardingLayout title="Liveness check" description="Start the liveness check with our provider. Return here when complete." stepIndex={13} totalSteps={18} onBack={() => router.push(-1)}>
      <div className="space-y-4">
        <Button className="w-full" onClick={onNext}>Start and continue</Button>
      </div>
    </OnboardingLayout>
  );
}

export default dynamic(() => Promise.resolve(Liveness), { ssr: false });