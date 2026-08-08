'use client';

import { GalleryVerticalEnd } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator
} from '@/components/field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/authContext';
import { cn } from '@/lib/utils';

// Define form data type
interface LoginFormData {
  email: string;
  password: string;
}

// Explicit Next.js Page Props
interface PageProps extends React.ComponentProps<'div'> {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function Page({ className, searchParams, ...props }: PageProps) {
  const { login, user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      setError('');
      await login(data.email, data.password);
      if (user) {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          ECommerce Admin.
        </Link>

        {/* ...props is now clean and searchParams is safe */}
        <div className={cn('flex flex-col gap-6', className)} {...props}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Welcome back</CardTitle>
              <CardDescription>Login with your email and password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(handleLogin)}>
                <FieldGroup>
                  <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                    Sign in with credentials
                  </FieldSeparator>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      {...register('email', { required: 'Email is required' })}
                    />
                    {errors.email && (
                      <p className="text-destructive mt-1 text-xs">{errors.email.message}</p>
                    )}
                  </Field>
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Link href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                        Forgot your password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      {...register('password', { required: 'Password is required' })}
                    />
                    {errors.password && (
                      <p className="text-destructive mt-1 text-xs">{errors.password.message}</p>
                    )}
                  </Field>
                  {error && <p className="text-destructive mt-1 text-center text-xs">{error}</p>}
                  <Field>
                    <Button size="lg" type="submit" disabled={isSubmitting} className="w-full">
                      Login
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
          <FieldDescription className="text-muted-foreground px-6 text-center text-xs">
            By clicking continue, you agree to our{' '}
            <Link href="#" className="underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" className="underline">
              Privacy Policy
            </Link>
            .
          </FieldDescription>
        </div>
      </div>
    </div>
  );
}
