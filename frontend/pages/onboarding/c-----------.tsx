import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from 'next/link';
import { analytics } from "@/utils/analytics";
import { authApi } from "@/utils/onboardingApi";
import { OnboardingLayout } from "./OnboardingLayout";

function ConfirmEmail() {
  const [params] = useSearchParams();
  const navigate = useRouter();
  const token = params.get("token") || "";
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    analytics.track({ name: "email_confirm_link_opened" });
    (async () => {
      const { email } = await authApi.confirmEmail({ token });
      setEmail(email);
    })();
  }, [token]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) return setError("Use at least 8 characters.");
    if (password !== confirm) return setError("Passwords donÃ¢â‚¬â„¢t match.");
    await authApi.setPassword({ email, password });
    analytics.track({ name: "password_set_success" });
    router.push(`/onboarding/login?email=${encodeURIComponent(email)}`);
  };

  return (
    <OnboardingLayout title="Set a password" description={`For ${email || "your account"}.`} stepIndex={1} totalSteps={18} onBack={() => router.push(-1)}>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="confirm">Confirm password</Label>
          <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <Button type="submit" className="w-full">Continue</Button>
      </form>
    </OnboardingLayout>
  );
}

export default dynamic(() => Promise.resolve(ConfirmEmail), { ssr: false });