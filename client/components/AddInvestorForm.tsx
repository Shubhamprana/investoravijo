import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  InvestorFormData, 
  INVESTOR_TYPES, 
  STAGE_PREFERENCES, 
  INVESTOR_STATUSES, 
  INVESTMENT_FOCUS_OPTIONS,
  CURRENCIES 
} from '@shared/investor';
import { Plus, Users, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddInvestorFormProps {
  onAddInvestor: (data: InvestorFormData) => void;
}

export function AddInvestorForm({ onAddInvestor }: AddInvestorFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<InvestorFormData>({
    name: '',
    type: 'vc',
    email: '',
    phone: '',
    website: '',
    contactPerson: '',
    location: '',
    investmentFocus: [],
    stagePreference: 'seed',
    status: 'researching',
    notes: '',
    nextAction: '',
    nextActionDate: '',
    tags: [],
  });

  const [focusInput, setFocusInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || formData.investmentFocus.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in name, email, and at least one investment focus.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      onAddInvestor(formData);
      
      // Reset form
      setFormData({
        name: '',
        type: 'vc',
        email: '',
        phone: '',
        website: '',
        contactPerson: '',
        location: '',
        investmentFocus: [],
        stagePreference: 'seed',
        status: 'researching',
        notes: '',
        nextAction: '',
        nextActionDate: '',
        tags: [],
      });
      
      setIsOpen(false);
      
      toast({
        title: "Investor Added",
        description: `${formData.name} has been added to your investor database.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add investor. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof InvestorFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addInvestmentFocus = (focus: string) => {
    if (focus && !formData.investmentFocus.includes(focus)) {
      setFormData(prev => ({
        ...prev,
        investmentFocus: [...prev.investmentFocus, focus]
      }));
    }
    setFocusInput('');
  };

  const removeInvestmentFocus = (focus: string) => {
    setFormData(prev => ({
      ...prev,
      investmentFocus: prev.investmentFocus.filter(f => f !== focus)
    }));
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags?.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag]
      }));
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || []
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Investor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Add New Investor
          </DialogTitle>
          <DialogDescription>
            Add a new investor to track in your outreach database.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Investor Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Sequoia Capital"
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
                  {INVESTOR_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="contact@investor.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                placeholder="John Smith"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://investor.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="San Francisco, CA"
            />
          </div>

          {/* Investment Preferences */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Investment Focus *</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.investmentFocus.map((focus) => (
                  <Badge key={focus} variant="secondary" className="flex items-center gap-1">
                    {focus}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => removeInvestmentFocus(focus)}
                    />
                  </Badge>
                ))}
              </div>
              <Select value={focusInput} onValueChange={addInvestmentFocus}>
                <SelectTrigger>
                  <SelectValue placeholder="Add investment focus areas" />
                </SelectTrigger>
                <SelectContent>
                  {INVESTMENT_FOCUS_OPTIONS.filter(focus => !formData.investmentFocus.includes(focus)).map((focus) => (
                    <SelectItem key={focus} value={focus}>
                      {focus}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stagePreference">Stage Preference</Label>
              <Select value={formData.stagePreference} onValueChange={(value) => handleInputChange('stagePreference', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAGE_PREFERENCES.map((stage) => (
                    <SelectItem key={stage.value} value={stage.value}>
                      {stage.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Ticket Size */}
          <div className="space-y-2">
            <Label>Ticket Size</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Input
                type="number"
                placeholder="Min amount"
                value={formData.ticketSize?.min || ''}
                onChange={(e) => handleInputChange('ticketSize', {
                  ...formData.ticketSize,
                  min: parseFloat(e.target.value) || 0,
                  max: formData.ticketSize?.max || 0,
                  currency: formData.ticketSize?.currency || 'USD'
                })}
              />
              <Input
                type="number"
                placeholder="Max amount"
                value={formData.ticketSize?.max || ''}
                onChange={(e) => handleInputChange('ticketSize', {
                  ...formData.ticketSize,
                  min: formData.ticketSize?.min || 0,
                  max: parseFloat(e.target.value) || 0,
                  currency: formData.ticketSize?.currency || 'USD'
                })}
              />
              <Select 
                value={formData.ticketSize?.currency || 'USD'} 
                onValueChange={(value) => handleInputChange('ticketSize', {
                  ...formData.ticketSize,
                  min: formData.ticketSize?.min || 0,
                  max: formData.ticketSize?.max || 0,
                  currency: value as any
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status and Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INVESTOR_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nextActionDate">Next Action Date</Label>
              <Input
                id="nextActionDate"
                type="date"
                value={formData.nextActionDate}
                onChange={(e) => handleInputChange('nextActionDate', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nextAction">Next Action</Label>
            <Input
              id="nextAction"
              value={formData.nextAction}
              onChange={(e) => handleInputChange('nextAction', e.target.value)}
              placeholder="e.g., Send pitch deck, Schedule call"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any additional notes about this investor..."
              rows={3}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags?.map((tag) => (
                <Badge key={tag} variant="outline" className="flex items-center gap-1">
                  {tag}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tag"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag(tagInput);
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={() => addTag(tagInput)}>
                Add
              </Button>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Investor'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
