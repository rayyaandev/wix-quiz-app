// Questions are loaded from constant.js

// --- Quiz State ---
let currentStep = 43; // 0 = intro, then questions in order
let answers = {};
let quizId = null; // Unique identifier for this quiz session
let currentLanguage = "en"; // Default language

// --- Language Functions ---
function changeLanguage(lang) {
  currentLanguage = lang;
  renderQuizStep();
  updateLanguageSelector();
}

function updateLanguageSelector() {
  const langButtons = document.querySelectorAll(".lang-btn");
  langButtons.forEach((btn) => {
    if (btn.dataset.lang === currentLanguage) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

function getText(key) {
  return i18n[currentLanguage]?.[key] || i18n.en[key] || key;
}

// --- Header Render Function ---
function renderHeader() {
  const header = document.getElementById("quiz-header");
  if (!header) return;

  header.innerHTML = `
    <nav style="background:rgba(0,0,0,0.8);backdrop-filter:blur(10px);border-bottom:2px solid #f1b94f;padding:10px;position:sticky;top:0;z-index:1000;margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;align-items:center;max-width:1200px;margin:0 auto;padding:0 20px;">
        <!-- Logo/Brand -->
        <div style="display:flex;align-items:center;gap:15px;">
          <div style="font-size:1.8em;">🌍</div>
          <div style="font-size:1.4em;font-weight:bold;color:#f1b94f;">
            Travel Archetype Quiz
          </div>
        </div>
        
        <!-- Right Side: Language Selector -->
        <div style="display:flex;align-items:center;gap:20px;">
          <!-- Language Selector -->
          <div style="display:flex;gap:4px;background:rgba(255,255,255,0.05);border-radius:8px;padding:4px;">
            <button class="lang-btn" data-lang="en" onclick="changeLanguage('en')" style="padding:6px 12px;border-radius:6px;border:none;background:transparent;color:#f1b94f;cursor:pointer;font-weight:bold;font-size:0.9em;transition:all 0.2s ease;min-width:40px;">EN</button>
            <button class="lang-btn" data-lang="es" onclick="changeLanguage('es')" style="padding:6px 12px;border-radius:6px;border:none;background:transparent;color:#f1b94f;cursor:pointer;font-weight:bold;font-size:0.9em;transition:all 0.2s ease;min-width:40px;">ES</button>
            <button class="lang-btn" data-lang="fr" onclick="changeLanguage('fr')" style="padding:6px 12px;border-radius:6px;border:none;background:transparent;color:#f1b94f;cursor:pointer;font-weight:bold;font-size:0.9em;transition:all 0.2s ease;min-width:40px;">FR</button>
          </div>
        </div>
      </div>
    </nav>
  `;

  updateLanguageSelector();
}

// --- Save & Resume Functions ---
function generateQuizId() {
  return "quiz_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
}

function saveQuizProgress(isAutoSave = false) {
  if (!quizId) {
    quizId = generateQuizId();
  }

  const quizData = {
    id: quizId,
    currentStep: currentStep,
    answers: answers,
    timestamp: Date.now(),
    totalQuestions: questions.length,
  };

  localStorage.setItem("savedQuiz", JSON.stringify(quizData));

  // No notifications - completely silent
}

function loadQuizProgress() {
  const saved = localStorage.getItem("savedQuiz");
  if (saved) {
    try {
      const quizData = JSON.parse(saved);
      const timeDiff = Date.now() - quizData.timestamp;
      const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

      // Only load if saved within last 30 days
      if (daysDiff <= 30) {
        return quizData;
      } else {
        // Clear expired save
        localStorage.removeItem("savedQuiz");
      }
    } catch (e) {
      console.error("Error loading saved quiz:", e);
      localStorage.removeItem("savedQuiz");
    }
  }
  return null;
}

function resumeQuiz() {
  const savedData = loadQuizProgress();
  if (savedData) {
    currentStep = savedData.currentStep;
    answers = savedData.answers;
    quizId = savedData.id;
    renderQuizStep();
  }
}

function clearSavedProgress() {
  localStorage.removeItem("savedQuiz");
  quizId = null;
}

// // --- Helper: Render Progress Bar ---
// function renderProgress(step, total) {
//   // Don't show for intro or section covers, only on questions
//   if (questions[step].type === "intro") return "";
//   const percent = Math.round((step / (total - 1)) * 100);
//   return `
//       <div class="quiz-progress">
//         <div class="quiz-progress-bar" style="width:${percent}%;"></div>
//         <div class="quiz-progress-label" style="text-align:center;margin-top:20px;opacity:1;">
//           ${percent}% complete
//         </div>
//       </div>
//     `;
// }

function renderProgress(step, total) {
  // Don't show for intro or section covers, only on questions
  if (questions[step].type === "intro") return "";

  const currentStep = step;
  const totalSteps = total - 1; // Excluding intro
  const percent = Math.round((currentStep / totalSteps) * 100);
  const stepsCompleted = currentStep;
  const stepsRemaining = totalSteps - currentStep;

  return `
    <div class="quiz-progress-container">
      <div class="quiz-progress-header">
        <div class="quiz-progress-stats">
          <span class="progress-step-counter">Question ${currentStep} of ${totalSteps}</span>
          <span class="progress-percentage">${percent}%</span>
        </div>
      </div>
      
      <div class="quiz-progress" role="progressbar" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100" aria-label="Quiz progress">
        <div class="quiz-progress-track">
          <div class="quiz-progress-bar" style="width: ${percent}%;">
            <div class="quiz-progress-glow"></div>
          </div>
        </div>
        
        <div class="quiz-progress-steps">
          ${Array.from({ length: totalSteps }, (_, i) => {
            const stepNumber = i + 1;
            const isCompleted = stepNumber <= currentStep;
            const isCurrent = stepNumber === currentStep;

            return `
              <div class="progress-step ${isCompleted ? "completed" : ""} ${
              isCurrent ? "current" : ""
            }">
              </div>
            `;
          }).join("")}
        </div>
      </div>
    </div>
  `;
}

// --- Main Render Function ---
function renderQuizStep() {
  const root = document.getElementById("quiz-root");
  const step = questions[currentStep];
  let html = "";

  // Progress Bar
  html += renderProgress(currentStep, questions.length);

  // Back button (not on intro)
  if (currentStep > 0) {
    html += `<button class="quiz-back-btn" onclick="goBack()"><span class="arrow">&larr;</span>${getText(
      "back"
    )}</button>`;
  }

  // Section cover screens (if type is intro)
  if (step.type === "intro") {
    const savedData = loadQuizProgress();
    const resumeButton = savedData
      ? `
      <div style="margin-top:20px;text-align:center;">
        <button onclick="resumeQuiz()" style="background:rgba(255,255,255,0.1);color:#f1b94f;border:2px solid #f1b94f;padding:12px 24px;border-radius:8px;font-weight:bold;cursor:pointer;margin-right:10px;">${getText(
          "resumeQuiz"
        )}</button>
        <button onclick="clearSavedProgress()" style="background:transparent;color:#ccc;border:2px solid #ccc;padding:10px 20px;border-radius:8px;cursor:pointer;">${getText(
          "clearSaved"
        )}</button>
      </div>
    `
      : "";

    html += `
        <div class="quiz-card" style="text-align:left;">
          <h1 class="quiz-label">${step.title}</h1>
          <div class="quiz-helper" style="margin-bottom:32px;">${
            step.intro
          }</div>
          <button class="quiz-begin-btn" onclick="goNext()">${getText(
            "startQuiz"
          )} <span class="arrow">&rarr;</span></button>
          ${resumeButton}
        </div>
      `;
    root.innerHTML = html;
    return;
  }

  if (step.type === "outro") {
    html += `
    <div class="quiz-card" style="text-align:left;">
      <h1 class="quiz-label">${step.title}</h1>
      <div class="quiz-helper" style="margin-bottom:32px;">${step.intro}</div>
      <button class="quiz-begin-btn" onclick="goNext()">${step.button}</button>
    </div>
  `;
    root.innerHTML = html;
    return;
  }

  // Question card
  html += `<div class="quiz-card">`;

  // Title/Label
  if (step.label) {
    html += `<div class="quiz-label">${step.label}${
      step.required ? ' <span style="color:#fff;font-size:1.1em">*</span>' : ""
    }</div>`;
  }

  // Helper/Description
  if (step.helper) {
    html += `<div class="quiz-helper">${step.helper}</div>`;
  }

  // Input type rendering
  html += `<div class="quiz-options">`;
  if (step.type === "single") {
    step.options.forEach((opt, i) => {
      const selected = answers[currentStep] === i ? "selected" : "";
      html += `<button class="quiz-option-btn ${selected}" onclick="selectSingle(${i})">
          <span class="option-badge">${opt.badge}</span> ${opt.text}
        </button>`;
    });
  }
  if (step.type === "scale") {
    html += `<div class="quiz-scale-container">`;
    for (let i = step.min; i <= step.max; i++) {
      const selected = answers[currentStep] === i ? "selected" : "";
      html += `<button class="quiz-scale-btn ${selected}" onclick="selectScale(${i})">${i}</button>`;
    }
    html += `</div>
      <div class="quiz-scale-labels">
        <span>${step.leftLabel}</span>
        ${step.midLabel ? `<span>${step.midLabel}</span>` : ""}
        <span>${step.rightLabel}</span>
      </div>`;
  }
  if (step.type === "multiselect") {
    step.options.forEach((opt, i) => {
      const checked = (answers[currentStep] || []).includes(i);
      html += `<label style="display:flex;align-items:center;gap:10px;font-size:1.08em;margin-bottom:8px;">
          <input type="checkbox" onchange="toggleMulti(${i})" ${
        checked ? "checked" : ""
      } style="accent-color:#f1b94f;width:19px;height:19px;">
          ${opt}
        </label>`;
    });
  }
  if (step.type === "slider-multiselect") {
    step.options.forEach((opt, i) => {
      // Ensure we always have a valid value, defaulting to min if not set
      if (!answers[currentStep]) answers[currentStep] = {};
      if (!answers[currentStep][i]) answers[currentStep][i] = opt.min || 1;

      const currentValue = answers[currentStep][i];
      const isDollar = opt.min >= 500; // Check if this is a dollar slider
      const displayValue = isDollar
        ? `$${currentValue.toLocaleString()}`
        : currentValue;

      html += `<div style="margin-bottom:30px;padding:20px;background:rgba(255,255,255,0.05);border-radius:12px;border:1px solid rgba(255,255,255,0.1);">
          <div style="display:flex;justify-content:space-between;margin-bottom:15px;align-items:center;">
            <span style="font-size:1.1em;font-weight:500;">${opt.text}</span>
            <span style="font-weight:bold;color:#f1b94f;font-size:1.2em;background:rgba(241,185,79,0.1);padding:8px 12px;border-radius:8px;min-width:80px;text-align:center;">${displayValue}</span>
          </div>
          
          <div style="position:relative;margin:20px 0;">
            <input type="range" 
              min="${opt.min || 1}" 
              max="${opt.max || 10}" 
              value="${currentValue}"
              oninput="updateSlider(${i}, this.value)"
              onchange="updateSlider(${i}, this.value)"
              style="
                width:100%;
                height:12px;
                border-radius:6px;
                background:linear-gradient(to right, #f1b94f 0%, #f1b94f ${
                  ((currentValue - opt.min) / (opt.max - opt.min)) * 100
                }%, #444 0%);
                outline:none;
                cursor:grab;
                -webkit-appearance:none;
                appearance:none;
                border:none;
                box-shadow:inset 0 2px 4px rgba(0,0,0,0.3);
                touch-action:pan-x;
              "
              onmousedown="this.style.cursor='grabbing'; this.style.background='linear-gradient(to right, #f1b94f 0%, #f1b94f ' + ((this.value - ${
                opt.min
              }) / (${opt.max} - ${opt.min})) * 100 + '%, #444 0%)'"
              onmouseup="this.style.cursor='grab'"
              onmouseleave="this.style.cursor='grab'">
          </div>
          
          <div style="display:flex;justify-content:space-between;font-size:0.9em;opacity:0.8;margin-top:8px;">
            <span style="background:rgba(255,255,255,0.1);padding:4px 8px;border-radius:4px;">${
              opt.leftLabel || opt.min || 1
            }</span>
            <span style="background:rgba(255,255,255,0.1);padding:4px 8px;border-radius:4px;">${
              opt.rightLabel || opt.max || 10
            }</span>
          </div>
        </div>`;
    });
  }
  if (step.type === "select") {
    html += `<select class="quiz-input" onchange="selectDropdown(this)">
        <option value="">${getText("select")}</option>
        ${step.options
          .map(
            (opt, i) =>
              `<option value="${i}" ${
                answers[currentStep] === i ? "selected" : ""
              }>${opt}</option>`
          )
          .join("")}
      </select>`;
  }
  if (step.type === "text") {
    const inputId = `input-${currentStep}`;
    html += `<input class="quiz-input" id="${inputId}" type="text" value="${
      answers[currentStep] || ""
    }" 
        oninput="typeText(this)" placeholder="${
          step.placeholder || getText("typeAnswer")
        }">`;
  }
  if (step.type === "tag-multiselect") {
    // Tag input at top
    html += `<div class="quiz-tag-multiselect" id="tag-multiselect">`;
    const selected = answers[currentStep] || [];
    selected.forEach((idx) => {
      const tag = step.options[idx];
      html += `<span class="quiz-tag ${tag.color}">${tag.text}
          <button class="remove-x" onclick="removeTag(${idx}, event)">&times;</button>
        </span>`;
    });
    html += `</div>`;
    // All options below, disabled if already chosen
    step.options.forEach((opt, i) => {
      const already = selected.includes(i);
      html += `<button class="quiz-tag ${opt.color}" style="margin-bottom:8px;${
        already ? "opacity:0.4;pointer-events:none;" : ""
      }" onclick="addTag(${i})">${opt.text}</button>`;
    });
  }
  html += `</div>`; // quiz-options

  // Next button
  let nextDisabled = false;
  if (step.required) {
    if (step.type === "single" && answers[currentStep] == null)
      nextDisabled = true;
    if (step.type === "scale" && answers[currentStep] == null)
      nextDisabled = true;
    if (
      step.type === "multiselect" &&
      (!answers[currentStep] || answers[currentStep].length === 0)
    )
      nextDisabled = true;
    if (step.type === "select" && answers[currentStep] == null)
      nextDisabled = true;
    if (
      step.type === "text" &&
      (!answers[currentStep] || !answers[currentStep].trim())
    )
      nextDisabled = true;
    if (
      step.type === "tag-multiselect" &&
      (!answers[currentStep] || answers[currentStep].length === 0)
    )
      nextDisabled = true;
    if (
      step.type === "slider-multiselect" &&
      (!answers[currentStep] || Object.keys(answers[currentStep]).length === 0)
    )
      nextDisabled = true;
  }

  html += `<button class="quiz-next-btn" onclick="goNext()" ${
    nextDisabled ? "disabled" : ""
  }>${getText("next")} <span class="arrow">&rarr;</span></button>`;

  html += `</div>`; // quiz-card

  root.innerHTML = html;
}

// --- Selection Functions ---
function selectSingle(idx) {
  answers[currentStep] = idx;
  renderQuizStep();
}
function selectScale(val) {
  answers[currentStep] = val;
  renderQuizStep();
}
function toggleMulti(idx) {
  if (!answers[currentStep]) answers[currentStep] = [];
  const arr = answers[currentStep];
  if (arr.includes(idx)) {
    answers[currentStep] = arr.filter((i) => i !== idx);
  } else {
    arr.push(idx);
  }
  renderQuizStep();
}
function updateSlider(idx, value) {
  if (!answers[currentStep]) answers[currentStep] = {};
  answers[currentStep][idx] = parseInt(value);

  // Update the visual feedback immediately
  const slider = event.target;
  const opt = questions[currentStep].options[idx];
  const percentage = ((value - opt.min) / (opt.max - opt.min)) * 100;

  // Update the gradient background in real-time
  slider.style.background = `linear-gradient(to right, #f1b94f 0%, #f1b94f ${percentage}%, #444 0%)`;

  // Update the display value
  const valueDisplay =
    slider.parentElement.previousElementSibling.querySelector(
      "span:last-child"
    );
  if (valueDisplay) {
    const isDollar = opt.min >= 500;
    const displayValue = isDollar
      ? `$${parseInt(value).toLocaleString()}`
      : value;
    valueDisplay.textContent = displayValue;
  }
}
function selectDropdown(sel) {
  answers[currentStep] = sel.value === "" ? null : +sel.value;
  renderQuizStep();
}
function typeText(input) {
  answers[currentStep] = input.value;
  const nextButton = document.querySelector(".quiz-next-btn");
  if (nextButton) {
    nextButton.disabled = !(input.value && input.value.trim());
  }
}
function addTag(i) {
  if (!answers[currentStep]) answers[currentStep] = [];
  if (!answers[currentStep].includes(i)) {
    answers[currentStep].push(i);
    renderQuizStep();
  }
}
function removeTag(i, e) {
  e.stopPropagation();
  if (!answers[currentStep]) return;
  answers[currentStep] = answers[currentStep].filter((idx) => idx !== i);
  renderQuizStep();
}

// --- Navigation ---
function goNext() {
  if (currentStep < questions.length - 1) {
    // Auto-save progress before moving to next question
    if (Object.keys(answers).length > 0) {
      saveQuizProgress(true);
    }

    currentStep++;
    renderQuizStep();
  } else {
    showResults();
  }
}
function goBack() {
  if (currentStep > 0) {
    // Auto-save progress before going back
    if (Object.keys(answers).length > 0) {
      saveQuizProgress(true);
    }

    currentStep--;
    renderQuizStep();
  }
}

// --- Scoring Calculation ---
function calculateArchetypeScores() {
  const scores = {};

  // Initialize all archetypes with 0
  archetypes.forEach((archetype) => {
    scores[archetype.id] = 0;
  });

  // Calculate scores based on answers
  Object.keys(answers).forEach((questionIndex) => {
    const question = questions[questionIndex];
    const answer = answers[questionIndex];

    if (question.id === "ageRange" && quizLogic.ageRange[answer]) {
      Object.keys(quizLogic.ageRange[answer]).forEach((archetypeId) => {
        scores[archetypeId] += quizLogic.ageRange[answer][archetypeId];
      });
    }

    if (
      question.id === "personalityType" &&
      quizLogic.personalityType[answer]
    ) {
      Object.keys(quizLogic.personalityType[answer]).forEach((archetypeId) => {
        scores[archetypeId] += quizLogic.personalityType[answer][archetypeId];
      });
    }

    if (question.id === "humor" && quizLogic.humor[answer]) {
      Object.keys(quizLogic.humor[answer]).forEach((archetypeId) => {
        scores[archetypeId] += quizLogic.humor[answer][archetypeId];
      });
    }
  });

  return scores;
}

// --- Results Display ---

function showResults() {
  const scores = calculateArchetypeScores();
  const sortedArchetypes = Object.keys(scores)
    .map((id) => ({ id, score: scores[id] }))
    .sort((a, b) => b.score - a.score);

  const mainArchetype = archetypes.find((a) => a.id === sortedArchetypes[0].id);
  const secondaryArchetypes = sortedArchetypes
    .slice(1, 3)
    .map((item) => archetypes.find((a) => a.id === item.id));

  const maxScore = questions.reduce((sum, q) => sum + (q.maxScore || 0), 0);
  const mainPercentage = Math.round(
    (sortedArchetypes[0].score / maxScore) * 100
  );

  // Calculate percentages for secondary archetypes
  const totalScore =
    sortedArchetypes[0].score +
    sortedArchetypes[1].score +
    sortedArchetypes[2].score;
  const secondaryPercentages = [
    Math.round((sortedArchetypes[1].score / totalScore) * 100),
    Math.round((sortedArchetypes[2].score / totalScore) * 100),
  ];

  document.getElementById("quiz-root").innerHTML = `
    <div class="results-card">
      <!-- Background Image Section -->
      <div class="background-image-section">
        <div class="background-image">
        <img src="${
          mainArchetype.image ||
          (typeof recommendationImages !== "undefined"
            ? recommendationImages.default
            : "")
        }" alt="${
    mainArchetype.imageAlt || mainArchetype.name
  }" style="width:100%;max-height:260px;object-fit:cover;border-radius:12px;margin-bottom:20px;" /></div>
      </div>
      
      <!-- Main Results Card -->
      <div class="main-results-card">
        <h1 class="results-title">Your Results are In!</h1>
        <div class="results-divider"></div>
        <h2 class="archetype-label">Your Travel Archetype is:</h2>
        <h3 class="main-archetype-name">${mainArchetype.name}</h3>
        <div class="scroll-indicator">
          <div class="arrow-circle">
            <span class="arrow">↓</span>
          </div>
        </div>
      </div>
      
      <!-- Closest Matches Section -->
      <div class="closest-matches-section">
        <h2 class="closest-matches-title">Your next closest matches</h2>
        <div class="matches-grid">
          ${secondaryArchetypes
            .slice(0, 2)
            .map(
              (archetype, index) => `
            <div class="match-card">
              <div class="pie-chart">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <!-- Purple segment (large) -->
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#8B5CF6" stroke-width="20" 
                    stroke-dasharray="314 314" stroke-dashoffset="0"/>
                  <!-- Blue segment (medium) -->
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#6366F1" stroke-width="20" 
                    stroke-dasharray="314 314" stroke-dashoffset="78.5"/>
                  <!-- Yellow segment (small) - represents the percentage -->
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#F1B94F" stroke-width="20" 
                    stroke-dasharray="314 314" stroke-dashoffset="235.5"/>
                  <!-- Percentage text -->
                  <text x="60" y="65" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${secondaryPercentages[index]}%</text>
                </svg>
              </div>
              <h3 class="match-name">${archetype.name}</h3>
              <button class="learn-more-btn">Learn About Me</button>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
      
      <!-- Detailed Archetype Information -->
      <div class="detailed-info-section">
        
        <!-- Community Count -->
        <div class="community-count-section" style="text-align:center;margin:20px 0;padding:20px;background:rgba(241,185,79,0.1);border:2px solid #f1b94f;border-radius:12px;">
          <div style="font-size:1em;margin-bottom:10px;">👥 ${getText(
            "community"
          )}</div>
          <div style="font-size:1.6em;font-weight:bold;color:#f1b94f;margin-bottom:5px;">3,484</div>
          <div style="font-size:0.85em;color:#ccc;">${getText(
            "peopleShare"
          )} ${mainArchetype.name.toLowerCase()}</div>
        </div>
        
        <!-- Archetype Overview -->
        <div class="archetype-section" style="margin-bottom:25px;">
          <div class="archetype-overview-icon" style="text-align:center;margin-bottom:10px;">
            <img src="${
              mainArchetype.icons ||
              (typeof recommendationImages !== "undefined"
                ? recommendationImages.default
                : "")
            }" alt="${
    mainArchetype.imageAlt || mainArchetype.name
  } icon" style="width:200px;height:200px;border-radius:50%;object-fit:cover" />
          </div>
          <h3 style="font-size:1.2em;margin-bottom:12px;color:#f1b94f;">About your archetype</h3>
          <p style="font-size:0.95em;line-height:1.5;color:#e0e0e0;">${
            mainArchetype.overview
          }</p>
        </div>
        
        <!-- How You're Seen -->
        <div class="archetype-section" style="margin-bottom:25px;">
          <h3 style="font-size:1.2em;margin-bottom:12px;color:#f1b94f;">How You're Seen</h3>
          <p style="font-size:0.95em;line-height:1.5;color:#e0e0e0;">${
            mainArchetype.howYoureSeen
          }</p>
        </div>
        
        <!-- Archetype Information Cards -->
        <div class="archetype-cards-section">
          <h3 style="font-size:1.3em;margin-bottom:25px;color:#f1b94f;text-align:center;">About Your Archetype</h3>
          <div class="archetype-cards-grid">
            <!-- Personality Card -->
            <div class="archetype-card">
              <div class="card-icon">
                <img src="images/Page Icons/personality.png" alt="Personality" />
              </div>
              <h4 class="card-title">Personality</h4>
              <p class="card-description">${mainArchetype.personality}</p>
            </div>
            
            <!-- Essence Card -->
            <div class="archetype-card">
              <div class="card-icon">
                <img src="images/Page Icons/essence.png" alt="Essence" />
              </div>
              <h4 class="card-title">Essence</h4>
              <p class="card-description">${mainArchetype.essence}</p>
            </div>
            
            <!-- Values Card -->
            <div class="archetype-card">
              <div class="card-icon">
                <img src="images/Page Icons/values.png" alt="Values" />
              </div>
              <h4 class="card-title">Values</h4>
              <p class="card-description">${
                Array.isArray(mainArchetype.values)
                  ? mainArchetype.values.join(", ")
                  : mainArchetype.values
              }</p>
            </div>
            
            <!-- Interests Card -->
            <div class="archetype-card">
              <div class="card-icon">
                <img src="images/Page Icons/interests.png" alt="Interests" />
              </div>
              <h4 class="card-title">Interests</h4>
              <p class="card-description">${
                Array.isArray(mainArchetype.interests)
                  ? mainArchetype.interests.join(", ")
                  : mainArchetype.interests
              }</p>
            </div>
            
            <!-- Experiences Card -->
            <div class="archetype-card">
              <div class="card-icon">
                <img src="images/Page Icons/experiences.png" alt="Experiences" />
              </div>
              <h4 class="card-title">Experiences</h4>
              <p class="card-description">${
                Array.isArray(mainArchetype.experiences)
                  ? mainArchetype.experiences.join(", ")
                  : mainArchetype.experiences
              }</p>
            </div>
            
            <!-- Recommended Destinations Card -->
            <div class="archetype-card">
              <div class="card-icon">
                <img src="images/Page Icons/recommended-destinations.png" alt="Recommended Destinations" />
              </div>
              <h4 class="card-title">Recommended Destinations</h4>
              <p class="card-description">${mainArchetype.recommendedDestinations.join(
                ", "
              )}</p>
            </div>
          </div>
        </div>
        
        <!-- How to Travel Better -->
        <div class="travel-better-section">
          <div class="travel-better-background">
            <img src="${
              mainArchetype.travelBetter ||
              (typeof archeTypeTravelBetter !== "undefined"
                ? archeTypeTravelBetter.default
                : "")
            }" alt="Travel background for ${mainArchetype.name}" />
          </div>
          <div class="travel-better-overlay">
            <h3 class="travel-better-title">How to travel better as a ${
              mainArchetype.name
            }:</h3>
                          <div class="travel-tips-container">
                ${mainArchetype.howToTravelBetter
                  .map(
                    (tip, index) => `
                    <div class="travel-tip-item">
                      <h4 class="tip-heading">${tip.title || tip}</h4>
                      <p class="tip-description">${tip.description || tip}</p>
                      ${
                        index < mainArchetype.howToTravelBetter.length - 1
                          ? '<div class="tip-separator"></div>'
                          : ""
                      }
                    </div>
                  `
                  )
                  .join("")}
              </div>
          </div>
        </div>
        
        <!-- Our Recommendations -->
        <div class="archetype-section" style="margin-bottom:25px;">
          <h3 style="font-size:1.2em;margin-bottom:12px;color:#f1b94f;">Our Recommendations</h3>
          <div class="recommendations-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;margin-top:15px;">
            ${mainArchetype.ourRecommendations
              .map(
                (rec) => `
              <div class="recommendation-card" style="border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:20px;transition:transform 0.2s ease;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                <img src="${rec.image}" alt="${rec.title}" class="recommendation-image" style="width:100%;height:180px;object-fit:cover;border-radius:8px;margin-bottom:15px;">
                <h4 style="font-size:1.1em;margin-bottom:10px;color:#f1b94f;">${rec.title}</h4>
                <p class="recommendation-description" style="font-size:0.9em;line-height:1.4;color:#ccc;">${rec.description}</p>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </div>
      
      <!-- Secondary Archetypes
      <div class="secondary-archetypes" style="margin-bottom:30px;">
        <h3 style="font-size:1.3em;margin-bottom:20px;color:#f1b94f;">Secondary Archetypes</h3>
        ${secondaryArchetypes
          .map(
            (archetype) => `
          <div class="secondary-archetype" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:20px;margin-bottom:15px;">
            <img src="${
              archetype.image ||
              (typeof recommendationImages !== "undefined"
                ? recommendationImages.default
                : "")
            }" alt="${
              archetype.imageAlt || archetype.name
            }" style="width:100%;max-height:150px;object-fit:cover;border-radius:8px;margin-bottom:12px;" />
            <h4 style="font-size:1.1em;margin-bottom:10px;color:#f1b94f;">${
              archetype.name
            }</h4>
            <p style="font-size:0.9em;line-height:1.4;color:#e0e0e0;">${
              archetype.overview
            }</p>
          </div>
        `
          )
          .join("")}
      </div>
       -->
      <!-- Social Sharing -->
      <div class="social-sharing" style="margin-bottom:30px;">
        <h3 style="font-size:1.3em;margin-bottom:20px;color:#f1b94f;">Share Your Results</h3>
        
        <!-- Download Card Button -->
        <div style="margin-bottom:20px;text-align:center;">
          <button onclick="downloadArchetypeCard('${mainArchetype.name}', '${
    mainArchetype.overview
  }')" class="download-card-btn" style="background:#f1b94f;color:#000;border:none;padding:15px 30px;border-radius:8px;font-size:1em;font-weight:bold;cursor:pointer;transition:all 0.2s ease;margin-bottom:15px;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            🎨 Download Social Media Card
          </button>
          <div id="download-loading" style="display:none;color:#f1b94f;font-size:0.9em;margin-top:10px;">
            Generating your custom card...
          </div>
        </div>
         <!--
        <div class="share-buttons" style="display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap;">
          <button onclick="shareResults('facebook')" class="share-btn facebook" style="background:#1877f2;color:white;border:none;padding:12px 20px;border-radius:8px;font-size:0.9em;cursor:pointer;font-weight:bold;">Facebook</button>
          <button onclick="shareResults('twitter')" class="share-btn twitter" style="background:#1da1f2;color:white;border:none;padding:12px 20px;border-radius:8px;font-size:0.9em;cursor:pointer;font-weight:bold;">Twitter</button>
          <button onclick="shareResults('instagram')" class="share-btn instagram" style="background:linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888);color:white;border:none;padding:12px 20px;border-radius:8px;font-size:0.9em;cursor:pointer;font-weight:bold;">Instagram</button>
        </div>
        <button onclick="emailResults()" class="email-btn" style="background:rgba(255,255,255,0.1);color:#f1b94f;border:2px solid #f1b94f;padding:12px 24px;border-radius:8px;font-size:0.9em;cursor:pointer;font-weight:bold;transition:all 0.2s ease;" onmouseover="this.style.background='rgba(241,185,79,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">Email Me My Results</button>
        -->
      </div>
      
      <button onclick="retakeQuiz()" class="retake-btn" style="background:#f1b94f;color:#000;border:none;padding:15px 30px;border-radius:8px;font-size:1em;font-weight:bold;cursor:pointer;transition:all 0.2s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">Retake Quiz</button>
    </div>
  `;
}

// --- Social Sharing Functions ---
function shareResults(platform) {
  const scores = calculateArchetypeScores();
  const sortedArchetypes = Object.keys(scores)
    .map((id) => ({ id, score: scores[id] }))
    .sort((a, b) => b.score - a.score);

  const text = `I'm a ${
    archetypes.find((a) => a.id === sortedArchetypes[0].id).name
  } traveler! Take the quiz at kiortravel.com`;
  const url = window.location.href;

  if (platform === "facebook") {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    );
  } else if (platform === "twitter") {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}&url=${encodeURIComponent(url)}`
    );
  } else if (platform === "instagram") {
    // Instagram sharing is limited, copy to clipboard
    navigator.clipboard.writeText(text + " " + url);
    alert("Text copied to clipboard! Share on Instagram manually.");
  }
}

function emailResults() {
  const scores = calculateArchetypeScores();
  const sortedArchetypes = Object.keys(scores)
    .map((id) => ({ id, score: scores[id] }))
    .sort((a, b) => b.score - a.score);

  const subject = "My Travel Archetype Results";
  const body = `Hi! I just took the travel archetype quiz and I'm a ${
    archetypes.find((a) => a.id === sortedArchetypes[0].id).name
  } traveler. Check it out at kiortravel.com`;
  window.open(
    `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      body
    )}`
  );
}

function retakeQuiz() {
  currentStep = 0;
  answers = {};
  renderQuizStep();
}

/**
 * Generates and downloads a custom social media card for travel archetype quiz results
 * @param {Object} options - Configuration object
 * @param {string} options.archetypeName - The user's travel archetype name
 * @param {string} options.description - Brief description of the archetype
 * @param {number} options.communityCount - Number of community members (default: 3484)
 * @param {string} options.filename - Custom filename for download (optional)
 */
async function generateSocialMediaCard({
  archetypeName,
  description,
  communityCount = 3484,
  filename = "travel-archetype-card.png",
}) {
  try {
    // Show loading state
    const loadingElement = document.getElementById("download-loading");
    if (loadingElement) {
      loadingElement.style.display = "block";
    }

    // Create canvas element
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions (optimal for social media)
    canvas.width = 1200;
    canvas.height = 630;

    // Define colors and styling
    const colors = {
      background: "#1a1a1a",
      backgroundGradient: "#2d2d2d",
      golden: "#f1b94f",
      white: "#ffffff",
      lightGray: "#cccccc",
      darkGray: "#666666",
    };

    // Load logo image
    const logo = await loadImage(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Primary%20logo%20Colored%20transparent%20version-6LxSbcbPfX4kbd3949TzAFoJqB5NsM.png"
    );

    // Create gradient background
    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height
    );
    gradient.addColorStop(0, colors.background);
    gradient.addColorStop(1, colors.backgroundGradient);

    // Fill background
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add subtle border
    ctx.strokeStyle = colors.golden;
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Add decorative corner elements (keep original positions)
    drawCornerDecorations(ctx, colors.golden);

    // Draw logo positioned to not interfere with corner decorations
    const logoSize = 100;
    const logoX = canvas.width - logoSize - 100; // Moved further left
    const logoY = 80; // Moved down to avoid corner decoration
    ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);

    // Set text properties
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Calculate layout positions
    const layout = {
      title: { y: 120 },
      archetype: { y: 220 },
      description: { startY: 320, maxLines: 4, lineHeight: 35 },
      community: { y: 520 },
      website: { y: 580 },
    };

    // Title: "Your Travel Archetype"
    ctx.fillStyle = colors.golden;
    ctx.font = "bold 42px Arial, sans-serif";
    ctx.fillText("Your Travel Archetype", canvas.width / 2, layout.title.y);

    // Archetype Name (main focus)
    ctx.fillStyle = colors.white;
    let fontSize = 64;
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;

    // Handle long archetype names by adjusting font size
    while (
      ctx.measureText(archetypeName).width > canvas.width - 200 &&
      fontSize > 36
    ) {
      fontSize -= 4;
      ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    }

    ctx.fillText(archetypeName, canvas.width / 2, layout.archetype.y);

    // Description text (wrapped and properly spaced)
    ctx.fillStyle = colors.lightGray;
    ctx.font = "28px Arial, sans-serif";

    const wrappedDescription = wrapText(ctx, description, canvas.width - 160);

    // Limit description to maximum lines to prevent overflow
    const maxLines = Math.min(
      wrappedDescription.length,
      layout.description.maxLines
    );
    const descriptionLines = wrappedDescription.slice(0, maxLines);

    // If text was truncated, add ellipsis to last line
    if (wrappedDescription.length > maxLines) {
      const lastLine = descriptionLines[maxLines - 1];
      const truncatedLine = lastLine + "...";
      descriptionLines[maxLines - 1] = truncatedLine;
    }

    // Draw description lines with proper spacing
    descriptionLines.forEach((line, index) => {
      const yPosition =
        layout.description.startY + index * layout.description.lineHeight;
      ctx.fillText(line, canvas.width / 2, yPosition);
    });

    // Community count - positioned to avoid overlap
    ctx.fillStyle = colors.golden;
    ctx.font = "bold 32px Arial, sans-serif";
    ctx.fillText(
      `Join ${communityCount.toLocaleString()} fellow travelers`,
      canvas.width / 2,
      layout.community.y
    );

    // Add website/brand text
    ctx.fillStyle = colors.darkGray;
    ctx.font = "22px Arial, sans-serif";
    ctx.fillText(
      "Discover Your Travel Archetype",
      canvas.width / 2,
      layout.website.y
    );

    // Convert canvas to blob and trigger download
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to generate image"));
            return;
          }

          // Create download link
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = filename;

          // Trigger download
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Clean up
          URL.revokeObjectURL(url);

          resolve(blob);
        },
        "image/png",
        0.95
      );
    });
  } catch (error) {
    console.error("Error generating social media card:", error);
    throw new Error(`Failed to generate card: ${error.message}`);
  } finally {
    // Hide loading state
    const loadingElement = document.getElementById("download-loading");
    if (loadingElement) {
      loadingElement.style.display = "none";
    }
  }
}

/**
 * Helper function to load images asynchronously
 */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/**
 * Helper function to wrap text within a specified width
 */
function wrapText(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine + (currentLine ? " " : "") + word;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * Helper function to draw decorative corner elements - restored to original positions
 */
function drawCornerDecorations(ctx, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;

  const cornerSize = 30;
  const offset = 40;

  // Top-left corner
  ctx.beginPath();
  ctx.moveTo(offset, offset + cornerSize);
  ctx.lineTo(offset, offset);
  ctx.lineTo(offset + cornerSize, offset);
  ctx.stroke();

  // Top-right corner - restored to original position
  ctx.beginPath();
  ctx.moveTo(ctx.canvas.width - offset - cornerSize, offset);
  ctx.lineTo(ctx.canvas.width - offset, offset);
  ctx.lineTo(ctx.canvas.width - offset, offset + cornerSize);
  ctx.stroke();

  // Bottom-left corner
  ctx.beginPath();
  ctx.moveTo(offset, ctx.canvas.height - offset - cornerSize);
  ctx.lineTo(offset, ctx.canvas.height - offset);
  ctx.lineTo(offset + cornerSize, ctx.canvas.height - offset);
  ctx.stroke();

  // Bottom-right corner
  ctx.beginPath();
  ctx.moveTo(
    ctx.canvas.width - offset - cornerSize,
    ctx.canvas.height - offset
  );
  ctx.lineTo(ctx.canvas.width - offset, ctx.canvas.height - offset);
  ctx.lineTo(
    ctx.canvas.width - offset,
    ctx.canvas.height - offset - cornerSize
  );
  ctx.stroke();
}

/**
 * Integration function for existing share buttons
 */
async function downloadArchetypeCard(archetypeName, description) {
  try {
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = "Generating...";
    button.disabled = true;

    await generateSocialMediaCard({
      archetypeName,
      description,
      communityCount: 3484,
      filename: `${archetypeName
        .toLowerCase()
        .replace(/\s+/g, "-")}-archetype.png`,
    });

    button.textContent = "Downloaded!";
    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
    }, 2000);
  } catch (error) {
    console.error("Download failed:", error);
    const button = event.target;
    button.textContent = "Download Failed";
    setTimeout(() => {
      button.textContent = "Download Card";
      button.disabled = false;
    }, 3000);
    alert("Sorry, there was an error generating your card. Please try again.");
  }
}

// --- INIT ---
console.log("Constants loaded:", {
  archetypes:
    typeof archetypes !== "undefined" ? archetypes.length : "undefined",
  questions: typeof questions !== "undefined" ? questions.length : "undefined",
  quizLogic:
    typeof quizLogic !== "undefined"
      ? Object.keys(quizLogic).length
      : "undefined",
});

// Add custom slider styles
function addSliderStyles() {
  if (document.getElementById("slider-styles")) return; // Already added

  const style = document.createElement("style");
  style.id = "slider-styles";
  style.textContent = `
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #f1b94f;
      cursor: pointer;
      border: 3px solid #fff;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      transition: all 0.2s ease;
    }
    
    input[type="range"]::-webkit-slider-thumb:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(241,185,79,0.4);
    }
    
    input[type="range"]::-webkit-slider-thumb:active {
      transform: scale(0.95);
      background: #e6a93c;
    }
    
    input[type="range"]::-moz-range-thumb {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #f1b94f;
      cursor: pointer;
      border: 3px solid #fff;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      transition: all 0.2s ease;
    }
    
    input[type="range"]::-moz-range-thumb:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(241,185,79,0.4);
    }
    
    input[type="range"]::-moz-range-thumb:active {
      transform: scale(0.95);
      background: #e6a93c;
    }
    
    input[type="range"]::-ms-thumb {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #f1b94f;
      border: 3px solid #fff;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      transition: all 0.2s ease;
    }
    
    .lang-btn.active {
      background: #f1b94f !important;
      color: #000 !important;
      transform: scale(1.05);
      box-shadow: 0 2px 8px rgba(241,185,79,0.3);
    }
    
    .lang-btn:hover {
      background: rgba(241,185,79,0.2) !important;
      transform: scale(1.02);
    }
    
    .lang-btn {
      transition: all 0.2s ease;
    }
  `;
  document.head.appendChild(style);
}

// Wait for DOM to be ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    addSliderStyles();
    renderQuizStep();
    renderHeader(); // Render header after DOM is ready
  });
} else {
  addSliderStyles();
  renderQuizStep();
  renderHeader(); // Render header after DOM is ready
}
