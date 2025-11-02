import { GoogleGenerativeAI } from "@google/generative-ai";
import { UserDetails } from "@/types/user";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

export async function generateFitnessPlan(userData: UserDetails) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        responseMimeType: "application/json"
      }
    });
    
    const prompt = createFitnessPlanPrompt(userData);
    
    console.log("Generating fitness plan...");
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log("Received response, length:", text?.length);

    // Parse JSON response
    return parseGeminiResponse(text);
  } catch (error) {
    console.error("Error generating fitness plan:", error);
    throw new Error("Failed to generate fitness plan");
  }
}

export async function generateMotivationalQuote() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const prompt = `Generate a single, powerful motivational quote about fitness, health, or personal growth. 
    Make it inspiring and uplifting. Return only the quote text, nothing else.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Error generating motivational quote:", error);
    return "Your only limit is you. Push yourself and see what you can achieve!";
  }
}

function createFitnessPlanPrompt(userData: UserDetails): string {
  const bmi = (userData.weight / ((userData.height / 100) ** 2)).toFixed(1);
  
  return `Generate a 7-day fitness and diet plan for:
Name: ${userData.name}, Age: ${userData.age}, Gender: ${userData.gender}
Height: ${userData.height}cm, Weight: ${userData.weight}kg, BMI: ${bmi}
Goal: ${userData.fitnessGoal}, Level: ${userData.fitnessLevel}
Location: ${userData.workoutLocation}, Diet: ${userData.dietaryPreference}
${userData.medicalHistory ? `Medical: ${userData.medicalHistory}` : ''}

Return in this JSON format:

{
  "workoutPlan": {
    "days": [
      {
        "day": "Day 1",
        "focus": "Chest and Triceps",
        "warmup": "5 minutes cardio + dynamic stretching",
        "exercises": [
          {
            "name": "Push-ups",
            "sets": 3,
            "reps": "10-12",
            "rest": "60 seconds",
            "equipment": "None",
            "notes": "Keep core engaged"
          }
        ],
        "cooldown": "5 minutes stretching"
      }
    ]
  },
  "dietPlan": {
    "breakfast": {
      "name": "Protein-Rich Breakfast",
      "time": "7:00 AM",
      "items": ["Oatmeal with fruits", "2 boiled eggs", "Green tea"],
      "calories": 400,
      "protein": 25,
      "carbs": 45,
      "fats": 12
    },
    "midMorningSnack": {
      "name": "Mid-Morning Snack",
      "time": "10:00 AM",
      "items": ["Greek yogurt", "Handful of almonds"],
      "calories": 200,
      "protein": 15,
      "carbs": 12,
      "fats": 10
    },
    "lunch": {
      "name": "Balanced Lunch",
      "time": "1:00 PM",
      "items": ["Grilled chicken breast", "Brown rice", "Mixed vegetables"],
      "calories": 500,
      "protein": 40,
      "carbs": 50,
      "fats": 15
    },
    "eveningSnack": {
      "name": "Evening Snack",
      "time": "4:00 PM",
      "items": ["Protein shake", "Banana"],
      "calories": 250,
      "protein": 20,
      "carbs": 30,
      "fats": 5
    },
    "dinner": {
      "name": "Light Dinner",
      "time": "7:00 PM",
      "items": ["Grilled fish", "Quinoa", "Steamed broccoli"],
      "calories": 450,
      "protein": 35,
      "carbs": 40,
      "fats": 15
    },
    "totalCalories": 1800,
    "totalProtein": 135,
    "totalCarbs": 177,
    "totalFats": 57
  },
  "tips": [
    "Stay hydrated - drink at least 8-10 glasses of water daily",
    "Get 7-8 hours of quality sleep each night",
    "Focus on proper form to prevent injuries",
    "Listen to your body and rest when needed",
    "Track your progress weekly"
  ],
  "motivation": "Every workout brings you one step closer to your goals. Stay consistent, stay focused, and believe in yourself!"
}

Create 7 workout days for ${userData.fitnessLevel} level at ${userData.workoutLocation}.
Adjust diet calories for ${userData.fitnessGoal} (${userData.dietaryPreference}).
Return only valid JSON.`;
}

function parseGeminiResponse(text: string) {
  try {
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/```\n?/g, "");
    }
    
    // Check if response is empty or too short
    if (!cleanedText || cleanedText.length < 100) {
      console.error("Response too short:", cleanedText);
      throw new Error("Incomplete response from AI");
    }
    const parsed = JSON.parse(cleanedText);
    if (!parsed.workoutPlan || !parsed.dietPlan || !parsed.tips || !parsed.motivation) {
      console.error("Missing required fields in response");
      throw new Error("Invalid response structure from AI");
    }
    parsed.createdAt = new Date().toISOString();
    
    return parsed;
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    console.error("Raw text length:", text?.length);
    console.error("Text preview:", text?.substring(0, 500));
    throw new Error("Failed to parse AI response. The response may be incomplete or invalid.");
  }
}
