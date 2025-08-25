import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { analytics } from "@/utils/analytics";
import { OnboardingLayout } from "./OnboardingLayout";

const TTL_MS = 10 * 60 * 1000;

export default function VerifyPhone() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [sentAt] = useState<number>(Date.now());

  const remaining = useMemo(() => Math.max(0, TTL_MS - (Date.now() - sentAt)), [sentAt, code]);
  const mm = Math.floor(remaining / 60000);
  const ss = Math.floor((remaining % 60000) / 1000).toString().padStart(2, "0");

  const onNext = () => {
    analytics.track({ name: "phone_verify_ok" });
    navigate("/onboarding/dob");
  };

  return (
    <OnboardingLayout title="Verify phone" description={`Enter the SMS code sent to your number. Expires in ${mm}:${ss}.`} stepIndex={7} totalSteps={18} onBack={() => navigate(-1)}>
      <div className="space-y-4">
        <InputOTP maxLength={6} value={code} onChange={setCode}>
          <InputOTPGroup>
            {Array.from({ length: 6 }).map((_, i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>
        <Button className="w-full" onClick={onNext} disabled={code.length !== 6}>Continue</Button>
      </div>
    </OnboardingLayout>
  );
}
