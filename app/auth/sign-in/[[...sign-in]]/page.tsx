"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from "@/components/field";
import { GalleryVerticalEnd } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/authContext";
import { useForm } from "react-hook-form";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";

// Define form data type
interface LoginFormData {
  email: string;
  password: string;
}

// Define props with explicit searchParams
interface PageProps extends React.ComponentProps<"div"> {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function Page({ className, searchParams, ...props }: PageProps) {
  const { login,isAuthenticated } = useAuth();
  const router = useRouter();
  //  if(isAuthenticated){
  //   console.log("Authenticated")
  //    redirect("/dashboard")

  // }
  const [error, setError] = useState<string>("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      setError("");
      await login(data.email, data.password);
      isAuthenticated && router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          ECommerce Admin.
        </a>
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Welcome back</CardTitle>
              <CardDescription>
                Login with your email and password
              </CardDescription>
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
                      {...register("email", { required: "Email is required" })}
                    />
                    {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
                  </Field>
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <a
                        href="#"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      {...register("password", { required: "Password is required" })}
                    />
                    {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}
                  </Field>
                  {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
                  <Field>
                    <Button size="lg" type="submit" disabled={isSubmitting}>
                      Login
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
          <FieldDescription className="px-6 text-center">
            By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
            and <a href="#">Privacy Policy</a>.
          </FieldDescription>
        </div>
      </div>
    </div>
  );
}