import { IconAlertTriangle, IconBox, IconCheck, IconCurrencyDollar } from '@tabler/icons-react';
import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function KPICard({
  totalStockCount,
  lowStockCount,
  totalElements,
  totalValue
}: {
  totalStockCount: number;
  lowStockCount: number;
  totalElements: number;
  totalValue: number;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          <IconBox className="text-primary h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalElements}</div>
          <p className="text-muted-foreground text-xs">Active unique SKUs</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Units in Stock</CardTitle>
          <IconCheck className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStockCount.toLocaleString()}</div>
          <p className="text-muted-foreground text-xs">Total stock inventory quantity</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inventory Valuation</CardTitle>
          <IconCurrencyDollar className="h-4 w-4 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-muted-foreground text-xs">Based on current unit prices</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
          <IconAlertTriangle className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lowStockCount}</div>
          <p className="text-muted-foreground text-xs">Products under 10 units</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default KPICard;
