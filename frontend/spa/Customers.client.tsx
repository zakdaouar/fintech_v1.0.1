import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { createCustomer, fetchCustomer, bridgeHealth } from '@/utils/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

function maskSSN(value: string) {
  // Force ###-##-#### pattern (digits only)
  const digits = value.replace(/\D/g, '').slice(0, 9);
  const parts = [digits.slice(0, 3), digits.slice(3, 5), digits.slice(5, 9)].filter(Boolean);
  return parts
    .map((part, idx) => (idx === parts.length - 1 ? part : part.padEnd(idx === 0 ? 3 : 2, '_')))
    .join('-');
}

function toE164Sample(input: string) {
  // naive: keep + and digits
  const s = input.replace(/[^\\d+]/g, '');
  return s.startsWith('+') ? s : `+${s}`;
}

const defaultCountry = 'USA';

type CustomerForm = {
  first_name: string;
  last_name: string;
  email: string;
  birth_date: string;
  phone: string;
  street_line_1: string;
  street_line_2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  tax_identification_number: string;
  signed_agreement_id: string;
};

const initialForm: CustomerForm = {
  first_name: '',
  last_name: '',
  email: '',
  birth_date: '',
  phone: '+15555555555',
  street_line_1: '',
  street_line_2: '',
  city: '',
  state: '',
  postal_code: '',
  country: defaultCountry,
  tax_identification_number: '',
  signed_agreement_id: crypto.randomUUID(),
};

