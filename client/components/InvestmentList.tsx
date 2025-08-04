import { useState } from 'react';
import { Investment } from '@shared/investment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Edit2, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  MoreHorizontal,
  RefreshCw,
  Eye
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface InvestmentListProps {
  investments: Investment[];
  onUpdateInvestment: (id: string, data: Partial<Investment>) => void;
  onDeleteInvestment: (id: string) => void;
  onUpdateCurrentPrice: (id: string, currentPrice: number) => void;
}

export function InvestmentList({ 
  investments, 
  onUpdateInvestment, 
  onDeleteInvestment, 
  onUpdateCurrentPrice 
}: InvestmentListProps) {
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);
  const [updatingPrice, setUpdatingPrice] = useState<{ id: string; price: number } | null>(null);
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage > 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  const calculateGainLoss = (investment: Investment) => {
    const totalInvested = investment.quantity * investment.buyPrice;
    const currentValue = investment.quantity * investment.currentPrice;
    const gainLoss = currentValue - totalInvested;
    const gainLossPercentage = (gainLoss / totalInvested) * 100;
    
    return { gainLoss, gainLossPercentage, currentValue, totalInvested };
  };

  const handleUpdatePrice = (investment: Investment) => {
    if (updatingPrice && updatingPrice.price > 0) {
      onUpdateCurrentPrice(investment.id, updatingPrice.price);
      setUpdatingPrice(null);
      toast({
        title: "Price Updated",
        description: `${investment.name} price updated to ${formatCurrency(updatingPrice.price)}`,
      });
    }
  };

  const handleDelete = (investment: Investment) => {
    onDeleteInvestment(investment.id);
    toast({
      title: "Investment Deleted",
      description: `${investment.name} has been removed from your portfolio.`,
    });
  };

  if (investments.length === 0) {
    return (
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Investments Yet</h3>
          <p className="text-slate-600 text-center max-w-md">
            Start building your portfolio by adding your first investment. Track stocks, mutual funds, ETFs and more.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Your Investments</CardTitle>
        <CardDescription>Track and manage all your investments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Investment</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Buy Price</TableHead>
                <TableHead>Current Price</TableHead>
                <TableHead>Current Value</TableHead>
                <TableHead>Gain/Loss</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investments.map((investment) => {
                const { gainLoss, gainLossPercentage, currentValue } = calculateGainLoss(investment);
                const isProfit = gainLoss >= 0;
                
                return (
                  <TableRow key={investment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-slate-900">{investment.name}</div>
                        {investment.symbol && (
                          <div className="text-sm text-slate-500">{investment.symbol}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {investment.type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{investment.quantity}</TableCell>
                    <TableCell>{formatCurrency(investment.buyPrice)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {formatCurrency(investment.currentPrice)}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => setUpdatingPrice({ id: investment.id, price: investment.currentPrice })}
                            >
                              <RefreshCw className="w-3 h-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Update Current Price</DialogTitle>
                              <DialogDescription>
                                Update the current market price for {investment.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="currentPrice">Current Price (₹)</Label>
                                <Input
                                  id="currentPrice"
                                  type="number"
                                  min="0.01"
                                  step="0.01"
                                  value={updatingPrice?.price || investment.currentPrice}
                                  onChange={(e) => setUpdatingPrice(prev => prev ? 
                                    { ...prev, price: parseFloat(e.target.value) || 0 } : 
                                    { id: investment.id, price: parseFloat(e.target.value) || 0 }
                                  )}
                                />
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setUpdatingPrice(null)}>
                                  Cancel
                                </Button>
                                <Button onClick={() => handleUpdatePrice(investment)}>
                                  Update Price
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(currentValue)}
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-1 ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                        {isProfit ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <div>
                          <div className="font-medium">{formatCurrency(Math.abs(gainLoss))}</div>
                          <div className="text-xs">{formatPercentage(gainLossPercentage)}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingInvestment(investment)}>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Investment</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {investment.name}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(investment)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
