import dynamic from 'next/dynamic';


import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'next/link';


import { analytics } from "@/utils/analytics";


import { OnboardingLayout } from "./OnboardingLayout";
import { OnboardingLayout } from 'lucide-react';
function Submitted() {


  const navigate = useRouter();





  const onNext = () => {


    analytics.track({ name: "onboarding_done" });


    router.push("/dashboard");


  };





  return (


    <OnboardingLayout title="Submitted" description="WeÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢re reviewing your details. YouÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ll have limited access until approval." stepIndex={17} totalSteps={18}>


      <div className="space-y-4">


        <Button className="w-full" onClick={onNext}>Go to dashboard</Button>


      </div>


    </OnboardingLayout>


  );


}





export default dynamic(() => Promise.resolve(Submitted), { ssr: false });