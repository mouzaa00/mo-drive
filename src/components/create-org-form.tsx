"use client";

import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { CreateOrg, createOrgSchema } from "~/lib/validation";

export function CreateOrgForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const orgForm = useForm<CreateOrg>({
    resolver: zodResolver(createOrgSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  async function onSubmit(formData: CreateOrg) {
    try {
      const res = await fetch("/api/orgs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
    } catch (err) {
      console.log(err);
    }
  }

  const isSubmitting = orgForm.formState.isSubmitting;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Add New Org</CardTitle>
          <CardDescription>
            Enter the org information below to create a new org
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={orgForm.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                {orgForm.formState.errors.root && (
                  <FieldError errors={[orgForm.formState.errors.root]} />
                )}
              </Field>
              <Controller
                name="name"
                control={orgForm.control}
                rules={{ required: true }}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel
                      data-invalid={fieldState.invalid}
                      htmlFor="name"
                    >
                      Org Name
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="name"
                      type="text"
                      placeholder="Enter org name"
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : (
                      <FieldDescription>
                        Must be between 2 and 50 characters
                      </FieldDescription>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="slug"
                control={orgForm.control}
                rules={{ required: true }}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel
                      data-invalid={fieldState.invalid}
                      htmlFor="slug"
                    >
                      Slug
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="slug"
                      type="text"
                      placeholder="org-slug"
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : (
                      <FieldDescription>
                        Lowercase letters, numbers, and hyphens only
                      </FieldDescription>
                    )}
                  </Field>
                )}
              />
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Add Org"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
