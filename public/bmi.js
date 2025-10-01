document.addEventListener("DOMContentLoaded", function () {
  initializeBMICalculator();
});

function initializeBMICalculator() {
  const form = document.getElementById("bmi-form");
  const heightUnit = document.getElementById("height-unit");
  const heightInches = document.getElementById("height-inches");

  // Handle height unit change
  if (heightUnit) {
    heightUnit.addEventListener("change", function () {
      if (this.value === "ft") {
        heightInches.style.display = "block";
      } else {
        heightInches.style.display = "none";
      }
    });
  }

  // Handle form submission
  if (form) {
    form.addEventListener("submit", handleBMICalculation);
  }
}

async function handleBMICalculation(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const height = parseFloat(formData.get("height"));
  const weight = parseFloat(formData.get("weight"));
  const heightUnit = formData.get("height-unit");
  const weightUnit = formData.get("weight-unit");
  const inches = heightUnit === "ft" ? parseFloat(formData.get("inches")) || 0 : 0;

  // Validation
  if (!validateNumber(document.getElementById("height"), "Height", 0.1, 300)) return;
  if (!validateNumber(document.getElementById("weight"), "Weight", 0.1, 1000)) return;

  if (heightUnit === "ft") {
    if (height < 1 || height > 8) {
      showNotification("Height must be between 1 and 8 feet", "error");
      return;
    }
    if (inches < 0 || inches > 11) {
      showNotification("Inches must be between 0 and 11", "error");
      return;
    }
  }

  // Convert to metric units for calculation
  let heightInMeters, weightInKg;

  if (heightUnit === "ft") {
    const totalInches = height * 12 + inches;
    heightInMeters = totalInches * 0.0254;
  } else {
    heightInMeters = height / 100;
  }

  if (weightUnit === "lbs") {
    weightInKg = weight * 0.453592;
  } else {
    weightInKg = weight;
  }

  // Calculate BMI
  const bmi = weightInKg / (heightInMeters * heightInMeters);
  const category = getBMICategory(bmi);

  // Display results
  displayBMIResult(bmi, category);

  // Save BMI data
  saveBMIData(formatNumber(bmi, 1), category.name);

  // Send to backend (optional - for data collection)
  try {
    await saveBMIToBackend({
      bmi: formatNumber(bmi, 1),
      category: category.name,
      height: height,
      heightUnit: heightUnit,
      inches: inches,
      weight: weight,
      weightUnit: weightUnit,
    });
  } catch (error) {
    // Don't show error to user as this is optional
    console.log("Backend save failed, but BMI calculation completed successfully");
  }
}

function getBMICategory(bmi) {
  if (bmi < 18.5) {
    return {
      name: "Underweight",
      class: "underweight",
      advice:
        "You may want to consider gaining weight through a healthy diet and exercise. Consult with a healthcare professional for personalized advice.",
      color: "#f56500",
    };
  } else if (bmi < 25) {
    return {
      name: "Normal Weight",
      class: "normal",
      advice: "Great! You have a healthy weight. Maintain it through balanced nutrition and regular physical activity.",
      color: "#38a169",
    };
  } else if (bmi < 30) {
    return {
      name: "Overweight",
      class: "overweight",
      advice:
        "Consider adopting a healthier lifestyle with improved diet and increased physical activity to reach a healthier weight.",
      color: "#dd6b20",
    };
  } else {
    return {
      name: "Obese",
      class: "obese",
      advice:
        "It's important to work with a healthcare professional to develop a safe and effective weight management plan.",
      color: "#e53e3e",
    };
  }
}

function displayBMIResult(bmi, category) {
  const resultDiv = document.getElementById("bmi-result");
  const bmiNumber = document.getElementById("bmi-number");
  const bmiCategory = document.getElementById("bmi-category");
  const bmiAdvice = document.getElementById("bmi-advice");

  if (resultDiv && bmiNumber && bmiCategory && bmiAdvice) {
    // Update values
    bmiNumber.textContent = formatNumber(bmi, 1);
    bmiCategory.textContent = category.name;
    bmiCategory.className = `bmi-category ${category.class}`;
    bmiAdvice.textContent = category.advice;

    // Show result with animation
    resultDiv.style.display = "block";
    resultDiv.scrollIntoView({ behavior: "smooth", block: "center" });

    // Success notification
    showNotification("BMI calculated successfully! 🎉", "success");
  }
}

async function saveBMIToBackend(bmiData) {
  try {
    await makeAPIRequest("/bmi/calculate", {
      method: "POST",
      body: JSON.stringify({
        ...bmiData,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    // Fail silently - the frontend calculation is the primary feature
    console.warn("Failed to save BMI to backend:", error);
  }
}

// Auto-populate form if coming from a direct link or bookmark
function checkUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const height = urlParams.get("height");
  const weight = urlParams.get("weight");
  const heightUnit = urlParams.get("heightUnit");
  const weightUnit = urlParams.get("weightUnit");

  if (height) document.getElementById("height").value = height;
  if (weight) document.getElementById("weight").value = weight;
  if (heightUnit) document.getElementById("height-unit").value = heightUnit;
  if (weightUnit) document.getElementById("weight-unit").value = weightUnit;

  // Trigger height unit change if needed
  if (heightUnit === "ft") {
    document.getElementById("height-inches").style.display = "block";
  }
}
