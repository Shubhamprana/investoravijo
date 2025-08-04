import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { InvestmentFormData, INVESTMENT_TYPES } from '@shared/investment';
import { Plus, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddInvestmentFormProps {
  onAddInvestment: (data: InvestmentFormData) => void;
}

export function AddInvestmentForm({ onAddInvestment }: AddInvestmentFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<InvestmentFormData>({
    name: '',
    type: 'stock',
    symbol: '',
    quantity: 1,
    buyPrice: 0,
    currentPrice: 0,
    buyDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || formData.quantity <= 0 || formData.buyPrice <= 0 || formData.currentPrice <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields with valid values.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      onAddInvestment(formData);
      
      // Reset form
      setFormData({
        name: '',
        type: 'stock',
        symbol: '',
        quantity: 1,
        buyPrice: 0,
        currentPrice: 0,
        buyDate: new Date().toISOString().split('T')[0],
        notes: '',
      });
      
      setIsOpen(false);
      
      toast({
        title: "Investment Added",
        description: `${formData.name} has been added to your portfolio.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add investment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof InvestmentFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Investment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Add New Investment
          </DialogTitle>
          <DialogDescription>
            Add a new investment to track in your portfolio.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Investment Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Reliance Industries"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INVESTMENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol/Code</Label>
              <Input
                id="symbol"
                value={formData.symbol}
                onChange={(e) => handleInputChange('symbol', e.target.value)}
                placeholder="e.g., RELIANCE"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="0.01"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', parseFloat(e.target.value) || 0)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buyPrice">Buy Price (₹) *</Label>
              <Input
                id="buyPrice"
                type="number"
                min="0.01"
                step="0.01"
                value={formData.buyPrice}
                onChange={(e) => handleInputChange('buyPrice', parseFloat(e.target.value) || 0)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currentPrice">Current Price (₹) *</Label>
              <Input
                id="currentPrice"
                type="number"
                min="0.01"
                step="0.01"
                value={formData.currentPrice}
                onChange={(e) => handleInputChange('currentPrice', parseFloat(e.target.value) || 0)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="buyDate">Purchase Date *</Label>
            <Input
              id="buyDate"
              type="date"
              value={formData.buyDate}
              onChange={(e) => handleInputChange('buyDate', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any additional notes about this investment..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Investment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
