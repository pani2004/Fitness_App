"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Utensils, Clock, Flame, Drumstick, Wheat, Droplet, Image as ImageIcon } from "lucide-react";
import { DietPlan as DietPlanType } from "@/types/plan";
import ImageModal from "@/components/ImageModal";
import { createMealPrompt, generateAndCacheImage } from "@/lib/image-generation/pollinations";

interface DietPlanProps {
  dietPlan: DietPlanType;
}

export default function DietPlan({ dietPlan }: DietPlanProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageTitle, setImageTitle] = useState<string>("");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const meals = [
    { key: "breakfast", icon: Utensils, color: "orange" },
    { key: "midMorningSnack", icon: Utensils, color: "yellow" },
    { key: "lunch", icon: Utensils, color: "green" },
    { key: "eveningSnack", icon: Utensils, color: "blue" },
    { key: "dinner", icon: Utensils, color: "purple" },
  ];

  const getMeal = (key: string) => {
    return dietPlan[key as keyof DietPlanType];
  };

  const handleGenerateMealImage = async (mealName: string, items: string[]) => {
    setImageTitle(mealName);
    setIsImageModalOpen(true);
    setIsGeneratingImage(true);
    setSelectedImage(null);

    try {
      const prompt = createMealPrompt(mealName, items);
      const cacheKey = `img_meal_${mealName.replace(/\s+/g, '_')}`;
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
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Your Daily Diet Plan
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Nutritionally balanced meals to fuel your fitness journey
        </p>
        <p className="text-sm text-green-600 dark:text-green-400 mt-2">
          💡 Click the image icon on any meal to see an AI-generated food photo
        </p>
      </motion.div>

      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageUrl={selectedImage}
        title={imageTitle}
        isLoading={isGeneratingImage}
      />

      {/* Daily Summary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-6 text-white mb-6"
      >
        <h3 className="text-xl font-bold mb-4">Daily Nutritional Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <Flame className="w-6 h-6 mb-2" />
            <p className="text-2xl font-bold">{dietPlan.totalCalories}</p>
            <p className="text-sm opacity-90">Calories</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <Drumstick className="w-6 h-6 mb-2" />
            <p className="text-2xl font-bold">{dietPlan.totalProtein}g</p>
            <p className="text-sm opacity-90">Protein</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <Wheat className="w-6 h-6 mb-2" />
            <p className="text-2xl font-bold">{dietPlan.totalCarbs}g</p>
            <p className="text-sm opacity-90">Carbs</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <Droplet className="w-6 h-6 mb-2" />
            <p className="text-2xl font-bold">{dietPlan.totalFats}g</p>
            <p className="text-sm opacity-90">Fats</p>
          </div>
        </div>
      </motion.div>

      {/* Meals */}
      <div className="grid gap-4">
        {meals.map((mealInfo, index) => {
          const meal = getMeal(mealInfo.key);
          if (!meal || typeof meal !== 'object' || !('name' in meal)) return null;

          return (
            <motion.div
              key={mealInfo.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/90 dark:bg-gray-900/50 backdrop-blur-sm border-green-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <mealInfo.icon className={`w-5 h-5 text-${mealInfo.color}-600`} />
                      <span>{meal.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleGenerateMealImage(meal.name, meal.items)}
                        className="h-6 w-6 p-0"
                        title="Generate AI image"
                      >
                        <ImageIcon className="w-4 h-4 text-green-600" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      {meal.time}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Food Items */}
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-lg">
                      <ul className="space-y-2">
                        {meal.items.map((item: string, idx: number) => (
                          <li key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Macros */}
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded">
                        <Flame className="w-4 h-4 mx-auto mb-1 text-red-600" />
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{meal.calories} cal</p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                        <Drumstick className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{meal.protein}g</p>
                      </div>
                      <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
                        <Wheat className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{meal.carbs}g</p>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded">
                        <Droplet className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{meal.fats}g</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
