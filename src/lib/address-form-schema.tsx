import { z } from "zod"

export const addressFormSchema = z
  .object({
    suburb: z.string().min(3, "Suburb must be at least 3 characters"),
    postcode: z.string().min(4, "Postcode must be at least 4 numbers"),
    state: z.string().min(1, "select a state"),
  });

export type AddressFormType = z.infer<typeof addressFormSchema>
export type AddressFormErrors = Partial<Record<keyof AddressFormType, string[]>>;