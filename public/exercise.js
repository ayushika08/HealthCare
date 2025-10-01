document.addEventListener("DOMContentLoaded", function () {
  initializeExercisePlan();
});

function initializeExercisePlan() {
  const form = document.getElementById("exercise-form");

  if (form) {
    form.addEventListener("submit", handleExercisePlanGeneration);
  }
}

async function handleExercisePlanGeneration(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const goal = formData.get("goal");
  const level = formData.get("level");
  const time = formData.get("time");

  // Validation
  if (!validateRequired(document.getElementById("fitness-goal"), "Fitness Goal")) return;
  if (!validateRequired(document.getElementById("fitness-level"), "Fitness Level")) return;
  if (!validateRequired(document.getElementById("time-availability"), "Time Availability")) return;

  // Generate and display exercise plan
  const exercisePlan = generateExercisePlan(goal, level, time);
  displayExercisePlan(exercisePlan);

  // Save to backend (optional)
  try {
    await saveExercisePlanToBackend({
      goal: goal,
      level: level,
      time: time,
      plan: exercisePlan,
    });
  } catch (error) {
    console.log("Backend save failed, but exercise plan generated successfully");
  }
}

function generateExercisePlan(goal, level, time) {
  const plan = {
    goal: goal,
    level: level,
    time: time,
    title: getExerciseTitle(goal),
    frequency: getFrequency(goal, level),
    duration: time,
    focus: getFocus(goal),
    schedule: getWeeklySchedule(goal, level, time),
    exercises: getExerciseList(goal, level, time),
    tips: getExerciseTips(goal, level),
  };

  return plan;
}

function getExerciseTitle(goal) {
  const titles = {
    "fat-loss": "Fat Loss Training Program",
    "build-strength": "Strength Building Program",
    "improve-endurance": "Endurance Improvement Program",
  };
  return titles[goal] || "Fitness Training Program";
}

function getFrequency(goal, level) {
  const frequencies = {
    "fat-loss": {
      beginner: "3-4 times per week",
      intermediate: "4-5 times per week",
      advanced: "5-6 times per week",
    },
    "build-strength": {
      beginner: "3 times per week",
      intermediate: "4 times per week",
      advanced: "5-6 times per week",
    },
    "improve-endurance": {
      beginner: "3-4 times per week",
      intermediate: "4-5 times per week",
      advanced: "5-7 times per week",
    },
  };
  return frequencies[goal][level] || "3-4 times per week";
}

function getFocus(goal) {
  const focuses = {
    "fat-loss": "High-intensity cardio with strength training",
    "build-strength": "Progressive resistance training with compound movements",
    "improve-endurance": "Cardiovascular training with progressive intensity",
  };
  return focuses[goal] || "Balanced fitness training";
}

