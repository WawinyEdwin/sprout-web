"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitIntegrationRequest } from "@/lib/api/integrations";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Database, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Data Source Name is required"),
  description: z.string().min(1, "Description is required"),
});

type FormData = z.infer<typeof formSchema>;


export default function CustomIntegrationForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    await submitIntegrationRequest(data.name, data.description);
    setIsSubmitted(true);
    reset();
  };

  return (
    <div className="text-center py-8">
      <Database className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-slate-600 mb-2">
        Custom Integration
      </h3>
      <p className="text-slate-500 mb-6">
        Don't see your data source? We can help you create a custom integration.
      </p>

      {isSubmitted ? (
        <div className="flex flex-col items-center gap-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          <p className="text-emerald-600 font-medium">
            Request submitted successfully!
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 max-w-md mx-auto text-left"
        >
          <div>
            <Label htmlFor="name">Data Source Name</Label>
            <Input
              id="name"
              placeholder="e.g., Internal CRM System"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your data source and what metrics you'd like to track"
              className="min-h-[100px]"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full !bg-emerald-500"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? (
              "Submitting..."
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Request Custom Integration
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
