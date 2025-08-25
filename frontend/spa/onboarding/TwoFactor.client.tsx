import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { analytics } from "@/utils/analytics";
import { authApi } from "@/utils/onboardingApi";
import { OnboardingLayout } from "./OnboardingLayout";

const TTL_MS = 10 * 60 * 1000; // 10 minutes

export default function TwoFactor() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const email = params.get("email") || "";
  const [code, setCode] = useState("");
  const [sentAt] = useState<number>(Date.now());
  const [error, setError] = useState<string | null>(null);

  const remaining = useMemo(() => Math.max(0, TTL_MS - (Date.now() - sentAt)), [sentAt, code]);
  const mm = Math.floor(remaining / 60000);
  const ss = Math.floor((remaining % 60000) / 1000).toString().padStart(2, "0");

  useEffect(() => {
    const timer = setInterval(() => {
      // re-render
      setCode((c) => c);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await authApi.verify2faEmail({ email, code });
      analytics.track({ name: "twofa_verify_success" });
      navigate("/onboarding/account-type");
    } catch (err: any) {
      if (err?.message === "locked_out") setError("Too many attempts. Please try later or contact support.");
      else setError("Invalid code. Please try again.");
    }
  };

  const resend = async () => {
    await authApi.send2faEmail({ email });
  };

  return (
    <OnboardingLayout title="Two‑factor check" description={`Enter the 6‑digit code sent to ${email}`} stepIndex={3} totalSteps={18} onBack={() => navigate(-1)}>
      <form className="space-y-4" onSubmit={onSubmit}>
        <InputOTP maxLength={6} value={code} onChange={setCode}>
          <InputOTPGroup>
            {Array.from({ length: 6 }).map((_, i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>
        <p className="text-sm text-muted-foreground">Code expires in {mm}:{ss}</p>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <Button type="submit" className="w-full">Continue</Button>
        <Button type="button" variant="outline" onClick={resend} className="w-full">Resend code</Button>
      </form>
    </OnboardingLayout>
  );
}
