 param($m) $m.Value + "import dynamic from 'next/dynamic';`n" 
function PhoneStatus() {
  const navigate = useNavigate();

  const onNext = () => {
    analytics.track({ name: "idv_phone_ok" });
    navigate("/onboarding/review");
  };

  return (
    <OnboardingLayout title="Phone verification" description="Weâ€™ll auto-complete this if you verified less than 24 hours ago." stepIndex={15} totalSteps={18} onBack={() => navigate(-1)}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Status: Verified</p>
        <Button className="w-full" onClick={onNext}>Continue</Button>
      </div>
    </OnboardingLayout>
  );
}
export default dynamic(() => Promise.resolve(PhoneStatus), { ssr: false });
