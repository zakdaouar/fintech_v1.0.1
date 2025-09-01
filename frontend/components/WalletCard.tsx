import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getStatusColor } from "@/utils/formatters";
import type { WalletBalance } from "@/utils/api";
import { Badge, Card } from 'lucide-react';


interface WalletCardProps {
  wallet: WalletBalance;
}

export const WalletCard = ({ wallet }: WalletCardProps) => {
  return (
    <Card className="p-6 bg-gradient-card border-border hover:border-primary/50 transition-all duration-300 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{wallet.flag}</span>
          <div>
            <h3 className="font-semibold text-lg">{wallet.currency}</h3>
            <p className="text-sm text-muted-foreground">{wallet.method}</p>
          </div>
        </div>
        <Badge 
          variant="secondary" 
          className={`${getStatusColor(wallet.status)} bg-success/10 border-success/20`}
        >
          {wallet.status}
        </Badge>
      </div>
      
      <div className="space-y-2">
        <div className="text-2xl font-bold">
          {formatCurrency(wallet.amount, wallet.currency)}
        </div>
        <div className="text-sm text-muted-foreground">
          Available Balance
        </div>
      </div>
    </Card>
  );
};