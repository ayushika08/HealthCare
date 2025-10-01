document.addEventListener("DOMContentLoaded", function () {
  initializeDietPlan();
});

function initializeDietPlan() {
  const form = document.getElementById("diet-form");

  if (form) {
    form.addEventListener("submit", handleDietPlanGeneration);
  }

  // Check if BMI was just calculated and auto-populate
  window.addEventListener("bmiCalculated", function (event) {
    const bmiInput = document.getElementById("bmi-input");
    if (bmiInput && !bmiInput.value) {
      bmiInput.value = event.detail.value;
    }
  });
}

async function handleDietPlanGeneration(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const bmi = parseFloat(formData.get("bmi"));
  const goal = formData.get("goal");
  const activity = formData.get("activity");

  // Validation
  if (!validateNumber(document.getElementById("bmi-input"), "BMI", 10, 50)) return;
  if (!validateRequired(document.getElementById("goal-select"), "Health Goal")) return;
  if (!validateRequired(document.getElementById("activity-level"), "Activity Level")) return;

  // Generate and display diet plan
  const dietPlan = generateDietPlan(bmi, goal, activity);
  displayDietPlan(dietPlan);

  // Save to backend (optional)
  try {
    await saveDietPlanToBackend({
      bmi: bmi,
      goal: goal,
      activity: activity,
      plan: dietPlan,
    });
  } catch (error) {
    console.log("Backend save failed, but diet plan generated successfully");
  }
}

function generateDietPlan(bmi, goal, activity) {
  const plan = {
    goal: goal,
    bmi: bmi,
    activity: activity,
    goalDescription: getGoalDescription(goal),
    meals: {
      breakfast: getBreakfastOptions(goal, bmi, activity),
      lunch: getLunchOptions(goal, bmi, activity),
      dinner: getDinnerOptions(goal, bmi, activity),
      snacks: getSnackOptions(goal, bmi, activity),
    },
    tips: getDietTips(goal, bmi, activity),
    calories: getEstimatedCalories(bmi, goal, activity),
  };

  return plan;
}

function getGoalDescription(goal) {
  const descriptions = {
    "weight-loss":
      "A balanced meal plan designed to help you lose weight safely while maintaining energy levels and essential nutrients.",
    "muscle-gain":
      "A protein-rich meal plan focused on supporting muscle growth and recovery while providing sustained energy.",
    "maintain-weight":
      "A well-balanced meal plan to help you maintain your current healthy weight while optimizing nutrition.",
  };
  return descriptions[goal] || descriptions["maintain-weight"];
}

function getBreakfastOptions(goal, bmi, activity) {
  const breakfastPlans = {
    "weight-loss": [
      "Greek yogurt (1 cup) with fresh berries and 1 tbsp almonds",
      "Vegetable omelet (2 eggs) with spinach, tomatoes, and peppers",
      "Oatmeal (1/2 cup dry) with banana slices and cinnamon",
      "Smoothie: protein powder, spinach, banana, and unsweetened almond milk",
      "Whole grain toast (1 slice) with avocado and sliced tomato",
    ],
    "muscle-gain": [
      "Protein pancakes: 3 eggs + 1 banana + oats, topped with berries",
      "Greek yogurt (1.5 cups) with granola, nuts, and honey",
      "Scrambled eggs (3 whole + 1 white) with whole grain toast",
      "Protein smoothie: whey protein, oats, banana, peanut butter, milk",
      "Overnight oats with protein powder, chia seeds, and fruits",
    ],
    "maintain-weight": [
      "Whole grain cereal with milk and fresh fruit",
      "Two eggs with whole grain toast and avocado",
      "Oatmeal with nuts, seeds, and berries",
      "Greek yogurt parfait with granola and fruit",
      "Smoothie bowl with protein powder, fruits, and nuts",
    ],
  };

  return breakfastPlans[goal] || breakfastPlans["maintain-weight"];
}

function getLunchOptions(goal, bmi, activity) {
  const lunchPlans = {
    "weight-loss": [
      "Large mixed salad with grilled chicken, olive oil dressing",
      "Vegetable soup with a small whole grain roll",
      "Grilled fish with steamed vegetables and quinoa (1/2 cup)",
      "Turkey and vegetable wrap in whole grain tortilla",
      "Lentil salad with mixed vegetables and herbs",
    ],
    "muscle-gain": [
      "Grilled chicken breast with sweet potato and broccoli",
      "Tuna sandwich on whole grain bread with side salad",
      "Chicken and quinoa bowl with vegetables",
      "Lean beef stir-fry with brown rice",
      "Salmon with wild rice and asparagus",
    ],
    "maintain-weight": [
      "Mediterranean bowl with chicken, vegetables, and hummus",
      "Grilled fish with mixed vegetables and brown rice",
      "Turkey and avocado sandwich with side salad",
      "Chicken soup with whole grain crackers",
      "Quinoa salad with beans and vegetables",
    ],
  };

  return lunchPlans[goal] || lunchPlans["maintain-weight"];
}

