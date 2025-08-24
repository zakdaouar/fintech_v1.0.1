import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export type LayoutProps = {
  title: string;
  description?: string;
  stepIndex: number;
  totalSteps: number;
  onBack?: () => void;
  children: React.ReactNode;
};

export const OnboardingLayout = ({ title, description, stepIndex, totalSteps, onBack, children }: LayoutProps) => {
  const percent = Math.round(((stepIndex + 1) / totalSteps) * 100);

  useEffect(() => {
    document.title = `${title} · Onboarding`;
  }, [title]);

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-xl p-6 bg-gradient-card border-border">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Step {stepIndex + 1} of {totalSteps} · {percent}%</p>
          {onBack && (
            <Button variant="outline" onClick={onBack}>Back</Button>
          )}
        </div>
        <Progress value={percent} className="mb-6" />
        <h1 className="text-2xl font-semibold mb-2">{title}</h1>
        {description && <p className="text-muted-foreground mb-6">{description}</p>}
        {children}
      </Card>
    </main>
  );
};
