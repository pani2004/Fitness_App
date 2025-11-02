"use client";

import { useState } from "react";
import LandingPage from "@/components/LandingPage";
import UserForm from "@/components/forms/UserForm";
import WorkoutPlan from "@/components/plan-display/WorkoutPlan";
import DietPlan from "@/components/plan-display/DietPlan";
import TipsAndMotivation from "@/components/plan-display/TipsAndMotivation";
import SavedPlans from "@/components/SavedPlans";
import VoicePlayer from "@/components/VoicePlayer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserDetails } from "@/types/user";
import { FitnessPlan } from "@/types/plan";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Home as HomeIcon, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { exportToPDF } from "@/lib/pdf-export";
import { savePlan } from "@/lib/storage/local-storage";

type AppState = "landing" | "form" | "plan" | "saved";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("landing");
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [fitnessPlan, setFitnessPlan] = useState<FitnessPlan | null>(null);
  const [userData, setUserData] = useState<UserDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetStarted = () => {
    setAppState("form");
  };

  const handleFormSubmit = async (formData: UserDetails) => {
    setIsLoading(true);
    setError(null);
    setUserData(formData);

    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate plan");
      }

      const plan: FitnessPlan = await response.json();
      
      // Save plan to local storage
      savePlan(plan, formData);
      
      setFitnessPlan(plan);
      setAppState("plan");
      
      // Show success message
      setError("✅ Plan saved successfully!");
      setTimeout(() => setError(null), 3000);
    } catch (err) {
      console.error("Error generating plan:", err);
      setError(err instanceof Error ? err.message : "Failed to generate plan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!fitnessPlan || !userData) return;
    
    setIsExporting(true);
    try {
      await exportToPDF(fitnessPlan, userData.name);
    } catch (err) {
      console.error("Error exporting PDF:", err);
      setError("Failed to export PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const handleBackToLanding = () => {
    setAppState("landing");
  };

  const handleViewSavedPlans = () => {
    setAppState("saved");
  };

  const handleViewSavedPlan = (plan: FitnessPlan, user: UserDetails) => {
    setFitnessPlan(plan);
    setUserData(user);
    setAppState("plan");
  };

  // Convert plan to text for voice reading
  const getWorkoutText = (plan: FitnessPlan): string => {
    let text = "Your 7-day workout plan. ";
    plan.workoutPlan.days.forEach((day) => {
      text += `${day.day}. Focus: ${day.focus}. Warm-up: ${day.warmup}. `;
      day.exercises.forEach((ex, i) => {
        text += `Exercise ${i + 1}: ${ex.name}. ${ex.sets} sets of ${ex.reps} reps. Rest ${ex.rest}. `;
      });
      text += `Cool-down: ${day.cooldown}. `;
    });
    return text;
  };

  const getDietText = (plan: FitnessPlan): string => {
    const meals = ['breakfast', 'midMorningSnack', 'lunch', 'eveningSnack', 'dinner'] as const;
    let text = "Your daily diet plan. ";
    meals.forEach((mealKey) => {
      const meal = plan.dietPlan[mealKey];
      if (meal && typeof meal === 'object' && 'name' in meal) {
        text += `${meal.name} at ${meal.time}. Items: ${meal.items.join(', ')}. `;
      }
    });
    return text;
  };

  const getTipsText = (plan: FitnessPlan): string => {
    let text = "Fitness tips. ";
    plan.tips.forEach((tip, i) => {
      text += `Tip ${i + 1}: ${tip}. `;
    });
    text += `Motivation: ${plan.motivation}`;
    return text;
  };

  return (
    <div className="min-h-screen">
      {appState === "landing" && (
        <LandingPage 
          onGetStarted={handleGetStarted}
          onViewSavedPlans={handleViewSavedPlans}
        />
      )}

      {appState === "saved" && (
        <SavedPlans
          onViewPlan={handleViewSavedPlan}
          onClose={handleBackToLanding}
        />
      )}

      {appState === "form" && (
        <UserForm
          onSubmit={handleFormSubmit}
          onBack={handleBackToLanding}
          isLoading={isLoading}
        />
      )}

      {appState === "plan" && fitnessPlan && (
        <div className="min-h-screen p-4 md:p-8">
          {/* Theme Toggle - Fixed Position */}
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          
          <div className="container mx-auto max-w-7xl">
            {/* Header with Actions */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4"
            >
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Your Personalized Fitness Plan
              </h1>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setAppState("landing")}
                  className="flex items-center gap-2"
                >
                  <HomeIcon className="w-4 h-4" />
                  Home
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setAppState("form");
                    setFitnessPlan(null);
                  }}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Regenerate
                </Button>
                <Button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex items-center gap-2"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Export PDF
                    </>
                  )}
                </Button>
              </div>
            </motion.div>

            {/* Voice Player */}
            <VoicePlayer
              workoutText={getWorkoutText(fitnessPlan)}
              dietText={getDietText(fitnessPlan)}
              tipsText={getTipsText(fitnessPlan)}
            />

            {/* Tabs for Plan Sections */}
            <Tabs defaultValue="workout" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 lg:w-auto">
                <TabsTrigger value="workout">💪 Workout Plan</TabsTrigger>
                <TabsTrigger value="diet">🥗 Diet Plan</TabsTrigger>
                <TabsTrigger value="tips">💡 Tips & Motivation</TabsTrigger>
              </TabsList>

              <TabsContent value="workout" className="mt-6">
                <WorkoutPlan workoutPlan={fitnessPlan.workoutPlan} />
              </TabsContent>

              <TabsContent value="diet" className="mt-6">
                <DietPlan dietPlan={fitnessPlan.dietPlan} />
              </TabsContent>

              <TabsContent value="tips" className="mt-6">
                <TipsAndMotivation 
                  tips={fitnessPlan.tips} 
                  motivation={fitnessPlan.motivation}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

      {error && (
        <div className={`fixed bottom-4 right-4 px-6 py-4 rounded-lg shadow-lg ${
          error.startsWith("✅") 
            ? "bg-green-500 text-white" 
            : "bg-red-500 text-white"
        }`}>
          <p className="font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}
