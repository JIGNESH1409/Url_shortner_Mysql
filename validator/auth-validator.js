import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().trim().email({message:"Entered Email is not valid. Please enter a valid email"}).min(5,{message:"Email must be more than 5 characters"}).max(40,{message:"Email must be less than 40 characters"}),
    password: z.string().trim().min(6,{message:"Password must be at least 6 characters"}).max(20,{message:"Password must be less than 20 characters"})
})


export const registerSchema=loginSchema.extend({
  name: z.string().trim().min(3,{message:"Name must be more than 3 characters"}).max(30,{message:"Name must be less than 30 characters"})
})