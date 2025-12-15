/**
 * Admin Subscriptions List
 *
 * Internal admin page for viewing and managing all user subscriptions.
 * Includes filtering, search, and quick actions.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Download, ChevronRight, AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import SEO from '@/components/SEO';
import { supabase } from '@/integrations/supabase/client';
import type { UserSubscription, SubscriptionStatus } from '@/types/subscription';

interface SubscriptionWithDetails extends UserSubscription {
  tier: {
    display_name: string;
    price_monthly: number;
    transaction_fee_percent: number;
  };
  user_email?: string;
}

// Fetch all subscriptions with filters
async function fetchSubscriptions(filters: {
  status?: SubscriptionStatus;
  userType?: 'buyer' | 'supplier';
  search?: string;
}) {
  if (!supabase) throw new Error('Supabase not initialized');

  let query = supabase
    .from('user_subscriptions')
    .select(`
      *,
      tier:subscription_tiers(
        display_name,
        price_monthly,
        transaction_fee_percent,
        user_type
      )
    `)
    .order('created_at', { ascending: false });

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.userType) {
    query = query.eq('tier.user_type', filters.userType);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data as SubscriptionWithDetails[];
}

// Calculate MRR from subscriptions
function calculateMRR(subscriptions: SubscriptionWithDetails[]): number {
  return subscriptions
    .filter((sub) => sub.status === 'active' || sub.status === 'trialing')
    .reduce((total, sub) => total + (sub.tier.price_monthly / 100), 0);
}

// Status badge styling
function getStatusBadge(status: SubscriptionStatus) {
  const styles = {
    active: 'bg-green-100 text-green-700 border-green-200',
    trialing: 'bg-blue-100 text-blue-700 border-blue-200',
    past_due: 'bg-orange-100 text-orange-700 border-orange-200',
    canceled: 'bg-gray-100 text-gray-700 border-gray-200',
    unpaid: 'bg-red-100 text-red-700 border-red-200',
    paused: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  };

  const icons = {
    active: CheckCircle2,
    trialing: Clock,
    past_due: AlertCircle,
    canceled: XCircle,
    unpaid: AlertCircle,
    paused: Clock,
  };

  const Icon = icons[status];

  return (
    <Badge variant="outline" className={styles[status]}>
      <Icon className="w-3 h-3 mr-1" />
      {status.replace('_', ' ')}
    </Badge>
  );
}

export default function AdminSubscriptions() {
  const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | 'all'>('all');
  const [userTypeFilter, setUserTypeFilter] = useState<'buyer' | 'supplier' | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: subscriptions, isLoading, error } = useQuery({
    queryKey: ['admin-subscriptions', statusFilter, userTypeFilter, searchQuery],
    queryFn: () => fetchSubscriptions({
      status: statusFilter === 'all' ? undefined : statusFilter,
      userType: userTypeFilter === 'all' ? undefined : userTypeFilter,
      search: searchQuery || undefined,
    }),
  });

  const mrr = subscriptions ? calculateMRR(subscriptions) : 0;
  const activeCount = subscriptions?.filter((s) => s.status === 'active').length || 0;
  const trialCount = subscriptions?.filter((s) => s.status === 'trialing').length || 0;
  const churnedCount = subscriptions?.filter((s) => s.status === 'canceled').length || 0;

  const exportToCSV = () => {
    if (!subscriptions) return;

    const csv = [
      ['User ID', 'Email', 'Tier', 'Status', 'MRR', 'Transaction Fee', 'Created', 'Trial End'].join(','),
      ...subscriptions.map((sub) => [
        sub.user_id,
        sub.user_email || 'N/A',
        sub.tier.display_name,
        sub.status,
        (sub.tier.price_monthly / 100).toFixed(2),
        sub.tier.transaction_fee_percent,
        new Date(sub.created_at).toLocaleDateString(),
        sub.trial_end ? new Date(sub.trial_end).toLocaleDateString() : 'N/A',
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscriptions-${new Date().toISOString()}.csv`;
    a.click();
  };

  return (
    <>
      <SEO
        title="Subscriptions | Admin"
        description="Manage all HoleScale subscriptions"
        noindex
      />

      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Subscriptions</h1>
            <p className="text-muted-foreground">
              Manage and monitor all customer subscriptions
            </p>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Monthly Recurring Revenue</div>
              <div className="text-3xl font-bold">${mrr.toLocaleString()}</div>
              <div className="text-xs text-green-600 mt-1">
                {subscriptions?.length || 0} total subscriptions
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Active Subscriptions</div>
              <div className="text-3xl font-bold">{activeCount}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Paying customers
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Trial Subscriptions</div>
              <div className="text-3xl font-bold">{trialCount}</div>
              <div className="text-xs text-blue-600 mt-1">
                In free trial period
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Churned</div>
              <div className="text-3xl font-bold">{churnedCount}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Canceled subscriptions
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by user email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="trialing">Trialing</SelectItem>
                  <SelectItem value="past_due">Past Due</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                </SelectContent>
              </Select>

              <Select value={userTypeFilter} onValueChange={(v) => setUserTypeFilter(v as any)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="User Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="buyer">Buyers</SelectItem>
                  <SelectItem value="supplier">Suppliers</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={exportToCSV}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </Card>

          {/* Table */}
          <Card>
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading subscriptions...</p>
              </div>
            ) : error ? (
              <div className="p-12 text-center">
                <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                <p className="text-destructive">Failed to load subscriptions</p>
              </div>
            ) : subscriptions && subscriptions.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>MRR</TableHead>
                      <TableHead>Trial End</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptions.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell>
                          <div className="font-medium truncate max-w-[200px]">
                            {sub.user_email || sub.user_id.slice(0, 8)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {sub.user_id.slice(0, 8)}...
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{sub.tier.display_name}</div>
                          <div className="text-xs text-muted-foreground">
                            {sub.tier.transaction_fee_percent}% fee
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(sub.status)}</TableCell>
                        <TableCell>
                          <div className="font-semibold">
                            ${(sub.tier.price_monthly / 100).toFixed(0)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {sub.trial_end ? (
                            <div className="text-sm">
                              {new Date(sub.trial_end).toLocaleDateString()}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(sub.created_at).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                          >
                            <Link to={`/admin/subscriptions/${sub.id}`}>
                              View
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <p className="text-muted-foreground">No subscriptions found</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
