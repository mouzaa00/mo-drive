"use client";

import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { authClient } from "~/lib/auth-client";

const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address."),
});

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isSuccess, setIsSuccess] = useState(false);
  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(formData: z.infer<typeof forgotPasswordSchema>) {
    await authClient.requestPasswordReset({
      email: formData.email,
      redirectTo: `/reset-password?email=${encodeURIComponent(formData.email)}`,
      fetchOptions: {
        onError: (ctx) => {
          forgotPasswordForm.setError("root", { message: ctx.error.message });
        },
        onSuccess: () => {
          setIsSuccess(true);
        },
      },
    });
  }

  if (isSuccess) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              We&apos;ve sent a password reset link to{" "}
              <span className="font-medium text-foreground">
                {forgotPasswordForm.getValues("email")}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Didn&apos;t receive the email? Check your spam folder or{" "}
              <Button
                variant="link"
                className="h-auto p-0 text-sm"
                onClick={() => setIsSuccess(false)}
              >
                try again
              </Button>
            </p>
            <p className="text-muted-foreground mt-4 text-center text-sm">
              Remember your password?{" "}
              <Link
                href="/login"
                className="underline underline-offset-4 hover:underline"
              >
                Back to login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isSubmitting = forgotPasswordForm.formState.isSubmitting;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Forgot your password?</CardTitle>
          <CardDescription>
            Enter your email below and we&apos;ll send you a reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={forgotPasswordForm.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                {forgotPasswordForm.formState.errors.root && (
                  <FieldError
                    errors={[forgotPasswordForm.formState.errors.root]}
                  />
                )}
              </Field>
              <Controller
                name="email"
                control={forgotPasswordForm.control}
                rules={{ required: true }}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel
                      data-invalid={fieldState.invalid}
                      htmlFor="email"
                    >
                      Email
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      type="email"
                      placeholder="m@example.com"
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
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
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
