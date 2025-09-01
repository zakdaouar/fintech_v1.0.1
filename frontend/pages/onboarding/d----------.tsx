import dynamic from 'next/dynamic';


import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from "react";


import { useNavigate } from 'next/link';


import { analytics } from "@/utils/analytics";


import { onboardingApi } from "@/utils/onboardingApi";


import { OnboardingLayout } from "./OnboardingLayout";
import { OnboardingLayout } from 'lucide-react';
function DateOfBirth() {


  const navigate = useRouter();


  const [dob, setDob] = useState("");





  const onNext = async () => {


    await onboardingApi.dob({ dateOfBirth: dob });


    analytics.track({ name: "dob_saved" });


    router.push("/onboarding/idv-intro");


  };





  return (


    <OnboardingLayout title="Date of birth" description="Use the same date as on your ID." stepIndex={8} totalSteps={18} onBack={() => router.push(-1)}>


      <div className="space-y-4">


        <Label htmlFor="dob">Date of birth</Label>


        <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />


        <Button className="w-full" onClick={onNext} disabled={!dob}>Continue</Button>


      </div>


    </OnboardingLayout>


  );


}





export default dynamic(() => Promise.resolve(DateOfBirth), { ssr: false });