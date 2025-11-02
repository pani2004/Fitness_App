"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Heart, Sparkles } from "lucide-react";

interface TipsAndMotivationProps {
  tips: string[];
  motivation: string;
}

export default function TipsAndMotivation({ tips, motivation }: TipsAndMotivationProps) {
  return (
    <div className="space-y-6">
      {/* Motivational Quote */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden"
      >
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <Heart className="w-8 h-8 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-3">Your Motivation</h3>
                <p className="text-lg leading-relaxed italic">"{motivation}"</p>
              </div>
            </div>
            <Sparkles className="absolute top-4 right-4 w-6 h-6 opacity-50" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          Expert Tips for Success
        </h3>
        <div className="grid gap-4">
          {tips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="bg-white/90 dark:bg-gray-900/50 backdrop-blur-sm border-yellow-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed pt-1">
                      {tip}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
