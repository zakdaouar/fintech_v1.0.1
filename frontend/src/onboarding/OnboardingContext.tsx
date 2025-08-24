import React, { createContext, useContext, useMemo, useState } from "react";
import { draftStore } from "@/utils/onboardingApi";

export type OnboardingData = ReturnType<typeof draftStore.read> & { _updatedAt?: number };

type Ctx = {
  data: OnboardingData;
  setData: (p: Partial<OnboardingData>) => void;
  totalSteps: number;
  stepIndex: number;
  setStepIndex: (i: number) => void;
};

const OnboardingCtx = createContext<Ctx | null>(null);

export const useOnboarding = () => {
  const ctx = useContext(OnboardingCtx);
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
};

export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setDataState] = useState<OnboardingData>(draftStore.read());
  const [stepIndex, setStepIndex] = useState<number>(0);
  const totalSteps = 18;

  const setData = (p: Partial<OnboardingData>) => {
    const merged = { ...data, ...p };
    draftStore.write(merged);
    setDataState(merged);
  };

  const value = useMemo(() => ({ data, setData, totalSteps, stepIndex, setStepIndex }), [data, stepIndex]);
  return <OnboardingCtx.Provider value={value}>{children}</OnboardingCtx.Provider>;
};
