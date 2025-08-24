import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Transfers from "./pages/Transfers";
import IssueCard from "./pages/IssueCard";
import Customers from "./pages/Customers";
import Tests from "./pages/Tests";
import NotFound from "./pages/NotFound";
// Onboarding pages
import OnboardingStart from "./pages/onboarding/Start";
import OnboardingConfirmEmail from "./pages/onboarding/ConfirmEmail";
import OnboardingLogin from "./pages/onboarding/Login";
import OnboardingTwoFactor from "./pages/onboarding/TwoFactor";
import OnboardingAccountType from "./pages/onboarding/AccountType";
import OnboardingLegalName from "./pages/onboarding/LegalName";
import OnboardingContactDetails from "./pages/onboarding/ContactDetails";
import OnboardingVerifyPhone from "./pages/onboarding/VerifyPhone";
import OnboardingDateOfBirth from "./pages/onboarding/DateOfBirth";
import OnboardingIdvIntro from "./pages/onboarding/IdvIntro";
import OnboardingComplianceLocale from "./pages/onboarding/ComplianceLocale";
import OnboardingOverview from "./pages/onboarding/Overview";
import OnboardingDocumentSetup from "./pages/onboarding/DocumentSetup";
import OnboardingLiveness from "./pages/onboarding/Liveness";
import OnboardingProofOfAddress from "./pages/onboarding/ProofOfAddress";
import OnboardingPhoneStatus from "./pages/onboarding/PhoneStatus";
import OnboardingReview from "./pages/onboarding/Review";
import OnboardingSubmitted from "./pages/onboarding/Submitted";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transfers" element={<Transfers />} />
          <Route path="/issue-card" element={<IssueCard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/tests" element={<Tests />} />

          {/* Onboarding routes */}
          <Route path="/onboarding/start" element={<OnboardingStart />} />
          <Route path="/onboarding/confirm" element={<OnboardingConfirmEmail />} />
          <Route path="/onboarding/login" element={<OnboardingLogin />} />
          <Route path="/onboarding/2fa" element={<OnboardingTwoFactor />} />
          <Route path="/onboarding/account-type" element={<OnboardingAccountType />} />
          <Route path="/onboarding/legal-name" element={<OnboardingLegalName />} />
          <Route path="/onboarding/contact" element={<OnboardingContactDetails />} />
          <Route path="/onboarding/verify-phone" element={<OnboardingVerifyPhone />} />
          <Route path="/onboarding/dob" element={<OnboardingDateOfBirth />} />
          <Route path="/onboarding/idv-intro" element={<OnboardingIdvIntro />} />
          <Route path="/onboarding/compliance-locale" element={<OnboardingComplianceLocale />} />
          <Route path="/onboarding/overview" element={<OnboardingOverview />} />
          <Route path="/onboarding/document-setup" element={<OnboardingDocumentSetup />} />
          <Route path="/onboarding/liveness" element={<OnboardingLiveness />} />
          <Route path="/onboarding/poa" element={<OnboardingProofOfAddress />} />
          <Route path="/onboarding/phone-status" element={<OnboardingPhoneStatus />} />
          <Route path="/onboarding/review" element={<OnboardingReview />} />
          <Route path="/onboarding/submitted" element={<OnboardingSubmitted />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
