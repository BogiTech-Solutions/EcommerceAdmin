'use client';

import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

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
import { useAuth } from '@/context/authContext';

interface OverviewMetrics {
  totalRevenue: string;
  totalOrders: string;
  totalManufacturers: string;
  totalSpareParts: string;
  revenueChange: number;
  ordersChange: number;
  manufacturersChange: number;
  sparePartsChange: number;
}

const MOCK_METRICS: OverviewMetrics = {
  totalRevenue: '$1,250.00',
  totalOrders: '1,234',
  totalManufacturers: '45,678',
  totalSpareParts: '4.5%',
  revenueChange: 12.5,
  ordersChange: -20,
  manufacturersChange: 12.5,
  sparePartsChange: 4.5
};

export default function OverViewLayout({
  sales,
  bar_stats
}: {
  sales: React.ReactNode;
  pie_stats?: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats?: React.ReactNode;
}) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Authentication safeguard
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth/sign-in');
    }
  }, [isAuthenticated, router]);

  // Fetch mock overview data
  useEffect(() => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    const timer = setTimeout(() => {
      setMetrics(MOCK_METRICS);
      setIsLoading(false);
    }, 1200); // Simulate API latency

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

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
          {/* Card 1: Total Revenue */}
          <MetricCard
            title="Total Revenue"
            value={metrics?.totalRevenue}
            change={metrics?.revenueChange}
            trendLabel="Trending up this month"
            subText="Visitors for the last 6 months"
            isLoading={isLoading}
          />

          {/* Card 2: Total Orders */}
          <MetricCard
            title="Total Orders"
            value={metrics?.totalOrders}
            change={metrics?.ordersChange}
            trendLabel="Down 20% this period"
            subText="Acquisition needs attention"
            isLoading={isLoading}
          />

          {/* Card 3: Total Manufacturers */}
          <MetricCard
            title="Total Manufacturers"
            value={metrics?.totalManufacturers}
            change={metrics?.manufacturersChange}
            trendLabel="Strong user retention"
            subText="Engagement exceeds targets"
            isLoading={isLoading}
          />

          {/* Card 4: Total Spare Parts */}
          <MetricCard
            title="Total Spare Parts"
            value={metrics?.totalSpareParts}
            change={metrics?.sparePartsChange}
            trendLabel="Steady performance increase"
            subText="Meets growth projections"
            isLoading={isLoading}
          />
        </div>

        {/* Analytics Charts Section */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">{isLoading ? <ChartSkeleton /> : bar_stats}</div>
          <div className="col-span-4 md:col-span-3">{isLoading ? <ChartSkeleton /> : sales}</div>
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
