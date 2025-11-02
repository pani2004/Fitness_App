"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Timer, Repeat, Info, Image as ImageIcon } from "lucide-react";
import { DayWorkout } from "@/types/plan";
import ImageModal from "@/components/ImageModal";
import { createExercisePrompt, generateAndCacheImage } from "@/lib/image-generation/pollinations";

interface WorkoutPlanProps {
  workoutPlan: {
    days: DayWorkout[];
  };
}

export default function WorkoutPlan({ workoutPlan }: WorkoutPlanProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageTitle, setImageTitle] = useState<string>("");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const handleGenerateImage = async (exerciseName: string, equipment?: string) => {
    setImageTitle(exerciseName);
    setIsImageModalOpen(true);
    setIsGeneratingImage(true);
    setSelectedImage(null);

    try {
      const prompt = createExercisePrompt(exerciseName, equipment);
      const cacheKey = `img_exercise_${exerciseName.replace(/\s+/g, '_')}`;
      const imageUrl = await generateAndCacheImage(cacheKey, prompt);
      setSelectedImage(imageUrl);
    } catch (error) {
      console.error('Failed to generate image:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Your 7-Day Workout Plan
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Follow this personalized routine to achieve your fitness goals
        </p>
        <p className="text-sm text-purple-600 dark:text-purple-400 mt-2">
          💡 Click the image icon on any exercise to see an AI-generated visual
        </p>
      </motion.div>

      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageUrl={selectedImage}
        title={imageTitle}
        isLoading={isGeneratingImage}
      />

      <div className="grid gap-6">
        {workoutPlan.days.map((day, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white/90 dark:bg-gray-900/50 backdrop-blur-sm border-purple-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Dumbbell className="w-6 h-6 text-purple-600" />
                      {day.day}
                    </CardTitle>
                    <CardDescription className="text-lg mt-1">
                      Focus: <span className="font-semibold text-purple-600 dark:text-purple-400">{day.focus}</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Warmup */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                    <Timer className="w-4 h-4" />
                    Warm-up
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">{day.warmup}</p>
                </div>

                {/* Exercises */}
                <div className="space-y-3">
                  {day.exercises.map((exercise, exIndex) => (
                    <motion.div
                      key={exIndex}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2 flex-1">
                          <h5 className="font-bold text-gray-900 dark:text-white">
                            {exIndex + 1}. {exercise.name}
                          </h5>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleGenerateImage(exercise.name, exercise.equipment)}
                            className="h-6 w-6 p-0"
                            title="Generate AI image"
                          >
                            <ImageIcon className="w-4 h-4 text-purple-600" />
                          </Button>
                        </div>
                        {exercise.equipment && (
                          <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
                            {exercise.equipment}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Repeat className="w-4 h-4 text-purple-600" />
                          <span className="text-gray-700 dark:text-gray-300">
                            <strong>{exercise.sets}</strong> sets
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Dumbbell className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-700 dark:text-gray-300">
                            <strong>{exercise.reps}</strong> reps
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Timer className="w-4 h-4 text-green-600" />
                          <span className="text-gray-700 dark:text-gray-300">
                            <strong>{exercise.rest}</strong> rest
                          </span>
                        </div>
                      </div>
                      {exercise.notes && (
                        <div className="mt-2 flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Info className="w-4 h-4 mt-0.5 text-amber-600" />
                          <span>{exercise.notes}</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Cooldown */}
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2 flex items-center gap-2">
                    <Timer className="w-4 h-4" />
                    Cool-down
                  </h4>
                  <p className="text-sm text-green-800 dark:text-green-200">{day.cooldown}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
