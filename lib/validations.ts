import { z } from "zod";

const honeypot = z.string().max(0).optional().or(z.literal(""));

const optionalEmail = z
  .string()
  .trim()
  .refine((value) => value === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), "Enter a valid email");

export const estimateSchema = z.object({
  rooms: z.string().min(1, "Select room count"),
  productType: z.string().min(1, "Select a product type"),
  budget: z.string().min(1, "Select a budget range"),
  name: z.string().min(2, "Enter your name"),
  phone: z.string().min(7, "Enter a valid phone"),
  email: optionalEmail,
  message: z.string().max(2000),
  company: honeypot,
});

export const bookingSchema = z.object({
  location: z.enum(["Dubai", "Abu Dhabi"]),
  preferredDate: z.string().min(1, "Choose a date"),
  preferredTime: z.string().min(1, "Choose a time slot"),
  address: z.string().min(8, "Enter your address"),
  name: z.string().min(2, "Enter your name"),
  phone: z.string().min(7, "Enter a valid phone"),
  email: optionalEmail,
  notes: z.string().max(2000),
  company: honeypot,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const chatLeadSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  phone: z.string().min(7, "Enter a valid phone"),
  email: optionalEmail,
  product_interest: z.string().min(1),
  rooms: z.string().min(1),
  location: z.string().min(1),
  estimate_min: z.number().nonnegative(),
  estimate_max: z.number().nonnegative(),
  booking_date: z.string().optional().default(""),
  booking_time: z.string().optional().default(""),
  transcript: z
    .array(
      z.object({
        role: z.enum(["bot", "user"]),
        text: z.string(),
      })
    )
    .default([]),
});

export type EstimateInput = z.infer<typeof estimateSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type ChatLeadInput = z.infer<typeof chatLeadSchema>;
