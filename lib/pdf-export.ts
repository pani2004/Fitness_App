import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FitnessPlan } from '@/types/plan';

export async function exportToPDF(fitnessPlan: FitnessPlan, userName: string) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  let yPosition = margin;

  // Helper function to add text
  const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = margin;
    }
    const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
    pdf.text(lines, margin, yPosition);
    yPosition += lines.length * (fontSize / 2.5) + 3;
  };

  // Title
  pdf.setFillColor(139, 92, 246); // Purple
  pdf.rect(0, 0, pageWidth, 40, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Your Personalized Fitness Plan', pageWidth / 2, 20, { align: 'center' });
  pdf.setFontSize(14);
  pdf.text(`Generated for ${userName}`, pageWidth / 2, 30, { align: 'center' });
  
  yPosition = 50;
  pdf.setTextColor(0, 0, 0);

  // Workout Plan
  addText('7-DAY WORKOUT PLAN', 18, true);
  yPosition += 5;

  fitnessPlan.workoutPlan.days.forEach((day, index) => {
    addText(`${day.day} - ${day.focus}`, 14, true);
    addText(`Warm-up: ${day.warmup}`, 10);
    
    day.exercises.forEach((exercise, idx) => {
      addText(`${idx + 1}. ${exercise.name}`, 11, true);
      addText(`   Sets: ${exercise.sets} | Reps: ${exercise.reps} | Rest: ${exercise.rest}`, 9);
      if (exercise.notes) {
        addText(`   Note: ${exercise.notes}`, 9);
      }
    });
    
    addText(`Cool-down: ${day.cooldown}`, 10);
    yPosition += 5;
  });

  // Diet Plan
  pdf.addPage();
  yPosition = margin;
  addText('DAILY DIET PLAN', 18, true);
  yPosition += 5;

  // Daily Summary
  addText(`Total Daily Intake:`, 12, true);
  addText(`Calories: ${fitnessPlan.dietPlan.totalCalories} | Protein: ${fitnessPlan.dietPlan.totalProtein}g | Carbs: ${fitnessPlan.dietPlan.totalCarbs}g | Fats: ${fitnessPlan.dietPlan.totalFats}g`, 10);
  yPosition += 5;

  const meals = ['breakfast', 'midMorningSnack', 'lunch', 'eveningSnack', 'dinner'];
  meals.forEach(mealKey => {
    const meal = fitnessPlan.dietPlan[mealKey as keyof typeof fitnessPlan.dietPlan];
    if (meal && typeof meal === 'object' && 'name' in meal) {
      addText(`${meal.name} (${meal.time})`, 12, true);
      meal.items.forEach((item: string) => addText(`• ${item}`, 10));
      addText(`Macros: ${meal.calories} cal | Protein: ${meal.protein}g | Carbs: ${meal.carbs}g | Fats: ${meal.fats}g`, 9);
      yPosition += 3;
    }
  });

  // Tips
  pdf.addPage();
  yPosition = margin;
  addText('EXPERT TIPS FOR SUCCESS', 18, true);
  yPosition += 5;
  fitnessPlan.tips.forEach((tip, index) => {
    addText(`${index + 1}. ${tip}`, 11);
    yPosition += 2;
  });

  // Motivation
  yPosition += 5;
  pdf.setFillColor(139, 92, 246);
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 30, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'italic');
  const motivationLines = pdf.splitTextToSize(`"${fitnessPlan.motivation}"`, pageWidth - 2 * margin - 10);
  pdf.text(motivationLines, pageWidth / 2, yPosition + 15, { align: 'center' });

  // Save
  pdf.save(`${userName}_Fitness_Plan.pdf`);
}
