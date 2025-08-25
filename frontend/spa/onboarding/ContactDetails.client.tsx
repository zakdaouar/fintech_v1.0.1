import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { analytics } from "@/utils/analytics";
import { onboardingApi } from "@/utils/onboardingApi";
import { OnboardingLayout } from "./OnboardingLayout";

type Contact = { country: string; address1: string; address2?: string; city: string; region: string; postalCode: string; phone: string };

export default function ContactDetails() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Contact>();

  const onSubmit = async (v: Contact) => {
    await onboardingApi.contact(v);
    analytics.track({ name: "contact_saved" });
    navigate("/onboarding/verify-phone");
  };

  return (
    <OnboardingLayout title="Contact details" description="Tell us how to reach you." stepIndex={6} totalSteps={18} onBack={() => navigate(-1)}>
      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="country">Country</Label>
          <Input id="country" {...register("country", { required: "Required" })} />
          {errors.country && <p className="text-destructive text-sm">{errors.country.message}</p>}
        </div>
        <div>
          <Label htmlFor="address1">Address line 1</Label>
          <Input id="address1" {...register("address1", { required: "Required" })} />
          {errors.address1 && <p className="text-destructive text-sm">{errors.address1.message}</p>}
        </div>
        <div>
          <Label htmlFor="address2">Address line 2 (optional)</Label>
          <Input id="address2" {...register("address2")} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" {...register("city", { required: "Required" })} />
          </div>
          <div>
            <Label htmlFor="region">Region</Label>
            <Input id="region" {...register("region", { required: "Required" })} />
          </div>
          <div>
            <Label htmlFor="postalCode">Postal code</Label>
            <Input id="postalCode" {...register("postalCode", { required: "Required" })} />
          </div>
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...register("phone", { required: "Required" })} />
          {errors.phone && <p className="text-destructive text-sm">{errors.phone.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>Continue</Button>
      </form>
    </OnboardingLayout>
  );
}
