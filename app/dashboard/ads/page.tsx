'use client';

import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconDotsVertical,
  IconPhone,
  IconEye,
  IconClick,
  IconChartBar,
  IconLoader2,
  IconFilter,
  IconExternalLink,
  IconCalendarEvent
} from '@tabler/icons-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

// UI Components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

// Mock Initial Data
const INITIAL_ADS = [
  {
    id: 'ad-1',
    title: 'Summer Flash Sale 50% Off',
    placement: 'homepage_hero',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&h=120&fit=crop',
    targetUrl: '/collections/summer-sale',
    status: 'active',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    impressions: 45200,
    clicks: 3180,
    ctr: 7.03,
    createdAt: '2024-05-28'
  },
  {
    id: 'ad-2',
    title: 'New Electronics Launch - Earbuds Pro',
    placement: 'sidebar',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=120&fit=crop',
    targetUrl: '/products/earbuds-pro',
    status: 'active',
    startDate: '2024-07-10',
    endDate: '2024-09-10',
    impressions: 18400,
    clicks: 920,
    ctr: 5.0,
    createdAt: '2024-07-08'
  },
  {
    id: 'ad-3',
    title: 'Newsletter Signup Discount Modal',
    placement: 'popup',
    imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&h=120&fit=crop',
    targetUrl: '/subscribe',
    status: 'scheduled',
    startDate: '2024-09-01',
    endDate: '2024-10-01',
    impressions: 0,
    clicks: 0,
    ctr: 0.0,
    createdAt: '2024-08-01'
  },
  {
    id: 'ad-4',
    title: 'Black Friday Countdown Preview',
    placement: 'footer',
    imageUrl: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=300&h=120&fit=crop',
    targetUrl: '/black-friday',
    status: 'paused',
    startDate: '2024-05-01',
    endDate: '2024-05-15',
    impressions: 8900,
    clicks: 240,
    ctr: 2.7,
    createdAt: '2024-04-25'
  }
];

