import axios from "axios";

export class ApiClient {
  constructor(private baseUrl: string) {}

  hello() { return axios.get(`${this.baseUrl}/api/health`); }

  // Bridge proxy examples (adjust paths to your backend)
  createLinkToken(payload: any) { return axios.post(`${this.baseUrl}/api/bridge/link-token`, payload); }
  getAccounts() { return axios.get(`${this.baseUrl}/api/bridge/accounts`); }
  // ... add more as needed
}
