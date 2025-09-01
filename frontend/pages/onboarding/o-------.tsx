import dynamic from 'next/dynamic';


import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'next/link';


import { analytics } from "@/utils/analytics";


import { OnboardingLayout } from "./OnboardingLayout";
import { OnboardingLayout } from 'lucide-react';
function Overview() {


  const navigate = useRouter();





  const onNext = () => {


    analytics.track({ name: "overview_viewed" });


    router.push("/onboarding/document-setup");


  };





  return (


    <OnboardingLayout title="WhatÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢s next" description="YouÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ll provide an identity document, complete a liveness check, and submit proof of address." stepIndex={11} totalSteps={18} onBack={() => router.push(-1)}>


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





export default dynamic(() => Promise.resolve(Overview), { ssr: false });