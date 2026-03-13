import * as z from "zod";

export const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phoneNumber: z
    .string()
    .transform((val) => val.replace(/\s+/g, ""))
    .refine((val) => /^\d+$/.test(val), {
      message: "Phone number must contain only digits",
    })
    .refine((val) => val.length >= 10, {
      message: "Phone number must be at least 10 digits",
    }),
  city: z.string().min(2, "City is required"),
  state: z.string().min(1, "Please select a state"),
  note: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const employerProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .optional()
    .or(z.literal("")),
  website: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .optional()
    .or(z.literal("")),
  industry: z
    .string()
    .min(2, "Industry must be at least 2 characters")
    .optional()
    .or(z.literal("")),
});

export type EmployerProfileFormValues = z.infer<typeof employerProfileSchema>;

export const employerPasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your new password"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type EmployerPasswordFormValues = z.infer<typeof employerPasswordSchema>;
