import dynamic from 'next/dynamic';


import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";


import { useState } from "react";


import { useNavigate } from 'next/link';


import { analytics } from "@/utils/analytics";


import { OnboardingLayout } from "./OnboardingLayout";
import { OnboardingLayout, RadioGroup, RadioGroupItem } from 'lucide-react';
function AccountType() {


  const navigate = useRouter();


  const [type, setType] = useState<"personal" | "business">("personal");





  const onNext = () => {


    analytics.track({ name: "account_type_chosen", props: { type } });


    router.push("/onboarding/legal-name");


  };





  return (


    <OnboardingLayout title="Account type" description="Choose Personal or Business. Jurisdictional checks may apply." stepIndex={4} totalSteps={18} onBack={() => router.push(-1)}>


      <div className="space-y-4">


        <RadioGroup value={type} onValueChange={(v) => setType(v as any)}>


          <div className="flex items-center space-x-2">


            <RadioGroupItem value="personal" id="personal" />


            <Label htmlFor="personal">Personal</Label>


          </div>


          <div className="flex items-center space-x-2">


            <RadioGroupItem value="business" id="business" />


            <Label htmlFor="business">Business</Label>


          </div>


        </RadioGroup>


        <Button className="w-full" onClick={onNext}>Continue</Button>


      </div>


    </OnboardingLayout>


  );


}





export default dynamic(() => Promise.resolve(AccountType), { ssr: false });