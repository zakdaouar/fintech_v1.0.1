import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { WalletCard } from "@/components/WalletCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Plus, Send, TrendingUp, CreditCard, Building } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { apiService, type Balance, type WalletBalance } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [balance, setBalance] = useState<Balance | null>(null);
  const [wallets, setWallets] = useState<WalletBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [addMoneyOpen, setAddMoneyOpen] = useState(false);
  const [addingMoney, setAddingMoney] = useState(false);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleAddMoney = async () => {
    if (!amount || !paymentMethod) {
      toast({
        title: "Missing Information",
        description: "Please enter an amount and select a payment method.",
        variant: "destructive",
      });
      return;
    }

    setAddingMoney(true);
    try {
      // Simulate API call to add money
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Money Added Successfully",
        description: `$${amount} has been added to your account.`,
      });
      
      setAddMoneyOpen(false);
      setAmount("");
      setPaymentMethod("");
      
      // Refresh balance data
      const balanceData = await apiService.getBalances();
      setBalance(balanceData);
    } catch (error) {
      toast({
        title: "Failed to Add Money",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAddingMoney(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [balanceData, walletsData] = await Promise.all([
          apiService.getBalances(),
          apiService.getWallets(),
        ]);
        setBalance(balanceData);
        setWallets(walletsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <TopBar />
        
        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Balance Card */}
          <Card className="p-6 bg-gradient-card border-border shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Total Balance</h3>
                <div className="text-3xl font-bold text-primary">
                  {balance ? formatCurrency(balance.total_balance_usd) : '$0.00'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-success" />
                <span className="text-sm text-success">+2.5% this month</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              USD equivalent across all your wallets
            </p>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Dialog open={addMoneyOpen} onOpenChange={setAddMoneyOpen}>
              <DialogTrigger asChild>
                <Button className="flex-1 bg-gradient-primary hover:opacity-90 text-white font-semibold py-6">
                  <Plus className="mr-2 h-5 w-5" />
                  Add Money
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Money to Your Account</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="1"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Label htmlFor="payment-method">Payment Method</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Credit/Debit Card
                          </div>
                        </SelectItem>
                        <SelectItem value="bank">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            Bank Transfer
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={handleAddMoney} 
                    disabled={addingMoney || !amount || !paymentMethod}
                    className="w-full"
                  >
                    {addingMoney && <LoadingSpinner size="sm" className="mr-2" />}
                    {addingMoney ? "Processing..." : "Add Money"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button 
              className="flex-1 bg-accent hover:opacity-90 text-accent-foreground font-semibold py-6"
              onClick={() => navigate('/transfers')}
            >
              <Send className="mr-2 h-5 w-5" />
              Send Money
            </Button>
          </div>

          {/* Wallet Cards */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Your Wallets</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {wallets.map((wallet, index) => (
                <WalletCard key={index} wallet={wallet} />
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="p-6 bg-gradient-card border-border shadow-card">
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-muted-foreground">Transactions this month</div>
            </Card>
            <Card className="p-6 bg-gradient-card border-border shadow-card">
              <div className="text-2xl font-bold">3</div>
              <div className="text-sm text-muted-foreground">Active currencies</div>
            </Card>
            <Card className="p-6 bg-gradient-card border-border shadow-card">
              <div className="text-2xl font-bold">$2,450</div>
              <div className="text-sm text-muted-foreground">Total transferred</div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;