"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Rocket } from "lucide-react";

import { cn } from "~/lib/utils";
import {
  createCompanySchema,
  CreateCompanyInput,
} from "~/lib/validations/company";
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
import { redirect } from "next/navigation";

export function CreateCompanyForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const createCompanyForm = useForm<CreateCompanyInput>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  async function onSubmit(formData: CreateCompanyInput) {
    const res = await fetch("/api/companies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      createCompanyForm.setError("root", {
        message: data.error || "Something went wrong",
      });
      return;
    }

    redirect(`http://${data.slug}.localhost:3000/feature-requests`);
  }

  const isSubmitting = createCompanyForm.formState.isSubmitting;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Rocket className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Add your company</CardTitle>
          <CardDescription className="max-w-70 mx-auto">
            Start by creating a company for your projects and feature requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={createCompanyForm.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                {createCompanyForm.formState.errors.root && (
                  <FieldError
                    errors={[createCompanyForm.formState.errors.root]}
                  />
                )}
              </Field>
              <Controller
                name="name"
                control={createCompanyForm.control}
                rules={{ required: true }}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel
                      data-invalid={fieldState.invalid}
                      htmlFor="name"
                    >
                      Project name
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="name"
                      type="text"
                      placeholder="My Awesome Company"
                      disabled={isSubmitting}
                    />
                    <FieldDescription>
                      This is the name of your company that will be displayed to
                      users
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="slug"
                control={createCompanyForm.control}
                rules={{ required: true }}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel
                      data-invalid={fieldState.invalid}
                      htmlFor="slug"
                    >
                      Company slug
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="slug"
                      type="text"
                      placeholder="my-awesome-slug"
                      disabled={isSubmitting}
                    />
                    <FieldDescription>
                      This will be used in your project URL and must be unique
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Field>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Creating company...
                    </>
                  ) : (
                    "Create company"
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
