import { useState } from 'react';
import { Investor } from '@shared/investor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Edit2, 
  Trash2, 
  Mail, 
  Phone, 
  Globe, 
  MapPin,
  Calendar,
  Users,
  Filter,
  Search,
  Grid,
  List,
  ExternalLink
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface InvestorListProps {
  investors: Investor[];
  onUpdateInvestor: (id: string, data: Partial<Investor>) => void;
  onDeleteInvestor: (id: string) => void;
  searchInvestors: (query: string) => Investor[];
}

export function InvestorList({ 
  investors, 
  onUpdateInvestor, 
  onDeleteInvestor,
  searchInvestors
}: InvestorListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const { toast } = useToast();

  const filteredInvestors = investors.filter(investor => {
    const matchesSearch = searchQuery === '' || searchInvestors(searchQuery).includes(investor);
    const matchesStatus = statusFilter === 'all' || investor.status === statusFilter;
    const matchesType = typeFilter === 'all' || investor.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: Investor['status']) => {
    const colors = {
      'researching': 'bg-gray-100 text-gray-800',
      'contacted': 'bg-blue-100 text-blue-800',
      'application_submitted': 'bg-yellow-100 text-yellow-800',
      'meeting_scheduled': 'bg-purple-100 text-purple-800',
      'under_review': 'bg-orange-100 text-orange-800',
      'rejected': 'bg-red-100 text-red-800',
      'invested': 'bg-green-100 text-green-800',
      'follow_up': 'bg-indigo-100 text-indigo-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: Investor['type']) => {
    const colors = {
      'vc': 'bg-blue-50 text-blue-700',
      'angel': 'bg-green-50 text-green-700',
      'incubator': 'bg-purple-50 text-purple-700',
      'accelerator': 'bg-orange-50 text-orange-700',
      'family_office': 'bg-pink-50 text-pink-700',
      'corporate': 'bg-slate-50 text-slate-700',
      'government': 'bg-emerald-50 text-emerald-700',
      'other': 'bg-gray-50 text-gray-700',
    };
    return colors[type] || 'bg-gray-50 text-gray-700';
  };

  const handleDelete = (investor: Investor) => {
    onDeleteInvestor(investor.id);
    toast({
      title: "Investor Deleted",
      description: `${investor.name} has been removed from your database.`,
    });
  };

  if (investors.length === 0) {
    return (
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Investors Yet</h3>
          <p className="text-slate-600 text-center max-w-md">
            Start building your investor database by adding your first investor contact.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Investor Database</CardTitle>
          <CardDescription>Manage your investor outreach and track communication</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search investors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="researching">Researching</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="application_submitted">Applied</SelectItem>
                  <SelectItem value="meeting_scheduled">Meeting</SelectItem>
                  <SelectItem value="under_review">Review</SelectItem>
                  <SelectItem value="invested">Invested</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="follow_up">Follow Up</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="vc">VC</SelectItem>
                  <SelectItem value="angel">Angel</SelectItem>
                  <SelectItem value="incubator">Incubator</SelectItem>
                  <SelectItem value="accelerator">Accelerator</SelectItem>
                  <SelectItem value="family_office">Family Office</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investors Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvestors.map((investor) => (
            <Card key={investor.id} className="bg-white/60 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{investor.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getTypeColor(investor.type)} variant="secondary">
                        {investor.type.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(investor.status)} variant="secondary">
                        {investor.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
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
                            <AlertDialogTitle>Delete Investor</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {investor.name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(investor)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{investor.email}</span>
                  </div>
                  
                  {investor.phone && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-4 h-4" />
                      <span>{investor.phone}</span>
                    </div>
                  )}
                  
                  {investor.website && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Globe className="w-4 h-4" />
                      <a 
                        href={investor.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        Visit Website
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                  
                  {investor.location && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="w-4 h-4" />
                      <span>{investor.location}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">Focus:</p>
                  <div className="flex flex-wrap gap-1">
                    {investor.investmentFocus.slice(0, 3).map((focus) => (
                      <Badge key={focus} variant="outline" className="text-xs">
                        {focus}
                      </Badge>
                    ))}
                    {investor.investmentFocus.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{investor.investmentFocus.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {investor.nextAction && (
                  <div className="pt-2 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <span className="truncate">{investor.nextAction}</span>
                    </div>
                    {investor.nextActionDate && (
                      <p className="text-xs text-slate-500 ml-6">
                        {new Date(investor.nextActionDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="divide-y divide-slate-200">
              {filteredInvestors.map((investor) => (
                <div key={investor.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900">{investor.name}</h3>
                        <Badge className={getTypeColor(investor.type)} variant="secondary">
                          {investor.type.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(investor.status)} variant="secondary">
                          {investor.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span className="truncate">{investor.email}</span>
                        </div>
                        
                        {investor.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{investor.location}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Stage:</span>
                          <span>{investor.stagePreference.replace('_', ' ')}</span>
                        </div>
                        
                        {investor.nextActionDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(investor.nextActionDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {investor.investmentFocus.slice(0, 5).map((focus) => (
                            <Badge key={focus} variant="outline" className="text-xs">
                              {focus}
                            </Badge>
                          ))}
                          {investor.investmentFocus.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{investor.investmentFocus.length - 5} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
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
                              <AlertDialogTitle>Delete Investor</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {investor.name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(investor)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