export default function AdsPage() {
  const [ads, setAds] = useState(INITIAL_ADS);
  const [searchQuery, setSearchQuery] = useState('');
  const [placementFilter, setPlacementFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      placement: 'homepage_hero',
      imageUrl: '',
      targetUrl: '',
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: ''
    }
  });

  // Watch Image URL for live preview inside modal
  const watchedImageUrl = watch('imageUrl');

  // Open Modal
  const handleOpenModal = (adToEdit: any = null) => {
    if (adToEdit) {
      setEditingAd(adToEdit);
      reset({
        title: adToEdit.title,
        placement: adToEdit.placement,
        imageUrl: adToEdit.imageUrl,
        targetUrl: adToEdit.targetUrl,
        status: adToEdit.status,
        startDate: adToEdit.startDate,
        endDate: adToEdit.endDate
      });
    } else {
      setEditingAd(null);
      reset({
        title: '',
        placement: 'homepage_hero',
        imageUrl: '',
        targetUrl: '',
        status: 'active',
        startDate: new Date().toISOString().split('T')[0],
        endDate: ''
      });
    }
    setIsModalOpen(true);
  };

  // Submit Handler
  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await new Promise((res) => setTimeout(res, 800)); // Simulate API call

      if (editingAd) {
        setAds((prev) => prev.map((ad) => (ad.id === editingAd.id ? { ...ad, ...data } : ad)));
        toast.success('Campaign updated successfully');
      } else {
        const newAd = {
          id: `ad-${Date.now()}`,
          title: data.title,
          placement: data.placement,
          imageUrl:
            data.imageUrl ||
            'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&h=120&fit=crop',
          targetUrl: data.targetUrl,
          status: data.status,
          startDate: data.startDate,
          endDate: data.endDate,
          impressions: 0,
          clicks: 0,
          ctr: 0.0,
          createdAt: new Date().toISOString().split('T')[0]
        };
        setAds((prev) => [newAd, ...prev]);
        toast.success('Ad campaign created successfully');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to save campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Active/Paused Status via Switch
  const handleToggleStatus = (adId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'paused' : 'active';
    setAds((prev) => prev.map((ad) => (ad.id === adId ? { ...ad, status: nextStatus } : ad)));
    toast.success(`Campaign status changed to ${nextStatus}`);
  };

  // Delete Ad
  const handleDeleteAd = (adId: string) => {
    setAds((prev) => prev.filter((ad) => ad.id !== adId));
    toast.success('Ad campaign deleted');
  };

  // Filter Ads
  const filteredAds = ads.filter((ad) => {
    const matchesSearch =
      ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.targetUrl.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlacement = placementFilter === 'all' || ad.placement === placementFilter;
    const matchesStatus = statusFilter === 'all' || ad.status === statusFilter;

    return matchesSearch && matchesPlacement && matchesStatus;
  });

  // Calculate High-level Stats
  const totalImpressions = ads.reduce((acc, curr) => acc + curr.impressions, 0);
  const totalClicks = ads.reduce((acc, curr) => acc + curr.clicks, 0);
  const avgCtr =
    totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';

  // Format Placement Label
  const formatPlacement = (placement: string) => {
    switch (placement) {
      case 'homepage_hero':
        return 'Homepage Hero';
      case 'sidebar':
        return 'Sidebar Banner';
      case 'popup':
        return 'Popup Banner';
      case 'footer':
        return 'Footer Banner';
      default:
        return placement;
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Ads & Banners</h2>
          <p className="text-muted-foreground text-sm">
            Manage promotional banners, hero sliders, popups, and track campaign performance.
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <IconPlus className="h-4 w-4" />
          Create New Campaign
        </Button>
      </div>

      {/* KPI Stats Header */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <IconPhone className="text-primary h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ads.filter((a) => a.status === 'active').length}
            </div>
            <p className="text-muted-foreground text-xs">Out of {ads.length} total campaigns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
            <IconEye className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalImpressions.toLocaleString()}</div>
            <p className="text-muted-foreground text-xs">Views across all placements</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <IconClick className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
            <p className="text-muted-foreground text-xs">Direct traffic leads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Click Rate (CTR)</CardTitle>
            <IconChartBar className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCtr}%</div>
            <p className="text-muted-foreground text-xs">Industry avg is ~2.5%</p>
          </CardContent>
        </Card>
      </div>

      {/* Table & Filters Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <IconSearch className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                placeholder="Search campaigns or URLs..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Options */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <IconFilter className="text-muted-foreground h-4 w-4" />
                <Select value={placementFilter} onValueChange={setPlacementFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Placement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Placements</SelectItem>
                    <SelectItem value="homepage_hero">Homepage Hero</SelectItem>
                    <SelectItem value="sidebar">Sidebar Banner</SelectItem>
                    <SelectItem value="popup">Popup Banner</SelectItem>
                    <SelectItem value="footer">Footer Banner</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-35">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Banner Preview & Title</TableHead>
                  <TableHead>Placement</TableHead>
                  <TableHead>Target Link</TableHead>
                  <TableHead className="text-center">Impressions / Clicks</TableHead>
                  <TableHead className="text-center">CTR</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAds.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-muted-foreground h-24 text-center">
                      No campaigns found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAds.map((ad) => (
                    <TableRow key={ad.id}>
                      {/* Preview & Title */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={ad.imageUrl}
                            alt={ad.title}
                            className="h-12 w-24 rounded-md border object-cover"
                          />
                          <div>
                            <p className="font-medium">{ad.title}</p>
                            <p className="text-muted-foreground flex items-center gap-1 text-xs">
                              <IconCalendarEvent className="h-3 w-3" />
                              {ad.startDate} {ad.endDate ? `to ${ad.endDate}` : '(Ongoing)'}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Placement */}
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {formatPlacement(ad.placement)}
                        </Badge>
                      </TableCell>

                      {/* Target Link */}
                      <TableCell>
                        <a
                          href={ad.targetUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary flex items-center gap-1 font-mono text-xs hover:underline"
                        >
                          {ad.targetUrl}
                          <IconExternalLink className="h-3 w-3" />
                        </a>
                      </TableCell>

                      {/* Stats */}
                      <TableCell className="text-center">
                        <div className="text-sm font-medium">
                          {ad.impressions.toLocaleString()}{' '}
                          <span className="text-muted-foreground font-normal">views</span>
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {ad.clicks.toLocaleString()} clicks
                        </div>
                      </TableCell>

                      {/* CTR */}
                      <TableCell className="text-center font-medium">
                        <Badge variant={ad.ctr > 5 ? 'default' : 'secondary'} className="font-mono">
                          {ad.ctr}%
                        </Badge>
                      </TableCell>

                      {/* Status Toggle Switch */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={ad.status === 'active'}
                            onCheckedChange={() => handleToggleStatus(ad.id, ad.status)}
                            disabled={ad.status === 'expired'}
                          />
                          <Badge
                            variant={
                              ad.status === 'active'
                                ? 'default'
                                : ad.status === 'scheduled'
                                  ? 'outline'
                                  : 'secondary'
                            }
                            className="capitalize"
                          >
                            {ad.status}
                          </Badge>
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <IconDotsVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleOpenModal(ad)}>
                              <IconEdit className="mr-2 h-4 w-4" />
                              Edit Campaign
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteAd(ad.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <IconTrash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-137.5">
          <DialogHeader>
            <DialogTitle>{editingAd ? 'Edit Ad Campaign' : 'Create Ad Campaign'}</DialogTitle>
            <DialogDescription>
              {editingAd
                ? 'Update banner graphics, scheduling, or target destination.'
                : 'Configure a new promotional banner or popup campaign.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">Campaign Title *</Label>
              <Input
                id="title"
                placeholder="e.g. Summer Flash Sale"
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title && (
                <p className="text-destructive text-xs">{errors.title.message as string}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="placement">Placement Zone</Label>
                <Select
                  value={watch('placement')}
                  onValueChange={(val: any) => setValue('placement', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select placement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="homepage_hero">Homepage Hero Slider</SelectItem>
                    <SelectItem value="sidebar">Sidebar Banner</SelectItem>
                    <SelectItem value="popup">Popup Modal</SelectItem>
                    <SelectItem value="footer">Footer Banner</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Initial Status</Label>
                <Select
                  value={watch('status')}
                  onValueChange={(val: any) => setValue('status', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetUrl">Target Link URL *</Label>
              <Input
                id="targetUrl"
                placeholder="e.g. /collections/summer-sale or https://..."
                {...register('targetUrl', { required: 'Target URL is required' })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Banner Image URL *</Label>
              <Input
                id="imageUrl"
                placeholder="https://images.unsplash.com/..."
                {...register('imageUrl', { required: 'Image URL is required' })}
              />
            </div>

            {/* Live Image Preview */}
            {watchedImageUrl && (
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Banner Preview</Label>
                <div className="bg-muted relative h-28 w-full overflow-hidden rounded-md border">
                  <img
                    src={watchedImageUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" {...register('startDate')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Input id="endDate" type="date" {...register('endDate')} />
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingAd ? 'Save Campaign' : 'Publish Campaign'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
