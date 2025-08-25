 param($m) $m.Value + "import dynamic from 'next/dynamic';`n" 
function Submitted() {
  const navigate = useNavigate();

  const onNext = () => {
    analytics.track({ name: "onboarding_done" });
    navigate("/dashboard");
  };

  return (
    <OnboardingLayout title="Submitted" description="Weâ€™re reviewing your details. Youâ€™ll have limited access until approval." stepIndex={17} totalSteps={18}>
      <div className="space-y-4">
        <Button className="w-full" onClick={onNext}>Go to dashboard</Button>
      </div>
    </OnboardingLayout>
  );
}
export default dynamic(() => Promise.resolve(Submitted), { ssr: false });
