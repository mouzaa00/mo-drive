"use client";

import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";

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
import { authClient } from "~/lib/auth-client";
import { redirect } from "next/navigation";

import { cn } from "~/lib/utils";

const signupSchema = z
  .object({
    email: z.email("Invalid email address"),
    name: z.string().min(1, "Name is required"),
    password: z.string().min(8, "Password must at least be 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Confirm Password must at least be 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(formData: z.infer<typeof signupSchema>) {
    await authClient.signUp.email({
      email: formData.email.toLowerCase(),
      name: formData.name.toLowerCase(),
      password: formData.password,
      fetchOptions: {
        onError: (ctx) => {
          signupForm.setError("root", { message: ctx.error.message });
        },
        onSuccess: () => {
          redirect("/");
        },
      },
    });
  }

  const isSubmitting = signupForm.formState.isSubmitting;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={signupForm.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                {signupForm.formState.errors.root && (
                  <FieldError errors={[signupForm.formState.errors.root]} />
                )}
              </Field>
              <Controller
                name="email"
                control={signupForm.control}
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
                      id="email"
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
              <Controller
                name="name"
                control={signupForm.control}
                rules={{ required: true }}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel
                      data-invalid={fieldState.invalid}
                      htmlFor="name"
                    >
                      Full Name
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={signupForm.control}
                rules={{ required: true }}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel
                      data-invalid={fieldState.invalid}
                      htmlFor="password"
                    >
                      Password
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="password"
                      type="password"
                      placeholder="Create password"
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
                control={signupForm.control}
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
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm password"
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
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  disabled={isSubmitting}
                  onClick={async () =>
                    await authClient.signIn.social({
                      provider: "google",
                      callbackURL: "/",
                    })
                  }
                >
                  Continue with Google
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <Link href="/login">Log in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
