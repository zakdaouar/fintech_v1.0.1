import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { analytics } from "@/utils/analytics";
import { authApi } from "@/utils/onboardingApi";
import { OnboardingLayout } from "./OnboardingLayout";

export default function Login() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState(params.get("email") || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // focus email on mount
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await authApi.login({ email, password });
    analytics.track({ name: "login_success" });
    if (res.requires2fa) {
      await authApi.send2faEmail({ email });
      analytics.track({ name: "twofa_sent_email" });
      navigate(`/onboarding/2fa?email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <OnboardingLayout title="Log in" description="We’ll send a 6‑digit code to your email." stepIndex={2} totalSteps={18} onBack={() => navigate(-1)}>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <Button type="submit" className="w-full">Continue</Button>
      </form>
    </OnboardingLayout>
  );
}
