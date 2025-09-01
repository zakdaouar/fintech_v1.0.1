import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'next/link';
import { analytics } from "@/utils/analytics";
import { OnboardingLayout } from "./OnboardingLayout";

function PhoneStatus() {
  const navigate = useRouter();

  const onNext = () => {
    analytics.track({ name: "idv_phone_ok" });
    router.push("/onboarding/review");
  };

  return (
    <OnboardingLayout title="Phone verification" description="Weâ€™ll auto-complete this if you verified less than 24 hours ago." stepIndex={15} totalSteps={18} onBack={() => router.push(-1)}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Status: Verified</p>
        <Button className="w-full" onClick={onNext}>Continue</Button>
      </div>
    </OnboardingLayout>
  );
}

export default dynamic(() => Promise.resolve(PhoneStatus), { ssr: false });