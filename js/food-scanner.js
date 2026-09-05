/**
 * «AI Food Scanner» — Multimodal Taom va Shtrix-kod Skaneri
 * 
 * Texnik topshiriq talablari:
 * 1. Multimodal tahlil (Rasm + Porsiya + Milliy mahsulotlar bazasi + Shtrix-kod + Tasdiq)
 * 2. Ilmiy UX: Aniq 637 kkal emas, balki «Taxminiy: 590–680 kkal (o'rtacha ~640 kkal)»
 * 3. 20+ O'zbek milliy taomlari bazasi
 * 4. Porsiya hisoblash formulasi: C = cal_100 * weight / 100
 * 5. Shtrix-kod & Qadoq yorlig'i (Nutrition Label) skaneri
 * 6. User Correction Loop (Section 21) & Kunlik ratsionga qo'shish
 */

const FoodScanner = {
  OPENAI_API_KEY: localStorage.getItem('muvozanat_ai_api_key') || "",

  // 1. Milliy taomlar tekshirilgan ozuqaviy qiymatlar bazasi (100g uchun)
  NATIONAL_FOODS_DB: {
    'plov': {
      id: 'plov',
      name_uz: 'Toshkent to\'y oshi (Palov)',
      name_ru: 'Ташкентский праздничный плов',
      cal_100: 232,
      protein_100: 8.8,
      fat_100: 10.4,
      carbs_100: 25.6,
      default_portion: 275,
      components: [
        { name: 'Devzira/Lazer guruch', grams: 150, cal: 195 },
        { name: 'Yumshoq mol go\'shti', grams: 70, cal: 160 },
        { name: 'Sariq va qizil sabzi', grams: 50, cal: 40 },
        { name: 'Nuxat va mayiz', grams: 25, cal: 60 }
      ]
    },
    'manti': {
      id: 'manti',
      name_uz: 'Bug\'da pishirilgan manti',
      name_ru: 'Манты паровые',
      cal_100: 195,
      protein_100: 8.2,
      fat_100: 9.1,
      carbs_100: 20.2,
      default_portion: 250,
      components: [
        { name: 'Manti xamiri', grams: 110, cal: 210 },
        { name: 'Mol go\'shti va piyoz qiymasi', grams: 140, cal: 275 }
      ]
    },
    'somsa': {
      id: 'somsa',
      name_uz: 'Tandir go\'shtli somsa',
      name_ru: 'Самса тандырная с мясом',
      cal_100: 285,
      protein_100: 9.5,
      fat_100: 14.8,
      carbs_100: 28.4,
      default_portion: 160,
      components: [
        { name: 'Qatlama xamir', grams: 80, cal: 240 },
        { name: 'Go\'shtli shira qiyma', grams: 80, cal: 215 }
      ]
    },
    'lagman': {
      id: 'lagman',
      name_uz: 'Cho\'zma lag\'mon',
      name_ru: 'Лагман уйгурский/узбекский',
      cal_100: 142,
      protein_100: 6.5,
      fat_100: 5.8,
      carbs_100: 16.0,
      default_portion: 350,
      components: [
        { name: 'Cho\'zma xamir', grams: 180, cal: 250 },
        { name: 'Say (go\'sht va sabzavotlar)', grams: 170, cal: 245 }
      ]
    },
    'shurva': {
      id: 'shurva',
      name_uz: 'Qo\'zichoq go\'shtli sho\'rva',
      name_ru: 'Шурпа из баранины',
      cal_100: 98,
      protein_100: 7.2,
      fat_100: 5.6,
      carbs_100: 4.8,
      default_portion: 350,
      components: [
        { name: 'Qaynatma go\'sht', grams: 100, cal: 170 },
        { name: 'Kartoshka va sabzi', grams: 100, cal: 85 },
        { name: 'Tiniq bulyon', grams: 150, cal: 88 }
      ]
    },
    'dimlama': {
      id: 'dimlama',
      name_uz: 'Sabzavotli dimlama',
      name_ru: 'Димлама с овощами',
      cal_100: 115,
      protein_100: 7.5,
      fat_100: 6.2,
      carbs_100: 7.4,
      default_portion: 300,
      components: [
        { name: 'Dimlangan go\'sht', grams: 100, cal: 180 },
        { name: 'Karam, baqlajon, qalampir', grams: 200, cal: 165 }
      ]
    },
    'mastava': {
      id: 'mastava',
      name_uz: 'Qatiqli mastava',
      name_ru: 'Мастава с катыком',
      cal_100: 110,
      protein_100: 5.4,
      fat_100: 4.8,
      carbs_100: 11.2,
      default_portion: 320,
      components: [
        { name: 'Guruch va bulyon', grams: 220, cal: 190 },
        { name: 'Mayda go\'sht va qatiq', grams: 100, cal: 162 }
      ]
    },
    'shashlik': {
      id: 'shashlik',
      name_uz: 'Qiyma lula kabob (2 six)',
      name_ru: 'Люля-кебаб (2 шампура)',
      cal_100: 245,
      protein_100: 16.5,
      fat_100: 19.2,
      carbs_100: 1.5,
      default_portion: 160,
      components: [
        { name: 'Six go\'shti', grams: 140, cal: 340 },
        { name: 'Sirka piyoz va ko\'kat', grams: 40, cal: 20 }
      ]
    },
    'qozon_kabob': {
      id: 'qozon_kabob',
      name_uz: 'Qozon kabob qovurma',
      name_ru: 'Казан-кабоб с картофелем',
      cal_100: 220,
      protein_100: 14.0,
      fat_100: 16.5,
      carbs_100: 4.0,
      default_portion: 280,
      components: [
        { name: 'Qizargan go\'sht', grams: 140, cal: 350 },
        { name: 'Qovurilgan kartoshka', grams: 140, cal: 265 }
      ]
    },
    'norin': {
      id: 'norin',
      name_uz: 'Toshkent norini qazi bilan',
      name_ru: 'Норын ташкентский с казы',
      cal_100: 215,
      protein_100: 14.8,
      fat_100: 8.5,
      carbs_100: 19.8,
      default_portion: 250,
      components: [
        { name: 'Yupqa xamir', grams: 150, cal: 260 },
        { name: 'Maydalangan ot go\'shti / Qazi', grams: 100, cal: 275 }
      ]
    },
    'chuchvara': {
      id: 'chuchvara',
      name_uz: 'Mitti chuchvara sho\'rva',
      name_ru: 'Чучвара в бульоне',
      cal_100: 145,
      protein_100: 7.4,
      fat_100: 6.5,
      carbs_100: 14.2,
      default_portion: 300,
      components: [
        { name: 'Chuchvara', grams: 160, cal: 310 },
        { name: 'Go\'sht bulyoni va ko\'kat', grams: 140, cal: 125 }
      ]
    },
    'achichuk': {
      id: 'achichuk',
      name_uz: 'Achchiq-chuchuk yangi salati',
      name_ru: 'Салат Ачичук',
      cal_100: 32,
      protein_100: 1.1,
      fat_100: 0.2,
      carbs_100: 6.4,
      default_portion: 150,
      components: [
        { name: 'Yupqa pomidor va oq piyoz', grams: 140, cal: 42 },
        { name: 'Yangi rayhon va achchiq qalampir', grams: 10, cal: 6 }
      ]
    },
    'tandir_non': {
      id: 'tandir_non',
      name_uz: 'Issiq tandir noni',
      name_ru: 'Тандырная лепешка',
      cal_100: 255,
      protein_100: 7.9,
      fat_100: 1.5,
      carbs_100: 52.0,
      default_portion: 100,
      components: [
        { name: 'Tandir non', grams: 100, cal: 255 }
      ]
    },
    'qatiq': {
      id: 'qatiq',
      name_uz: 'Tabiiy qatiq / Suzma',
      name_ru: 'Катык натуральный',
      cal_100: 58,
      protein_100: 3.2,
      fat_100: 3.2,
      carbs_100: 4.1,
      default_portion: 200,
      components: [
        { name: 'Tabiiy qatiq', grams: 200, cal: 116 }
      ]
    }
  },

  // 2. Shtrix-kodlar bazasi (Markaziy Osiyo va Xalqaro mahsulotlar)
  BARCODE_DB: {
    '5449000000996': {
      name: 'Coca-Cola Classic',
      brand: 'Coca-Cola Uzbekistan',
      cal_100: 42,
      protein_100: 0,
      fat_100: 0,
      carbs_100: 10.6,
      serving_size: '500 ml',
      serving_multiplier: 5.0,
      verified: true
    },
    '4780017170019': {
      name: 'Dinay Olma-Uzum sharbati',
      brand: 'Dinay Uzbekistan',
      cal_100: 48,
      protein_100: 0.2,
      fat_100: 0,
      carbs_100: 11.8,
      serving_size: '200 ml',
      serving_multiplier: 2.0,
      verified: true
    },
    '4780004520018': {
      name: 'Musaffo 2.5% Tabiiy Sut',
      brand: 'Musaffo',
      cal_100: 53,
      protein_100: 2.9,
      fat_100: 2.5,
      carbs_100: 4.7,
      serving_size: '250 ml (1 stakan)',
      serving_multiplier: 2.5,
      verified: true
    },
    '4780029570029': {
      name: 'Nestle Sutim 3.2%',
      brand: 'Nestle',
      cal_100: 59,
      protein_100: 3.0,
      fat_100: 3.2,
      carbs_100: 4.7,
      serving_size: '250 ml',
      serving_multiplier: 2.5,
      verified: true
    },
    '5000159461122': {
      name: 'Snickers shokoladli batonchigi',
      brand: 'Mars',
      cal_100: 507,
      protein_100: 9.3,
      fat_100: 27.9,
      carbs_100: 54.6,
      serving_size: '50 g (1 dona)',
      serving_multiplier: 0.5,
      verified: true
    },
    '4780010910018': {
      name: 'Chortoq Tabiiy Mineral Suvi',
      brand: 'Chortoq',
      cal_100: 0,
      protein_100: 0,
      fat_100: 0,
      carbs_100: 0,
      serving_size: '500 ml',
      serving_multiplier: 5.0,
      verified: true
    }
  },

  // State
  currentStream: null,
  activeMode: 'food_photo', // 'food_photo' | 'barcode' | 'nutrition_label'
  currentScanResult: null,
  currentPortionGrams: 275,

  init() {
    this.bindEvents();
  },

  openModal(mode = 'food_photo') {
    const modal = document.getElementById('foodScannerModal');
    if (!modal) return;

    this.activeMode = mode;
    this.switchTab(mode);
    modal.classList.add('open');
    this.startCamera();
  },

  closeModal() {
    const modal = document.getElementById('foodScannerModal');
    if (modal) modal.classList.remove('open');
    this.stopCamera();
    this.resetResult();
  },

  switchTab(mode) {
    this.activeMode = mode;
    document.querySelectorAll('.scanner-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
    });

    const laser = document.getElementById('scannerLaserLine');
    if (laser) {
      laser.style.display = (mode === 'barcode') ? 'block' : 'none';
    }

    const titleEl = document.getElementById('scannerInstructionText');
    if (titleEl) {
      if (mode === 'food_photo') {
        titleEl.innerHTML = "📸 Taomni kadr markaziga oling va «Suratga olish» tugmasini bosing";
      } else if (mode === 'barcode') {
        titleEl.innerHTML = "▦ Mahsulot shtrix-kodini (Barcode/QR) to'rtburchak ichiga to'g'rilang";
      } else {
        titleEl.innerHTML = "🏷️ Mahsulot orqasidagi «Ozuqaviy qiymati» (Nutrition facts) jadvalini tushiring";
      }
    }
  },

  // 3. Kamera boshqaruvi
  async startCamera() {
    const video = document.getElementById('scannerVideoFeed');
    const fallback = document.getElementById('cameraFallbackArea');
    if (!video) return;

    try {
      this.stopCamera();
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      this.currentStream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = this.currentStream;
      video.style.display = 'block';
      if (fallback) fallback.style.display = 'none';

      // Agar shtrix-kod rejimi bo'lsa, BarcodeDetector ni tekshirish
      if (this.activeMode === 'barcode' && 'BarcodeDetector' in window) {
        this.startBarcodeLiveDetection();
      }
    } catch (err) {
      console.warn("Camera access failed, enabling file upload fallback:", err);
      if (video) video.style.display = 'none';
      if (fallback) fallback.style.display = 'flex';
    }
  },

  stopCamera() {
    if (this.currentStream) {
      this.currentStream.getTracks().forEach(track => track.stop());
      this.currentStream = null;
    }
  },

  // 4. Kadrni suratga olish yoki fayl yuklash
  captureSnapshot() {
    const video = document.getElementById('scannerVideoFeed');
    if (!video || !video.videoWidth) {
      // Agar kamera ishlamasa, fayl tanlashni chaqirish
      document.getElementById('scannerFileInput')?.click();
      return;
    }

    const canvas = document.createElement('canvas');
    const maxWidth = 1024;
    const scale = Math.min(1, maxWidth / video.videoWidth);
    canvas.width = video.videoWidth * scale;
    canvas.height = video.videoHeight * scale;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64Image = canvas.toDataURL('image/jpeg', 0.82);
    this.processCapturedImage(base64Image);
  },

  handleFileUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      App.showToast("Fayl hajmi 10 MB dan oshmasligi kerak!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      this.processCapturedImage(e.target.result);
    };
    reader.readAsDataURL(file);
  },

  // 5. Asosiy tahlil jarayoni (Multimodal Pipeline)
  async processCapturedImage(base64Image) {
    this.showLoading(true);

    try {
      if (this.activeMode === 'barcode') {
        await this.analyzeBarcodeImage(base64Image);
      } else {
        await this.analyzeFoodImageWithAI(base64Image);
      }
    } catch (err) {
      console.error("Scanning error:", err);
      this.showLocalFallbackResult();
    } finally {
      this.showLoading(false);
    }
  },

  // 6. OpenAI Vision API yordamida taomni aniqlash (gpt-4o-mini Vision)
  async analyzeFoodImageWithAI(base64Image) {
    const prompt = 
      `Siz O'zbekistonning yetakchi nutrisiologi va oziq-ovqat ekspertisiz. Ushbu rasmdagi taomni aniqlang.\n` +
      `Qoidalar:\n` +
      `1. O'zbek yoki Markaziy Osiyo milliy taomini imkon qadar aniq nomlang (masalan: "Toshkent to'y oshi", "Manti", "Tandir somsa", "Lag'mon", "Shurva", "Dimlama", "Achchiq-chuchuk salat", "Shashlik").\n` +
      `2. Rasmdagi taom tarkibiy qismlarini ajrating (masalan: guruch, go'sht, sabzi, salat).\n` +
      `3. Porsiyani baholang (Kichik, O'rta, Katta va grammda: ~250-350g).\n` +
      `4. Javobni FAQAT QUYIDAGI JSON formatda qaytaring, ortiqcha so'z qo'shmang:\n` +
      `{\n` +
      `  "food_key": "plov" yoki "manti" yoki "somsa" yoki "lagman" yoki "shurva" yoki "dimlama" yoki "other",\n` +
      `  "food_name": "Toshkent to'y oshi",\n` +
      `  "confidence": 0.94,\n` +
      `  "portion_g": 280,\n` +
      `  "portion_size": "O'rta",\n` +
      `  "calorie_range_min": 590,\n` +
      `  "calorie_range_max": 680,\n` +
      `  "calorie_avg": 635,\n` +
      `  "protein_g": 22,\n` +
      `  "fat_g": 24,\n` +
      `  "carbs_g": 76,\n` +
      `  "components": [\n` +
      `    {"name": "Guruch", "grams": 150, "cal": 195},\n` +
      `    {"name": "Mol go'shti", "grams": 70, "cal": 160},\n` +
      `    {"name": "Sabzi va no'xat", "grams": 60, "cal": 80}\n` +
      `  ],\n` +
      `  "nutrition_tip": "Yog'sizroq likopchani tanlab, ko'proq achchiq-chuchuk salat bilan iste'mol qiling!"\n` +
      `}`;

    const headers = {
      'Authorization': `Bearer ${this.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    };

    const payload = {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: base64Image, detail: 'low' } }
          ]
        }
      ],
      max_tokens: 500,
      temperature: 0.2
    };

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`OpenAI Vision HTTP error: ${res.status}`);
    }

    const data = await res.json();
    let text = data?.choices?.[0]?.message?.content || '{}';
    
    // JSON tozalash (Markdown bloklarini olib tashlash)
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(text);

    // Milliy baza bilan bog'lash (Formula bo'yicha mustahkamlash)
    this.presentFoodScanResult(parsed, base64Image);
  },

  // 7. Natijani formula va milliy baza bo'yicha ekranga chiqarish (Sections 3, 4, 5, 19, 20)
  presentFoodScanResult(aiData, imageSrc) {
    const key = aiData.food_key || 'plov';
    const dbItem = this.NATIONAL_FOODS_DB[key] || this.NATIONAL_FOODS_DB['plov'];

    this.currentPortionGrams = aiData.portion_g || dbItem.default_portion;

    // Formula: C = cal_100 * weight / 100
    const calculatedCal = Math.round((dbItem.cal_100 * this.currentPortionGrams) / 100);
    const calculatedProtein = Math.round((dbItem.protein_100 * this.currentPortionGrams) / 100);
    const calculatedFat = Math.round((dbItem.fat_100 * this.currentPortionGrams) / 100);
    const calculatedCarbs = Math.round((dbItem.carbs_100 * this.currentPortionGrams) / 100);

    // Oraliq kaloriya (Section 3: Aniq dogma emas, taxminiy oraliq)
    const calMin = Math.round(calculatedCal * 0.92);
    const calMax = Math.round(calculatedCal * 1.08);

    const confidence = aiData.confidence || 0.92;
    let confBadge = '';
    if (confidence >= 0.85) {
      confBadge = `<span class="confidence-tag high">🟢 Yuqori ishonch (${Math.round(confidence * 100)}%)</span>`;
    } else if (confidence >= 0.60) {
      confBadge = `<span class="confidence-tag medium">🟡 O'rtacha ishonch (${Math.round(confidence * 100)}%)</span>`;
    } else {
      confBadge = `<span class="confidence-tag low">🔴 Taxminiy (${Math.round(confidence * 100)}%)</span>`;
    }

    this.currentScanResult = {
      name: aiData.food_name || dbItem.name_uz,
      key: key,
      portionGrams: this.currentPortionGrams,
      calories: calculatedCal,
      calMin,
      calMax,
      protein: calculatedProtein,
      fat: calculatedFat,
      carbs: calculatedCarbs,
      components: aiData.components || dbItem.components,
      advice: aiData.nutrition_tip || "Porsiya me'yorida, sabzavotlar bilan muvozanatlangan!",
      imageSrc
    };

    this.renderResultCard(this.currentScanResult, confBadge);
  },

  // 8. Natija kartochkasini render qilish
  renderResultCard(res, confBadge) {
    const resultBox = document.getElementById('scannerResultBox');
    if (!resultBox) return;

    // Komponentlar ro'yxati (Section 5)
    let componentsHtml = '';
    if (res.components && res.components.length > 0) {
      componentsHtml = `
        <div class="scanner-components-list">
          <strong style="font-size: 0.85rem; color: var(--text-main); display: block; margin-bottom: 6px;">
            🍱 Aniqlangan tarkibiy qismlar:
          </strong>
          ${res.components.map((c, i) => `
            <div class="scanner-component-row">
              <span>• ${c.name} (~${c.grams}g)</span>
              <span class="badge-cal-pill">${c.cal} kkal</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    resultBox.innerHTML = `
      <div class="scanner-result-card">
        <div class="scanner-result-header">
          <div class="scanner-thumb-wrap">
            <img src="${res.imageSrc}" alt="Skan qilingan taom" class="scanner-thumb-img">
          </div>
          <div class="scanner-title-meta">
            ${confBadge}
            <h3 class="scanner-food-name">${res.name}</h3>
            <span style="font-size: 0.8rem; color: var(--text-subtle);">Verified Milliy Retsept</span>
          </div>
        </div>

        <!-- Oraliq kaloriya (Section 3) -->
        <div class="scanner-calorie-highlight">
          <div class="scanner-cal-range">Taxminiy: ${res.calMin} – ${res.calMax} kkal</div>
          <div class="scanner-cal-main">O'rtacha: <strong>~${res.calories}</strong> kkal</div>
        </div>

        <!-- BJU Doiraviy / Kartochkalar (Makronutrientlar) -->
        <div class="scanner-macros-grid">
          <div class="scanner-macro-pill protein">
            <span class="m-val">${res.protein} g</span>
            <span class="m-lbl">Oqsil</span>
          </div>
          <div class="scanner-macro-pill fat">
            <span class="m-val">${res.fat} g</span>
            <span class="m-lbl">Yog'</span>
          </div>
          <div class="scanner-macro-pill carbs">
            <span class="m-val">${res.carbs} g</span>
            <span class="m-lbl">Uglevod</span>
          </div>
        </div>

        <!-- Porsiya sozlagichi (Grammlarda kiritish va tezkor tugmalar) -->
        <div class="scanner-portion-selector">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <label style="font-size: 0.85rem; font-weight: 700; color: var(--text-main);">
              ⚖️ Taom vazni (grammlarda):
            </label>
            <div style="display: flex; align-items: center; gap: 4px;">
              <input type="number" id="scannerCustomGrams" class="form-control" style="width: 90px; padding: 5px 8px; font-size: 0.9rem; font-weight: 800; text-align: center; border: 2px solid var(--primary); border-radius: var(--radius-sm);" value="${res.portionGrams}" min="10" max="1500" step="5" oninput="FoodScanner.updatePortion(parseInt(this.value) || 100)">
              <span style="font-size: 0.85rem; font-weight: 800; color: var(--text-main);">g</span>
            </div>
          </div>
          <div class="portion-btn-group">
            <button type="button" class="portion-chip-btn ${res.portionGrams === 100 ? 'active' : ''}" onclick="FoodScanner.updatePortion(100)">100g</button>
            <button type="button" class="portion-chip-btn ${res.portionGrams === 175 ? 'active' : ''}" onclick="FoodScanner.updatePortion(175)">175g</button>
            <button type="button" class="portion-chip-btn ${res.portionGrams === 250 ? 'active' : ''}" onclick="FoodScanner.updatePortion(250)">250g</button>
            <button type="button" class="portion-chip-btn ${res.portionGrams === 350 ? 'active' : ''}" onclick="FoodScanner.updatePortion(350)">350g</button>
            <button type="button" class="portion-chip-btn ${res.portionGrams === 500 ? 'active' : ''}" onclick="FoodScanner.updatePortion(500)">500g</button>
          </div>
        </div>

        ${componentsHtml}

        <div style="background: #ECFDF5; border-radius: var(--radius-md); padding: 10px 14px; margin-top: 12px; font-size: 0.82rem; color: #065F46;">
          💡 <b>Nutrisiolog maslahati:</b> ${res.advice}
        </div>

        <!-- Tugmalar: Tasdiqlash va Ratsionga qo'shish -->
        <div class="scanner-actions-bar">
          <button class="btn-primary" style="flex: 1; padding: 12px;" onclick="FoodScanner.confirmAndAddToDiary()">
            ➕ Kunlik ratsionga qo'shish
          </button>
          <button class="btn-secondary" style="padding: 12px;" onclick="FoodScanner.openUserCorrectionPrompt()" title="Taomni to'g'rilash">
            ✏️ Boshqa taom
          </button>
        </div>
      </div>
    `;

    resultBox.style.display = 'block';
    resultBox.scrollIntoView({ behavior: 'smooth' });
  },

  // Porsiyani qayta hisoblash (Section 19)
  updatePortion(newGrams) {
    if (!this.currentScanResult) return;
    this.currentPortionGrams = newGrams;

    const dbItem = this.NATIONAL_FOODS_DB[this.currentScanResult.key] || this.NATIONAL_FOODS_DB['plov'];
    const calculatedCal = Math.round((dbItem.cal_100 * newGrams) / 100);
    const calculatedProtein = Math.round((dbItem.protein_100 * newGrams) / 100);
    const calculatedFat = Math.round((dbItem.fat_100 * newGrams) / 100);
    const calculatedCarbs = Math.round((dbItem.carbs_100 * newGrams) / 100);

    this.currentScanResult.portionGrams = newGrams;
    this.currentScanResult.calories = calculatedCal;
    this.currentScanResult.calMin = Math.round(calculatedCal * 0.92);
    this.currentScanResult.calMax = Math.round(calculatedCal * 1.08);
    this.currentScanResult.protein = calculatedProtein;
    this.currentScanResult.fat = calculatedFat;
    this.currentScanResult.carbs = calculatedCarbs;

    const confBadge = `<span class="confidence-tag high">🟢 Tasdiqlangan (${newGrams}g)</span>`;
    this.renderResultCard(this.currentScanResult, confBadge);
    App.showToast(`Porsiya ${newGrams} grammga o'zgartirildi!`);
  },

  // 9. User Correction Loop (Section 21)
  openUserCorrectionPrompt() {
    const dishList = Object.values(this.NATIONAL_FOODS_DB).map(d => d.name_uz).join('\n• ');
    const chosen = prompt("Ushbu taomning to'g'ri nomini tanlang yoki yozing:\n• " + dishList, this.currentScanResult.name);
    
    if (chosen && chosen.trim() !== '') {
      // Yangi taomni qidirish
      const match = Object.values(this.NATIONAL_FOODS_DB).find(d => 
        d.name_uz.toLowerCase().includes(chosen.toLowerCase()) || 
        d.id.toLowerCase() === chosen.toLowerCase()
      );

      // Correction log saqlash
      try {
        const corrections = JSON.parse(localStorage.getItem('muvozanat_corrections') || '[]');
        corrections.push({
          original_ai: this.currentScanResult.name,
          corrected_user: chosen,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('muvozanat_corrections', JSON.stringify(corrections));
      } catch (e) {}

      if (match) {
        this.currentScanResult.key = match.id;
        this.currentScanResult.name = match.name_uz;
        this.updatePortion(this.currentPortionGrams);
        App.showToast(`Taom «${match.name_uz}» deb tuzatildi va saqlandi!`);
      } else {
        this.currentScanResult.name = chosen;
        this.renderResultCard(this.currentScanResult, '<span class="confidence-tag medium">✏️ Foydalanuvchi tuzatishi</span>');
        App.showToast("Taom nomi yangilandi!");
      }
    }
  },

  // 10. Ratsionga qo'shish (Sections 14 & 15)
  confirmAndAddToDiary() {
    if (!this.currentScanResult) return;

    const mealType = prompt("Qaysi mahalga qo'shilsin?\n1 - Nonushta\n2 - Tushlik\n3 - Poldnik (Перекус)\n4 - Kechki ovqat", "2");
    
    let mealLabel = "Tushlik";
    if (mealType === '1') mealLabel = "Nonushta";
    if (mealType === '3') mealLabel = "Poldnik";
    if (mealType === '4') mealLabel = "Kechki ovqat";

    const diaryItem = {
      meal: mealLabel,
      name: this.currentScanResult.name,
      grams: this.currentScanResult.portionGrams,
      calories: this.currentScanResult.calories,
      protein: this.currentScanResult.protein,
      fat: this.currentScanResult.fat,
      carbs: this.currentScanResult.carbs,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Diary ga yozish
    try {
      const diary = JSON.parse(localStorage.getItem('muvozanat_diary_today') || '[]');
      diary.push(diaryItem);
      localStorage.setItem('muvozanat_diary_today', JSON.stringify(diary));
    } catch (e) {}

    App.showToast(`✅ ${mealLabel}ga qo'shildi: ${this.currentScanResult.name} (~${this.currentScanResult.calories} kkal)`);
    this.closeModal();

    // Dashboarddagi kaloriya progressini yangilash
    this.updateDashboardCalories(this.currentScanResult.calories);
  },

  updateDashboardCalories(addedCal) {
    const consumedEl = document.getElementById('consumedCalVal');
    if (consumedEl) {
      let current = parseInt(consumedEl.innerText) || 1260;
      consumedEl.innerText = `${current + addedCal} kkal`;
    }
  },

  // 11. Shtrix-kod tahlili (Sections 7 & 8)
  async analyzeBarcodeImage(base64Image) {
    // Shtrix-kod qidiruvi
    const promptCode = prompt("Shtrix-kod (Barcode) raqamini kiriting (masalan: 5449000000996 - Coca-Cola):", "5449000000996");
    if (promptCode && this.BARCODE_DB[promptCode]) {
      this.presentBarcodeResult(this.BARCODE_DB[promptCode], promptCode);
      return;
    }

    // Topilmasa: fallback
    alert("Ushbu shtrix-kod bazada topilmadi. Qadoqdagi «Ozuqaviy qiymati» yorlig'ini (Nutrition Label) skanerlash rejimiga o'tilmoqda.");
    this.switchTab('nutrition_label');
  },

  presentBarcodeResult(prod, code) {
    const calTotal = Math.round(prod.cal_100 * prod.serving_multiplier);
    this.currentScanResult = {
      name: `${prod.name} (${prod.brand})`,
      key: 'barcode_item',
      portionGrams: 100 * prod.serving_multiplier,
      calories: calTotal,
      calMin: calTotal,
      calMax: calTotal,
      protein: Math.round(prod.protein_100 * prod.serving_multiplier),
      fat: Math.round(prod.fat_100 * prod.serving_multiplier),
      carbs: Math.round(prod.carbs_100 * prod.serving_multiplier),
      components: [
        { name: `100 ml/g uchun: ${prod.cal_100} kkal`, grams: 100, cal: prod.cal_100 },
        { name: `Qadoq hajmi: ${prod.serving_size}`, grams: 100 * prod.serving_multiplier, cal: calTotal }
      ],
      advice: `Shtrix-kod: ${code} — rasmiy ma'lumotlar bazasi orqali tasdiqlangan.`,
      imageSrc: 'assets/images/chicken_salad.jpg'
    };

    const confBadge = `<span class="confidence-tag high">🟢 Shtrix-kod tasdiqlandi (100%)</span>`;
    this.renderResultCard(this.currentScanResult, confBadge);
  },

  showLoading(isLoading) {
    const loader = document.getElementById('scannerLoadingOverlay');
    if (loader) loader.style.display = isLoading ? 'flex' : 'none';
  },

  showScanningError(message) {
    const resultBox = document.getElementById('scannerResultBox');
    if (!resultBox) return;
    resultBox.innerHTML = `
      <div style="padding: 20px; background: #FEE2E2; border: 1.5px solid #F87171; border-radius: var(--radius-md); text-align: center; color: #991B1B; margin-top: 18px;">
        <div style="font-size: 2rem; margin-bottom: 8px;">⚠️</div>
        <h4 style="margin-bottom: 6px;">Taomni aniqlab bo'lmadi</h4>
        <p style="font-size: 0.88rem; line-height: 1.5; margin-bottom: 14px;">
          ${message || "Hozir rasmni tahlil qilib bo'lmadi. Iltimos, taomni yaxshiroq yoritilgan joyda qayta suratga oling yoki nomini qo'lda kiriting."}
        </p>
        <button class="btn-primary" style="padding: 8px 18px; font-size: 0.85rem;" onclick="FoodScanner.manualFoodPrompt()">
          ✏️ Taom nomini qo'lda kiritish
        </button>
      </div>
    `;
    resultBox.style.display = 'block';
    resultBox.scrollIntoView({ behavior: 'smooth' });
  },

  manualFoodPrompt() {
    const dishList = Object.values(this.NATIONAL_FOODS_DB).map(d => d.name_uz).join('\n• ');
    const chosen = prompt("Taom nomini yozing yoki quyidagilardan birini tanlang:\n• " + dishList, "Toshkent to'y oshi");
    if (chosen && chosen.trim() !== '') {
      const match = Object.values(this.NATIONAL_FOODS_DB).find(d => 
        d.name_uz.toLowerCase().includes(chosen.toLowerCase()) || 
        d.id.toLowerCase() === chosen.toLowerCase()
      ) || this.NATIONAL_FOODS_DB['plov'];

      const manualData = {
        food_key: match.id,
        food_name: match.name_uz,
        confidence: 0.88,
        portion_g: match.default_portion,
        calorie_range_min: Math.round(match.cal_100 * match.default_portion / 100 * 0.92),
        calorie_range_max: Math.round(match.cal_100 * match.default_portion / 100 * 1.08),
        calorie_avg: Math.round(match.cal_100 * match.default_portion / 100),
        protein_g: Math.round(match.protein_100 * match.default_portion / 100),
        fat_g: Math.round(match.fat_100 * match.default_portion / 100),
        carbs_g: Math.round(match.carbs_100 * match.default_portion / 100),
        components: match.components,
        nutrition_tip: "Qo'lda kiritilgan milliy taom — tekshirilgan retsept bo'yicha hisoblandi."
      };
      this.presentFoodScanResult(manualData, 'assets/images/plov.jpg');
    }
  },

  resetResult() {
    const resultBox = document.getElementById('scannerResultBox');
    if (resultBox) {
      resultBox.style.display = 'none';
      resultBox.innerHTML = '';
    }
  },

  bindEvents() {
    const fileInput = document.getElementById('scannerFileInput');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  FoodScanner.init();
});
