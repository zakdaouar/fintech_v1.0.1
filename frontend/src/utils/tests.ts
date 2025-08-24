import { Balance, Transfer, Card } from './api';

export interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

export function testBalancesApi(response: Balance): TestResult[] {
  const tests: TestResult[] = [];
  
  // Test 1: Response has total_balance_usd property
  tests.push({
    name: 'Has total_balance_usd',
    passed: 'total_balance_usd' in response,
    message: 'total_balance_usd' in response ? 'Property exists' : 'Property missing'
  });
  
  // Test 2: total_balance_usd is a number
  tests.push({
    name: 'total_balance_usd is number',
    passed: typeof response.total_balance_usd === 'number',
    message: typeof response.total_balance_usd === 'number' ? 
      `Valid number: ${response.total_balance_usd}` : 
      `Invalid type: ${typeof response.total_balance_usd}`
  });
  
  // Test 3: total_balance_usd is positive
  tests.push({
    name: 'Balance is positive',
    passed: response.total_balance_usd >= 0,
    message: response.total_balance_usd >= 0 ? 
      'Balance is non-negative' : 
      'Balance is negative'
  });
  
  return tests;
}

export function testTransfersApi(response: Transfer[]): TestResult[] {
  const tests: TestResult[] = [];
  
  // Test 1: Response is an array
  tests.push({
    name: 'Response is array',
    passed: Array.isArray(response),
    message: Array.isArray(response) ? 
      `Array with ${response.length} items` : 
      `Invalid type: ${typeof response}`
  });
  
  if (Array.isArray(response) && response.length > 0) {
    const firstTransfer = response[0];
    
    // Test 2: Has required properties
    const requiredProps = ['amount', 'currency', 'to'];
    const hasAllProps = requiredProps.every(prop => prop in firstTransfer);
    tests.push({
      name: 'Has required properties',
      passed: hasAllProps,
      message: hasAllProps ? 
        'All required properties present' : 
        `Missing: ${requiredProps.filter(prop => !(prop in firstTransfer)).join(', ')}`
    });
    
    // Test 3: Amount is a number
    tests.push({
      name: 'Amount is number',
      passed: typeof firstTransfer.amount === 'number',
      message: typeof firstTransfer.amount === 'number' ? 
        `Valid amount: ${firstTransfer.amount}` : 
        `Invalid amount type: ${typeof firstTransfer.amount}`
    });
    
    // Test 4: Currency is a string
    tests.push({
      name: 'Currency is string',
      passed: typeof firstTransfer.currency === 'string',
      message: typeof firstTransfer.currency === 'string' ? 
        `Valid currency: ${firstTransfer.currency}` : 
        `Invalid currency type: ${typeof firstTransfer.currency}`
    });
    
    // Test 5: To field is a string
    tests.push({
      name: 'To field is string',
      passed: typeof firstTransfer.to === 'string',
      message: typeof firstTransfer.to === 'string' ? 
        `Valid recipient: ${firstTransfer.to}` : 
        `Invalid recipient type: ${typeof firstTransfer.to}`
    });
  } else {
    tests.push({
      name: 'Array validation',
      passed: false,
      message: 'Empty array or not an array'
    });
  }
  
  return tests;
}

export function testCardsApi(response: Card[]): TestResult[] {
  const tests: TestResult[] = [];
  
  // Test 1: Response is an array
  tests.push({
    name: 'Response is array',
    passed: Array.isArray(response),
    message: Array.isArray(response) ? 
      `Array with ${response.length} items` : 
      `Invalid type: ${typeof response}`
  });
  
  if (Array.isArray(response) && response.length > 0) {
    const firstCard = response[0];
    
    // Test 2: Has required properties
    const requiredProps = ['currency', 'status', 'last4'];
    const hasAllProps = requiredProps.every(prop => prop in firstCard);
    tests.push({
      name: 'Has required properties',
      passed: hasAllProps,
      message: hasAllProps ? 
        'All required properties present' : 
        `Missing: ${requiredProps.filter(prop => !(prop in firstCard)).join(', ')}`
    });
    
    // Test 3: Currency is a string
    tests.push({
      name: 'Currency is string',
      passed: typeof firstCard.currency === 'string',
      message: typeof firstCard.currency === 'string' ? 
        `Valid currency: ${firstCard.currency}` : 
        `Invalid currency type: ${typeof firstCard.currency}`
    });
    
    // Test 4: Status is a string
    tests.push({
      name: 'Status is string',
      passed: typeof firstCard.status === 'string',
      message: typeof firstCard.status === 'string' ? 
        `Valid status: ${firstCard.status}` : 
        `Invalid status type: ${typeof firstCard.status}`
    });
    
    // Test 5: Last4 is a string
    tests.push({
      name: 'Last4 is string',
      passed: typeof firstCard.last4 === 'string',
      message: typeof firstCard.last4 === 'string' ? 
        `Valid last4: ${firstCard.last4}` : 
        `Invalid last4 type: ${typeof firstCard.last4}`
    });
    
    // Test 6: Last4 has correct length
    tests.push({
      name: 'Last4 length is 4',
      passed: firstCard.last4.length === 4,
      message: firstCard.last4.length === 4 ? 
        'Correct last4 length' : 
        `Invalid length: ${firstCard.last4.length}`
    });
    
    // Test 7: Status is valid
    const validStatuses = ['Issued', 'Pending', 'Cancelled', 'Expired'];
    tests.push({
      name: 'Valid status',
      passed: validStatuses.includes(firstCard.status),
      message: validStatuses.includes(firstCard.status) ? 
        'Valid status value' : 
        `Invalid status: ${firstCard.status}`
    });
  } else {
    tests.push({
      name: 'Array validation',
      passed: false,
      message: 'Empty array or not an array'
    });
  }
  
  return tests;
}

// Bridge Sandbox tests
export function testBridgeCreate(response: any): TestResult[] {
  const tests: TestResult[] = [];
  tests.push({
    name: 'Has id',
    passed: typeof response?.id === 'string',
    message: typeof response?.id === 'string' ? 'Valid id' : 'Missing id'
  });
  tests.push({
    name: 'Has status',
    passed: typeof response?.status === 'string',
    message: typeof response?.status === 'string' ? `Status: ${response.status}` : 'Missing status'
  });
  tests.push({
    name: 'Valid created_at date',
    passed: Boolean(response?.created_at && !isNaN(Date.parse(response.created_at))),
    message: response?.created_at || 'No created_at'
  });
  return tests;
}

export function testBridgeFetch(response: any): TestResult[] {
  const tests: TestResult[] = [];
  tests.push({
    name: 'Has first_name',
    passed: typeof response?.first_name === 'string',
    message: typeof response?.first_name === 'string' ? 'first_name present' : 'Missing first_name'
  });
  tests.push({
    name: 'Has last_name',
    passed: typeof response?.last_name === 'string',
    message: typeof response?.last_name === 'string' ? 'last_name present' : 'Missing last_name'
  });
  tests.push({
    name: 'Has status',
    passed: typeof response?.status === 'string',
    message: typeof response?.status === 'string' ? `Status: ${response.status}` : 'Missing status'
  });
  if (response?.capabilities) {
    tests.push({
      name: 'Capabilities object',
      passed: typeof response.capabilities === 'object',
      message: 'Capabilities present'
    });
  }
  return tests;
}

export function testUnauthorized(status: number): TestResult[] {
  return [{
    name: 'Forbidden without auth',
    passed: status === 401 || status === 403,
    message: `Status ${status}`,
  }];
}
