import { FitnessPlan } from "@/types/plan";
import { UserDetails } from "@/types/user";

const PLANS_STORAGE_KEY = "fitness_plans";
const USER_DATA_STORAGE_KEY = "user_data";

export const savePlan = (plan: FitnessPlan, userData: UserDetails) => {
  try {
    const plans = loadPlans();
    const newPlan = {
      ...plan,
      userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    plans.unshift(newPlan); // Add to beginning
    
    // Keep only last 10 plans
    if (plans.length > 10) {
      plans.splice(10);
    }
    
    localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(plans));
    return newPlan;
  } catch (error) {
    console.error("Error saving plan:", error);
    throw new Error("Failed to save plan");
  }
};

export const loadPlans = () => {
  try {
    const data = localStorage.getItem(PLANS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading plans:", error);
    return [];
  }
};

export const deletePlan = (planId: string) => {
  try {
    const plans = loadPlans();
    const updatedPlans = plans.filter((plan: any) => plan.id !== planId);
    localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(updatedPlans));
    return updatedPlans;
  } catch (error) {
    console.error("Error deleting plan:", error);
    throw new Error("Failed to delete plan");
  }
};

export const saveUserData = (userData: UserDetails) => {
  try {
    localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};

export const loadUserData = (): UserDetails | null => {
  try {
    const data = localStorage.getItem(USER_DATA_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error loading user data:", error);
    return null;
  }
};

export const clearAllData = () => {
  try {
    localStorage.removeItem(PLANS_STORAGE_KEY);
    localStorage.removeItem(USER_DATA_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing data:", error);
  }
};
