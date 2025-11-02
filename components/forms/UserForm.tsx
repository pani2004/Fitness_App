"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { UserDetails, userDetailsSchema, fitnessGoals, fitnessLevels, workoutLocations, dietaryPreferences, genders, stressLevels } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

interface UserFormProps {
  onSubmit: (data: UserDetails) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

export default function UserForm({ onSubmit, onBack, isLoading }: UserFormProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    setValue,
    watch,
    trigger
  } = useForm<UserDetails>({
    resolver: zodResolver(userDetailsSchema),
    mode: "onTouched"
  });

  const formData = watch();

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(step);
    const isValid = await trigger(fieldsToValidate as any);
    if (isValid && step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const getFieldsForStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return ["name", "age", "gender"];
      case 2:
        return ["height", "weight"];
      case 3:
        return ["fitnessGoal", "fitnessLevel"];
      case 4:
        return ["workoutLocation", "dietaryPreference"];
      case 5:
        return ["medicalHistory", "stressLevel"];
      default:
        return [];
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-black dark:via-gray-950 dark:to-black py-12 px-4">
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      <div className="container mx-auto max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
              {Math.round((step / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait" custom={step}>
            <motion.div
              key={step}
              custom={step}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <Card className="border-2 shadow-xl bg-white/90 dark:bg-gray-900/50 backdrop-blur-sm dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl">
                    {step === 1 && "Personal Information"}
                    {step === 2 && "Physical Stats"}
                    {step === 3 && "Fitness Goals"}
                    {step === 4 && "Preferences"}
                    {step === 5 && "Additional Details"}
                  </CardTitle>
                  <CardDescription>
                    {step === 1 && "Let's start with your basic information"}
                    {step === 2 && "Tell us about your current physical condition"}
                    {step === 3 && "What are your fitness goals?"}
                    {step === 4 && "Help us customize your plan"}
                    {step === 5 && "Almost done! Any additional information?"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Step 1: Personal Info */}
                  {step === 1 && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          {...register("name")}
                          className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && (
                          <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="age">Age *</Label>
                        <Input
                          id="age"
                          type="number"
                          placeholder="25"
                          {...register("age", { valueAsNumber: true })}
                          className={errors.age ? "border-red-500" : ""}
                        />
                        {errors.age && (
                          <p className="text-sm text-red-500">{errors.age.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender *</Label>
                        <Select
                          onValueChange={(value) => {
                            setValue("gender", value as any, { shouldValidate: true, shouldTouch: true });
                          }}
                          defaultValue={formData.gender}
                        >
                          <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            {genders.map((gender) => (
                              <SelectItem key={gender} value={gender}>
                                {gender}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.gender && touchedFields.gender && (
                          <p className="text-sm text-red-500">{errors.gender.message}</p>
                        )}
                      </div>
                    </>
                  )}

                  {/* Step 2: Physical Stats */}
                  {step === 2 && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="height">Height (cm) *</Label>
                        <Input
                          id="height"
                          type="number"
                          placeholder="170"
                          {...register("height", { valueAsNumber: true })}
                          className={errors.height ? "border-red-500" : ""}
                        />
                        {errors.height && (
                          <p className="text-sm text-red-500">{errors.height.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg) *</Label>
                        <Input
                          id="weight"
                          type="number"
                          placeholder="70"
                          {...register("weight", { valueAsNumber: true })}
                          className={errors.weight ? "border-red-500" : ""}
                        />
                        {errors.weight && (
                          <p className="text-sm text-red-500">{errors.weight.message}</p>
                        )}
                      </div>

                      {formData.height && formData.weight && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg"
                        >
                          <p className="text-sm font-medium text-purple-900 dark:text-purple-200">
                            Your BMI:{" "}
                            <span className="text-lg">
                              {(formData.weight / ((formData.height / 100) ** 2)).toFixed(1)}
                            </span>
                          </p>
                        </motion.div>
                      )}
                    </>
                  )}

                  {/* Step 3: Fitness Goals */}
                  {step === 3 && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="fitnessGoal">Fitness Goal *</Label>
                        <Select
                          onValueChange={(value) => {
                            setValue("fitnessGoal", value as any, { shouldValidate: true, shouldTouch: true });
                          }}
                          defaultValue={formData.fitnessGoal}
                        >
                          <SelectTrigger className={errors.fitnessGoal ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select your goal" />
                          </SelectTrigger>
                          <SelectContent>
                            {fitnessGoals.map((goal) => (
                              <SelectItem key={goal} value={goal}>
                                {goal}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.fitnessGoal && touchedFields.fitnessGoal && (
                          <p className="text-sm text-red-500">{errors.fitnessGoal.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fitnessLevel">Current Fitness Level *</Label>
                        <Select
                          onValueChange={(value) => {
                            setValue("fitnessLevel", value as any, { shouldValidate: true, shouldTouch: true });
                          }}
                          defaultValue={formData.fitnessLevel}
                        >
                          <SelectTrigger className={errors.fitnessLevel ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select your level" />
                          </SelectTrigger>
                          <SelectContent>
                            {fitnessLevels.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.fitnessLevel && touchedFields.fitnessLevel && (
                          <p className="text-sm text-red-500">{errors.fitnessLevel.message}</p>
                        )}
                      </div>
                    </>
                  )}

                  {/* Step 4: Preferences */}
                  {step === 4 && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="workoutLocation">Workout Location *</Label>
                        <Select
                          onValueChange={(value) => {
                            setValue("workoutLocation", value as any, { shouldValidate: true, shouldTouch: true });
                          }}
                          defaultValue={formData.workoutLocation}
                        >
                          <SelectTrigger className={errors.workoutLocation ? "border-red-500" : ""}>
                            <SelectValue placeholder="Where will you workout?" />
                          </SelectTrigger>
                          <SelectContent>
                            {workoutLocations.map((location) => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.workoutLocation && touchedFields.workoutLocation && (
                          <p className="text-sm text-red-500">{errors.workoutLocation.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dietaryPreference">Dietary Preference *</Label>
                        <Select
                          onValueChange={(value) => {
                            setValue("dietaryPreference", value as any, { shouldValidate: true, shouldTouch: true });
                          }}
                          defaultValue={formData.dietaryPreference}
                        >
                          <SelectTrigger className={errors.dietaryPreference ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select your diet type" />
                          </SelectTrigger>
                          <SelectContent>
                            {dietaryPreferences.map((diet) => (
                              <SelectItem key={diet} value={diet}>
                                {diet}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.dietaryPreference && touchedFields.dietaryPreference && (
                          <p className="text-sm text-red-500">{errors.dietaryPreference.message}</p>
                        )}
                      </div>
                    </>
                  )}

                  {/* Step 5: Additional Details */}
                  {step === 5 && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="medicalHistory">Medical History (Optional)</Label>
                        <Textarea
                          id="medicalHistory"
                          placeholder="Any injuries, conditions, or allergies we should know about?"
                          rows={4}
                          {...register("medicalHistory")}
                        />
                        <p className="text-xs text-gray-500">
                          This helps us create a safer plan for you
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="stressLevel">Stress Level (Optional)</Label>
                        <Select
                          onValueChange={(value) => {
                            setValue("stressLevel", value as any, { shouldValidate: true, shouldTouch: true });
                          }}
                          defaultValue={formData.stressLevel}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="How stressed do you feel?" />
                          </SelectTrigger>
                          <SelectContent>
                            {stressLevels.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={step === 1 && onBack ? onBack : prevStep}
              disabled={isLoading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {step < totalSteps ? (
              <Button
                type="button"
                onClick={nextStep}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Your Plan...
                  </>
                ) : (
                  <>
                    Generate My Plan
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
