import { z } from "zod";

// Exercise Schema
export const exerciseSchema = z.object({
  name: z.string(),
  sets: z.number(),
  reps: z.string(), // Can be "10-12" or "30 seconds"
  rest: z.string(),
  equipment: z.string().optional(),
  notes: z.string().optional(),
});

export type Exercise = z.infer<typeof exerciseSchema>;

// Day Workout Schema
export const dayWorkoutSchema = z.object({
  day: z.string(),
  focus: z.string(),
  warmup: z.string(),
  exercises: z.array(exerciseSchema),
  cooldown: z.string(),
});

export type DayWorkout = z.infer<typeof dayWorkoutSchema>;

// Meal Schema
export const mealSchema = z.object({
  name: z.string(),
  time: z.string(),
  items: z.array(z.string()),
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fats: z.number(),
});

export type Meal = z.infer<typeof mealSchema>;

// Diet Plan Schema
export const dietPlanSchema = z.object({
  breakfast: mealSchema,
  midMorningSnack: mealSchema.optional(),
  lunch: mealSchema,
  eveningSnack: mealSchema.optional(),
  dinner: mealSchema,
  totalCalories: z.number(),
  totalProtein: z.number(),
  totalCarbs: z.number(),
  totalFats: z.number(),
});

export type DietPlan = z.infer<typeof dietPlanSchema>;

// Fitness Plan Schema
export const fitnessPlanSchema = z.object({
  workoutPlan: z.object({
    days: z.array(dayWorkoutSchema),
  }),
  dietPlan: dietPlanSchema,
  tips: z.array(z.string()),
  motivation: z.string(),
  createdAt: z.string().optional(),
});

export type FitnessPlan = z.infer<typeof fitnessPlanSchema>;
