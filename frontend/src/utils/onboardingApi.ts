// Minimal mock API layer for onboarding. Replace with real endpoints when available.

type DocumentType = "id_card" | "residence_permit" | "passport";
export type Region = "us" | "other";

const delay = (ms = 600) => new Promise((res) => setTimeout(res, ms));

const DRAFT_KEY = "onboarding_draft_v2";
const FAILURE_KEY = "twofa_failures";

export const draftStore = {
  read: () => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  },
  write: (data: any) => {
    const existing = draftStore.read();
    const merged = { ...existing, ...data, _updatedAt: Date.now() };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(merged));
    return merged;
  },
  clear: () => localStorage.removeItem(DRAFT_KEY),
};

export const authApi = {
  register: async ({ firstName, lastName, email }: { firstName: string; lastName: string; email: string }) => {
    await delay();
    draftStore.write({ firstName, lastName, email, emailConfirmed: false });
    return { status: 204 as const };
  },
  confirmEmail: async ({ token }: { token: string }) => {
    await delay();
    // Mock decode
    const email = atob(token || btoa("test@example.com"));
    draftStore.write({ email, emailConfirmed: true });
    return { email };
  },
  setPassword: async ({ email, password }: { email: string; password: string }) => {
    await delay();
    draftStore.write({ email, passwordSet: true });
    return { status: 204 as const };
  },
  login: async ({ email, password }: { email: string; password: string }) => {
    await delay();
    const draft = draftStore.read();
    if (email !== draft.email || !password) return { requires2fa: true };
    return { requires2fa: true };
  },
  send2faEmail: async ({ email }: { email: string }) => {
    await delay();
    draftStore.write({ twofa: { emailCode: "123456", sentAt: Date.now() } });
    return { status: 204 as const };
  },
  verify2faEmail: async ({ email, code }: { email: string; code: string }) => {
    await delay();
    const failures = Number(localStorage.getItem(FAILURE_KEY) || 0);
    if (failures >= 5) {
      throw new Error("locked_out");
    }
    const ok = code === draftStore.read()?.twofa?.emailCode;
    if (!ok) {
      localStorage.setItem(FAILURE_KEY, String(failures + 1));
      throw new Error("invalid_code");
    }
    localStorage.setItem(FAILURE_KEY, "0");
    draftStore.write({ twofaVerified: true });
    return { ok: true } as const;
  },
};

export const onboardingApi = {
  profile: async ({ legalName, accountType }: { legalName: string; accountType: "personal" | "business" }) => {
    await delay();
    draftStore.write({ legalName, accountType });
    return { ok: true };
  },
  contact: async (payload: { country: string; address1: string; address2?: string; city: string; region: string; postalCode: string; phone: string }) => {
    await delay();
    draftStore.write({ contact: payload });
    return { ok: true };
  },
  dob: async ({ dateOfBirth }: { dateOfBirth: string }) => {
    await delay();
    draftStore.write({ dateOfBirth });
    return { ok: true };
  },
  kycSession: async ({ region }: { region: Region }) => {
    await delay();
    const sessionId = Math.random().toString(36).slice(2);
    const handoffUrl = `${location.origin}/onboarding/document-setup?session=${sessionId}`;
    draftStore.write({ kyc: { sessionId, region } });
    return { sessionId, handoffUrl };
  },
  kycDocument: async ({ issuingCountry, documentType }: { issuingCountry: string; documentType: DocumentType }) => {
    await delay();
    draftStore.write({ document: { issuingCountry, documentType } });
    return { ok: true };
  },
  kycLiveness: async ({ sessionId }: { sessionId: string }) => {
    await delay();
    draftStore.write({ livenessOk: true, sessionId });
    return { ok: true };
  },
  poa: async (file: File) => {
    await delay(800);
    draftStore.write({ poaSubmitted: true, poaFileName: file.name });
    return { ok: true };
  },
  review: async () => {
    await delay();
    draftStore.write({ status: "submitted" });
    return { status: "submitted" as const };
  },
};
