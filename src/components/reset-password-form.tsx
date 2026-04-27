"use client";

import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { redirect, useSearchParams } from "next/navigation";
import { authClient } from "~/lib/auth-client";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const params = useSearchParams();
  const token = params.get("token");
  const email = params.get("email");

  const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(formData: z.infer<typeof resetPasswordSchema>) {
    if (!token) {
      resetPasswordForm.setError("root", {
        message:
          "Reset token is missing. Please request a new password reset link.",
      });
      return;
    }

    await authClient.resetPassword({
      newPassword: formData.password,
      token,
      fetchOptions: {
        onError: (ctx) => {
          resetPasswordForm.setError("root", { message: ctx.error.message });
        },
        onSuccess: async () => {
          if (email) {
            await authClient.signIn.email({
              email,
              password: formData.password,
            });
          }
          redirect("/");
        },
      },
    });
  }

  if (!token) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle>Invalid reset link</CardTitle>
            <CardDescription>
              This password reset link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/forgot-password"
              className="text-sm underline underline-offset-4 hover:underline"
            >
              Request a new password reset
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isSubmitting = resetPasswordForm.formState.isSubmitting;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create new password</CardTitle>
          <CardDescription>
            {email
              ? `Enter a new password for ${email}`
              : "Enter a new password for your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={resetPasswordForm.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                {resetPasswordForm.formState.errors.root && (
                  <FieldError
                    errors={[resetPasswordForm.formState.errors.root]}
                  />
                )}
              </Field>
              <Controller
                name="password"
                control={resetPasswordForm.control}
                rules={{ required: true }}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel
                      data-invalid={fieldState.invalid}
                      htmlFor="password"
                    >
                      New Password
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      type="password"
                      placeholder="Enter new password"
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : (
                      <FieldDescription>
                        Must be at least 8 characters
                      </FieldDescription>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="confirmPassword"
                control={resetPasswordForm.control}
                rules={{ required: true }}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel
                      data-invalid={fieldState.invalid}
                      htmlFor="confirmPassword"
                    >
                      Confirm Password
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      type="password"
                      placeholder="Confirm new password"
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
                <p className="text-muted-foreground mt-4 text-center text-sm">
                  Remember your password?{" "}
                  <Link
                    href="/login"
                    className="underline underline-offset-4 hover:underline"
                  >
                    Back to login
                  </Link>
                </p>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
