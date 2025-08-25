 param($m) $m.Value + "import dynamic from 'next/dynamic';`n" 
function IdvIntro() {
  const navigate = useNavigate();

  const onNext = () => {
    analytics.track({ name: "idv_intro_viewed" });
    navigate("/onboarding/compliance-locale");
  };

  return (
    <OnboardingLayout title="Identity verification" description="Complete a few checks. Beware of phishing; weâ€™ll never ask for your full email code." stepIndex={9} totalSteps={18} onBack={() => navigate(-1)}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Youâ€™ll verify your document, liveness, and proof of address. You can continue on your phone later.</p>
        <Button className="w-full" onClick={onNext}>Continue</Button>
      </div>
    </OnboardingLayout>
  );
}
export default dynamic(() => Promise.resolve(IdvIntro), { ssr: false });
