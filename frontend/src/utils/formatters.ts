// Utility functions for formatting data

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'activated':
    case 'issued':
      return 'text-success';
    case 'pending':
      return 'text-warning';
    case 'failed':
    case 'declined':
      return 'text-destructive';
    default:
      return 'text-muted-foreground';
  }
};

export const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    MXN: '$',
    GBP: '£',
  };
  return symbols[currency] || currency;
};