function getWeeklySchedule(goal, level, time) {
  const schedules = {
    "fat-loss": {
      beginner: [
        { day: "Monday", workout: "Full Body Strength + Cardio", type: "workout" },
        { day: "Tuesday", workout: "Rest or Light Walk", type: "rest" },
        { day: "Wednesday", workout: "Cardio Focus Day", type: "workout" },
        { day: "Thursday", workout: "Rest", type: "rest" },
        { day: "Friday", workout: "Full Body Strength + Cardio", type: "workout" },
        { day: "Saturday", workout: "Active Recovery (yoga/walking)", type: "active-rest" },
        { day: "Sunday", workout: "Complete Rest", type: "rest" },
      ],
      intermediate: [
        { day: "Monday", workout: "Upper Body Strength + HIIT", type: "workout" },
        { day: "Tuesday", workout: "Cardio (moderate intensity)", type: "workout" },
        { day: "Wednesday", workout: "Lower Body Strength + Core", type: "workout" },
        { day: "Thursday", workout: "Active Recovery", type: "active-rest" },
        { day: "Friday", workout: "Full Body Circuit + Cardio", type: "workout" },
        { day: "Saturday", workout: "Long Cardio Session", type: "workout" },
        { day: "Sunday", workout: "Rest or Gentle Yoga", type: "rest" },
      ],
    },
    "build-strength": {
      beginner: [
        { day: "Monday", workout: "Full Body Strength", type: "workout" },
        { day: "Tuesday", workout: "Rest", type: "rest" },
        { day: "Wednesday", workout: "Full Body Strength", type: "workout" },
        { day: "Thursday", workout: "Rest", type: "rest" },
        { day: "Friday", workout: "Full Body Strength", type: "workout" },
        { day: "Saturday", workout: "Light Activity", type: "active-rest" },
        { day: "Sunday", workout: "Rest", type: "rest" },
      ],
    },
    "improve-endurance": {
      beginner: [
        { day: "Monday", workout: "Easy Cardio (20-30 min)", type: "workout" },
        { day: "Tuesday", workout: "Rest or Cross Training", type: "rest" },
        { day: "Wednesday", workout: "Moderate Cardio (25-35 min)", type: "workout" },
        { day: "Thursday", workout: "Rest", type: "rest" },
        { day: "Friday", workout: "Easy Cardio (20-30 min)", type: "workout" },
        { day: "Saturday", workout: "Longer Easy Session", type: "workout" },
        { day: "Sunday", workout: "Complete Rest", type: "rest" },
      ],
    },
  };

  return schedules[goal]?.[level] || schedules["fat-loss"]["beginner"];
}

function getExerciseList(goal, level, time) {
  const exercises = {
    "fat-loss": {
      "Strength Exercises": [
        { name: "Squats", sets: "3", reps: "12-15", rest: "30-45 sec" },
        { name: "Push-ups", sets: "3", reps: "8-12", rest: "30-45 sec" },
        { name: "Lunges", sets: "3", reps: "10 each leg", rest: "30-45 sec" },
        { name: "Planks", sets: "3", reps: "30-45 sec", rest: "30 sec" },
        { name: "Mountain Climbers", sets: "3", reps: "15 each leg", rest: "30 sec" },
      ],
      "Cardio Exercises": [
        { name: "Jump Rope", sets: "3", reps: "2-3 min", rest: "1 min" },
        { name: "Burpees", sets: "3", reps: "8-10", rest: "45 sec" },
        { name: "High Knees", sets: "3", reps: "30 sec", rest: "30 sec" },
        { name: "Jumping Jacks", sets: "3", reps: "45 sec", rest: "15 sec" },
      ],
    },
    "build-strength": {
      "Compound Movements": [
        { name: "Deadlifts", sets: "4", reps: "6-8", rest: "2-3 min" },
        { name: "Squats", sets: "4", reps: "6-8", rest: "2-3 min" },
        { name: "Bench Press", sets: "4", reps: "6-8", rest: "2-3 min" },
        { name: "Rows", sets: "4", reps: "6-8", rest: "2-3 min" },
        { name: "Overhead Press", sets: "3", reps: "8-10", rest: "2 min" },
      ],
      "Accessory Exercises": [
        { name: "Bicep Curls", sets: "3", reps: "10-12", rest: "90 sec" },
        { name: "Tricep Extensions", sets: "3", reps: "10-12", rest: "90 sec" },
        { name: "Lateral Raises", sets: "3", reps: "12-15", rest: "60 sec" },
        { name: "Calf Raises", sets: "3", reps: "15-20", rest: "60 sec" },
      ],
    },
    "improve-endurance": {
      "Cardio Base Building": [
        { name: "Brisk Walking", sets: "1", reps: "20-40 min", rest: "N/A" },
        { name: "Light Jogging", sets: "1", reps: "15-30 min", rest: "N/A" },
        { name: "Cycling", sets: "1", reps: "20-45 min", rest: "N/A" },
        { name: "Swimming", sets: "1", reps: "15-30 min", rest: "N/A" },
      ],
      "Interval Training": [
        { name: "Run/Walk Intervals", sets: "6-10", reps: "1 min run / 1 min walk", rest: "Built in" },
        { name: "Bike Intervals", sets: "8-12", reps: "30 sec hard / 90 sec easy", rest: "Built in" },
        { name: "Stair Climbing", sets: "5-8", reps: "30 sec up / 30 sec recovery", rest: "Built in" },
      ],
    },
  };

  return exercises[goal] || exercises["fat-loss"];
}

