import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { analytics } from "@/utils/analytics";
import { authApi } from "@/utils/onboardingApi";
import { OnboardingLayout } from "./OnboardingLayout";

export default function Start() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{firstName: string; lastName: string; email: string}>();

  const onSubmit = async (v: {firstName: string; lastName: string; email: string}) => {
    analytics.track({ name: "email_submit", props: { email: v.email } });
    await authApi.register(v);
    navigate("/onboarding/confirm?token=" + btoa(v.email));
  };

  return (
    <OnboardingLayout title="Create your account" description="We’ll send a confirmation link to your email." stepIndex={0} totalSteps={18}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="firstName">First name</Label>
          <Input id="firstName" autoComplete="given-name" {...register("firstName", { required: "Required" })} />
          {errors.firstName && <p className="text-destructive text-sm mt-1">{errors.firstName.message}</p>}
        </div>
        <div>
          <Label htmlFor="lastName">Last name</Label>
          <Input id="lastName" autoComplete="family-name" {...register("lastName", { required: "Required" })} />
          {errors.lastName && <p className="text-destructive text-sm mt-1">{errors.lastName.message}</p>}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" {...register("email", { required: "Required" })} />
          {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div className="pt-2">
          <Button type="submit" disabled={isSubmitting} className="w-full">Send confirmation</Button>
        </div>
      </form>
    </OnboardingLayout>
  );
}
