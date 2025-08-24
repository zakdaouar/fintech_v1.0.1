// Simulated API layer for fintech app
export interface Balance {
  total_balance_usd: number;
}

export interface Transfer {
  amount: number;
  currency: string;
  to: string;
  date?: string;
  status?: string;
}

export interface Card {
  currency: string;
  status: string;
  last4: string;
  name?: string;
}

export interface WalletBalance {
  currency: string;
  amount: number;
  method: string;
  status: string;
  flag: string;
}

// Mock data
const mockBalances: Balance = { total_balance_usd: 1299.50 };

const mockTransfers: Transfer[] = [
  { amount: 200, currency: "USD", to: "alice@example.com", date: "2024-01-15", status: "Completed" },
  { amount: 50, currency: "EUR", to: "bob@company.com", date: "2024-01-14", status: "Pending" },
  { amount: 1000, currency: "MXN", to: "carlos@business.mx", date: "2024-01-13", status: "Completed" },
];

const mockCards: Card[] = [
  { currency: "USD", status: "Issued", last4: "1234", name: "Business Card" },
  { currency: "EUR", status: "Pending", last4: "5678", name: "Travel Card" },
];

const mockWallets: WalletBalance[] = [
  { currency: "EUR", amount: 450.75, method: "SEPA", status: "Activated", flag: "🇪🇺" },
  { currency: "USD", amount: 725.25, method: "ACH", status: "Activated", flag: "🇺🇸" },
  { currency: "MXN", amount: 23450.00, method: "SPEI", status: "Activated", flag: "🇲🇽" },
];

// Simulated API function with loading delay
export async function callApi<T>(endpoint: string): Promise<T> {
  // Add Authorization header simulation
  const headers = {
    'Authorization': 'Bearer mock-jwt-token',
    'Content-Type': 'application/json',
  };

  console.log(`API Call: ${endpoint}`, { headers });

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  switch (endpoint) {
    case '/api/balances':
      return mockBalances as T;
    case '/api/transfers':
      return mockTransfers as T;
    case '/api/cards':
      return mockCards as T;
    case '/api/wallets':
      return mockWallets as T;
    default:
      throw new Error(`Unknown endpoint: ${endpoint}`);
  }
}

// API service functions
export const apiService = {
  getBalances: () => callApi<Balance>('/api/balances'),
  getTransfers: () => callApi<Transfer[]>('/api/transfers'),
  getCards: () => callApi<Card[]>('/api/cards'),
  getWallets: () => callApi<WalletBalance[]>('/api/wallets'),
};

// ---------- Bridge Sandbox Client (via Supabase Edge Function) ----------

interface FetchResult<T = any> {
  status: number;
  ok: boolean;
  data: T | null;
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetry<T = any>(input: RequestInfo, init: RequestInit = {}, retries = 2, backoff = 400): Promise<FetchResult<T>> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(input, init);
      const status = res.status;
      const ok = res.ok;
      const ct = res.headers.get('content-type') || '';
      const data = ct.includes('application/json') ? await res.json() : await res.text();
      if ((status === 429 || status >= 500) && attempt < retries) {
        await sleep(backoff * Math.pow(2, attempt));
        continue;
      }
      return { status, ok, data } as FetchResult<T>;
    } catch (e) {
      if (attempt < retries) {
        await sleep(backoff * Math.pow(2, attempt));
        continue;
      }
      return { status: 0, ok: false, data: null };
    }
  }
  return { status: 0, ok: false, data: null };
}

const BRIDGE_FN_BASE = '/functions/v1/bridge';

export async function createCustomer(payload: any): Promise<FetchResult> {
  return fetchWithRetry(`${BRIDGE_FN_BASE}/customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer mock-jwt-token',
    },
    body: JSON.stringify(payload),
  });
}

export async function createCustomerNoAuth(payload: any): Promise<FetchResult> {
  return fetchWithRetry(`${BRIDGE_FN_BASE}/customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export async function fetchCustomer(id: string): Promise<FetchResult> {
  return fetchWithRetry(`${BRIDGE_FN_BASE}/customers/${id}`, {
    headers: {
      Authorization: 'Bearer mock-jwt-token',
    },
  });
}

export async function bridgeHealth(): Promise<FetchResult> {
  return fetchWithRetry(`${BRIDGE_FN_BASE}/health`);
}