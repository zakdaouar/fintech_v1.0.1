import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, Check, X, Shield } from 'lucide-react';
import { apiService, createCustomer, fetchCustomer, createCustomerNoAuth } from '@/utils/api';
import { testBalancesApi, testTransfersApi, testCardsApi, testBridgeCreate, testBridgeFetch, testUnauthorized } from '@/utils/tests';


interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

interface ApiTestState {
  loading: boolean;
  response: any;
  status: number;
  tests: TestResult[];
  expanded: boolean;
}

const testCoverage = {
  "/api/balances": true,
  "/api/transfers": true,
  "/api/cards": false,
  "POST /api/bridge/customers": true,
  "GET /api/bridge/customers/:id": true,
};

const Tests = () => {
// Check if in development mode
const isDevelopment = import.meta.env.DEV;
useEffect(() => { document.title = 'Tests | Dev Tools'; }, []);

  const [balanceTest, setBalanceTest] = useState<ApiTestState>({
    loading: false,
    response: null,
    status: 0,
    tests: [],
    expanded: false
  });

  const [transferTest, setTransferTest] = useState<ApiTestState>({
    loading: false,
    response: null,
    status: 0,
    tests: [],
    expanded: false
  });

const [cardTest, setCardTest] = useState<ApiTestState>({
  loading: false,
  response: null,
  status: 0,
  tests: [],
  expanded: false
});

// Bridge tests
const [bridgeCreate, setBridgeCreate] = useState<ApiTestState>({ loading: false, response: null, status: 0, tests: [], expanded: false });
const [bridgeFetch, setBridgeFetch] = useState<ApiTestState>({ loading: false, response: null, status: 0, tests: [], expanded: false });
const [bridgeAuth, setBridgeAuth] = useState<ApiTestState>({ loading: false, response: null, status: 0, tests: [], expanded: false });
const [bridgeFetchId, setBridgeFetchId] = useState<string>(localStorage.getItem('last_customer_id') || '');

  // Access denied for production
  if (!isDevelopment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Shield className="h-16 w-16 text-destructive mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-foreground mb-2">403</h1>
              <p className="text-xl text-muted-foreground mb-4">Access Denied</p>
              <p className="text-sm text-muted-foreground">
                This page is only available in development mode.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

const runBalanceTest = async () => {
  setBalanceTest(prev => ({ ...prev, loading: true, tests: [] }));
  try {
    const response = await apiService.getBalances();
    const tests = testBalancesApi(response);
    setBalanceTest({
      loading: false,
      response,
      status: 200,
      tests,
      expanded: true
    });
  } catch (error: any) {
    setBalanceTest({
      loading: false,
      response: { error: error?.message || 'Unknown' },
      status: 500,
      tests: [{ name: 'API Call', passed: false, message: 'Request failed' }],
      expanded: true
    });
  }
};

const runTransferTest = async () => {
  setTransferTest(prev => ({ ...prev, loading: true, tests: [] }));
  try {
    const response = await apiService.getTransfers();
    const tests = testTransfersApi(response);
    setTransferTest({
      loading: false,
      response,
      status: 200,
      tests,
      expanded: true
    });
  } catch (error: any) {
    setTransferTest({
      loading: false,
      response: { error: error?.message || 'Unknown' },
      status: 500,
      tests: [{ name: 'API Call', passed: false, message: 'Request failed' }],
      expanded: true
    });
  }
};

const runCardTest = async () => {
  setCardTest(prev => ({ ...prev, loading: true, tests: [] }));
  try {
    const response = await apiService.getCards();
    const tests = testCardsApi(response);
    setCardTest({
      loading: false,
      response,
      status: 200,
      tests,
      expanded: true
    });
  } catch (error: any) {
    setCardTest({
      loading: false,
      response: { error: error?.message || 'Unknown' },
      status: 500,
      tests: [{ name: 'API Call', passed: false, message: 'Request failed' }],
      expanded: true
    });
  }
};

  const calculateCoverage = () => {
    const total = Object.keys(testCoverage).length;
    const covered = Object.values(testCoverage).filter(Boolean).length;
    return Math.round((covered / total) * 100);
  };

  const getOverallStatus = (tests: TestResult[]) => {
    if (tests.length === 0) return null;
    return tests.every(test => test.passed);
  };

return (
  <div className="min-h-screen bg-background p-6">
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">API Test Suite</h1>
        <p className="text-muted-foreground">Developer testing interface for API endpoints</p>
      </div>

      {/* Test Coverage Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Test Coverage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="text-2xl font-bold text-foreground">
              Test Coverage: {calculateCoverage()}%
            </div>
          </div>
          <div className="space-y-2">
            {Object.entries(testCoverage).map(([route, covered]) => (
              <div key={route} className="flex items-center justify-between">
                <span className="font-mono text-sm">{route}</span>
                <div className="flex items-center gap-2">
                  {covered ? (
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  ) : (
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {covered ? 'Covered' : 'Not Covered'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bridge Sandbox Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Live: Create Customer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Bridge: Create Customer
              {getOverallStatus(bridgeCreate.tests) !== null && (
                getOverallStatus(bridgeCreate.tests) ?
                  <Check className="h-5 w-5 text-green-500" /> :
                  <X className="h-5 w-5 text-red-500" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={async () => {
                setBridgeCreate((p) => ({ ...p, loading: true, tests: [] }));
                // sample payload (sandbox only)
                const payload = {
                  first_name: 'Jane',
                  last_name: 'Doe',
                  email: `jane.doe.${Date.now()}@example.com`,
                  address: {
                    street_line_1: '1 Market St',
                    street_line_2: 'Suite 100',
                    city: 'San Francisco',
                    state: 'CA',
                    postal_code: '94105',
                    country: 'USA',
                  },
                  birth_date: '1990-01-01',
                  tax_identification_number: '111-11-1111',
                  phone: '+15555550100',
                  signed_agreement_id: crypto.randomUUID(),
                  type: 'individual',
                };
                const res = await createCustomer(payload);
                // Simulate latency
                await new Promise((r) => setTimeout(r, 500));
                const tests = res.ok && res.data ? testBridgeCreate(res.data) : [{ name: 'Request', passed: false, message: 'Failed' }];
                if ((res.data as any)?.id) localStorage.setItem('last_customer_id', (res.data as any).id);
                setBridgeCreate({ loading: false, response: res.data, status: res.status, tests, expanded: true });
              }}
              disabled={bridgeCreate.loading}
              className="w-full mb-4"
            >
              {bridgeCreate.loading ? <LoadingSpinner size="sm" /> : 'Run Test'}
            </Button>

            {bridgeCreate.status > 0 && (
              <div className="space-y-2">
                <Badge variant={bridgeCreate.status === 200 ? 'default' : 'destructive'}>
                  {bridgeCreate.status} {bridgeCreate.status === 200 ? 'OK' : 'Error'}
                </Badge>
                {bridgeCreate.tests.map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {t.passed ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
                    <span>{t.name}: {t.message}</span>
                  </div>
                ))}
                <Collapsible open={bridgeCreate.expanded} onOpenChange={(open) => setBridgeCreate((p) => ({ ...p, expanded: open }))}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full justify-between">
                      Debug Response
                      {bridgeCreate.expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <pre className="bg-muted p-3 rounded text-xs overflow-auto">{JSON.stringify(bridgeCreate.response, null, 2)}</pre>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live: Fetch Customer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Bridge: Fetch Customer
              {getOverallStatus(bridgeFetch.tests) !== null && (
                getOverallStatus(bridgeFetch.tests) ?
                  <Check className="h-5 w-5 text-green-500" /> :
                  <X className="h-5 w-5 text-red-500" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-3">
              <input className="w-full rounded border px-2 py-1 bg-background" placeholder="customer id" value={bridgeFetchId} onChange={(e) => setBridgeFetchId(e.target.value)} />
              <Button onClick={async () => {
                setBridgeFetch((p) => ({ ...p, loading: true, tests: [] }));
                const id = bridgeFetchId || localStorage.getItem('last_customer_id') || '';
                const res = id ? await fetchCustomer(id) : { ok: false, status: 0, data: null };
                await new Promise((r) => setTimeout(r, 500));
                const tests = res.ok && res.data ? testBridgeFetch(res.data) : [{ name: 'Request', passed: false, message: 'Failed' }];
                setBridgeFetch({ loading: false, response: res.data, status: res.status, tests, expanded: true });
              }} disabled={bridgeFetch.loading}>
                {bridgeFetch.loading ? <LoadingSpinner size="sm" /> : 'Run Test'}
              </Button>
            </div>

            {bridgeFetch.status > 0 && (
              <div className="space-y-2">
                <Badge variant={bridgeFetch.status === 200 ? 'default' : 'destructive'}>
                  {bridgeFetch.status} {bridgeFetch.status === 200 ? 'OK' : 'Error'}
                </Badge>
                {bridgeFetch.tests.map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {t.passed ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
                    <span>{t.name}: {t.message}</span>
                  </div>
                ))}
                <Collapsible open={bridgeFetch.expanded} onOpenChange={(open) => setBridgeFetch((p) => ({ ...p, expanded: open }))}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full justify-between">
                      Debug Response
                      {bridgeFetch.expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <pre className="bg-muted p-3 rounded text-xs overflow-auto">{JSON.stringify(bridgeFetch.response, null, 2)}</pre>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security: Unauthorized */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Security: Unauthorized
              {getOverallStatus(bridgeAuth.tests) !== null && (
                getOverallStatus(bridgeAuth.tests) ?
                  <Check className="h-5 w-5 text-green-500" /> :
                  <X className="h-5 w-5 text-red-500" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={async () => {
              setBridgeAuth((p) => ({ ...p, loading: true, tests: [] }));
              const payload = {
                first_name: 'No', last_name: 'Auth', email: `no.auth.${Date.now()}@example.com`,
                address: { street_line_1: '1 Test', street_line_2: '', city: 'Test', state: 'TS', postal_code: '00000', country: 'USA' },
                birth_date: '1990-01-01', tax_identification_number: '111-11-1111', phone: '+15555550101', signed_agreement_id: crypto.randomUUID(), type: 'individual'
              };
              const res = await createCustomerNoAuth(payload);
              await new Promise((r) => setTimeout(r, 400));
              const tests = testUnauthorized(res.status);
              setBridgeAuth({ loading: false, response: res.data, status: res.status, tests, expanded: true });
            }} disabled={bridgeAuth.loading} className="w-full mb-4">
              {bridgeAuth.loading ? <LoadingSpinner size="sm" /> : 'Run Test'}
            </Button>

            {bridgeAuth.status > 0 && (
              <div className="space-y-2">
                <Badge variant={(bridgeAuth.status === 401 || bridgeAuth.status === 403) ? 'default' : 'destructive'}>
                  {bridgeAuth.status}
                </Badge>
                {bridgeAuth.tests.map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {t.passed ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
                    <span>{t.name}: {t.message}</span>
                  </div>
                ))}
                <Collapsible open={bridgeAuth.expanded} onOpenChange={(open) => setBridgeAuth((p) => ({ ...p, expanded: open }))}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full justify-between">
                      Debug Response
                      {bridgeAuth.expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <pre className="bg-muted p-3 rounded text-xs overflow-auto">{JSON.stringify(bridgeAuth.response, null, 2)}</pre>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Existing Mock API Tests */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Balance API Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Test Balance API
              {getOverallStatus(balanceTest.tests) !== null && (
                getOverallStatus(balanceTest.tests) ? 
                  <Check className="h-5 w-5 text-green-500" /> : 
                  <X className="h-5 w-5 text-red-500" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={runBalanceTest} 
              disabled={balanceTest.loading}
              className="w-full mb-4"
            >
              {balanceTest.loading ? <LoadingSpinner size="sm" /> : 'Run Test'}
            </Button>
            {balanceTest.status > 0 && (
              <div className="space-y-2">
                <Badge variant={balanceTest.status === 200 ? "default" : "destructive"}>
                  {balanceTest.status} {balanceTest.status === 200 ? 'OK' : 'Error'}
                </Badge>
                {balanceTest.tests.map((test, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    {test.passed ? 
                      <Check className="h-4 w-4 text-green-500" /> : 
                      <X className="h-4 w-4 text-red-500" />
                    }
                    <span>{test.name}: {test.message}</span>
                  </div>
                ))}
                <Collapsible open={balanceTest.expanded} onOpenChange={(open) => 
                  setBalanceTest(prev => ({ ...prev, expanded: open }))
                }>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full justify-between">
                      Debug Response
                      {balanceTest.expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <pre className="bg-muted p-3 rounded text-xs overflow-auto">
                      {JSON.stringify(balanceTest.response, null, 2)}
                    </pre>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transfer API Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Test Transfer API
              {getOverallStatus(transferTest.tests) !== null && (
                getOverallStatus(transferTest.tests) ? 
                  <Check className="h-5 w-5 text-green-500" /> : 
                  <X className="h-5 w-5 text-red-500" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={runTransferTest} 
              disabled={transferTest.loading}
              className="w-full mb-4"
            >
              {transferTest.loading ? <LoadingSpinner size="sm" /> : 'Run Test'}
            </Button>
            {transferTest.status > 0 && (
              <div className="space-y-2">
                <Badge variant={transferTest.status === 200 ? "default" : "destructive"}>
                  {transferTest.status} {transferTest.status === 200 ? 'OK' : 'Error'}
                </Badge>
                {transferTest.tests.map((test, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    {test.passed ? 
                      <Check className="h-4 w-4 text-green-500" /> : 
                      <X className="h-4 w-4 text-red-500" />
                    }
                    <span>{test.name}: {test.message}</span>
                  </div>
                ))}
                <Collapsible open={transferTest.expanded} onOpenChange={(open) => 
                  setTransferTest(prev => ({ ...prev, expanded: open }))
                }>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full justify-between">
                      Debug Response
                      {transferTest.expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <pre className="bg-muted p-3 rounded text-xs overflow-auto">
                      {JSON.stringify(transferTest.response, null, 2)}
                    </pre>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card API Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Test Credit Card API
              {getOverallStatus(cardTest.tests) !== null && (
                getOverallStatus(cardTest.tests) ? 
                  <Check className="h-5 w-5 text-green-500" /> : 
                  <X className="h-5 w-5 text-red-500" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={runCardTest} 
              disabled={cardTest.loading}
              className="w-full mb-4"
            >
              {cardTest.loading ? <LoadingSpinner size="sm" /> : 'Run Test'}
            </Button>
            {cardTest.status > 0 && (
              <div className="space-y-2">
                <Badge variant={cardTest.status === 200 ? "default" : "destructive"}>
                  {cardTest.status} {cardTest.status === 200 ? 'OK' : 'Error'}
                </Badge>
                {cardTest.tests.map((test, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    {test.passed ? 
                      <Check className="h-4 w-4 text-green-500" /> : 
                      <X className="h-4 w-4 text-red-500" />
                    }
                    <span>{test.name}: {test.message}</span>
                  </div>
                ))}
                <Collapsible open={cardTest.expanded} onOpenChange={(open) => 
                  setCardTest(prev => ({ ...prev, expanded: open }))
                }>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full justify-between">
                      Debug Response
                      {cardTest.expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <pre className="bg-muted p-3 rounded text-xs overflow-auto">
                      {JSON.stringify(cardTest.response, null, 2)}
                    </pre>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);
};

export default Tests;