function getDinnerOptions(goal, bmi, activity) {
  const dinnerPlans = {
    "weight-loss": [
      "Grilled salmon with roasted vegetables",
      "Chicken breast with cauliflower rice and green beans",
      "Vegetable stir-fry with tofu and minimal oil",
      "Lean turkey meatballs with zucchini noodles",
      "Baked cod with steamed broccoli and small sweet potato",
    ],
    "muscle-gain": [
      "Grilled steak with quinoa and roasted vegetables",
      "Baked chicken thighs with brown rice and green vegetables",
      "Salmon with sweet potato and asparagus",
      "Turkey meatballs with whole wheat pasta",
      "Lean beef with wild rice and mixed vegetables",
    ],
    "maintain-weight": [
      "Grilled chicken with quinoa and roasted vegetables",
      "Baked fish with brown rice and steamed vegetables",
      "Turkey chili with beans and vegetables",
      "Grilled tofu with stir-fried vegetables and brown rice",
      "Lean pork with sweet potato and green vegetables",
    ],
  };

  return dinnerPlans[goal] || dinnerPlans["maintain-weight"];
}

function getSnackOptions(goal, bmi, activity) {
  const snackPlans = {
    "weight-loss": [
      "Apple slices with 1 tbsp almond butter",
      "Carrot sticks with hummus (2 tbsp)",
      "Greek yogurt (small cup) with berries",
      "Hard-boiled egg with cucumber slices",
      "Small handful of mixed nuts",
    ],
    "muscle-gain": [
      "Protein shake with banana",
      "Greek yogurt with nuts and honey",
      "Trail mix with nuts and dried fruits",
      "Cottage cheese with fruit",
      "Whole grain crackers with cheese",
    ],
    "maintain-weight": [
      "Mixed nuts and dried fruit",
      "Greek yogurt with berries",
      "Apple with peanut butter",
      "Hummus with vegetable sticks",
      "Small smoothie with fruit and yogurt",
    ],
  };

  return snackPlans[goal] || snackPlans["maintain-weight"];
}

function getDietTips(goal, bmi, activity) {
  const baseTips = [
    "Drink at least 8-10 glasses of water daily",
    "Eat slowly and mindfully, paying attention to hunger cues",
    "Include a variety of colorful fruits and vegetables",
    "Limit processed foods and added sugars",
    "Plan your meals in advance to avoid impulsive food choices",
  ];

  const goalSpecificTips = {
    "weight-loss": [
      "Create a moderate calorie deficit of 500-750 calories per day",
      "Focus on high-fiber foods to help you feel full",
      "Eat protein with each meal to maintain muscle mass",
      "Use smaller plates to help with portion control",
      "Track your food intake to stay accountable",
    ],
    "muscle-gain": [
      "Eat in a slight calorie surplus of 300-500 calories per day",
      "Consume 1.6-2.2g of protein per kg of body weight daily",
      "Eat protein within 30 minutes after workouts",
      "Include healthy fats like nuts, avocados, and olive oil",
      "Don't skip meals, especially post-workout",
    ],
    "maintain-weight": [
      "Maintain a balanced calorie intake matching your expenditure",
      "Focus on nutrient-dense whole foods",
      "Practice portion control without restricting food groups",
      "Listen to your body's hunger and fullness signals",
      "Allow occasional treats in moderation",
    ],
  };

  return [...baseTips, ...goalSpecificTips[goal]];
}

function getEstimatedCalories(bmi, goal, activity) {
  // Basic calorie estimation (simplified)
  let baseCalories = 1800; // Average baseline

  // Adjust for BMI
  if (bmi < 18.5) baseCalories += 200;
  else if (bmi > 25) baseCalories += 100;

  // Adjust for activity level
  const activityMultipliers = {
    sedentary: 1.0,
    light: 1.2,
    moderate: 1.4,
    active: 1.6,
  };

  baseCalories *= activityMultipliers[activity] || 1.0;

  // Adjust for goal
  if (goal === "weight-loss") baseCalories -= 500;
  else if (goal === "muscle-gain") baseCalories += 300;

  return Math.round(baseCalories);
}

function displayDietPlan(plan) {
  // Update goal and description
  document.getElementById("plan-goal").textContent = `Goal: ${plan.goal
    .replace("-", " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())}`;
  document.getElementById("plan-description").textContent = plan.goalDescription;

  // Display meals
  displayMeals("breakfast-content", plan.meals.breakfast);
  displayMeals("lunch-content", plan.meals.lunch);
  displayMeals("dinner-content", plan.meals.dinner);
  displayMeals("snacks-content", plan.meals.snacks);

  // Display tips
  displayTips(plan.tips);

  // Show the result section
  const resultSection = document.getElementById("diet-plan-result");
  resultSection.style.display = "block";
  resultSection.scrollIntoView({ behavior: "smooth", block: "start" });

  showNotification("Your personalized diet plan is ready! 🥗", "success");
}

function displayMeals(containerId, meals) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = meals
      .map(
        (meal, index) => `
            <div class="meal-item">
                <strong>Option ${index + 1}:</strong> ${meal}
            </div>
        `
      )
      .join("");
  }
}

function displayTips(tips) {
  const container = document.getElementById("diet-tips-content");
  if (container) {
    container.innerHTML = tips
      .map(
        (tip) => `
            <div class="tip-item">
                💡 ${tip}
            </div>
        `
      )
      .join("");
  }
}

async function saveDietPlanToBackend(planData) {
  try {
    await makeAPIRequest("/diet/generate", {
      method: "POST",
      body: JSON.stringify({
        ...planData,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.warn("Failed to save diet plan to backend:", error);
  }
}
