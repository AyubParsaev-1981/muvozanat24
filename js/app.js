// Main Application Controller (App.js)
// State management, event handling, view orchestration, and user flows

const App = {
  state: {
    user: null,
    foods: [],
    weekPlan: {},
    weightLogs: [],
    currentDay: 'mon',
    portions: {}, // key: 'day_category', val: 'small' | 'normal'
    currentSwapContext: null // { day, category }
  },

  init() {
    this.syncAuthState();
    this.loadState();
    this.bindEvents();
    this.renderAll();
    applyTranslations();

    // Check if onboarding needs to be shown for authenticated first-time users (Section 13)
    if (Auth.isAuthenticated() && !this.state.user.onboardingCompleted) {
      this.openOnboardingModal();
    }
  },

  syncAuthState() {
    const isAuth = Auth.isAuthenticated();
    const guestNav = document.getElementById('guestNavActions');
    const userNav = document.getElementById('userNavActions');
    const guestHero = document.getElementById('guestLandingHero');
    const dashSection = document.getElementById('dashboardSection');
    const navUserName = document.getElementById('navUserName');
    const adminToggleBtn = document.getElementById('adminToggleBtn');

    if (isAuth) {
      const user = Auth.getCurrentUser();
      if (guestNav) guestNav.style.display = 'none';
      if (userNav) userNav.style.display = 'flex';
      if (guestHero) guestHero.style.display = 'none';
      if (dashSection) dashSection.style.display = 'block';
      if (navUserName) navUserName.textContent = user.name || 'Foydalanuvchi';
      if (adminToggleBtn) adminToggleBtn.style.display = (user.role === 'ADMIN') ? 'inline-flex' : 'none';
    } else {
      if (guestNav) guestNav.style.display = 'flex';
      if (userNav) userNav.style.display = 'none';
      if (guestHero) guestHero.style.display = 'block';
      if (dashSection) dashSection.style.display = 'none';
    }
  },

  loadState() {
    if (Auth.isAuthenticated()) {
      const curUser = Auth.getCurrentUser();
      this.state.user = curUser.profile || { ...DEFAULT_USER_PROFILE, name: curUser.name };
      this.state.weightLogs = curUser.weightLogs || [];
    } else {
      this.state.user = { ...DEFAULT_USER_PROFILE };
      this.state.weightLogs = [];
    }

    const savedFoods = localStorage.getItem('muvozanat_foods');
    if (savedFoods) {
      try {
        const parsed = JSON.parse(savedFoods);
        this.state.foods = parsed.map(f => {
          const match = DEFAULT_FOODS.find(df => df.id === f.id);
          return match ? { ...f, image: match.image } : f;
        });
      } catch (e) {
        this.state.foods = [...DEFAULT_FOODS];
      }
    } else {
      this.state.foods = [...DEFAULT_FOODS];
    }

    const savedPlan = localStorage.getItem('muvozanat_week_plan');
    this.state.weekPlan = savedPlan ? JSON.parse(savedPlan) : { ...DEFAULT_WEEK_PLAN };

    const savedPortions = localStorage.getItem('muvozanat_portions');
    this.state.portions = savedPortions ? JSON.parse(savedPortions) : {};
  },

  saveState() {
    localStorage.setItem('muvozanat_user', JSON.stringify(this.state.user));
    localStorage.setItem('muvozanat_foods', JSON.stringify(this.state.foods));
    localStorage.setItem('muvozanat_week_plan', JSON.stringify(this.state.weekPlan));
    localStorage.setItem('muvozanat_weight_logs', JSON.stringify(this.state.weightLogs));
    localStorage.setItem('muvozanat_portions', JSON.stringify(this.state.portions));
  },

  bindEvents() {
    // Language select
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
      langSelect.value = currentLanguage;
      langSelect.addEventListener('change', (e) => {
        setLanguage(e.target.value);
      });
    }

    window.addEventListener('languageChanged', () => {
      this.renderAll();
    });

    // Navigation links
    document.querySelectorAll('.nav-link, .bottom-nav-item').forEach(link => {
      link.addEventListener('click', (e) => {
        const targetSectionId = link.getAttribute('data-target');
        if (targetSectionId) {
          e.preventDefault();
          const targetEl = document.getElementById(targetSectionId);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
          // Update active state
          document.querySelectorAll('.nav-link, .bottom-nav-item').forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    });

    // Start Free CTA buttons -> opens Onboarding
    document.querySelectorAll('.btn-open-onboarding').forEach(btn => {
      btn.addEventListener('click', () => {
        this.openOnboardingModal();
      });
    });

    // How it works CTA -> scrolls to 3 pillars
    document.querySelectorAll('.btn-how-it-works').forEach(btn => {
      btn.addEventListener('click', () => {
        const pillars = document.getElementById('pillarsSection');
        if (pillars) pillars.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // Day switcher buttons
    document.querySelectorAll('.day-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.day-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.currentDay = btn.getAttribute('data-day');
        this.renderMealPlan();
      });
    });

    // Weight Logging form
    const weightForm = document.getElementById('weightLogForm');
    if (weightForm) {
      weightForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('newWeightInput');
        const val = parseFloat(input.value);
        if (val && val > 30 && val < 300) {
          this.logNewWeight(val);
          input.value = '';
        }
      });
    }

    // Quick Add Button (Bottom Nav "+")
    const quickAddBtn = document.getElementById('quickAddBtn');
    if (quickAddBtn) {
      quickAddBtn.addEventListener('click', () => {
        this.openQuickAddMenu();
      });
    }

    // Admin Panel trigger
    const adminToggleBtn = document.getElementById('adminToggleBtn');
    if (adminToggleBtn) {
      adminToggleBtn.addEventListener('click', () => {
        this.openAdminModal();
      });
    }

    // Shopping List trigger
    const shoppingBtn = document.getElementById('shoppingListBtn');
    if (shoppingBtn) {
      shoppingBtn.addEventListener('click', () => {
        this.openShoppingModal();
      });
    }

    // Data Export & Account Deletion
    const exportBtn = document.getElementById('exportDataBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportUserData());
    }

    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    if (deleteAccountBtn) {
      deleteAccountBtn.addEventListener('click', () => this.deleteAccount());
    }

    // Add Dish Form in Admin
    const addDishForm = document.getElementById('adminAddDishForm');
    if (addDishForm) {
      addDishForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAdminAddDish(e.target);
      });
    }

    // Window resize -> rerender chart
    window.addEventListener('resize', () => {
      WeightChart.render('weightChartContainer', this.state.weightLogs, this.state.user.targetWeight, this.state.user.startWeight);
    });
  },

  renderAll() {
    this.renderDashboard();
    this.renderMealPlan();
    this.renderWeightChart();
    this.renderHabitTrackers();
  },

  // 1. Render 5-Second Dashboard (Section 12 & 21 & Empty State - Section 3)
  renderDashboard() {
    const user = this.state.user;
    const isWeightSet = user && user.currentWeight && user.currentWeight > 0;

    // Greeting
    const greetingEl = document.getElementById('dashGreeting');
    if (greetingEl) {
      greetingEl.textContent = user.name ? `Salom, ${user.name}!` : 'Xush kelibsiz!';
    }

    const subgreetingEl = document.getElementById('dashSubgreeting');
    if (subgreetingEl) {
      if (isWeightSet) {
        const progress = NutritionEngine.calculateProgress(user);
        subgreetingEl.textContent = t('dash_subgreeting', { percent: progress.percent });
      } else {
        subgreetingEl.textContent = "Shaxsiy ozish rejangiz uchun profilingizni to'ldiring.";
      }
    }

    // Metrics ribbon (Empty State Logic - Section 3)
    const currWEl = document.getElementById('dashCurrentWeight');
    const targetWEl = document.getElementById('dashTargetWeight');
    const remEl = document.getElementById('dashRemainingWeight');
    const deltaEl = document.getElementById('dashWeightDelta');
    const calTargetEl = document.getElementById('dashCalorieTarget');
    const pFill = document.getElementById('dashProgressBarFill');
    const pText = document.getElementById('dashProgressBarText');
    const goalRangeText = document.getElementById('dashGoalRangeText');
    const bmiValEl = document.getElementById('dashBmiValue');
    const bmiDiscEl = document.getElementById('dashBmiDisclaimer');

    if (isWeightSet) {
      const progress = NutritionEngine.calculateProgress(user);
      const bmiData = NutritionEngine.calculateBMI(user);

      if (currWEl) currWEl.textContent = `${progress.currentWeight} kg`;
      if (deltaEl) deltaEl.textContent = `${progress.changeKg} kg`;
      if (targetWEl) targetWEl.textContent = `${progress.targetWeight} kg`;
      if (remEl) remEl.textContent = `${progress.remainingKg} kg`;
      if (calTargetEl) calTargetEl.textContent = `${NutritionEngine.calculateDailyCalories(user)} kkal`;

      if (pFill) pFill.style.width = `${progress.percent}%`;
      if (pText) pText.textContent = `${progress.percent}% ${t('dash_progress_bar')}`;
      if (goalRangeText) goalRangeText.textContent = `${progress.currentWeight} kg → ${progress.targetWeight} kg`;

      if (bmiValEl) bmiValEl.textContent = `BMI: ${bmiData.value}`;
      if (bmiDiscEl) bmiDiscEl.textContent = t(bmiData.disclaimerKey);
    } else {
      if (currWEl) currWEl.innerHTML = `<span style="font-size: 0.9rem; color: var(--text-muted);">Kiritilmagan</span>`;
      if (deltaEl) deltaEl.textContent = `Boshlang'ich`;
      if (targetWEl) targetWEl.innerHTML = `<span style="font-size: 0.9rem; color: var(--text-muted);">Kiritilmagan</span>`;
      if (remEl) remEl.textContent = `-- kg`;
      if (calTargetEl) calTargetEl.textContent = `-- kkal`;

      if (pFill) pFill.style.width = `0%`;
      if (pText) pText.textContent = `0% maqsadga erishildi`;
      if (goalRangeText) goalRangeText.textContent = `-- kg → -- kg`;

      if (bmiValEl) bmiValEl.textContent = `BMI: --`;
      if (bmiDiscEl) bmiDiscEl.textContent = `Bo'y va vazn kiritilgandan so'ng hisoblanadi`;
    }
  },

  // 2. Render 7-Day Meal Plan (Section 8, 9, 10)
  renderMealPlan() {
    const container = document.getElementById('mealsGridContainer');
    if (!container) return;

    const day = this.state.currentDay;
    const dayPlan = this.state.weekPlan[day] || this.state.weekPlan['mon'];
    const categories = ['breakfast', 'lunch', 'snack', 'dinner'];

    let html = '';
    categories.forEach(cat => {
      const foodId = dayPlan[cat];
      const food = this.state.foods.find(f => f.id === foodId) || this.state.foods[0];
      const portionKey = `${day}_${cat}`;
      const isSmall = this.state.portions[portionKey] === 'small';
      const nutrition = NutritionEngine.getNutritionForPortion(food, isSmall);
      const foodName = food.name[currentLanguage] || food.name['uz-Latn'];

      html += `
        <div class="dish-card" id="dishCard_${cat}">
          <div class="dish-category-header">
            <span>${t('meal_' + cat)}</span>
            <span style="font-size: 0.75rem; color: var(--primary); font-weight: 700;">${food.halalStatus ? 'Halol ✓' : ''}</span>
          </div>
          <div class="dish-image-wrapper">
            <img src="${food.image}" alt="${foodName}" class="dish-card-image" onerror="this.src='assets/images/plov.jpg'"/>
            <span class="dish-card-badge">${nutrition.calories} ${t('macro_kcal')}</span>
          </div>
          <div class="dish-card-body">
            <h4 class="dish-name">${foodName}</h4>
            <div class="dish-portion-tag">${t('serving')}: <strong>${nutrition.servingText}</strong></div>

            <div class="dish-macro-grid">
              <div class="macro-cell">
                <span class="macro-cell-val">${nutrition.protein}g</span>
                <span class="macro-cell-lbl">${t('macro_protein')}</span>
              </div>
              <div class="macro-cell">
                <span class="macro-cell-val">${nutrition.fat}g</span>
                <span class="macro-cell-lbl">${t('macro_fat')}</span>
              </div>
              <div class="macro-cell">
                <span class="macro-cell-val">${nutrition.carbs}g</span>
                <span class="macro-cell-lbl">${t('macro_carbs')}</span>
              </div>
              <div class="macro-cell">
                <span class="macro-cell-val">${nutrition.fiber}g</span>
                <span class="macro-cell-lbl">${t('macro_fiber')}</span>
              </div>
            </div>

            <div class="dish-actions-stack">
              <button class="btn-dish-action btn-dish-swap" onclick="App.openSwapModal('${day}', '${cat}')">
                🔄 ${t('btn_swap_food')}
              </button>
              <button class="btn-dish-action btn-dish-portion" onclick="App.togglePortion('${day}', '${cat}')">
                ⚖️ ${isSmall ? t('btn_normal_portion') : t('btn_small_portion')}
              </button>
              <button class="btn-dish-action btn-dish-recipe" onclick="App.openRecipeModal('${food.id}')">
                📖 ${t('btn_view_recipe')}
              </button>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  },

  // 3. Render Weight Chart & Logs
  // 3. Render Weight Chart with Empty State (Section 3 & 11)
  renderWeightChart() {
    const container = document.getElementById('weightChartContainer');
    if (!container) return;

    if (!this.state.weightLogs || this.state.weightLogs.length < 2) {
      container.innerHTML = `
        <div style="padding: 40px 20px; text-align: center; background: #F9FAFB; border-radius: var(--radius-lg); border: 1.5px dashed var(--border-subtle);">
          <div style="font-size: 2.5rem; margin-bottom: 10px;">📉</div>
          <h4 style="font-size: 1.1rem; color: var(--text-main); margin-bottom: 6px;">Vazn o'zgarishi grafigi</h4>
          <p style="color: var(--text-muted); font-size: 0.88rem; max-width: 440px; margin: 0 auto 16px auto; line-height: 1.5;">
            Hali yetarli vazn ma'lumoti kiritilmagan. Dinamika grafigini ko'rish uchun kamida 2 ta o'lchov qayd etilishi kerak.
          </p>
          <button class="btn-primary" style="padding: 8px 18px; font-size: 0.88rem;" onclick="App.openWeightModal()">
            ➕ Yangi vazn kiritish
          </button>
        </div>
      `;
      return;
    }

    WeightChart.render('weightChartContainer', this.state.weightLogs, this.state.user.targetWeight, this.state.user.startWeight);
  },

  // 4. Render Water & Habit Checklist
  renderHabitTrackers() {
    const user = this.state.user;
    const waterRow = document.getElementById('waterGlassesRow');
    if (waterRow) {
      let glassesHtml = '';
      for (let i = 1; i <= user.dailyWaterTargetGlasses; i++) {
        const isFilled = i <= user.currentWaterGlasses;
        glassesHtml += `
          <button class="water-glass-btn ${isFilled ? 'filled' : ''}" onclick="App.setWaterGlasses(${i})" title="${i * 250} ml">
            💧
          </button>
        `;
      }
      waterRow.innerHTML = glassesHtml;
    }

    const waterCounter = document.getElementById('waterCounterText');
    if (waterCounter) {
      const ml = user.currentWaterGlasses * 250;
      const targetMl = user.dailyWaterTargetGlasses * 250;
      waterCounter.textContent = `${ml} / ${targetMl} ml (${Math.round((user.currentWaterGlasses / user.dailyWaterTargetGlasses) * 100)}%)`;
    }

    // Today's checklist values
    const checkWater = document.getElementById('checkWaterVal');
    if (checkWater) {
      checkWater.textContent = `${Math.round((user.currentWaterGlasses / user.dailyWaterTargetGlasses) * 100)}%`;
    }

    const checkSteps = document.getElementById('checkStepsVal');
    if (checkSteps) {
      checkSteps.textContent = `${Math.round((user.currentSteps / user.dailyStepsTarget) * 100)}% (${user.currentSteps})`;
    }
  },

  setWaterGlasses(count) {
    // Toggle: if clicking current level, remove one
    if (this.state.user.currentWaterGlasses === count) {
      this.state.user.currentWaterGlasses = Math.max(count - 1, 0);
    } else {
      this.state.user.currentWaterGlasses = count;
    }
    this.saveState();
    this.renderHabitTrackers();
    if (this.state.user.currentWaterGlasses >= this.state.user.dailyWaterTargetGlasses) {
      this.showToast(t('badge_water_streak_desc'));
    }
  },

  // 5. Portion Switcher
  togglePortion(day, category) {
    const key = `${day}_${category}`;
    const current = this.state.portions[key] || 'normal';
    this.state.portions[key] = current === 'normal' ? 'small' : 'normal';
    this.saveState();
    this.renderMealPlan();
  },

  // 6. Smart Food Replacement & Adaptation (Core Pillar 2)
  openSwapModal(day, category) {
    this.state.currentSwapContext = { day, category };
    const modal = document.getElementById('swapFoodModal');
    const list = document.getElementById('swapDishesList');
    if (!modal || !list) return;

    // Render suitable replacement options
    let dishesHtml = '';
    this.state.foods.forEach(food => {
      const name = food.name[currentLanguage] || food.name['uz-Latn'];
      dishesHtml += `
        <div class="swap-dish-card" onclick="App.applyFoodSwap('${food.id}')">
          <img src="${food.image}" alt="${name}" class="swap-dish-thumb" onerror="this.src='assets/images/plov.jpg'"/>
          <div class="swap-dish-info">
            <h5 class="swap-dish-title">${name}</h5>
            <span class="swap-dish-kcal">${food.calories} ${t('macro_kcal')} • ${food.servingSize}</span>
            <span style="font-size: 0.75rem; color: #6B7280;">${food.country} (${food.cuisine})</span>
          </div>
        </div>
      `;
    });

    list.innerHTML = dishesHtml;
    modal.classList.add('open');
  },

  applyFoodSwap(foodId) {
    const { day, category } = this.state.currentSwapContext;
    const selectedFood = this.state.foods.find(f => f.id === foodId);
    if (!selectedFood) return;

    // Run the Smart Adaptation Engine!
    const dayMeals = this.state.weekPlan[day];
    const { updatedDayMeals, adaptationMessage } = NutritionEngine.adaptDailyMeals(dayMeals, category, selectedFood, this.state.foods);

    this.state.weekPlan[day] = updatedDayMeals;
    this.saveState();
    this.closeModal('swapFoodModal');
    this.renderMealPlan();

    // If Smart Adaptation was triggered (e.g. dinner lightened due to Osh), show friendly non-punitive notice
    if (adaptationMessage) {
      const msg = t('swap_toast_adapted', { dish: adaptationMessage.chosenDish });
      this.showToast(msg, 'toast-adapted');
    } else {
      this.showToast(`${selectedFood.name[currentLanguage] || selectedFood.name['uz-Latn']} muvaffaqiyatli tanlandi!`);
    }
  },

  // 7. Recipe Viewer Modal
  openRecipeModal(foodId) {
    const food = this.state.foods.find(f => f.id === foodId);
    if (!food) return;

    const modal = document.getElementById('recipeDetailsModal');
    if (!modal) return;

    const name = food.name[currentLanguage] || food.name['uz-Latn'];
    document.getElementById('recipeModalTitle').textContent = name;
    document.getElementById('recipeModalImage').src = food.image;
    document.getElementById('recipeModalKcal').textContent = `${food.calories} ${t('macro_kcal')} (${food.servingSize})`;

    // Ingredients
    const ingList = food.ingredients[currentLanguage] || food.ingredients['uz-Latn'] || [];
    let ingHtml = '';
    ingList.forEach(item => {
      ingHtml += `<li>${item}</li>`;
    });
    document.getElementById('recipeModalIngredients').innerHTML = ingHtml;

    // Cooking Instructions
    const steps = food.recipe[currentLanguage] || food.recipe['uz-Latn'] || '';
    document.getElementById('recipeModalInstructions').textContent = steps;

    modal.classList.add('open');
  },

  // 8. Weight Logging
  logNewWeight(weight) {
    const todayStr = new Date().toISOString().split('T')[0];
    this.state.user.currentWeight = weight;

    // Check if entry for today exists
    const existingIdx = this.state.weightLogs.findIndex(l => l.date === todayStr);
    if (existingIdx >= 0) {
      this.state.weightLogs[existingIdx].weight = weight;
    } else {
      this.state.weightLogs.push({ date: todayStr, weight });
    }

    this.saveState();
    this.renderDashboard();
    this.renderWeightChart();
    this.showToast(t('weight_log_success'));
  },

  // 9. Shopping List Modal (Section 19)
  openShoppingModal() {
    const modal = document.getElementById('shoppingListModal');
    const container = document.getElementById('shoppingListContent');
    if (!modal || !container) return;

    // Gather categories
    const categories = {
      [t('cat_vegetables')]: ['Sabzi (sariq va qizil) — 1.5 kg', 'Piyoz — 1 kg', 'Yangi pomidor — 1.2 kg', 'Bodring — 1 kg', 'Rayhon va kashnich — 2 bog\'', 'Ismaloq yoki rukkola — 1 bog\''],
      [t('cat_fruits')]: ['Mavsumiy olma — 1 kg', 'Limon — 3 dona'],
      [t('cat_meat')]: ['Yumshoq lahm mol go\'shti — 1.2 kg', 'Tovuq ko\'krak filesi — 1 kg', 'Qo\'zichoq go\'shti (sho\'rva uchun) — 500 g'],
      [t('cat_dairy')]: ['Tuxum (C1) — 15 dona', 'Suzma yoki kam yog\'li qatiq — 500 g'],
      [t('cat_grains')]: ['Lazer yoki devzira guruch — 1 kg', 'Suli yormasi (ovsyanka) — 500 g', 'Tandir non — 3 dona', 'Qizil yasmiq — 400 g']
    };

    let html = '';
    for (const [catName, items] of Object.entries(categories)) {
      let itemsHtml = '';
      items.forEach((item, idx) => {
        itemsHtml += `
          <label class="shopping-item-row">
            <input type="checkbox" id="shop_${catName}_${idx}">
            <span>${item}</span>
          </label>
        `;
      });
      html += `
        <div class="shopping-group">
          <div class="shopping-group-title">${catName}</div>
          <div class="shopping-items-list">${itemsHtml}</div>
        </div>
      `;
    }

    container.innerHTML = html;
    modal.classList.add('open');
  },

  // 10. Admin CMS Modal & Add Food (Section 24 & 32)
  openAdminModal() {
    const modal = document.getElementById('adminCMSModal');
    if (!modal) return;
    AdminCMS.renderFoodsTable('adminFoodsTableContainer', this.state.foods);
    AdminCMS.renderKPIMetrics('adminKPIMetricsContainer');
    modal.classList.add('open');
  },

  handleAdminAddDish(form) {
    const newDish = {
      id: 'food_custom_' + Date.now(),
      country: form.dishCountry.value,
      cuisine: form.dishCuisine.value,
      name: {
        'uz-Latn': form.dishNameUz.value,
        'uz-Cyrl': form.dishNameUz.value,
        'ru': form.dishNameRu.value || form.dishNameUz.value
      },
      altNames: [form.dishNameUz.value],
      image: form.dishImage.value || 'assets/images/plov.jpg',
      servingSize: form.dishServing.value || '250 g',
      servingGrams: 250,
      smallServingGrams: 175,
      calories: parseInt(form.dishKcal.value) || 350,
      protein: parseInt(form.dishProtein.value) || 20,
      fat: parseInt(form.dishFat.value) || 15,
      carbs: parseInt(form.dishCarbs.value) || 30,
      fiber: 3.0,
      category: form.dishCategory.value,
      dietCategory: 'traditional',
      allergens: [],
      halalStatus: true,
      ingredients: {
        'uz-Latn': form.dishIngredients.value.split(',').map(s => s.trim()),
        'uz-Cyrl': form.dishIngredients.value.split(',').map(s => s.trim()),
        'ru': form.dishIngredients.value.split(',').map(s => s.trim())
      },
      recipe: {
        'uz-Latn': form.dishRecipe.value,
        'uz-Cyrl': form.dishRecipe.value,
        'ru': form.dishRecipe.value
      }
    };

    this.state.foods.unshift(newDish);
    this.saveState();
    AdminCMS.renderFoodsTable('adminFoodsTableContainer', this.state.foods);
    form.reset();
    this.showToast('Yangi taom muvaffaqiyatli bazaga qo\'shildi!');
  },

  deleteFoodItem(id) {
    this.state.foods = this.state.foods.filter(f => f.id !== id);
    this.saveState();
    AdminCMS.renderFoodsTable('adminFoodsTableContainer', this.state.foods);
    this.renderMealPlan();
    this.showToast('Taom o\'chirildi.');
  },

  // 11. Onboarding Flow (Multi-Step Wizard, Section 4, 5, 6, 7)
  currentOnboardingStep: 1,

  openOnboardingModal() {
    this.currentOnboardingStep = 1;
    this.showOnboardingStep(1);
    const modal = document.getElementById('onboardingModal');
    if (modal) modal.classList.add('open');
  },

  showOnboardingStep(stepNumber) {
    this.currentOnboardingStep = stepNumber;
    for (let i = 1; i <= 5; i++) {
      const stepEl = document.getElementById(`onboardStep${i}`);
      const dotEl = document.getElementById(`stepDot${i}`);
      if (stepEl) stepEl.style.display = i === stepNumber ? 'block' : 'none';
      if (dotEl) dotEl.classList.toggle('active', i <= stepNumber);
    }

    const prevBtn = document.getElementById('onboardPrevBtn');
    const nextBtn = document.getElementById('onboardNextBtn');
    const finishBtn = document.getElementById('onboardFinishBtn');

    if (prevBtn) prevBtn.style.display = stepNumber > 1 ? 'inline-flex' : 'none';
    if (nextBtn) nextBtn.style.display = stepNumber < 5 ? 'inline-flex' : 'none';
    if (finishBtn) finishBtn.style.display = stepNumber === 5 ? 'inline-flex' : 'none';
  },

  nextOnboardingStep() {
    if (this.currentOnboardingStep < 5) {
      this.showOnboardingStep(this.currentOnboardingStep + 1);
    }
  },

  prevOnboardingStep() {
    if (this.currentOnboardingStep > 1) {
      this.showOnboardingStep(this.currentOnboardingStep - 1);
    }
  },

  finishOnboarding() {
    // Read form values with validation (Section 19)
    const form = document.getElementById('onboardingForm');
    if (form) {
      const currentW = parseFloat(form.currentWeight.value);
      const targetW = parseFloat(form.targetWeight.value);
      const heightVal = parseInt(form.height.value);
      const ageVal = parseInt(form.age.value);

      if (!currentW || currentW < 30 || currentW > 300) {
        alert("Iltimos, haqiqiy vazningizni kiriting (30 - 300 kg oralig'ida)!");
        return;
      }

      this.state.user.gender = form.gender.value || 'male';
      this.state.user.age = ageVal || 30;
      this.state.user.height = heightVal || 175;
      this.state.user.currentWeight = currentW;
      this.state.user.startWeight = currentW;
      this.state.user.targetWeight = targetW || Math.round(currentW * 0.9);
      this.state.user.country = form.country.value || 'Uzbekistan';
      this.state.user.city = form.city.value || 'Toshkent';
      this.state.user.activityLevel = form.activity.value || 'medium';
      this.state.user.jobType = form.job.value || 'office';
      this.state.user.goal = form.goal.value || 'lose';
      this.state.user.cuisineStyle = form.cuisineStyle.value || 'traditional';
      this.state.user.onboardingCompleted = true;

      // Add first real entry to weight log
      this.state.weightLogs = [
        { date: new Date().toISOString().split('T')[0], weight: currentW }
      ];

      // Save to isolated user account
      if (Auth.isAuthenticated()) {
        Auth.saveCurrentUserData({
          profile: this.state.user,
          weightLogs: this.state.weightLogs,
          onboardingCompleted: true
        });
      }
    }

    this.saveState();
    this.closeModal('onboardingModal');
    this.renderAll();
    this.showToast('Tabriklaymiz! Shaxsiy milliy taomlar rejangiz tayyorlandi.');
  },

  // =========================================================================
  // AUTH MODAL HANDLERS (Sections 4, 5, 6, 7, 8)
  // =========================================================================
  openAuthModal(tab = 'login') {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    this.switchAuthTab(tab);
    modal.classList.add('open');
  },

  switchAuthTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const regForm = document.getElementById('registerForm');
    const tgTab = document.getElementById('telegramAuthTab');
    const titleEl = document.getElementById('authModalTitle');

    document.querySelectorAll('#authModal .scanner-tab-btn').forEach(btn => btn.classList.remove('active'));

    if (tab === 'login') {
      document.getElementById('authTabBtnLogin')?.classList.add('active');
      if (loginForm) loginForm.style.display = 'block';
      if (regForm) regForm.style.display = 'none';
      if (tgTab) tgTab.style.display = 'none';
      if (titleEl) titleEl.textContent = "Hisobga kirish";
    } else if (tab === 'register') {
      document.getElementById('authTabBtnRegister')?.classList.add('active');
      if (loginForm) loginForm.style.display = 'none';
      if (regForm) regForm.style.display = 'block';
      if (tgTab) tgTab.style.display = 'none';
      if (titleEl) titleEl.textContent = "Yangi hisob ochish";
    } else {
      document.getElementById('authTabBtnTelegram')?.classList.add('active');
      if (loginForm) loginForm.style.display = 'none';
      if (regForm) regForm.style.display = 'none';
      if (tgTab) tgTab.style.display = 'block';
      if (titleEl) titleEl.textContent = "Telegram orqali kirish";
    }
  },

  checkPasswordStrength(val) {
    const ind = document.getElementById('passwordStrengthIndicator');
    if (!ind) return;
    if (val.length < 8) {
      ind.innerHTML = `Xavfsizlik: <span style="color: #DC2626; font-weight: 700;">Juda qisqa (Kamida 8 belgi)</span>`;
    } else if (val.length < 10) {
      ind.innerHTML = `Xavfsizlik: <span style="color: #F59E0B; font-weight: 700;">O'rtacha</span>`;
    } else {
      ind.innerHTML = `Xavfsizlik: <span style="color: #10B981; font-weight: 700;">Kuchli va xavfsiz ✅</span>`;
    }
  },

  handleLoginSubmit(e) {
    e.preventDefault();
    const idVal = document.getElementById('loginIdentifier').value;
    const passVal = document.getElementById('loginPassword').value;
    const errEl = document.getElementById('loginErrorMsg');

    try {
      if (errEl) errEl.style.display = 'none';
      Auth.login(idVal, passVal);
      this.closeModal('authModal');
      this.syncAuthState();
      this.loadState();
      this.renderAll();
      this.showToast("Xush kelibsiz! Tizimga muvaffaqiyatli kirdingiz.");
    } catch (err) {
      if (errEl) {
        errEl.textContent = err.message;
        errEl.style.display = 'block';
      }
    }
  },

  handleRegisterSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const idVal = document.getElementById('regIdentifier').value;
    const passVal = document.getElementById('regPassword').value;
    const errEl = document.getElementById('registerErrorMsg');

    try {
      if (errEl) errEl.style.display = 'none';
      Auth.register(name, idVal, passVal);
      this.closeModal('authModal');
      this.syncAuthState();
      this.loadState();
      this.openOnboardingModal(); // Mandatory Onboarding (Section 13)
      this.showToast("Hisob yaratildi! Iltimos, shaxsiy ko'rsatkichlaringizni kiriting.");
    } catch (err) {
      if (errEl) {
        errEl.textContent = err.message;
        errEl.style.display = 'block';
      }
    }
  },

  // 12. Quick Add Floating Menu
  openQuickAddMenu() {
    const choice = prompt("Tezkor qo'shish:\n1 - 🥗 Taom tanlash va qo'shish (Baza & Grammlar)\n2 - ⚖️ Yangi vazn kiritish\n3 - 📷 Taomni skanerlash", "1");
    if (choice === '1') {
      this.openFoodCatalogModal();
    } else if (choice === '2') {
      this.openWeightModal();
    } else if (choice === '3') {
      FoodScanner.openModal();
    }
  },

  // =========================================================================
  // FOOD CATALOG & GRAMS SELECTOR (Grammlarda kiritish va Taomlar bazasi)
  // =========================================================================
  catalogState: {
    activeTab: 'browse',
    selectedCategory: 'all',
    searchTerm: '',
    selectedFood: null,
    currentGrams: 250
  },

  openFoodCatalogModal(defaultCategory = 'all') {
    const modal = document.getElementById('foodCatalogModal');
    if (!modal) return;
    this.catalogState.selectedCategory = defaultCategory;
    this.catalogState.searchTerm = '';
    const searchInput = document.getElementById('catalogSearchInput');
    if (searchInput) searchInput.value = '';

    this.switchCatalogTab('browse');
    this.filterCatalogByCategory(defaultCategory);
    modal.classList.add('open');
  },

  switchCatalogTab(tab) {
    this.catalogState.activeTab = tab;
    const browseTab = document.getElementById('catalogBrowseTab');
    const customTab = document.getElementById('catalogCustomTab');
    const btnBrowse = document.getElementById('catalogTabBtnBrowse');
    const btnCustom = document.getElementById('catalogTabBtnCustom');

    if (tab === 'browse') {
      if (browseTab) browseTab.style.display = 'block';
      if (customTab) customTab.style.display = 'none';
      btnBrowse?.classList.add('active');
      btnCustom?.classList.remove('active');
      this.renderFoodCatalogGrid();
    } else {
      if (browseTab) browseTab.style.display = 'none';
      if (customTab) customTab.style.display = 'block';
      btnBrowse?.classList.remove('active');
      btnCustom?.classList.add('active');
    }
  },

  filterCatalogByCategory(cat) {
    this.catalogState.selectedCategory = cat;
    document.querySelectorAll('#catalogCategoryPills .portion-chip-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-cat') === cat);
    });
    this.renderFoodCatalogGrid();
  },

  filterFoodCatalog() {
    const input = document.getElementById('catalogSearchInput');
    this.catalogState.searchTerm = input ? input.value.trim().toLowerCase() : '';
    this.renderFoodCatalogGrid();
  },

  getFoodDisplayName(food) {
    if (!food) return '';
    if (typeof food.name === 'string') return food.name;
    if (food.name && typeof food.name === 'object') {
      const lang = this.state.lang || 'uz-Latn';
      return food.name[lang] || food.name['uz-Latn'] || food.name['ru'] || Object.values(food.name)[0];
    }
    return 'Milliy taom';
  },

  renderFoodCatalogGrid() {
    const grid = document.getElementById('foodCatalogGrid');
    if (!grid) return;

    const foods = this.state.foods || DEFAULT_FOODS;
    const cat = this.catalogState.selectedCategory;
    const term = this.catalogState.searchTerm;

    const filtered = foods.filter(f => {
      // Category match
      if (cat !== 'all') {
        if (cat === 'snack' && f.category !== 'snack' && f.category !== 'salad') return false;
        else if (cat !== 'snack' && f.category !== cat) return false;
      }
      // Search term match
      if (term) {
        const name = this.getFoodDisplayName(f).toLowerCase();
        const alt = (f.altNames || []).join(' ').toLowerCase();
        if (!name.includes(term) && !alt.includes(term)) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 30px 15px; text-align: center; color: var(--text-muted);">
          <div style="font-size: 2rem; margin-bottom: 6px;">🔍</div>
          <p style="margin: 0; font-size: 0.9rem;">Taom topilmadi. Qidiruv so'zini o'zgartiring yoki «Yangi taom yaratish» bo'limidan o'zingiz qo'shing.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(f => {
      const name = this.getFoodDisplayName(f);
      const serving = f.servingGrams || 250;
      const cal100 = Math.round((f.calories / serving) * 100);
      const isSelected = this.catalogState.selectedFood && this.catalogState.selectedFood.id === f.id;

      return `
        <div class="catalog-food-card ${isSelected ? 'selected' : ''}" onclick="App.selectCatalogFood('${f.id}')">
          <img src="${f.image || 'assets/images/plov.jpg'}" alt="${name}" class="catalog-food-thumb" onerror="this.src='assets/images/plov.jpg'">
          <div class="catalog-food-info">
            <div class="catalog-food-title">${name}</div>
            <div class="catalog-food-meta">
              Standart: ${serving}g (~${f.calories} kkal)<br>
              O: ${f.protein}g | Y: ${f.fat}g | U: ${f.carbs}g
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
              <span class="catalog-100g-badge">${cal100} kkal / 100g</span>
              <span style="font-size: 0.8rem; font-weight: 700; color: #059669;">Tanlash ➔</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  selectCatalogFood(foodId) {
    const foods = this.state.foods || DEFAULT_FOODS;
    const food = foods.find(f => f.id === foodId);
    if (!food) return;

    this.catalogState.selectedFood = food;
    this.catalogState.currentGrams = food.servingGrams || 250;

    // Highlight selected card
    document.querySelectorAll('.catalog-food-card').forEach(card => card.classList.remove('selected'));
    this.renderFoodCatalogGrid();

    // Show config panel
    const panel = document.getElementById('selectedDishConfigPanel');
    if (panel) {
      panel.style.display = 'block';
      const name = this.getFoodDisplayName(food);
      const serving = food.servingGrams || 250;
      const cal100 = Math.round((food.calories / serving) * 100);
      const p100 = ((food.protein / serving) * 100).toFixed(1);
      const f100 = ((food.fat / serving) * 100).toFixed(1);
      const c100 = ((food.carbs / serving) * 100).toFixed(1);

      document.getElementById('catalogSelectedTitle').textContent = name;
      document.getElementById('catalogSelectedThumb').src = food.image || 'assets/images/plov.jpg';
      document.getElementById('catalogSelected100gInfo').textContent = `100g: ${cal100} kkal | O: ${p100}g | Y: ${f100}g | U: ${c100}g`;

      const gramsInput = document.getElementById('catalogGramsInput');
      if (gramsInput) gramsInput.value = this.catalogState.currentGrams;

      this.updateCatalogCalculations(this.catalogState.currentGrams);
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  },

  setCatalogGrams(grams) {
    this.catalogState.currentGrams = grams;
    const input = document.getElementById('catalogGramsInput');
    if (input) input.value = grams;

    document.querySelectorAll('.grams-quick-pills .grams-pill-btn').forEach(btn => {
      btn.classList.toggle('active', btn.textContent.startsWith(`${grams}g`));
    });

    this.updateCatalogCalculations(grams);
  },

  updateCatalogCalculations(grams) {
    if (!this.catalogState.selectedFood) return;
    const food = this.catalogState.selectedFood;
    const g = Math.max(10, Math.min(1500, grams || 100));
    this.catalogState.currentGrams = g;

    const serving = food.servingGrams || 250;
    const cal = Math.round((food.calories * g) / serving);
    const prot = (food.protein * g / serving).toFixed(1);
    const fat = (food.fat * g / serving).toFixed(1);
    const carbs = (food.carbs * g / serving).toFixed(1);

    const kcalEl = document.getElementById('catalogCalcKcal');
    const protEl = document.getElementById('catalogCalcProtein');
    const fatEl = document.getElementById('catalogCalcFat');
    const carbsEl = document.getElementById('catalogCalcCarbs');

    if (kcalEl) kcalEl.textContent = `${cal}`;
    if (protEl) protEl.textContent = `${prot}g`;
    if (fatEl) fatEl.textContent = `${fat}g`;
    if (carbsEl) carbsEl.textContent = `${carbs}g`;
  },

  addSelectedCatalogFoodToDiary() {
    if (!this.catalogState.selectedFood) {
      alert("Iltimos, avval biror taomni tanlang!");
      return;
    }

    const food = this.catalogState.selectedFood;
    const grams = this.catalogState.currentGrams;
    const serving = food.servingGrams || 250;
    const cal = Math.round((food.calories * grams) / serving);
    const prot = parseFloat(((food.protein * grams) / serving).toFixed(1));
    const fat = parseFloat(((food.fat * grams) / serving).toFixed(1));
    const carbs = parseFloat(((food.carbs * grams) / serving).toFixed(1));
    const name = this.getFoodDisplayName(food);

    const mealSelect = document.getElementById('catalogMealTimeSelect');
    const mealTime = mealSelect ? mealSelect.value : 'Tushlik';

    const diaryItem = {
      meal: mealTime,
      name: name,
      grams: grams,
      calories: cal,
      protein: prot,
      fat: fat,
      carbs: carbs,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    try {
      const diary = JSON.parse(localStorage.getItem('muvozanat_diary_today') || '[]');
      diary.push(diaryItem);
      localStorage.setItem('muvozanat_diary_today', JSON.stringify(diary));
    } catch (e) {}

    this.closeModal('foodCatalogModal');
    this.showToast(`✅ ${mealTime}ga qo'shildi: ${name} (${grams}g, ~${cal} kkal)`);
  },

  handleCreateCustomFood(e) {
    e.preventDefault();
    const name = document.getElementById('custDishName').value.trim();
    const cat = document.getElementById('custDishCategory').value;
    const grams = parseInt(document.getElementById('custDishGrams').value) || 200;
    const kcal = parseInt(document.getElementById('custDishKcal').value) || 300;
    const prot = parseFloat(document.getElementById('custDishProtein').value) || 15;
    const fat = parseFloat(document.getElementById('custDishFat').value) || 10;
    const carbs = parseFloat(document.getElementById('custDishCarbs').value) || 30;

    const newFood = {
      id: `custom_food_${Date.now()}`,
      country: 'Uzbekistan',
      cuisine: 'uzbek',
      name: {
        'uz-Latn': name,
        'uz-Cyrl': name,
        'ru': name
      },
      image: 'assets/images/chicken_salad.jpg',
      servingSize: `${grams} g`,
      servingGrams: grams,
      calories: kcal,
      protein: prot,
      fat: fat,
      carbs: carbs,
      category: cat,
      dietCategory: 'custom'
    };

    this.state.foods.unshift(newFood);
    this.saveState();

    this.showToast(`Taom «${name}» muvaffaqiyatli bazaga qo'shildi!`);
    this.switchCatalogTab('browse');
    this.selectCatalogFood(newFood.id);
  },

  // 13. Data Privacy & GDPR Exports (Section 28)
  exportUserData() {
    const data = {
      profile: this.state.user,
      weightLogs: this.state.weightLogs,
      weekPlan: this.state.weekPlan,
      exportTimestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `muvozanat_data_${this.state.user.name}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('Ma\'lumotlar muvaffaqiyatli yuklab olindi (JSON)');
  },

  deleteAccount() {
    if (confirm(t('btn_delete_account') + '? Ushbu amal barcha saqlangan ma\'lumotlaringizni tozalaydi.')) {
      localStorage.clear();
      window.location.reload();
    }
  },

  // 14. Premium & Telegram Bot Flow
  openPremiumModal() {
    const modal = document.getElementById('premiumModal');
    if (!modal) return;

    // Pre-fill name if user profile has name
    const nameInput = document.getElementById('premiumFullName');
    if (nameInput && this.state.user && this.state.user.name) {
      nameInput.value = this.state.user.name;
    }

    // Hide previous error messages
    const nameErr = document.getElementById('nameErrorMsg');
    const phoneErr = document.getElementById('phoneErrorMsg');
    if (nameErr) nameErr.classList.remove('visible');
    if (phoneErr) phoneErr.classList.remove('visible');

    // Phone input auto-formatter for 9 digits
    const phoneInput = document.getElementById('premiumPhoneInput');
    if (phoneInput && !phoneInput._hasInputListener) {
      phoneInput._hasInputListener = true;
      phoneInput.addEventListener('input', (e) => {
        let digits = e.target.value.replace(/\D/g, '');
        if (digits.length > 9) digits = digits.slice(0, 9);

        // Format as XX XXX XX XX
        let formatted = '';
        if (digits.length > 0) formatted += digits.slice(0, 2);
        if (digits.length > 2) formatted += ' ' + digits.slice(2, 5);
        if (digits.length > 5) formatted += ' ' + digits.slice(5, 7);
        if (digits.length > 7) formatted += ' ' + digits.slice(7, 9);

        e.target.value = formatted;
        if (phoneErr && digits.length === 9) {
          phoneErr.classList.remove('visible');
        }
      });
    }

    modal.classList.add('open');
  },

  handlePremiumSubmit(e) {
    if (e) e.preventDefault();

    const nameInput = document.getElementById('premiumFullName');
    const phoneInput = document.getElementById('premiumPhoneInput');
    const nameErr = document.getElementById('nameErrorMsg');
    const phoneErr = document.getElementById('phoneErrorMsg');

    const fullName = nameInput ? nameInput.value.trim() : '';
    const rawPhone = phoneInput ? phoneInput.value.replace(/\D/g, '') : '';

    let isValid = true;

    // Validate full name
    if (!fullName || fullName.length < 3) {
      if (nameErr) nameErr.classList.add('visible');
      isValid = false;
    } else {
      if (nameErr) nameErr.classList.remove('visible');
    }

    // Validate 9-digit phone strictly
    if (!rawPhone || rawPhone.length !== 9) {
      if (phoneErr) phoneErr.classList.add('visible');
      isValid = false;
    } else {
      if (phoneErr) phoneErr.classList.remove('visible');
    }

    if (!isValid) return;

    // Save registration details
    const premiumData = {
      fullName,
      phone: '+998' + rawPhone,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('muvozanat_premium_reg', JSON.stringify(premiumData));

    // Telegram bot target URL
    const botUsername = localStorage.getItem('muvozanat_telegram_bot') || 'muvozanat24_bot';
    const telegramUrl = `https://t.me/${botUsername}?start=reg_${rawPhone}`;

    this.showToast(t('telegram_redirecting'));

    setTimeout(() => {
      this.closeModal('premiumModal');
      window.open(telegramUrl, '_blank');
    }, 600);
  },

  // Modal helpers
  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('open');
  },

  showToast(message, extraClass = '') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${extraClass}`;
    toast.innerHTML = `<span>✨</span> <div>${message}</div>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
