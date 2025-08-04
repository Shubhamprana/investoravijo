import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AddInvestorForm } from "@/components/AddInvestorForm";
import { InvestorList } from "@/components/InvestorList";

import { useInvestors } from "@/hooks/use-investors-supabase";
import { useAuth } from "@/hooks/use-auth";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  Activity, 
  Users, 
  Bell,
  Search,
  Settings,
  Plus,
  BarChart3,
  Target,
  Calendar,
  Filter,
  Download,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  LogOut,
  User
} from "lucide-react";

export default function Index() {
  const { user, signOut } = useAuth();
  const {
    investors,
    isLoading,
    addInvestor,
    updateInvestor,
    deleteInvestor,
    calculateOutreach,
    getInvestorsByStatus,
    getRecentlyAdded,
    getUpcomingActions,
    exportToCSV,
    searchInvestors,
  } = useInvestors();

  const outreach = calculateOutreach();
  const recentlyAdded = getRecentlyAdded();
  const upcomingActions = getUpcomingActions();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'invested':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'under_review':
        return <Clock className="w-4 h-4 text-orange-600" />;
      case 'meeting_scheduled':
        return <Calendar className="w-4 h-4 text-purple-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4">
            <svg viewBox="0 0 50 50" className="w-full h-full">
              <circle
                className="opacity-30"
                cx="25"
                cy="25"
                r="20"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
              />
              <circle
                className="text-blue-600"
                cx="25"
                cy="25"
                r="20"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeDasharray="100"
                strokeDashoffset="75"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800">Loading Dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Avijo</h1>
                  <p className="text-xs text-slate-500">Investor Tracking Dashboard</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search investors..." 
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportToCSV}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
              <AddInvestorForm onAddInvestor={addInvestor} />
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.user_metadata?.full_name || 'User'}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {user?.user_metadata?.full_name || 'there'}!
          </h2>
          <p className="text-slate-600">
            {investors.length === 0
              ? "Start tracking your investor outreach to manage your fundraising efforts."
              : `You have ${investors.length} investor${investors.length === 1 ? '' : 's'} in your database.`
            }
          </p>
        </div>



        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Investors</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{outreach.totalInvestors}</div>
              <div className="flex items-center space-x-1 text-sm">
                <span className="text-slate-500">In your database</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Active Outreach</CardTitle>
              <Activity className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {(outreach.byStatus['contacted'] || 0) + (outreach.byStatus['application_submitted'] || 0) + (outreach.byStatus['meeting_scheduled'] || 0) + (outreach.byStatus['under_review'] || 0)}
              </div>
              <div className="flex items-center space-x-1 text-sm">
                <TrendingUp className="w-3 h-3 text-orange-600" />
                <span className="text-orange-600 font-medium">In progress</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Successful</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{outreach.byStatus['invested'] || 0}</div>
              <div className="flex items-center space-x-1 text-sm">
                <span className="text-slate-500">Investments secured</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Response Rate</CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {outreach.totalInvestors > 0 
                  ? Math.round(((outreach.byStatus['contacted'] || 0) + (outreach.byStatus['application_submitted'] || 0) + (outreach.byStatus['meeting_scheduled'] || 0) + (outreach.byStatus['under_review'] || 0) + (outreach.byStatus['invested'] || 0)) / outreach.totalInvestors * 100)
                  : 0
                }%
              </div>
              <div className="flex items-center space-x-1 text-sm">
                <span className="text-slate-500">Engagement rate</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-white/60 backdrop-blur-sm border-0">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="investors">All Investors</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Dashboard Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Status Overview */}
                <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Outreach Status Overview</CardTitle>
                    <CardDescription>Track the status of your investor outreach efforts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { status: 'researching', label: 'Researching', color: 'bg-gray-100 text-gray-800' },
                        { status: 'contacted', label: 'Contacted', color: 'bg-blue-100 text-blue-800' },
                        { status: 'application_submitted', label: 'Applied', color: 'bg-yellow-100 text-yellow-800' },
                        { status: 'meeting_scheduled', label: 'Meeting', color: 'bg-purple-100 text-purple-800' },
                        { status: 'under_review', label: 'Review', color: 'bg-orange-100 text-orange-800' },
                        { status: 'invested', label: 'Invested', color: 'bg-green-100 text-green-800' },
                        { status: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
                        { status: 'follow_up', label: 'Follow Up', color: 'bg-indigo-100 text-indigo-800' },
                      ].map((item) => (
                        <div key={item.status} className="text-center p-3 rounded-lg border border-slate-200">
                          <div className="text-2xl font-bold text-slate-900 mb-1">
                            {outreach.byStatus[item.status as keyof typeof outreach.byStatus] || 0}
                          </div>
                          <Badge className={item.color} variant="secondary">
                            {item.label}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Recently Added</CardTitle>
                    <CardDescription>Your latest investor additions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recentlyAdded.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-slate-600">No investors added yet</p>
                        <p className="text-sm text-slate-500">Start building your investor database</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recentlyAdded.map((investor) => (
                          <div key={investor.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              {getStatusIcon(investor.status)}
                              <div>
                                <p className="font-medium text-slate-900">{investor.name}</p>
                                <p className="text-sm text-slate-500 capitalize">
                                  {investor.type.replace('_', ' ')} • Added {new Date(investor.dateAdded).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Badge className="capitalize" variant="outline">
                              {investor.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Upcoming Actions */}
                <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Upcoming Actions</CardTitle>
                    <CardDescription>Your scheduled follow-ups</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {upcomingActions.length === 0 ? (
                      <div className="text-center py-4">
                        <Calendar className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-600">No upcoming actions</p>
                      </div>
                    ) : (
                      upcomingActions.map((investor) => (
                        <div key={investor.id} className="p-3 bg-white/50 rounded-lg">
                          <p className="font-medium text-slate-900">{investor.name}</p>
                          <p className="text-sm text-slate-600 mb-1">{investor.nextAction}</p>
                          <p className="text-xs text-slate-500">
                            {investor.nextActionDate && new Date(investor.nextActionDate).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Investor Types */}
                <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Investor Types</CardTitle>
                    <CardDescription>Distribution by investor type</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(outreach.byType).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="capitalize text-sm text-slate-700">{type.replace('_', ' ')}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <AddInvestorForm onAddInvestor={addInvestor} />
                    <Button className="w-full justify-start" variant="outline" onClick={exportToCSV}>
                      <FileText className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Analytics
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="investors">
            <InvestorList
              investors={investors}
              onUpdateInvestor={updateInvestor}
              onDeleteInvestor={deleteInvestor}
              searchInvestors={searchInvestors}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
