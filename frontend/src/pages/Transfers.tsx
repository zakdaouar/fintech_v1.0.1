import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { TransferItem } from "@/components/TransferItem";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Send, CheckCircle } from "lucide-react";
import { apiService, type Transfer } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";

const Transfers = () => {
  const { toast } = useToast();
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    currency: '',
    recipient: '',
  });

  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        const data = await apiService.getTransfers();
        setTransfers(data);
      } catch (error) {
        console.error('Error fetching transfers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransfers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.amount || !formData.currency || !formData.recipient) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Transfer submitted:', formData);
      
      // Create new transfer object
      const newTransfer: Transfer = {
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        to: formData.recipient,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending'
      };
      
      // Add to transfers list
      setTransfers(prev => [newTransfer, ...prev]);
      
      // Reset form
      setFormData({
        amount: '',
        currency: '',
        recipient: '',
      });
      
      // Show success message
      toast({
        title: "Transfer Initiated",
        description: `Successfully sent ${formData.currency} ${formData.amount} to ${formData.recipient}`,
      });
      
    } catch (error) {
      console.error('Transfer error:', error);
      toast({
        title: "Transfer Failed",
        description: "There was an error processing your transfer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <TopBar />
        
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Send className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Transfers</h1>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Transfer Form */}
            <Card className="p-6 bg-gradient-card border-border shadow-card">
              <h2 className="text-xl font-semibold mb-6">Send Money</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select 
                    value={formData.currency} 
                    onValueChange={(value) => handleInputChange('currency', value)}
                  >
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">🇺🇸 USD</SelectItem>
                      <SelectItem value="EUR">🇪🇺 EUR</SelectItem>
                      <SelectItem value="MXN">🇲🇽 MXN</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient Email</Label>
                  <Input
                    id="recipient"
                    type="email"
                    placeholder="recipient@example.com"
                    value={formData.recipient}
                    onChange={(e) => handleInputChange('recipient', e.target.value)}
                    className="bg-input border-border"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full bg-gradient-primary hover:opacity-90 text-white font-semibold py-3 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Transfer
                    </>
                  )}
                </Button>
              </form>
            </Card>

            {/* Recent Transfers */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Recent Transfers</h2>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <div className="space-y-3">
                  {transfers.map((transfer, index) => (
                    <TransferItem key={index} transfer={transfer} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Transfers;