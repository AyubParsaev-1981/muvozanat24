// Scientific Recommendation & Smart Food Replacement Engine
// Implements: Mifflin-St Jeor energy calculation, Neutral BMI evaluator, Smart Menu Adaptation

const NutritionEngine = {
  // Calculate Basal Metabolic Rate (BMR) via Mifflin-St Jeor equation
  calculateBMR(profile) {
    const { gender, currentWeight, height, age } = profile;
    const weight = Number(currentWeight) || 75;
    const h = Number(height) || 170;
    const a = Number(age) || 30;

    if (gender === 'female') {
      return Math.round(10 * weight + 6.25 * h - 5 * a - 161);
    } else {
      return Math.round(10 * weight + 6.25 * h - 5 * a + 5);
    }
  },

  // Calculate Total Daily Energy Expenditure (TDEE) & Target Daily Calories
  calculateDailyTargetCalories(profile) {
    const bmr = this.calculateBMR(profile);
    const activityMultipliers = {
      low: 1.2,
      medium: 1.45,
      high: 1.7
    };
    const factor = activityMultipliers[profile.activityLevel] || 1.4;
    const tdee = Math.round(bmr * factor);

    let targetCalories = tdee;
    if (profile.goal === 'lose') {
      // Safe, sustainable deficit: 15-20% deficit (~450 kcal/day)
      targetCalories = Math.max(tdee - 450, profile.gender === 'female' ? 1300 : 1550);
    } else if (profile.goal === 'gain') {
      targetCalories = tdee + 350;
    }

    // Macro distribution: Protein 25%, Fat 30%, Carbs 45%
    const proteinGrams = Math.round((targetCalories * 0.25) / 4);
    const fatGrams = Math.round((targetCalories * 0.30) / 9);
    const carbsGrams = Math.round((targetCalories * 0.45) / 4);

    return {
      bmr,
      tdee,
      targetCalories,
      macros: {
        protein: proteinGrams,
        fat: fatGrams,
        carbs: carbsGrams
      }
    };
  },

  // BMI calculation with neutral disclaimer (Section 7)
  calculateBMI(profile) {
    const w = Number(profile.currentWeight) || 70;
    const h = Number(profile.height) / 100 || 1.75;
    const bmi = (w / (h * h)).toFixed(1);
    return {
      value: bmi,
      disclaimerKey: 'bmi_neutral_disclaimer'
    };
  },

  // Progress metrics for the 5-second dashboard (Section 12 & 21)
  calculateProgress(profile) {
    const start = Number(profile.startWeight) || 96.0;
    const current = Number(profile.currentWeight) || 93.8;
    const target = Number(profile.targetWeight) || 82.0;

    const totalToLose = Math.max(start - target, 0.1);
    const alreadyLost = Math.max(start - current, 0);
    const percent = Math.min(Math.round((alreadyLost / totalToLose) * 100), 100);
    const remaining = (current - target).toFixed(1);
    const changeTotal = (current - start).toFixed(1); // e.g. -2.2 kg

    return {
      currentWeight: current,
      startWeight: start,
      targetWeight: target,
      percent: Math.max(percent, 0),
      remainingKg: Math.max(Number(remaining), 0).toFixed(1),
      changeKg: changeTotal > 0 ? `+${changeTotal}` : `${changeTotal}`,
      stage1Target: Math.round(start - (start - target) * 0.3) // First milestone (e.g. 96 -> 92 kg)
    };
  },

  // Smart Menu Adaptation (Core USP Feature):
  // If user chooses a rich national meal (e.g. Osh), rebalance dinner so daily targets stay safe!
  adaptDailyMeals(dayMeals, changedMealCategory, newFoodItem, foodsList) {
    const adaptedPlan = { ...dayMeals };
    adaptedPlan[changedMealCategory] = newFoodItem.id;

    // Check if lunch or snack is high in calories
    const isHeavyMeal = newFoodItem.calories >= 500;
    let adaptationMessage = null;

    if (isHeavyMeal && changedMealCategory === 'lunch') {
      // Find a light dinner option in foodsList
      const lightDinner = foodsList.find(f => f.category === 'dinner' && f.dietCategory === 'light') 
                       || foodsList.find(f => f.id === 'food_chicken_salad_01');

      if (lightDinner && adaptedPlan.dinner !== lightDinner.id) {
        adaptedPlan.dinner = lightDinner.id;
        adaptationMessage = {
          type: 'adapted_dinner',
          chosenDish: newFoodItem.name[currentLanguage] || newFoodItem.name['uz-Latn'],
          lightDish: lightDinner.name[currentLanguage] || lightDinner.name['uz-Latn']
        };
      }
    }

    return {
      updatedDayMeals: adaptedPlan,
      adaptationMessage
    };
  },

  // Calculate scaled food nutrition if small portion is selected
  getNutritionForPortion(food, isSmallPortion) {
    if (!isSmallPortion) {
      return {
        servingText: food.servingSize,
        calories: food.calories,
        protein: food.protein,
        fat: food.fat,
        carbs: food.carbs,
        fiber: food.fiber
      };
    }

    const ratio = (food.smallServingGrams || 170) / (food.servingGrams || 250);
    return {
      servingText: `${food.smallServingGrams} g`,
      calories: Math.round(food.calories * ratio),
      protein: Math.round(food.protein * ratio),
      fat: Math.round(food.fat * ratio),
      carbs: Math.round(food.carbs * ratio),
      fiber: Number((food.fiber * ratio).toFixed(1))
    };
  }
};
