import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { CreditCard, Wallet } from "lucide-react";

const IssueCard = () => {
  const [formData, setFormData] = useState({
    cardName: '',
    currency: '',
    limit: '',
    duration: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Card issued:', formData);
    // Here you would typically call an API to issue the card
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
            <CreditCard className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Issue Credit Card</h1>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Card Form */}
            <Card className="p-6 bg-gradient-card border-border shadow-card">
              <h2 className="text-xl font-semibold mb-6">Card Details</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="cardName">Card Name</Label>
                  <Input
                    id="cardName"
                    placeholder="Business Card"
                    value={formData.cardName}
                    onChange={(e) => handleInputChange('cardName', e.target.value)}
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
                      <SelectItem value="USD">🇺🇸 USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">🇪🇺 EUR - Euro</SelectItem>
                      <SelectItem value="MXN">🇲🇽 MXN - Mexican Peso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="limit">Credit Limit</Label>
                  <Input
                    id="limit"
                    type="number"
                    placeholder="5000"
                    value={formData.limit}
                    onChange={(e) => handleInputChange('limit', e.target.value)}
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (months)</Label>
                  <Select 
                    value={formData.duration} 
                    onValueChange={(value) => handleInputChange('duration', value)}
                  >
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12 months</SelectItem>
                      <SelectItem value="24">24 months</SelectItem>
                      <SelectItem value="36">36 months</SelectItem>
                      <SelectItem value="60">60 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-primary hover:opacity-90 text-white font-semibold py-3"
                >
                  Issue Card
                </Button>
              </form>
            </Card>

            {/* Card Preview */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Card Preview</h2>
              
              <div className="relative">
                <Card className="w-full max-w-sm aspect-[1.6/1] bg-gradient-primary p-6 text-white shadow-xl-custom">
                  <div className="flex justify-between items-start mb-8">
                    <div className="p-2 rounded bg-white/20">
                      <Wallet className="h-6 w-6" />
                    </div>
                    <div className="text-right">
                      <div className="text-sm opacity-80">Remoove</div>
                      <div className="text-xs opacity-60">PREMIUM</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-lg font-mono tracking-wider">
                      •••• •••• •••• 1234
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-xs opacity-60 uppercase">Card Holder</div>
                        <div className="font-semibold">
                          {formData.cardName || 'CARD NAME'}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xs opacity-60 uppercase">Currency</div>
                        <div className="font-semibold">
                          {formData.currency || 'USD'}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Card Features */}
              <Card className="p-6 bg-gradient-card border-border shadow-card">
                <h3 className="font-semibold mb-4">Card Features</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Worldwide acceptance</li>
                  <li>• Real-time transaction notifications</li>
                  <li>• Advanced fraud protection</li>
                  <li>• Flexible spending controls</li>
                  <li>• Instant virtual card activation</li>
                </ul>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default IssueCard;