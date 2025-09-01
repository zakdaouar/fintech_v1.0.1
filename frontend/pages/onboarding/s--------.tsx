import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'next/link';
import { analytics } from "@/utils/analytics";
import { OnboardingLayout } from "./OnboardingLayout";

function Submitted() {
  const navigate = useRouter();

  const onNext = () => {
    analytics.track({ name: "onboarding_done" });
    router.push("/dashboard");
  };

  return (
    <OnboardingLayout title="Submitted" description="Weâ€™re reviewing your details. Youâ€™ll have limited access until approval." stepIndex={17} totalSteps={18}>
      <div className="space-y-4">
        <Button className="w-full" onClick={onNext}>Go to dashboard</Button>
      </div>
    </OnboardingLayout>
  );
}

export default dynamic(() => Promise.resolve(Submitted), { ssr: false });