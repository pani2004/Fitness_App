"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Trash2, Eye, Calendar, User } from "lucide-react";
import { loadPlans, deletePlan } from "@/lib/storage/local-storage";
import { FitnessPlan } from "@/types/plan";
import { UserDetails } from "@/types/user";

interface SavedPlanWithMetadata extends FitnessPlan {
  id: string;
  userData: UserDetails;
  createdAt: string;
}

interface SavedPlansProps {
  onViewPlan: (plan: FitnessPlan, userData: UserDetails) => void;
  onClose: () => void;
}

export default function SavedPlans({ onViewPlan, onClose }: SavedPlansProps) {
  const [savedPlans, setSavedPlans] = useState<SavedPlanWithMetadata[]>([]);

  useEffect(() => {
    const plans = loadPlans();
    setSavedPlans(plans);
  }, []);

  const handleDelete = (planId: string) => {
    if (confirm("Are you sure you want to delete this plan?")) {
      const updatedPlans = deletePlan(planId);
      setSavedPlans(updatedPlans);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Saved Fitness Plans
            </h1>
            <Button variant="outline" onClick={onClose}>
              Back to Home
            </Button>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage your previously generated fitness plans
          </p>
        </motion.div>

        {savedPlans.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <Card className="p-12 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 border-2 border-dashed">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-2xl font-semibold mb-2">No Saved Plans Yet</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Generate your first fitness plan to see it here!
              </p>
            </Card>
          </motion.div>
        ) : (
          <div className="grid gap-4 md:gap-6">
            {savedPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-5 h-5 text-purple-600" />
                        <h3 className="text-xl font-semibold">
                          {plan.userData.name}'s Plan
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(plan.createdAt)}
                        </div>
                        <div className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                          Goal: {plan.userData.fitnessGoal}
                        </div>
                        <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                          Level: {plan.userData.fitnessLevel}
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2 text-sm">
                        <span className="text-gray-500">
                          📅 {plan.workoutPlan.days.length} Day Workout
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-500">
                          🍽️ {plan.dietPlan.totalCalories} Cal/Day
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-500">
                          💡 {plan.tips.length} Tips
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => onViewPlan(plan, plan.userData)}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Plan
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDelete(plan.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
