'use client';

import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { API_BASE_URL } from '@/constants';
import { useAuth } from '@/context/authContext';
import { BarGraph } from '@/features/overview/components/bar-graph';
import { RecentSales } from '@/features/overview/components/recent-sales';

export default function OverViewLayout() {
  // Destructure isLoading/loading from your AuthContext
  const { user, isAuthenticated, loading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [analytics, setAnalytics] = useState<{
    totalOrders: number;
    totalProducts: number;
    totalRevenue: number;
    totalUsers: number;
  }>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Memoized fetch function
  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/analytics/general`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace('/auth/sign-in');
    }
  }, [isAuthenticated, isAuthLoading, router]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // 1. Show page skeleton while checking Auth Context state
  if (isAuthLoading) {
    return (
      <PageContainer>
        <div className="flex flex-1 flex-col space-y-4">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <ChartSkeleton />
            <ChartSkeleton />
            <ChartSkeleton />
            <ChartSkeleton />
          </div>
        </div>
      </PageContainer>
    );
  }

  // 2. Prevent render if unauthenticated (redirection will handle navigation)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Hi, Welcome back 👋 {user?.name ? user.name : ''}
          </h2>
        </div>

        {/* Metrics Grid */}
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Revenue"
            value={analytics?.totalRevenue.toString()}
            change={analytics?.totalRevenue}
            trendLabel="Trending up this month"
            subText="Visitors for the last 6 months"
            isLoading={isLoading}
          />
          <MetricCard
            title="Total Orders"
            value={analytics?.totalOrders.toString()}
            change={analytics?.totalOrders}
            trendLabel="Down 20% this period"
            subText="Acquisition needs attention"
            isLoading={isLoading}
          />
          <MetricCard
            title="Total Users"
            value={analytics?.totalUsers.toString()}
            change={analytics?.totalUsers}
            trendLabel="Strong user retention"
            subText="Engagement exceeds targets"
            isLoading={isLoading}
          />
          <MetricCard
            title="Total Products"
            value={analytics?.totalProducts.toString()}
            change={analytics?.totalProducts}
            trendLabel="Steady performance increase"
            subText="Meets growth projections"
            isLoading={isLoading}
          />
        </div>

        {/* Analytics Charts Section */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">{isLoading ? <ChartSkeleton /> : <BarGraph />}</div>
          <div className="col-span-4 md:col-span-3">
            {isLoading ? <ChartSkeleton /> : <RecentSales />}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

// Sub-component for individual Metric Card with built-in Skeleton state
function MetricCard({
  title,
  value,
  change = 0,
  trendLabel,
  subText,
  isLoading
}: {
  title: string;
  value?: string;
  change?: number;
  trendLabel: string;
  subText: string;
  isLoading: boolean;
}) {
  const isPositive = change >= 0;

  if (isLoading) {
    return (
      <Card className="@container/card space-y-3 p-4">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="mt-4 h-4 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </Card>
    );
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>
        <CardAction>
          <Badge variant="outline" className={isPositive ? 'text-green-600' : 'text-red-600'}>
            {isPositive ? (
              <IconTrendingUp className="mr-1 size-3" />
            ) : (
              <IconTrendingDown className="mr-1 size-3" />
            )}
            {isPositive ? `+${change}%` : `${change}%`}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex items-center gap-2 font-medium">
          {trendLabel}
          {isPositive ? (
            <IconTrendingUp className="size-4" />
          ) : (
            <IconTrendingDown className="size-4" />
          )}
        </div>
        <div className="text-muted-foreground">{subText}</div>
      </CardFooter>
    </Card>
  );
}

// Chart Placeholder Skeleton
function ChartSkeleton() {
  return (
    <Card className="flex h-95 flex-col justify-between space-y-4 p-6">
      <div className="space-y-2">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      <Skeleton className="h-full w-full rounded-md" />
    </Card>
  );
}
