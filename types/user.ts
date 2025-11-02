import { z } from "zod";

// User Details Schema
export const userDetailsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().min(13, "Age must be at least 13").max(100, "Age must be less than 100"),
  gender: z.enum(["Male", "Female", "Other"]),
  height: z.number().min(100, "Height must be at least 100 cm").max(250, "Height must be less than 250 cm"),
  weight: z.number().min(30, "Weight must be at least 30 kg").max(300, "Weight must be less than 300 kg"),
  fitnessGoal: z.enum([
    "Weight Loss",
    "Muscle Gain",
    "Maintenance",
    "Endurance",
    "Flexibility"
  ]),
  fitnessLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
  workoutLocation: z.enum(["Home", "Gym", "Outdoor"]),
  dietaryPreference: z.enum([
    "Vegetarian",
    "Non-Vegetarian",
    "Vegan",
    "Keto",
    "Paleo"
  ]),
  medicalHistory: z.string().optional(),
  stressLevel: z.enum(["Low", "Medium", "High"]).optional(),
});

export type UserDetails = z.infer<typeof userDetailsSchema>;
export const fitnessGoals = [
  "Weight Loss",
  "Muscle Gain",
  "Maintenance",
  "Endurance",
  "Flexibility"
] as const;

export const fitnessLevels = ["Beginner", "Intermediate", "Advanced"] as const;
export const workoutLocations = ["Home", "Gym", "Outdoor"] as const;
export const dietaryPreferences = [
  "Vegetarian",
  "Non-Vegetarian",
  "Vegan",
  "Keto",
  "Paleo"
] as const;

export const genders = ["Male", "Female", "Other"] as const;

export const stressLevels = ["Low", "Medium", "High"] as const;
