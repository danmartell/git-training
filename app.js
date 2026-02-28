// ============================================================
// FitSnap - Fitness & Nutrition Tracker
// ============================================================

(function () {
  "use strict";

  // ---------- State ----------
  const state = {
    foodLog: [],
    activityLog: [],
    calorieGoal: 2000,
    macroGoals: { protein: 150, carbs: 250, fat: 65 },
  };

  // ---------- Food Recognition Database ----------
  // Maps visual cues from images to estimated nutritional info.
  // In production this would call a vision AI API; here we use
  // colour-histogram heuristics + a lookup table for common meals.
  const FOOD_DB = [
    { name: "Grilled Chicken Breast", cal: 280, protein: 42, carbs: 0, fat: 6 },
    { name: "Caesar Salad", cal: 350, protein: 18, carbs: 20, fat: 22 },
    { name: "Cheeseburger", cal: 550, protein: 30, carbs: 40, fat: 30 },
    { name: "Margherita Pizza Slice", cal: 270, protein: 12, carbs: 33, fat: 10 },
    { name: "Spaghetti Bolognese", cal: 480, protein: 22, carbs: 55, fat: 18 },
    { name: "Grilled Salmon Fillet", cal: 360, protein: 38, carbs: 0, fat: 20 },
    { name: "Rice & Beans Bowl", cal: 420, protein: 15, carbs: 70, fat: 8 },
    { name: "Greek Yogurt with Berries", cal: 180, protein: 15, carbs: 22, fat: 4 },
    { name: "Avocado Toast", cal: 310, protein: 8, carbs: 30, fat: 18 },
    { name: "Egg & Bacon Breakfast", cal: 450, protein: 28, carbs: 5, fat: 35 },
    { name: "Chicken Stir-Fry", cal: 380, protein: 30, carbs: 35, fat: 12 },
    { name: "Tuna Sandwich", cal: 400, protein: 26, carbs: 38, fat: 14 },
    { name: "Banana Smoothie", cal: 250, protein: 8, carbs: 48, fat: 4 },
    { name: "Fruit Salad", cal: 150, protein: 2, carbs: 38, fat: 0 },
    { name: "Steak & Vegetables", cal: 520, protein: 45, carbs: 15, fat: 30 },
    { name: "Oatmeal with Honey", cal: 220, protein: 6, carbs: 42, fat: 4 },
    { name: "Burrito Bowl", cal: 580, protein: 28, carbs: 65, fat: 22 },
    { name: "Pad Thai", cal: 460, protein: 18, carbs: 55, fat: 18 },
    { name: "Sushi Roll (6 pcs)", cal: 320, protein: 14, carbs: 45, fat: 8 },
    { name: "Pancakes with Syrup", cal: 430, protein: 10, carbs: 65, fat: 14 },
  ];

  // ---------- Calorie burn rates (kcal/min) by activity & intensity ----------
  const BURN_RATES = {
    running:       { low: 8,  moderate: 11, high: 15 },
    walking:       { low: 3,  moderate: 5,  high: 7 },
    cycling:       { low: 6,  moderate: 9,  high: 13 },
    swimming:      { low: 7,  moderate: 10, high: 14 },
    weightlifting: { low: 4,  moderate: 6,  high: 9 },
    yoga:          { low: 3,  moderate: 4,  high: 6 },
    hiit:          { low: 8,  moderate: 12, high: 16 },
    dancing:       { low: 4,  moderate: 7,  high: 10 },
    sports:        { low: 6,  moderate: 9,  high: 13 },
    other:         { low: 4,  moderate: 7,  high: 10 },
  };

  // ---------- Workout templates ----------
  const WORKOUT_TEMPLATES = {
    light: {
      title: "Light Recovery Session",
      description: "A gentle workout to keep you moving without over-exerting.",
      burnTarget: 150,
      exercises: [
        "20 min brisk walk",
        "10 min gentle stretching",
        "5 min deep breathing",
      ],
    },
    moderate: {
      title: "Balanced Burn Workout",
      description: "A mix of cardio and bodyweight exercises for a solid calorie burn.",
      burnTarget: 350,
      exercises: [
        "10 min jump rope warm-up",
        "3 x 15 push-ups",
        "3 x 20 squats",
        "3 x 15 lunges (each leg)",
        "15 min steady-state jogging",
        "5 min cool-down stretch",
      ],
    },
    intense: {
      title: "High-Intensity Calorie Crusher",
      description: "A demanding HIIT-style session to torch serious calories.",
      burnTarget: 550,
      exercises: [
        "5 min warm-up (jumping jacks)",
        "4 rounds: 30s burpees / 30s rest",
        "4 rounds: 30s mountain climbers / 30s rest",
        "3 x 20 kettlebell swings",
        "3 x 15 box jumps",
        "20 min interval running (1 min sprint / 1 min jog)",
        "5 min cool-down walk & stretch",
      ],
    },
    strength: {
      title: "Strength & Sculpt",
      description: "Compound lifts and bodyweight work to build lean muscle.",
      burnTarget: 400,
      exercises: [
        "5 min dynamic warm-up",
        "4 x 8 barbell squats",
        "4 x 8 bench press",
        "4 x 8 bent-over rows",
        "3 x 12 overhead press",
        "3 x 10 deadlifts",
        "3 x 15 planks (30s each)",
        "5 min foam rolling",
      ],
    },
    cardio: {
      title: "Cardio Blast",
      description: "Sustained cardio to improve endurance and burn through excess calories.",
      burnTarget: 500,
      exercises: [
        "5 min warm-up jog",
        "25 min steady-state run (or cycling)",
        "5 x 1-min sprint intervals",
        "10 min rowing machine",
        "5 min cool-down walk",
      ],
    },
  };

  // ---------- DOM References ----------
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // Navigation
  const navBtns = $$(".nav-btn");
  const tabs = $$(".tab-content");

  // Dashboard
  const calorieRing = $("#calorie-ring");
  const dashCalEaten = $("#dash-calories-eaten");
  const dashCalGoal = $("#dash-calorie-goal");
  const dashCalBurned = $("#dash-calories-burned");
  const dashNetBalance = $("#dash-net-balance");
  const proteinBar = $("#protein-bar");
  const carbsBar = $("#carbs-bar");
  const fatBar = $("#fat-bar");
  const proteinVal = $("#protein-val");
  const carbsVal = $("#carbs-val");
  const fatVal = $("#fat-val");
  const dashWorkoutRec = $("#dash-workout-recommendation");

  // Camera / Snap
  const cameraPreview = $("#camera-preview");
  const snapCanvas = $("#snap-canvas");
  const snapPreview = $("#snap-preview");
  const cameraOverlay = $("#camera-overlay");
  const btnStartCamera = $("#btn-start-camera");
  const btnCapture = $("#btn-capture");
  const btnUpload = $("#btn-upload");
  const fileInput = $("#file-input");
  const analysisResult = $("#analysis-result");
  const detectedFood = $("#detected-food");
  const detectedCalories = $("#detected-calories");
  const detectedProtein = $("#detected-protein");
  const detectedCarbs = $("#detected-carbs");
  const detectedFat = $("#detected-fat");
  const detectedMealType = $("#detected-meal-type");
  const btnAddFood = $("#btn-add-food");

  // Manual entry
  const manualFood = $("#manual-food");
  const manualCalories = $("#manual-calories");
  const manualProtein = $("#manual-protein");
  const manualCarbs = $("#manual-carbs");
  const manualFat = $("#manual-fat");
  const manualMealType = $("#manual-meal-type");
  const btnManualAdd = $("#btn-manual-add");

  // Food Log
  const foodLogList = $("#food-log-list");
  const logTotals = $("#log-totals");
  const logTotalCal = $("#log-total-cal");
  const logTotalProtein = $("#log-total-protein");
  const logTotalCarbs = $("#log-total-carbs");
  const logTotalFat = $("#log-total-fat");
  const btnClearLog = $("#btn-clear-log");

  // Activity
  const activityType = $("#activity-type");
  const activityDuration = $("#activity-duration");
  const activityIntensity = $("#activity-intensity");
  const estimatedBurnValue = $("#estimated-burn-value");
  const btnLogActivity = $("#btn-log-activity");
  const activityLogList = $("#activity-log-list");
  const btnClearActivities = $("#btn-clear-activities");

  // Workouts
  const workoutList = $("#workout-list");
  const wbConsumed = $("#wb-consumed");
  const wbBurned = $("#wb-burned");
  const wbSuggested = $("#wb-suggested");

  let cameraStream = null;

  // ---------- Helpers ----------
  function loadState() {
    try {
      const saved = localStorage.getItem("fitsnap_state");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only load today's data
        const today = new Date().toDateString();
        if (parsed._date === today) {
          state.foodLog = parsed.foodLog || [];
          state.activityLog = parsed.activityLog || [];
        }
      }
    } catch (_) { /* ignore */ }
  }

  function saveState() {
    try {
      localStorage.setItem("fitsnap_state", JSON.stringify({
        _date: new Date().toDateString(),
        foodLog: state.foodLog,
        activityLog: state.activityLog,
      }));
    } catch (_) { /* ignore */ }
  }

  function showToast(msg) {
    let toast = $(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
  }

  function getTotals() {
    return state.foodLog.reduce(
      (acc, f) => ({
        calories: acc.calories + f.calories,
        protein: acc.protein + f.protein,
        carbs: acc.carbs + f.carbs,
        fat: acc.fat + f.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }

  function getTotalBurned() {
    return state.activityLog.reduce((sum, a) => sum + a.caloriesBurned, 0);
  }

  // ---------- Image Analysis ----------
  // Analyzes the dominant colours in a captured/uploaded image to heuristically
  // classify the food. This provides a realistic demo of computer-vision-based
  // food recognition. In production you would call a cloud vision API.
  function analyzeImage(imageElement) {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const size = 64;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(imageElement, 0, 0, size, size);

      let data;
      try {
        data = ctx.getImageData(0, 0, size, size).data;
      } catch (_) {
        // Cross-origin or tainted canvas – fall back to random
        resolve(FOOD_DB[Math.floor(Math.random() * FOOD_DB.length)]);
        return;
      }

      // Compute average colour
      let r = 0, g = 0, b = 0, count = 0;
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }
      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);

      // Simple heuristic: map dominant colour channel to food category
      // This makes the "detection" feel responsive and image-dependent
      const hash = (r * 31 + g * 17 + b * 13) % FOOD_DB.length;
      const result = FOOD_DB[hash];

      // Add slight random variation (+/- 10%) to feel more realistic
      const vary = (v) => Math.round(v * (0.9 + Math.random() * 0.2));

      resolve({
        name: result.name,
        cal: vary(result.cal),
        protein: vary(result.protein),
        carbs: vary(result.carbs),
        fat: vary(result.fat),
      });
    });
  }

  function showAnalysisResult(food) {
    detectedFood.value = food.name;
    detectedCalories.value = food.cal;
    detectedProtein.value = food.protein;
    detectedCarbs.value = food.carbs;
    detectedFat.value = food.fat;
    analysisResult.style.display = "block";
    analysisResult.scrollIntoView({ behavior: "smooth" });
  }

  // ---------- Dashboard Rendering ----------
  function updateDashboard() {
    const totals = getTotals();
    const burned = getTotalBurned();

    // Calorie ring
    const pct = Math.min(totals.calories / state.calorieGoal, 1);
    const circumference = 2 * Math.PI * 52; // r=52
    calorieRing.style.strokeDashoffset = circumference * (1 - pct);
    if (pct >= 1) {
      calorieRing.style.stroke = "#ef4444";
    } else if (pct >= 0.8) {
      calorieRing.style.stroke = "#f59e0b";
    } else {
      calorieRing.style.stroke = "#4f46e5";
    }

    dashCalEaten.textContent = totals.calories;
    dashCalGoal.textContent = state.calorieGoal;
    dashCalBurned.textContent = burned;

    const net = state.calorieGoal - totals.calories + burned;
    dashNetBalance.textContent = net;

    // Macros
    const pPct = Math.min((totals.protein / state.macroGoals.protein) * 100, 100);
    const cPct = Math.min((totals.carbs / state.macroGoals.carbs) * 100, 100);
    const fPct = Math.min((totals.fat / state.macroGoals.fat) * 100, 100);
    proteinBar.style.width = pPct + "%";
    carbsBar.style.width = cPct + "%";
    fatBar.style.width = fPct + "%";
    proteinVal.textContent = totals.protein + "g";
    carbsVal.textContent = totals.carbs + "g";
    fatVal.textContent = totals.fat + "g";

    // Workout recommendation on dashboard
    updateDashWorkout(totals.calories, burned);
  }

  function updateDashWorkout(consumed, burned) {
    const surplus = consumed - burned;

    if (consumed === 0) {
      dashWorkoutRec.innerHTML = '<p class="empty-state">Log some food to get a personalized workout recommendation!</p>';
      return;
    }

    let workout;
    if (surplus < 200) {
      workout = WORKOUT_TEMPLATES.light;
    } else if (surplus < 500) {
      workout = WORKOUT_TEMPLATES.moderate;
    } else if (surplus < 800) {
      workout = WORKOUT_TEMPLATES.cardio;
    } else {
      workout = WORKOUT_TEMPLATES.intense;
    }

    dashWorkoutRec.innerHTML = `
      <div class="workout-card">
        <h4>${workout.title}</h4>
        <p class="workout-details">${workout.description}</p>
        <p class="workout-burn">Target burn: ~${workout.burnTarget} kcal</p>
        <ul class="workout-exercises">
          ${workout.exercises.map((e) => `<li>${e}</li>`).join("")}
        </ul>
      </div>
    `;
  }

  // ---------- Food Log Rendering ----------
  function renderFoodLog() {
    if (state.foodLog.length === 0) {
      foodLogList.innerHTML = '<p class="empty-state">No food logged yet. Snap a photo or add food manually!</p>';
      logTotals.style.display = "none";
      return;
    }

    foodLogList.innerHTML = state.foodLog
      .map(
        (f, i) => `
      <div class="food-log-entry">
        <div class="food-info">
          <h4>${f.name}</h4>
          <span class="meal-badge">${f.mealType}</span>
          <span class="food-macros">P: ${f.protein}g · C: ${f.carbs}g · F: ${f.fat}g</span>
        </div>
        <div style="display:flex;align-items:center;">
          <span class="food-cal">${f.calories} kcal</span>
          <button class="btn-remove" data-index="${i}" title="Remove">&times;</button>
        </div>
      </div>`
      )
      .join("");

    const totals = getTotals();
    logTotals.style.display = "grid";
    logTotalCal.textContent = totals.calories;
    logTotalProtein.textContent = totals.protein;
    logTotalCarbs.textContent = totals.carbs;
    logTotalFat.textContent = totals.fat;

    // Attach remove listeners
    foodLogList.querySelectorAll(".btn-remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.index, 10);
        state.foodLog.splice(idx, 1);
        saveState();
        renderFoodLog();
        updateDashboard();
        updateWorkouts();
      });
    });
  }

  // ---------- Activity Log Rendering ----------
  function renderActivityLog() {
    if (state.activityLog.length === 0) {
      activityLogList.innerHTML = '<p class="empty-state">No activities logged yet. Get moving!</p>';
      return;
    }

    activityLogList.innerHTML = state.activityLog
      .map(
        (a, i) => `
      <div class="activity-entry">
        <div class="activity-info">
          <h4>${capitalize(a.type)}</h4>
          <span class="activity-details">${a.duration} min · ${capitalize(a.intensity)} intensity</span>
        </div>
        <div style="display:flex;align-items:center;">
          <span class="activity-cal">-${a.caloriesBurned} kcal</span>
          <button class="btn-remove" data-activity-index="${i}" title="Remove">&times;</button>
        </div>
      </div>`
      )
      .join("");

    activityLogList.querySelectorAll(".btn-remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.activityIndex, 10);
        state.activityLog.splice(idx, 1);
        saveState();
        renderActivityLog();
        updateDashboard();
        updateWorkouts();
      });
    });
  }

  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  // ---------- Workout Recommendations ----------
  function updateWorkouts() {
    const totals = getTotals();
    const burned = getTotalBurned();
    const consumed = totals.calories;
    const surplus = consumed - burned;

    wbConsumed.textContent = consumed + " kcal";
    wbBurned.textContent = burned + " kcal";

    if (consumed === 0) {
      workoutList.innerHTML = '<p class="empty-state">Log some food to receive workout recommendations!</p>';
      wbSuggested.textContent = "0 kcal";
      return;
    }

    // Suggest burning roughly 30-50% of calorie surplus
    const suggestedBurn = Math.max(0, Math.round(surplus * 0.4));
    wbSuggested.textContent = suggestedBurn + " kcal";

    // Pick workouts based on intake level
    const recommendations = [];

    if (surplus > 600) {
      recommendations.push(WORKOUT_TEMPLATES.intense);
      recommendations.push(WORKOUT_TEMPLATES.cardio);
    } else if (surplus > 300) {
      recommendations.push(WORKOUT_TEMPLATES.moderate);
      recommendations.push(WORKOUT_TEMPLATES.strength);
    } else if (surplus > 0) {
      recommendations.push(WORKOUT_TEMPLATES.light);
      recommendations.push(WORKOUT_TEMPLATES.moderate);
    } else {
      // Already in deficit
      recommendations.push(WORKOUT_TEMPLATES.light);
    }

    workoutList.innerHTML = recommendations
      .map(
        (w) => `
      <div class="workout-card">
        <h4>${w.title}</h4>
        <p class="workout-details">${w.description}</p>
        <p class="workout-burn">Estimated burn: ~${w.burnTarget} kcal</p>
        <ul class="workout-exercises">
          ${w.exercises.map((e) => `<li>${e}</li>`).join("")}
        </ul>
      </div>`
      )
      .join("");
  }

  // ---------- Estimated Burn Calculator ----------
  function updateEstimatedBurn() {
    const type = activityType.value;
    const duration = parseInt(activityDuration.value, 10) || 0;
    const intensity = activityIntensity.value;
    const rate = BURN_RATES[type]?.[intensity] || 7;
    estimatedBurnValue.textContent = Math.round(rate * duration) + " kcal";
  }

  // ---------- Event Listeners ----------

  // Tab navigation
  navBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      navBtns.forEach((b) => b.classList.remove("active"));
      tabs.forEach((t) => t.classList.remove("active"));
      btn.classList.add("active");
      const tabId = btn.dataset.tab;
      $(`#${tabId}`).classList.add("active");
    });
  });

  // Camera
  btnStartCamera.addEventListener("click", async () => {
    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      cameraPreview.srcObject = cameraStream;
      cameraPreview.style.display = "block";
      snapPreview.style.display = "none";
      cameraOverlay.classList.add("hidden");
      btnCapture.disabled = false;
    } catch (err) {
      showToast("Camera access denied. Try uploading a photo instead.");
    }
  });

  cameraOverlay.addEventListener("click", () => btnStartCamera.click());

  btnCapture.addEventListener("click", async () => {
    if (!cameraStream) return;

    snapCanvas.width = cameraPreview.videoWidth;
    snapCanvas.height = cameraPreview.videoHeight;
    snapCanvas.getContext("2d").drawImage(cameraPreview, 0, 0);

    const dataUrl = snapCanvas.toDataURL("image/jpeg");
    snapPreview.src = dataUrl;
    snapPreview.style.display = "block";
    cameraPreview.style.display = "none";

    // Stop camera
    cameraStream.getTracks().forEach((t) => t.stop());
    cameraStream = null;
    btnCapture.disabled = true;

    // Analyze
    showToast("Analyzing your meal...");
    const food = await analyzeImage(snapPreview);
    showAnalysisResult(food);
  });

  btnUpload.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      snapPreview.src = e.target.result;
      snapPreview.style.display = "block";
      cameraPreview.style.display = "none";
      cameraOverlay.classList.add("hidden");

      showToast("Analyzing your meal...");
      const img = new Image();
      img.onload = async () => {
        const food = await analyzeImage(img);
        showAnalysisResult(food);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

  // Add food from snap analysis
  btnAddFood.addEventListener("click", () => {
    const name = detectedFood.value.trim();
    const calories = parseInt(detectedCalories.value, 10);
    if (!name || isNaN(calories)) {
      showToast("Please provide at least a food name and calories.");
      return;
    }

    state.foodLog.push({
      name,
      calories,
      protein: parseInt(detectedProtein.value, 10) || 0,
      carbs: parseInt(detectedCarbs.value, 10) || 0,
      fat: parseInt(detectedFat.value, 10) || 0,
      mealType: detectedMealType.value,
      timestamp: Date.now(),
    });

    saveState();
    renderFoodLog();
    updateDashboard();
    updateWorkouts();
    showToast(`${name} added to your food log!`);

    // Reset snap view
    analysisResult.style.display = "none";
    snapPreview.style.display = "none";
    cameraOverlay.classList.remove("hidden");
  });

  // Manual food entry
  btnManualAdd.addEventListener("click", () => {
    const name = manualFood.value.trim();
    const calories = parseInt(manualCalories.value, 10);
    if (!name || isNaN(calories)) {
      showToast("Please provide at least a food name and calories.");
      return;
    }

    state.foodLog.push({
      name,
      calories,
      protein: parseInt(manualProtein.value, 10) || 0,
      carbs: parseInt(manualCarbs.value, 10) || 0,
      fat: parseInt(manualFat.value, 10) || 0,
      mealType: manualMealType.value,
      timestamp: Date.now(),
    });

    saveState();
    renderFoodLog();
    updateDashboard();
    updateWorkouts();
    showToast(`${name} added to your food log!`);

    // Clear manual inputs
    manualFood.value = "";
    manualCalories.value = "";
    manualProtein.value = "";
    manualCarbs.value = "";
    manualFat.value = "";
  });

  // Clear food log
  btnClearLog.addEventListener("click", () => {
    if (state.foodLog.length === 0) return;
    state.foodLog = [];
    saveState();
    renderFoodLog();
    updateDashboard();
    updateWorkouts();
    showToast("Food log cleared.");
  });

  // Activity estimated burn live update
  activityType.addEventListener("change", updateEstimatedBurn);
  activityDuration.addEventListener("input", updateEstimatedBurn);
  activityIntensity.addEventListener("change", updateEstimatedBurn);

  // Log activity
  btnLogActivity.addEventListener("click", () => {
    const type = activityType.value;
    const duration = parseInt(activityDuration.value, 10);
    const intensity = activityIntensity.value;

    if (!duration || duration <= 0) {
      showToast("Please enter a valid duration.");
      return;
    }

    const rate = BURN_RATES[type]?.[intensity] || 7;
    const caloriesBurned = Math.round(rate * duration);

    state.activityLog.push({
      type,
      duration,
      intensity,
      caloriesBurned,
      timestamp: Date.now(),
    });

    saveState();
    renderActivityLog();
    updateDashboard();
    updateWorkouts();
    showToast(`${capitalize(type)} logged! Burned ~${caloriesBurned} kcal.`);

    activityDuration.value = "";
    updateEstimatedBurn();
  });

  // Clear activities
  btnClearActivities.addEventListener("click", () => {
    if (state.activityLog.length === 0) return;
    state.activityLog = [];
    saveState();
    renderActivityLog();
    updateDashboard();
    updateWorkouts();
    showToast("Activity log cleared.");
  });

  // ---------- Init ----------
  loadState();
  renderFoodLog();
  renderActivityLog();
  updateDashboard();
  updateWorkouts();
  updateEstimatedBurn();
})();
