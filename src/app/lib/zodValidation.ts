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
  companyId: z.string().optional().or(z.literal("")),
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .optional()
    .or(z.literal("")),
  logo: z
    .string()
    .url("Please enter a valid URL")
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
  specialization: z
    .string()
    .min(2, "Specialization must be at least 2 characters")
    .optional()
    .or(z.literal("")),
});

export type EmployerProfileFormValues = z.infer<typeof employerProfileSchema>;

export const employerPasswordSchema = z
  .object({
    oldPassword: z.string().optional().or(z.literal("")),
    newPassword: z.string().optional().or(z.literal("")),
  })
  .refine(
    (values) => {
      const oldPassword = values.oldPassword?.trim() ?? "";
      const newPassword = values.newPassword?.trim() ?? "";

      if (!oldPassword && !newPassword) {
        return true;
      }

      return Boolean(oldPassword) && Boolean(newPassword);
    },
    {
      message: "Old password and new password are required together",
      path: ["newPassword"],
    },
  );

export type EmployerPasswordFormValues = z.infer<typeof employerPasswordSchema>;
