'use client';

import {
  IconDeviceDesktop,
  IconDeviceMobile,
  IconLoader2,
  IconLock,
  IconShieldCheck,
  IconUserCircle
} from '@tabler/icons-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

// UI Components
import { ProfilePhotoUpload } from '@/components/ProfilePhotoUpload';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { API_BASE_URL } from '@/constants';
import { useAuth } from '@/context/authContext';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  bio: string;
}

interface SecurityFormData {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const token = localStorage.getItem('token');

  // Profile Form setup
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors, isDirty: isProfileDirty }
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: user?.name.split(' ')[0],
      lastName: user?.name.split(' ')[1],
      email: user?.email,
      role: user?.role,
      bio: 'Head of E-Commerce operations and system administration.'
    }
  });

  // Security Form setup
  const {
    register: registerSecurity,
    handleSubmit: handleSubmitSecurity,
    watch: watchSecurity,
    reset: resetSecurity,
    formState: { errors: securityErrors, isSubmitting: isSubmittingSecurity }
  } = useForm<SecurityFormData>();
  console.log(isSubmittingSecurity);
  const newPassword = watchSecurity('newPassword');

  const onUpdateProfile = async (data: ProfileFormData) => {
    setIsUpdatingProfile(true);
    try {
      const formData = new FormData();
      data.firstName && formData.append('firstName', data.firstName);
      data.lastName && formData.append('lastName', data.lastName);
      data.phone && formData.append('phone', data.phone);
      data.bio && formData.append('bio', data.bio);
      profilePhoto && formData.append('avatar', profilePhoto);
      const response = await fetch(API_BASE_URL + '/users/me', {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + token
        },
        body: formData
      });
      if (response.ok) {
        setProfilePhoto(null);
        return toast.success('Profile information updated successfully');
      } else throw new Error('Profile update error');
    } catch (err: any) {
      toast.error('Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const onUpdatePassword = async (data: SecurityFormData) => {
    setIsUpdatingPassword(true);
    try {
      console.log(data);
      // Simulate API update
      await new Promise((resolve) => setTimeout(resolve, 1200));
      toast.success('Password updated successfully');
      resetSecurity();
    } catch (err: any) {
      toast.error('Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };
  const handleProfileUpdate = () => {
    if (profilePhoto)
      onUpdateProfile({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '',
        bio: ''
      });
  };
  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Account Profile</h2>
        <p className="text-muted-foreground text-sm">
          Manage your personal information, role privileges, and security settings.
        </p>
      </div>

      {/* Top Banner Card */}
      <Card className="border-border from-muted/50 to-muted overflow-hidden bg-linear-to-r">
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              {user && (
                <ProfilePhotoUpload user={user} onFileSelect={(param) => setProfilePhoto(param)} />
              )}

              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center gap-2 sm:justify-start">
                  <h3 className="text-xl font-semibold">
                    {user?.name.split(' ')[0] || 'Admin User'}
                  </h3>
                  <Badge variant="secondary" className="gap-1 font-normal">
                    <IconShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    Verified
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm">
                  {user?.email || 'admin@ecommerce.com'}
                </p>
                <p className="text-muted-foreground/80 text-xs font-medium">
                  Role: <span className="text-foreground">Super Administrator</span>
                </p>
              </div>
            </div>

            {profilePhoto && (
              <Button variant="outline" size="sm" onClick={handleProfileUpdate}>
                Change Avatar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:inline-grid md:w-auto md:grid-cols-2">
          <TabsTrigger value="details" className="flex items-center gap-2">
            <IconUserCircle className="h-4 w-4" />
            <span>Personal Details</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <IconLock className="h-4 w-4" />
            <span>Security & Password</span>
          </TabsTrigger>
        </TabsList>

        {/* --- PERSONAL DETAILS TAB --- */}
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>
                Update your personal information and public administrator details.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmitProfile(onUpdateProfile)}>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      defaultValue={user?.name.split(' ')[0]}
                      {...registerProfile('firstName', { required: 'First name is required' })}
                    />
                    {profileErrors.firstName && (
                      <p className="text-destructive text-xs">{profileErrors.firstName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      defaultValue={user?.name.split(' ')[1]}
                      {...registerProfile('lastName', { required: 'Last name is required' })}
                    />
                    {profileErrors.lastName && (
                      <p className="text-destructive text-xs">{profileErrors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      disabled
                      value={user?.email}
                      {...registerProfile('email', { required: 'Email address is required' })}
                    />
                    {profileErrors.email && (
                      <p className="text-destructive text-xs">{profileErrors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input defaultValue={user?.phone} id="phone" {...registerProfile('phone')} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Platform Role</Label>
                  <Input
                    id="role"
                    disabled
                    className="bg-muted text-muted-foreground cursor-not-allowed"
                    {...registerProfile('role')}
                  />
                  <p className="text-muted-foreground text-[0.8rem]">
                    Role permissions are managed by system owners.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Administrator Bio</Label>
                  <Textarea
                    id="bio"
                    rows={3}
                    placeholder="Short summary of responsibilities..."
                    {...registerProfile('bio')}
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button type="submit" disabled={isUpdatingProfile || !isProfileDirty}>
                  {isUpdatingProfile && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* --- SECURITY & PASSWORD TAB --- */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Ensure your account uses a strong, unique password for security.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmitSecurity(onUpdatePassword)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    {...registerSecurity('currentPassword', {
                      required: 'Current password is required'
                    })}
                  />
                  {securityErrors.currentPassword && (
                    <p className="text-destructive text-xs">
                      {securityErrors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      {...registerSecurity('newPassword', {
                        required: 'New password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters'
                        }
                      })}
                    />
                    {securityErrors.newPassword && (
                      <p className="text-destructive text-xs">
                        {securityErrors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...registerSecurity('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (value) => value === newPassword || 'Passwords do not match'
                      })}
                    />
                    {securityErrors.confirmPassword && (
                      <p className="text-destructive text-xs">
                        {securityErrors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button type="submit" disabled={isUpdatingPassword}>
                  {isUpdatingPassword && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Password
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Active Sessions Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                Devices currently logged into your administrator account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-muted rounded-lg border p-2">
                    <IconDeviceDesktop className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">macOS • Chrome Browser</p>
                    <p className="text-muted-foreground text-xs">
                      Current Session • Addis Ababa, Ethiopia
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="border-emerald-200 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20"
                >
                  Active Now
                </Badge>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-muted rounded-lg border p-2">
                    <IconDeviceMobile className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">iOS • Safari App</p>
                    <p className="text-muted-foreground text-xs">Last active 2 hours ago</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => toast.success('Session revoked')}
                >
                  Revoke
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