const Customers: React.FC = () => {
  useEffect(() => {
    document.title = 'Customers | Bridge Sandbox';
  }, []);

  const { toast } = useToast();
  const [health, setHealth] = useState<{ sandbox: boolean; key_present: boolean } | null>(null);
  const [showHealth, setShowHealth] = useState(true);

  const [form, setForm] = useState<CustomerForm>(initialForm);

  const [creating, setCreating] = useState(false);
  const [createRes, setCreateRes] = useState<any | null>(null);
  const [createErr, setCreateErr] = useState<any | null>(null);

  const [fetching, setFetching] = useState(false);
  const [fetchId, setFetchId] = useState<string>(localStorage.getItem('last_customer_id') || '');
  const [fetchRes, setFetchRes] = useState<any | null>(null);
  const [fetchErr, setFetchErr] = useState<any | null>(null);

  useEffect(() => {
    async function loadHealth() {
      const h = await bridgeHealth();
      if (h.ok) setHealth(h.data as any);
      else setHealth({ sandbox: true, key_present: false });
    }
    loadHealth();
  }, []);

  const payload = useMemo(() => ({
    first_name: form.first_name,
    last_name: form.last_name,
    email: form.email,
    address: {
      street_line_1: form.street_line_1,
      street_line_2: form.street_line_2,
      city: form.city,
      state: form.state,
      postal_code: form.postal_code,
      country: form.country,
    },
    birth_date: form.birth_date,
    tax_identification_number: form.tax_identification_number,
    phone: toE164Sample(form.phone),
    signed_agreement_id: form.signed_agreement_id,
    type: 'individual',
  }), [form]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setCreateErr(null);
    setCreateRes(null);

    // Basic validation
    if (!form.first_name || !form.last_name || !form.email || !form.birth_date) {
      toast({ title: 'Missing fields', description: 'Please fill all required fields.' });
      setCreating(false);
      return;
    }

    const res = await createCustomer(payload);
    if (res.status === 503) {
      toast({ title: 'Bridge key missing', description: 'Set sk-test key on server to use sandbox.' });
    }
    if (res.ok) {
      setCreateRes(res.data);
      const id = (res.data as any).id;
      if (id) {
        localStorage.setItem('last_customer_id', id);
        setFetchId(id);
      }
      toast({ title: 'Customer created', description: 'Sandbox KYC auto-approved.' });
    } else {
      setCreateErr(res.data);
      toast({ title: 'Create failed', description: 'Please check inputs or try again later.' });
    }
    setCreating(false);
  }

  async function onFetch() {
    if (!fetchId) {
      toast({ title: 'Missing ID', description: 'Enter a customer id.' });
      return;
    }
    setFetching(true);
    setFetchErr(null);
    setFetchRes(null);
    const res = await fetchCustomer(fetchId);
    if (res.ok) {
      setFetchRes(res.data);
    } else {
      setFetchErr(res.data);
      if (res.status === 403) toast({ title: 'Unauthorized', description: 'Auth required for proxy.' });
    }
    setFetching(false);
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Bridge Sandbox – KYC auto-approved (sandbox)</p>
        </header>

        {showHealth && health && !health.key_present && (
          <Alert className="border-destructive/40">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Set your sk-test key in the server .env to use live Bridge sandbox. This is sandbox only (no real money).
              <Button variant="ghost" size="sm" className="ml-2" onClick={() => setShowHealth(false)}>Dismiss</Button>
            </AlertDescription>
          </Alert>
        )}

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Customer</CardTitle>
              <CardDescription>Required: first name, last name, email, birth date</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onCreate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input id="first_name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input id="last_name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="birth_date">Birth Date (YYYY-MM-DD)</Label>
                    <Input id="birth_date" placeholder="1990-01-01" value={form.birth_date} onChange={(e) => setForm({ ...form, birth_date: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone (E.164)</Label>
                    <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: toE164Sample(e.target.value) })} />
                  </div>
                  <div>
                    <Label htmlFor="tax">SSN (Sandbox)</Label>
                    <Input id="tax" value={form.tax_identification_number} onChange={(e) => setForm({ ...form, tax_identification_number: maskSSN(e.target.value) })} placeholder="111-11-1111" />
                  </div>
                  <div className="md:col-span-2">
                    <Separator className="my-2" />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Address</Label>
                  </div>
                  <div>
                    <Label htmlFor="line1">Street Line 1</Label>
                    <Input id="line1" value={form.street_line_1} onChange={(e) => setForm({ ...form, street_line_1: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="line2">Street Line 2</Label>
                    <Input id="line2" value={form.street_line_2} onChange={(e) => setForm({ ...form, street_line_2: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="state">State / Subdivision</Label>
                    <Input id="state" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="postal">Postal Code</Label>
                    <Input id="postal" value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="agreement">Signed Agreement ID</Label>
                    <Input id="agreement" value={form.signed_agreement_id} onChange={(e) => setForm({ ...form, signed_agreement_id: e.target.value })} />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button type="submit" disabled={creating}>
                    {creating ? <LoadingSpinner size="sm" /> : 'Create Customer'}
                  </Button>
                  {createRes && <span className="flex items-center text-green-600"><CheckCircle2 className="h-4 w-4 mr-1" /> Created</span>}
                </div>
              </form>

              {createRes && (
                <div className="mt-4">
                  <Card className="bg-secondary/20">
                    <CardHeader>
                      <CardTitle className="text-lg">Success</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div><strong>ID:</strong> {createRes.id}</div>
                        <div><strong>Email:</strong> {createRes.email}</div>
                        <div><strong>Status:</strong> {createRes.status} (auto-approved, sandbox)</div>
                        <div><strong>Created:</strong> {createRes.created_at}</div>
                      </div>
                      <pre className="mt-3 bg-muted p-3 rounded text-xs overflow-auto">{JSON.stringify(createRes, null, 2)}</pre>
                    </CardContent>
                  </Card>
                </div>
              )}

              {createErr && (
                <div className="mt-4">
                  <Card className="bg-destructive/5">
                    <CardHeader>
                      <CardTitle className="text-lg">Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-muted p-3 rounded text-xs overflow-auto">{JSON.stringify(createErr, null, 2)}</pre>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fetch Existing Customer</CardTitle>
              <CardDescription>Use last created ID or enter an existing one</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-3">
                <Input placeholder="customer_id" value={fetchId} onChange={(e) => setFetchId(e.target.value)} />
                <Button onClick={onFetch} disabled={fetching}>{fetching ? <LoadingSpinner size="sm" /> : 'Fetch Customer'}</Button>
              </div>

              {fetchRes && (
                <div className="space-y-2 text-sm">
                  <div><strong>Name:</strong> {fetchRes.first_name} {fetchRes.last_name}</div>
                  <div><strong>Email:</strong> {fetchRes.email}</div>
                  <div><strong>Status:</strong> {fetchRes.status} (auto-approved, sandbox)</div>
                  <div><strong>Created:</strong> {fetchRes.created_at}</div>
                  {fetchRes.capabilities && (
                    <div>
                      <strong>Capabilities:</strong>
                      <pre className="bg-muted p-3 rounded text-xs overflow-auto">{JSON.stringify(fetchRes.capabilities, null, 2)}</pre>
                    </div>
                  )}
                  {fetchRes.future_requirements_due && (
                    <div>
                      <strong>Future Requirements Due:</strong>
                      <pre className="bg-muted p-3 rounded text-xs overflow-auto">{JSON.stringify(fetchRes.future_requirements_due, null, 2)}</pre>
                    </div>
                  )}
                  {fetchRes.requirements_due && (
                    <div>
                      <strong>Requirements Due:</strong>
                      <pre className="bg-muted p-3 rounded text-xs overflow-auto">{JSON.stringify(fetchRes.requirements_due, null, 2)}</pre>
                    </div>
                  )}
                  <pre className="bg-muted p-3 rounded text-xs overflow-auto">{JSON.stringify(fetchRes, null, 2)}</pre>
                </div>
              )}

              {fetchErr && (
                <div>
                  <pre className="bg-muted p-3 rounded text-xs overflow-auto">{JSON.stringify(fetchErr, null, 2)}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
};

export default Customers;