function getExerciseTips(goal, level) {
  const baseTips = [
    "Always warm up for 5-10 minutes before exercising",
    "Cool down and stretch after each workout",
    "Stay hydrated throughout your workout",
    "Listen to your body and rest when needed",
    "Progress gradually - increase intensity slowly over time",
  ];

  const goalSpecificTips = {
    "fat-loss": [
      "Combine strength training with cardio for best fat loss results",
      "Keep rest periods short to maintain elevated heart rate",
      "Focus on compound exercises that work multiple muscle groups",
      "Consider adding HIIT sessions 2-3 times per week",
      "Track your workouts and gradually increase intensity",
    ],
    "build-strength": [
      "Focus on progressive overload - gradually increase weight or reps",
      "Compound exercises should be the foundation of your program",
      "Allow adequate rest between sets for maximum strength gains",
      "Get enough protein and sleep for muscle recovery",
      "Track your lifts and aim for consistent improvement",
    ],
    "improve-endurance": [
      "Build your base with consistent, moderate-intensity cardio",
      "Follow the 10% rule - increase weekly volume by no more than 10%",
      "Include one longer session each week to build endurance",
      "Add interval training once you have a good aerobic base",
      "Don't ignore rest days - they're crucial for adaptation",
    ],
  };

  return [...baseTips, ...goalSpecificTips[goal]];
}

function displayExercisePlan(plan) {
  // Update plan details
  document.getElementById("plan-title").textContent = plan.title;
  document.getElementById("plan-frequency").textContent = plan.frequency;
  document.getElementById("plan-duration").textContent = plan.duration + " per session";
  document.getElementById("plan-focus").textContent = plan.focus;

  // Display schedule
  displaySchedule(plan.schedule);

  // Display exercises
  displayExercises(plan.exercises);

  // Display tips
  displayExerciseTips(plan.tips);

  // Show the result section
  const resultSection = document.getElementById("exercise-plan-result");
  resultSection.style.display = "block";
  resultSection.scrollIntoView({ behavior: "smooth", block: "start" });

  showNotification("Your personalized exercise plan is ready! 💪", "success");
}

function displaySchedule(schedule) {
  const container = document.getElementById("schedule-content");
  if (container) {
    container.innerHTML = schedule
      .map(
        (day) => `
            <div class="schedule-day ${day.type === "rest" ? "rest" : ""}">
                <h4>${day.day}</h4>
                <p>${day.workout}</p>
            </div>
        `
      )
      .join("");
  }
}

function displayExercises(exercises) {
  const container = document.getElementById("exercises-list");
  if (container) {
    container.innerHTML = Object.entries(exercises)
      .map(
        ([category, exerciseList]) => `
            <div class="exercise-group">
                <h4>${category}</h4>
                ${exerciseList
                  .map(
                    (exercise) => `
                    <div class="exercise-item">
                        <div>
                            <strong>${exercise.name}</strong>
                            <div class="exercise-details">${exercise.sets} sets × ${exercise.reps}</div>
                        </div>
                        <div class="exercise-details">Rest: ${exercise.rest}</div>
                    </div>
                `
                  )
                  .join("")}
            </div>
        `
      )
      .join("");
  }
}

function displayExerciseTips(tips) {
  const container = document.getElementById("exercise-tips-content");
  if (container) {
    container.innerHTML = tips
      .map(
        (tip) => `
            <div class="tip-item">
                🏋️‍♂️ ${tip}
            </div>
        `
      )
      .join("");
  }
}

async function saveExercisePlanToBackend(planData) {
  try {
    await makeAPIRequest("/exercise/generate", {
      method: "POST",
      body: JSON.stringify({
        ...planData,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.warn("Failed to save exercise plan to backend:", error);
  }
}
