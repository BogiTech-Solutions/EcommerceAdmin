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
import React, { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

// UI Components
import { SingleFileUploader } from '@/components/file-upload';
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
import { API_BASE_URL } from '@/constants';
import { AdFormData, Advertisement } from '@/types';

export default function AdsPage() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [placementFilter, setPlacementFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAds = useCallback(async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(API_BASE_URL + '/ads', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      setAds(data);
    }
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors }
  } = useForm<AdFormData>({
    defaultValues: {
      title: '',
      placement: 'homepage_hero',
      file: '',
      targetUrl: '',
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: ''
    }
  });

  // Watch Image URL for live preview inside modal
  const watchedImageUrl = watch('file');

  // Open Modal
  const handleOpenModal = (adToEdit: any = null) => {
    if (adToEdit) {
      setEditingAd(adToEdit);
      reset({
        title: adToEdit.title,
        placement: adToEdit.placement,
        file: adToEdit.imageUrl,
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
        file: '',
        targetUrl: '',
        status: 'active',
        startDate: new Date().toISOString().split('T')[0],
        endDate: ''
      });
    }
    setIsModalOpen(true);
  };

  // Submit Handler
  const onSubmit = async (data: AdFormData) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.placement);
    formData.append('image', data.file);
    formData.append('targetUrl', data.targetUrl);
    formData.append('active', 'true');

    setIsSubmitting(true);
    try {
      if (editingAd) {
        const response = await fetch(API_BASE_URL + '/ads/' + editingAd.id, {
          method: 'PUT',
          headers: {
            Authorization: 'Bearer ' + token
          },
          body: formData
        });
        if (response.ok) toast.success('Campaign updated successfully');
      } else {
        const response = await fetch(API_BASE_URL + '/ads', {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + token
          },
          body: formData
        });
        console.log(response);
        if (response.ok) toast.success('Ad campaign created successfully');
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
    toast.success(`Campaign status changed to ${'nextStatus'}`);
  };

  // Delete Ad
  const handleDeleteAd = (adId: string) => {};

  // Filter Ads
  const filteredAds = ads.filter((ad: Advertisement) => {
    const matchesSearch =
      ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.targetUrl.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlacement = placementFilter === 'all' || ad.placement === placementFilter;
    const matchesStatus = statusFilter === 'all' || ad.status === statusFilter;

    return matchesSearch && matchesPlacement && matchesStatus;
  });

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
  useEffect(() => {
    fetchAds();
  }, [fetchAds]);
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
            {/* <div className="text-2xl font-bold">{totalImpressions.toLocaleString()}</div> */}
            <p className="text-muted-foreground text-xs">Views across all placements</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <IconClick className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            {/* <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div> */}
            <p className="text-muted-foreground text-xs">Direct traffic leads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Click Rate (CTR)</CardTitle>
            <IconChartBar className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            {/* <div className="text-2xl font-bold">{avgCtr}%</div> */}
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
                  <TableHead>Banner Preview</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Placement</TableHead>
                  <TableHead>Target Link</TableHead>
                  {/* <TableHead className="text-center">Impressions / Clicks</TableHead> */}
                  {/* <TableHead className="text-center">CTR</TableHead> */}
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
                        <div className="flex items-center justify-center gap-3">
                          <img
                            src={ad.imageUrl}
                            alt={''}
                            className="h-12 w-24 rounded-md border object-cover"
                          />
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-3">
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
                          {formatPlacement(ad.title)}
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
                      {/* <TableCell className="text-center">
                        <div className="text-sm font-medium">
                          {ad.impressions.toLocaleString()}{' '}
                          <span className="text-muted-foreground font-normal">views</span>
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {ad.clicks.toLocaleString()} clicks
                        </div>
                      </TableCell> */}

                      {/* CTR */}
                      {/* <TableCell className="text-center font-medium">
                        <Badge variant={ad.ctr > 5 ? 'default' : 'secondary'} className="font-mono">
                          {ad.ctr}%
                        </Badge>
                      </TableCell> */}

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
            <div className="grid gap-4 md:grid-cols-2">
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
            </div>

            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="targetUrl">Target Link URL *</Label>
                <Input
                  id="targetUrl"
                  placeholder="e.g. /collections/summer-sale or https://..."
                  {...register('targetUrl', { required: 'Target URL is required' })}
                />
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

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Banner Image URL *</Label>
                <Controller
                  name="file"
                  control={control}
                  render={({ field }) => (
                    <SingleFileUploader
                      value={field.value} // Can be a File object, image URL string (e.g., "/uploads/cat-1.png"), or null
                      onValueChange={(newFile) => field.onChange(newFile)}
                      maxSize={1024 * 1024 * 2} // 2MB
                      {...register('file', { required: 'Image is required' })}
                    />
                  )}
                />
                {errors.file && (
                  <p className="text-destructive text-xs">{errors.file.message as string}</p>
                )}
              </div>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="pl-1">
                    Start Date
                  </Label>
                  <Input id="startDate" type="date" {...register('startDate')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate" className="pl-1">
                    End Date (Optional)
                  </Label>
                  <Input id="endDate" type="date" {...register('endDate')} />
                </div>
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
