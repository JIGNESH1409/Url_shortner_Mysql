import z from 'zod';

export const shortnerSchema = z.object({
    url: z
    .string()
    .trim()
    .url({ message: "Please enter a valid URL" })
    .min(5, { message: "URL must be at least 5 characters long" })
    .max(2048, { message: "URL must be less than 2048 characters long" }),

   shortCode: z
   .string()
   .trim()
   .min(3, { message: "Shortcode must be at least 3 characters long" })
   .max(20, { message: "Shortcode must be less than 20 characters long" }) 
})