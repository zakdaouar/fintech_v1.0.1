import { Card } from '@/components/ui/card';

import { Input } from '@/components/ui/input';

import { formatCurrency } from '@/utils/formatters';

export function formatCurrency(


  amount: number,


  currency: string = "USD",


  locale: string = "en-US"


) {


  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);


}





export function formatAmountCents(


  cents: number,


  currency: string = "USD",


  locale: string = "en-US"


) {


  const amount = (cents ?? 0) / 100;


  return formatCurrency(amount, currency, locale);


}





export function formatDate(input: string | number | Date, locale: string = "en-GB") {


  const d = new Date(input);


  return isNaN(d.getTime()) ? "" : d.toLocaleDateString(locale);


}





export function maskCard(card: string, visible: number = 4) {


  if (!card) return "";


  const clean = card.replace(/\s+/g, "");


  const tail = clean.slice(-visible);


  return `ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢ ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢ ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢ ${tail}`;


}





export function maskAccount(ibanOrAcct: string, visible: number = 4) {


  if (!ibanOrAcct) return "";


  const clean = ibanOrAcct.replace(/\s+/g, "");


  const tail = clean.slice(-visible);


  return `****${tail}`;


}





// Alias rÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©tro-compat si certains composants appellent formatAmount()


export const formatAmount = formatAmountCents;