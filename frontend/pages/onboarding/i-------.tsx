import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'next/link';
import { analytics } from "@/utils/analytics";
import { OnboardingLayout } from "./OnboardingLayout";

function IdvIntro() {
  const navigate = useRouter();

  const onNext = () => {
    analytics.track({ name: "idv_intro_viewed" });
    router.push("/onboarding/compliance-locale");
  };

  return (
    <OnboardingLayout title="Identity verification" description="Complete a few checks. Beware of phishing; weÃ¢â‚¬â„¢ll never ask for your full email code." stepIndex={9} totalSteps={18} onBack={() => router.push(-1)}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">YouÃ¢â‚¬â„¢ll verify your document, liveness, and proof of address. You can continue on your phone later.</p>
        <Button className="w-full" onClick={onNext}>Continue</Button>
      </div>
    </OnboardingLayout>
  );
}

export default dynamic(() => Promise.resolve(IdvIntro), { ssr: false });