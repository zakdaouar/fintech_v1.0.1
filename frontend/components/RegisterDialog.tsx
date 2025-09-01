import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { createCustomerNoAuth } from "@/utils/api";
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Label, RegisterDialogProps, RegisterFormValues } from 'lucide-react';


interface RegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface RegisterFormValues {
  first_name: string;
  last_name: string;
  email: string;
  street_line_1: string;
  street_line_2?: string;
  city: string;
  subdivision: string;
  postal_code: string;
  country: string;
  birth_date: string; // YYYY-MM-DD
  phone: string; // E.164
  signed_agreement_id: string;
  ssn: string; // 123-45-6789
  issuing_country: string; // e.g. usa
}

const defaultValues: Partial<RegisterFormValues> = {
  country: "USA",
  issuing_country: "usa",
  signed_agreement_id: "0001",
};

const RegisterDialog: React.FC<RegisterDialogProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<RegisterFormValues>({ defaultValues: defaultValues as RegisterFormValues });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const payload = {
        type: "individual",
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        residential_address: {
          street_line_1: values.street_line_1,
          street_line_2: values.street_line_2 || "",
          city: values.city,
          subdivision: values.subdivision,
          postal_code: values.postal_code,
          country: values.country,
        },
        birth_date: values.birth_date,
        phone: values.phone,
        signed_agreement_id: values.signed_agreement_id,
        identifying_information: [
          {
            type: "ssn",
            issuing_country: values.issuing_country,
            number: values.ssn,
          },
        ],
      };

      const res = await createCustomerNoAuth(payload);
      if (!res.ok) {
        throw new Error(`Registration failed (${res.status})`);
      }
      const createdId = (res.data as any)?.id;

      toast({
        title: "Registration submitted",
        description: `Customer created (sandbox). ID: ${createdId ?? "N/A"}. KYC will auto-complete shortly.`,
      });

      reset();
      onOpenChange(false);
    } catch (e: any) {
      toast({
        title: "Registration error",
        description: e?.message ?? "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Register New Customer</DialogTitle>
          <DialogDescription>
            Fill in your details to create a sandbox customer. All fields are required unless marked optional.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First name</Label>
              <Input id="first_name" placeholder="Maxime" {...register("first_name", { required: true })} />
            </div>
            <div>
              <Label htmlFor="last_name">Last name</Label>
              <Input id="last_name" placeholder="Nicolas" {...register("last_name", { required: true })} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="max@example.com" {...register("email", { required: true })} />
            </div>
            <div>
              <Label htmlFor="birth_date">Birth date</Label>
              <Input id="birth_date" type="date" {...register("birth_date", { required: true })} />
            </div>
            <div>
              <Label htmlFor="phone">Phone (E.164)</Label>
              <Input id="phone" placeholder="+15555555555" {...register("phone", { required: true })} />
            </div>
          </section>

          <section className="space-y-3">
            <p className="text-sm text-muted-foreground">Residential address</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="street_line_1">Street line 1</Label>
                <Input id="street_line_1" placeholder="123 Washington St" {...register("street_line_1", { required: true })} />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="street_line_2">Street line 2 (optional)</Label>
                <Input id="street_line_2" placeholder="Apt 2F" {...register("street_line_2")} />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="San Francisco" {...register("city", { required: true })} />
              </div>
              <div>
                <Label htmlFor="subdivision">State/Province</Label>
                <Input id="subdivision" placeholder="CA" {...register("subdivision", { required: true })} />
              </div>
              <div>
                <Label htmlFor="postal_code">Postal code</Label>
                <Input id="postal_code" placeholder="10001" {...register("postal_code", { required: true })} />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input id="country" placeholder="USA" {...register("country", { required: true })} />
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="signed_agreement_id">Signed agreement ID</Label>
              <Input id="signed_agreement_id" placeholder="0001" {...register("signed_agreement_id", { required: true })} />
            </div>
            <div>
              <Label htmlFor="issuing_country">ID issuing country</Label>
              <Input id="issuing_country" placeholder="usa" {...register("issuing_country", { required: true })} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="ssn">SSN</Label>
              <Input id="ssn" placeholder="123-45-6789" {...register("ssn", { required: true })} />
            </div>
          </section>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterDialog;
