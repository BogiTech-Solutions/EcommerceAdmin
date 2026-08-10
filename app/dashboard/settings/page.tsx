'use client';

import {
  IconBell,
  IconBuildingStore,
  IconCreditCard,
  IconKey,
  IconLoader2
} from '@tabler/icons-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

// Change IconStore to IconBuildingStore

interface StoreSettingsForm {
  storeName: string;
  supportEmail: string;
  storeCurrency: string;
  storeDescription: string;
  orderNotifications: boolean;
  lowStockAlerts: boolean;
  marketingEmails: boolean;
  enableTaxCalculation: boolean;
  testMode: boolean;
}

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty }
  } = useForm<StoreSettingsForm>({
    defaultValues: {
      storeName: 'Acme Store',
      supportEmail: 'support@acmestore.com',
      storeCurrency: 'USD',
      storeDescription: 'The premium official store for Acme merchandise.',
      orderNotifications: true,
      lowStockAlerts: true,
      marketingEmails: false,
      enableTaxCalculation: true,
      testMode: false
    }
  });

  const onSubmit = async (data: StoreSettingsForm) => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full max-h-screen flex-1 space-y-6 overflow-y-auto p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground text-sm">
            Manage your store configurations, notifications, and integration settings.
          </p>
        </div>
        <Button onClick={handleSubmit(onSubmit)} disabled={isSaving || !isDirty}>
          {isSaving && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:inline-grid md:w-auto md:grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <IconBuildingStore className="h-4 w-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <IconBell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <IconCreditCard className="h-4 w-4" />
            <span>Payments</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <IconKey className="h-4 w-4" />
            <span>API & Keys</span>
          </TabsTrigger>
        </TabsList>

        {/* --- GENERAL SETTINGS --- */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Store Profile</CardTitle>
              <CardDescription>
                Configure public-facing store details and contact info.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    {...register('storeName', { required: 'Store name is required' })}
                  />
                  {errors.storeName && (
                    <p className="text-destructive text-xs">{errors.storeName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    {...register('supportEmail', {
                      required: 'Support email is required'
                    })}
                  />
                  {errors.supportEmail && (
                    <p className="text-destructive text-xs">{errors.supportEmail.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeCurrency">Base Currency</Label>
                <Select
                  defaultValue={watch('storeCurrency')}
                  onValueChange={(val) => setValue('storeCurrency', val, { shouldDirty: true })}
                >
                  <SelectTrigger id="storeCurrency" className="w-full md:w-64">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($) - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR (€) - Euro</SelectItem>
                    <SelectItem value="GBP">GBP (£) - British Pound</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeDescription">Store Description</Label>
                <Textarea
                  id="storeDescription"
                  rows={4}
                  {...register('storeDescription')}
                  placeholder="Brief description of your store..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- NOTIFICATIONS SETTINGS --- */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Admin Notifications</CardTitle>
              <CardDescription>
                Choose when and how you want to be alerted regarding shop activities.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label className="text-base">Order Alerts</Label>
                  <p className="text-muted-foreground text-sm">
                    Receive immediate notifications when a new order is placed.
                  </p>
                </div>
                <Switch
                  checked={watch('orderNotifications')}
                  onCheckedChange={(val) =>
                    setValue('orderNotifications', val, { shouldDirty: true })
                  }
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label className="text-base">Low Stock Warnings</Label>
                  <p className="text-muted-foreground text-sm">
                    Alert when inventory levels drop below threshold.
                  </p>
                </div>
                <Switch
                  checked={watch('lowStockAlerts')}
                  onCheckedChange={(val) => setValue('lowStockAlerts', val, { shouldDirty: true })}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label className="text-base">Marketing Newsletters</Label>
                  <p className="text-muted-foreground text-sm">
                    Receive weekly performance summaries and platform updates.
                  </p>
                </div>
                <Switch
                  checked={watch('marketingEmails')}
                  onCheckedChange={(val) => setValue('marketingEmails', val, { shouldDirty: true })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- PAYMENTS & CHECKOUT --- */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Checkout & Payment Gateway</CardTitle>
              <CardDescription>Configure checkout settings and tax options.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label className="text-base">Automatic Tax Calculation</Label>
                  <p className="text-muted-foreground text-sm">
                    Automatically calculate sales tax at checkout based on customer address.
                  </p>
                </div>
                <Switch
                  checked={watch('enableTaxCalculation')}
                  onCheckedChange={(val) =>
                    setValue('enableTaxCalculation', val, { shouldDirty: true })
                  }
                />
              </div>

              <div className="bg-muted/50 flex items-center justify-between space-x-2 rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Sandbox / Test Mode</Label>
                  <p className="text-muted-foreground text-sm">
                    Enable test gateway payments without charging real credit cards.
                  </p>
                </div>
                <Switch
                  checked={watch('testMode')}
                  onCheckedChange={(val) => setValue('testMode', val, { shouldDirty: true })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- API KEYS --- */}
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>
                Manage API credentials for third-party integrations and headless storefronts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">Public API Key</Label>
                <Input
                  id="apiKey"
                  readOnly
                  value={process.env.STRIPE_SECRATE}
                  className="bg-muted font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="secretKey">Secret Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="secretKey"
                    type="password"
                    readOnly
                    value={process.env.STRIPE_PASSWORD}
                    className="bg-muted font-mono text-sm"
                  />
                  <Button variant="outline">Roll Key</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
