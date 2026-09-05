/**
 * «AI-Nutrisiolog» (Sun'iy intellekt chatboti) Moduli
 * 
 * Qat'iy Guardrails (Mavzu cheklovi):
 * Faqat to'g'ri ovqatlanish, vazn yo'qotish, kaloriya va milliy taomlar bo'yicha maslahat beradi.
 * Siyosat, din, dasturlash va boshqa mavzulardagi so'rovlarni 0-millisekundda rad etadi.
 */

const AINutritionist = {
  // Standart qolip rad javobi (Section 2.2)
  STANDARD_REFUSAL: "Kechirasiz, men faqat to'g'ri ovqatlanish, vazn yo'qotish va parhez masalalarida yordam bera olaman.",

  // Guardrails: Mavzudan tashqari taqiqlangan mavzular va Prompt Injection qoliplari
  OFF_TOPIC_PATTERNS: [
    // Prompt injection & jailbreak
    /ignore\s+(previous|all)\s+instructions/i,
    /system\s+prompt/i,
    /act\s+as\s+(a|an)?/i,
    /dan\s+mode/i,
    /jailbreak/i,
    /barcha\s+qoidalarni\s+(unut|bekor)/i,
    /tizim\s+ko'rsatmasini\s+ko'rsat/i,

    // Dasturlash va IT
    /\b(python|javascript|html|css|php|java|c\+\+|sql|database|frontend|backend|api|kod|skript|dasturlash|algoritm|bug|linux|github)\b/i,
    /\b(функция|массив|база\s*данных|программирован|скрипт|код)\b/i,

    // Siyosat va davlat
    /\b(siyosat|prezident|hukumat|vazir|deputat|saylov|urush|harbiy|armiya|putin|bayden|tramp|zelenskiy|rossiya|ukraina|nato|parlament)\b/i,
    /\b(политик|президент|правительств|выборы|война|армия|санкции)\b/i,

    // Din va e'tiqod bahslari (parhezga doir bo'lmagan)
    /\b(mazhab|masjid|cherkov|namoz\s+vaqti|hadis\s+sanadi|xristian|buddizm|ateizm|dinlar\s+tarixi)\b/i,

    // Umumiy mavzular: avtomobil, kino, ob-havo, fizika, matematika
    /\b(avtomobil|mashina\s+narxi|bmw|mercedes|gentra|kino|serial|aktrisa|futbol|messi|ronaldo|valyuta\s+kursi|dollar\s+kursi|kriptovalyuta|bitcoin)\b/i
  ],

  // Parhez va sog'lom ovqatlanishga oid ruxsat etilgan kalit so'zlar (Lotin va Kirill)
  NUTRITION_KEYWORDS: [
    'osh', 'palov', 'manti', 'somsa', 'shurva', 'sho\'rva', 'dimlama', 'mastava', 'shashlik', 'beshbarmak', 'qazi',
    'kaloriya', 'vazn', 'ozish', 'semirish', 'parhez', 'diet', 'dieta', 'oqsil', 'uglevod', 'yog\'', 'vitamin',
    'non', 'shakar', 'tuz', 'suv', 'choy', 'nonushta', 'tushlik', 'kechki', 'ovqat', 'taom', 'ochlik', 'ishtaha',
    'metabolizm', 'bmr', 'tdee', 'bmi', 'mifflin', 'sabzavot', 'meva', 'go\'sht', 'tovuq', 'baliq', 'tuxum', 'qatiq',
    'salat', 'achchiq-chuchuk', 'chuchvara', 'qorin', 'bel', 'yog\'larni', 'sport', 'mashq', 'qadam', 'porsiya',
    'kilo', 'kg', 'qancha', 'nima', 'yeyish', 'mumkin', 'mumkinmi', 'retsept', 'ratsion', 'menyu',
    // Kirillcha kalit so'zlar:
    'ош', 'палов', 'манти', 'сомса', 'шўрва', 'шурва', 'димлама', 'мастава', 'шашлик', 'бешбармоқ', 'қази',
    'калория', 'калори', 'вазн', 'озиш', 'семириш', 'парҳез', 'диет', 'диета', 'оқсил', 'углевод', 'ёғ', 'витамин',
    'нон', 'шакар', 'туз', 'сув', 'чой', 'нонушта', 'тушлик', 'кечки', 'овқат', 'таом', 'очлик', 'иштаҳа',
    'метаболизм', 'сабзавот', 'мева', 'гўшт', 'товуқ', 'балиқ', 'тухум', 'қатиқ', 'салат', 'аччиқ-чучук',
    'чучвара', 'қорин', 'бел', 'спорт', 'машқ', 'қадам', 'порция', 'порци', 'кило', 'кг', 'қандай', 'нима',
    'ейиш', 'мумкин', 'мумкинми', 'ёрдам', 'маслаҳат', 'меню', 'рацион', 'нутрициолог', 'шифокор',
    // Ruscha
    'похуде', 'белок', 'жир', 'вода', 'вес'
  ],

  isOpen: false,
  isTyping: false,
  dailyLimit: 10,

  init() {
    this.bindEvents();
    this.renderChatHistory();
    this.updateQueriesBadge();
  },

  // 1. Guardrail tekshiruvi: So'rov parhez mavzusidami?
  isAllowedTopic(query) {
    const cleanText = query.trim().toLowerCase();

    // 1-bosqich: Taqiqlangan mavzular yoki Injection bormi?
    for (const pattern of this.OFF_TOPIC_PATTERNS) {
      if (pattern.test(cleanText)) {
        return false;
      }
    }

    // 2-bosqich: Parhez va ovqatlanishga doir kalit so'zlardan kamida bittasi bormi?
    const hasNutritionTerm = this.NUTRITION_KEYWORDS.some(kw => cleanText.includes(kw));

    // Umumiy salomlashishlar ruxsat etiladi (Lotin, Kirill, Ruscha)
    const greetings = [
      'salom', 'assalomu alaykum', 'qalesiz', 'qalaysiz', 'rahmat', 'yordam',
      'салом', 'ассалому алайкум', 'қалайсиз', 'раҳмат', 'ёрдам', 'доктор',
      'privet', 'zdravstvuyte', 'привет', 'здравствуйте'
    ];
    const isGreeting = greetings.some(g => cleanText.includes(g));

    return hasNutritionTerm || isGreeting;
  },

  // 2. Foydalanuvchi kontekstini yig'ish (Section 2.3)
  getUserContext() {
    const user = App?.state?.user || {};
    const weekPlan = App?.state?.weekPlan || {};
    const activeDay = App?.state?.activeDay || 'dush';
    const dayPlan = weekPlan[activeDay] || {};

    const currentWeight = user.currentWeight || 93.8;
    const targetWeight = user.targetWeight || 82.0;
    const height = user.height || 178;
    const age = user.age || 38;
    const gender = user.gender === 'female' ? 'Ayol' : 'Erkak';
    
    // BMI
    const hM = height / 100;
    const bmi = (currentWeight / (hM * hM)).toFixed(1);

    // Bugungi taomnoma
    const foods = App?.state?.foods || [];
    const getDishName = (id) => foods.find(f => f.id === id)?.name?.['uz-Latn'] || id;

    const breakfast = getDishName(dayPlan.breakfast);
    const lunch = getDishName(dayPlan.lunch);
    const snack = getDishName(dayPlan.snack);
    const dinner = getDishName(dayPlan.dinner);

    return {
      name: user.name || 'Ayubxon',
      gender,
      age,
      height: `${height} sm`,
      currentWeight: `${currentWeight} kg`,
      targetWeight: `${targetWeight} kg (Qoldi: ${(currentWeight - targetWeight).toFixed(1)} kg)`,
      bmi: `${bmi} (Ortiqcha vazn ориентири)`,
      calorieTarget: '1,850 kkal/kun (xavfsiz -450 kkal defitsit)',
      todayMenu: {
        breakfast: `${breakfast} (~290 kkal)`,
        lunch: `${lunch} (~580 kkal)`,
        snack: `${snack} (~240 kkal)`,
        dinner: `${dinner} (~280 kkal)`
      }
    };
  },

  // 3. Rate limiting (Section 4)
  getRemainingQueries() {
    const isPremium = localStorage.getItem('muvozanat_premium_reg') !== null;
    if (isPremium) return 999; // Cheksiz

    const todayStr = new Date().toISOString().split('T')[0];
    const storedData = JSON.parse(localStorage.getItem('muvozanat_ai_usage') || '{}');
    
    if (storedData.date !== todayStr) {
      storedData.date = todayStr;
      storedData.count = 0;
      localStorage.setItem('muvozanat_ai_usage', JSON.stringify(storedData));
    }

    return Math.max(0, this.dailyLimit - storedData.count);
  },

  incrementUsage() {
    const isPremium = localStorage.getItem('muvozanat_premium_reg') !== null;
    if (isPremium) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const storedData = JSON.parse(localStorage.getItem('muvozanat_ai_usage') || '{}');
    
    if (storedData.date !== todayStr) {
      storedData.date = todayStr;
      storedData.count = 1;
    } else {
      storedData.count = (storedData.count || 0) + 1;
    }

    localStorage.setItem('muvozanat_ai_usage', JSON.stringify(storedData));
    this.updateQueriesBadge();
  },

  updateQueriesBadge() {
    const badge = document.getElementById('aiQueriesBadge');
    if (!badge) return;

    const isPremium = localStorage.getItem('muvozanat_premium_reg') !== null;
    if (isPremium) {
      badge.innerHTML = '👑 Premium: Cheksiz';
      badge.style.background = '#FEF3C7';
      badge.style.color = '#92400E';
    } else {
      const remaining = this.getRemainingQueries();
      badge.innerHTML = `Savollar: ${remaining}/${this.dailyLimit}`;
      badge.style.background = remaining > 0 ? '#E0F2FE' : '#FEE2E2';
      badge.style.color = remaining > 0 ? '#0369A1' : '#B91C1C';
    }
  },

  // OpenAI API Kaliti (localStorage yoki sozlamalardan olinadi)
  DEFAULT_OPENAI_KEY: localStorage.getItem('muvozanat_ai_api_key') || "",

  // 4. Javob generatsiya qilish dvigateli (Local Expert + API Support)
  async generateResponse(userMessage) {
    // 1-bosqich: Guardrails tekshiruvi
    if (!this.isAllowedTopic(userMessage)) {
      return this.STANDARD_REFUSAL;
    }

    // 2-bosqich: Rate limit tekshiruvi
    if (this.getRemainingQueries() <= 0) {
      return "⚠️ Bugungi bepul savollar limitingiz (10/10) tugadi. Cheksiz suhbat uchun '👑 Premium' tugmasini bosing!";
    }

    // Kontekst
    const ctx = this.getUserContext();
    const apiKey = localStorage.getItem('muvozanat_ai_api_key') || (window.MUVOZANAT_CONFIG && window.MUVOZANAT_CONFIG.OPENAI_API_KEY) || this.DEFAULT_OPENAI_KEY;
    
    // Provayderni kalit formatiga qarab aniqlash (sk- bilan boshlansa doim OpenAI)
    let apiProvider = localStorage.getItem('muvozanat_ai_provider') || 'openai';
    if (apiKey && apiKey.startsWith('sk-')) {
      apiProvider = 'openai';
    } else if (apiKey && apiKey.startsWith('AIza')) {
      apiProvider = 'gemini';
    }

    // OpenAI yoki Gemini API chaqiruvi
    if (apiKey) {
      try {
        const response = await this.callExternalLLM(userMessage, ctx, apiKey, apiProvider);
        if (response && response.trim().length > 0) {
          this.incrementUsage();
          return response;
        }
      } catch (e) {
        console.warn("Tashqi LLM chaqiruvida xatolik, ichki bilimlardan foydalaniladi:", e);
      }
    }

    // 3-bosqich: Smart Local Expert Nutritionist Engine (Fallback)
    this.incrementUsage();
    return this.generateSmartLocalAnswer(userMessage, ctx);
  },

  // Mahalliy yuqori aniqlikdagi O'zbek tili nutrisiologiya bilimlari bazasi
  generateSmartLocalAnswer(msg, ctx) {
    const lower = msg.toLowerCase();

    if (lower.includes('salom') || lower.includes('assalomu') || lower.includes('салом') || lower.includes('ассалому')) {
      return `Assalomu alaykum, ${ctx.name}! Men sizning shaxsiy AI-Nutrisiologingizman. Bugun sizga qaysi taom yoki vazn nazorati bo'yicha yordam beray?`;
    }

    if (lower.includes('palov') || lower.includes('osh') || lower.includes('палов') || lower.includes('ош')) {
      return `🍚 <b>Toshkent to'y oshi tahlili:</b>\n` +
             `• Standart porsiya (250g): ~580 kkal (Oqsil: 22g, Yog': 26g, Uglevod: 64g).\n` +
             `• <b>Nutrisiolog maslahati:</b> Ozingizni oshdan cheklamang! Osh yeyayotganda laganning yog'sizroq qismini tanlang, unga katta likopchada <b>Achchiq-chuchuk salat</b> qo'shing va bir piyola issiq ko'k choy iching. Agar tushlikda osh yesangiz, kechki ovqatni tovuq filesi va sabzavotli salatga (280 kkal) almashtirish kifoya!`;
    }

    if (lower.includes('tushlik') || lower.includes('nima yesam') || lower.includes('reja') || lower.includes('тушлик') || lower.includes('нима есам')) {
      return `🥗 <b>Sizning bugungi menyuingiz bo'yicha tavsiya:</b>\n` +
             `• Rejangizdagi tushlik: <b>${ctx.todayMenu.lunch}</b>.\n` +
             `• Hozirgi vazningiz ${ctx.currentWeight} va maqsadingiz ${ctx.targetWeight}.\n` +
             `• Ushbu tushlik sizning kunlik ${ctx.calorieTarget} me'yoringizga to'liq muvofiq keladi. Yoniga ko'katlar va yangi sabzavotlar qo'shishingizni tavsiya qilaman!`;
    }

    if (lower.includes('ochlik') || lower.includes('och qoldim') || lower.includes('ishtaha') || lower.includes('очлик') || lower.includes('иштаҳа')) {
      return `⚡ <b>Ochlik hissini yengish bo'yicha 3 ta ilmiy usul:</b>\n` +
             `1. <b>Katta stakan iliq suv:</b> Ko'pincha miya suvsizlanishni ochlik bilan adashtiradi. 250-300 ml suv ichib, 10 daqiqa kuting.\n` +
             `2. <b>Kletchatka va oqsil:</b> 1 dona qaynatilgan tuxum oqi yoki yangi bodring iste'mol qiling — bu oshqozonni to'ldiradi va yog' hosil qilmaydi.\n` +
             `3. <b>Ko'k choy:</b> Issiq ko'k choy ishtahani tabiiy ravishda pasaytiradi.`;
    }

    if (lower.includes('kechki') || lower.includes('kechasi') || lower.includes('20:00') || lower.includes('кечки') || lower.includes('кечаси')) {
      return `🌙 <b>Kechki ovqat qoidalari:</b>\n` +
             `• Rejangizdagi kechki taom: <b>${ctx.todayMenu.dinner}</b> (juda to'g'ri tanlov, yengil va oqsilli).\n` +
             `• Kechki 20:00 dan keyin qorin ochsa: 1 stakan yog'siz qatiq yoki 1 dona bodring yeyish mumkin. Qattiq och uxlash stress gormonlarini oshirib, ertasi kuni ortiqcha yeb qo'yishga sabab bo'ladi.`;
    }

    if (lower.includes('to\'y') || lower.includes('mehmon') || lower.includes('restoran') || lower.includes('тўй') || lower.includes('меҳмон')) {
      return `🍗 <b>To'y va mehmondorchilikda ortiqcha vazn olmaslik siri:</b>\n` +
             `1. Mehmonga borishdan oldin och qolmaslik uchun uyda 1 stakan suv va olma yeb oling.\n` +
             `2. Gazli shirin ichimliklar (kola, fanta, sharbat) o'rniga faqat gazsiz suv yoki ko'k choy iching.\n` +
             `3. Dasturxondagi salatlardan mayonezsiz, yangi pomidor-bodringli Achchiq-chuchukni tanlang.\n` +
             `4. Go'sht va oshni me'yorda (taxminan bir kaft hajmida) yeng va nonni kamaytiring.`;
    }

    if (lower.includes('manti') || lower.includes('somsa') || lower.includes('shashlik') || lower.includes('манти') || lower.includes('сомса') || lower.includes('шашлик')) {
      return `🥟 <b>Milliy taomlar balansi:</b>\n` +
             `• Bug'da pishirilgan manti (3 dona ~380 kkal) yoki tandir somsa (1 dona ~340 kkal) xavfsiz ratsionga sig'adi.\n` +
             `• Muhim jihat: qovurilgan emas, bug'da yoki tandirda pishganini tanlang va mayonez o'rniga qatiq yoki suzma bilan iste'mol qiling!`;
    }

    // Default science-backed response
    return `💡 <b>Nutrisiolog xulosasi:</b>\n` +
           `Sizning hozirgi ko'rsatkichlaringiz (${ctx.currentWeight}, BMI ${ctx.bmi}) asosida maqsadga erishish uchun kunlik ${ctx.calorieTarget} me'yorida qolishingiz muhim.\n` +
           `Milliy taomlarimiz to'yimli va foydali moddalarga boy. Asosiysi — porsiyani nazorat qilish va kechki taomni yengil tutishdir. Yana qanday savollaringiz bor?`;
  },

  // 5. Tashqi LLM (OpenAI yoki Gemini) chaqiruvi
  async callExternalLLM(prompt, ctx, apiKey, provider) {
    const systemInstruction = 
      `Siz O'zbekistonning eng tajribali, professional oliy toifali nutrisiologi va parhezshunosisiz (Doktor Dilnoza).\n` +
      `Sizning yagona maqsadingiz — foydalanuvchilarga milliy taomlarimizdan (palov, manti, somsa, sho'rva) voz kechmasdan, sog'lom va xavfsiz ozishda yordam berish.\n` +
      `Foydalanuvchi siyosat, din, dasturlash, umumiy tarix yoki parhezga aloqasi bo'lmagan har qanday boshqa mavzuda savol bersa, muloyimlik bilan faqat parhez va ovqatlanish bo'yicha yordam bera olishingizni ayting.\n\n` +
      `Foydalanuvchi ko'rsatkichlari va rejasi:\n` +
      `- Ismi: ${ctx.name}, Jinsi: ${ctx.gender}, Yoshi: ${ctx.age}\n` +
      `- Bo'yi: ${ctx.height}, Hozirgi vazni: ${ctx.currentWeight}, Maqsad: ${ctx.targetWeight}, BMI: ${ctx.bmi}\n` +
      `- Kunlik tavsiya etilgan kaloriya maqsadi: ${ctx.calorieTarget}\n` +
      `- Bugungi milliy menyusi: Nonushta: ${ctx.todayMenu.breakfast}, Tushlik: ${ctx.todayMenu.lunch}, Perecus: ${ctx.todayMenu.snack}, Kechki: ${ctx.todayMenu.dinner}\n\n` +
      `Talablar:\n` +
      `1. Foydalanuvchi savol bergan tilda (O'zbekcha lotin, O'zbekcha kirill yoki Ruscha) javob bering.\n` +
      `2. Javobingiz aniq, do'stona, ilmiy asoslangan va amaliy bo'lsin. Kaloriya, oqsil, yog', uglevodlar va porsiya me'yorlarini aniq keltiring.\n` +
      `3. Formatlash uchun <b>...</b>, <i>...</i>, punktlar (•) va emojilardan chiroyli foydalaning.`;

    if (provider === 'openai') {
      // Oxirgi suhbat kontekstini yig'ish (Multi-turn dialog)
      let recentMessages = [];
      try {
        const history = JSON.parse(localStorage.getItem('muvozanat_ai_history') || '[]');
        recentMessages = history.slice(-6).map(item => ({
          role: item.sender === 'user' ? 'user' : 'assistant',
          content: item.text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
        }));
      } catch (e) {}

      const messagesPayload = [
        { role: 'system', content: systemInstruction },
        ...recentMessages,
        { role: 'user', content: prompt }
      ];

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: messagesPayload,
          temperature: 0.7,
          max_tokens: 650
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        console.error("OpenAI API Xatosi:", res.status, errJson);
        throw new Error(errJson?.error?.message || `OpenAI status: ${res.status}`);
      }

      const data = await res.json();
      const rawText = data?.choices?.[0]?.message?.content;
      if (!rawText) throw new Error("OpenAI bo'sh javob qaytardi");

      // Markdown formatlashni HTML formatlashga o'tkazish
      let formatted = rawText
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
        .replace(/\*(.*?)\*/g, '<i>$1</i>')
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>');

      return formatted;
    } else {
      // Gemini API
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: `${systemInstruction}\n\nFoydalanuvchi savoli: ${prompt}` }] }
          ]
        })
      });
      const data = await res.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text;
    }
  },

  // 6. UI va Xabarlar oqimi
  toggleWidget() {
    const box = document.getElementById('aiChatWidgetBox');
    if (!box) return;

    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      box.classList.add('active');
      const input = document.getElementById('aiChatInput');
      if (input) setTimeout(() => input.focus(), 150);
      this.scrollToBottom();
    } else {
      box.classList.remove('active');
    }
  },

  closeWidget() {
    const box = document.getElementById('aiChatWidgetBox');
    if (box) {
      box.classList.remove('active');
      this.isOpen = false;
    }
  },

  async handleUserSubmit(e) {
    if (e) e.preventDefault();
    if (this.isTyping) return;

    const input = document.getElementById('aiChatInput');
    if (!input) return;

    const text = input.value.trim();
    if (!text) return;

    input.value = '';

    // Foydalanuvchi xabarini chiqarish
    this.appendMessage('user', text);
    this.saveMessage('user', text);

    // Typing animatsiyasini yoqish
    this.showTypingIndicator();

    try {
      // Javobni olish
      const botResponse = await this.generateResponse(text);

      // Typingni o'chirish va javobni typewriter effekti bilan chiqarish
      this.hideTypingIndicator();
      await this.streamBotMessage(botResponse);
      this.saveMessage('bot', botResponse);
    } catch (err) {
      this.hideTypingIndicator();
      this.appendMessage('bot', "Kechirasiz, xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
    }
  },

  sendQuickReply(text) {
    const input = document.getElementById('aiChatInput');
    if (input) {
      input.value = text;
      this.handleUserSubmit();
    }
  },

  appendMessage(sender, htmlText) {
    const messagesEl = document.getElementById('aiChatMessages');
    if (!messagesEl) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `ai-msg-row ${sender === 'user' ? 'user' : 'bot'}`;

    if (sender === 'bot') {
      msgDiv.innerHTML = `
        <div class="ai-avatar-tiny">🥗</div>
        <div class="ai-bubble bot">${htmlText}</div>
      `;
    } else {
      msgDiv.innerHTML = `
        <div class="ai-bubble user">${this.escapeHtml(htmlText)}</div>
      `;
    }

    messagesEl.appendChild(msgDiv);
    this.scrollToBottom();
    return msgDiv;
  },

  // Streaming / Typewriter effekti (Section 4)
  async streamBotMessage(fullHtml) {
    const messagesEl = document.getElementById('aiChatMessages');
    if (!messagesEl) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = 'ai-msg-row bot';
    msgDiv.innerHTML = `
      <div class="ai-avatar-tiny">🥗</div>
      <div class="ai-bubble bot"><span class="stream-content"></span><span class="ai-cursor">▍</span></div>
    `;
    messagesEl.appendChild(msgDiv);

    const streamEl = msgDiv.querySelector('.stream-content');
    const cursorEl = msgDiv.querySelector('.ai-cursor');

    // Tezkor so'zma-so'z yoki bo'lakma-bo'lak chiqarish (< 1.5 sek)
    const words = fullHtml.split(' ');
    let current = '';

    for (let i = 0; i < words.length; i++) {
      current += (i === 0 ? '' : ' ') + words[i];
      streamEl.innerHTML = current;
      this.scrollToBottom();
      await new Promise(r => setTimeout(r, 22)); // 22ms kechikish bilan juda silliq oqim
    }

    if (cursorEl) cursorEl.remove();
    this.scrollToBottom();
  },

  showTypingIndicator() {
    this.isTyping = true;
    const messagesEl = document.getElementById('aiChatMessages');
    if (!messagesEl) return;

    let indicator = document.getElementById('aiTypingRow');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'aiTypingRow';
      indicator.className = 'ai-msg-row bot';
      indicator.innerHTML = `
        <div class="ai-avatar-tiny">🥗</div>
        <div class="ai-bubble bot ai-typing-bubble">
          <span class="ai-dot"></span>
          <span class="ai-dot"></span>
          <span class="ai-dot"></span>
        </div>
      `;
      messagesEl.appendChild(indicator);
    }
    indicator.style.display = 'flex';
    this.scrollToBottom();
  },

  hideTypingIndicator() {
    this.isTyping = false;
    const indicator = document.getElementById('aiTypingRow');
    if (indicator) indicator.remove();
  },

  scrollToBottom() {
    const messagesEl = document.getElementById('aiChatMessages');
    if (messagesEl) {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
  },

  escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  },

  // 7. Chat tarixini saqlash va yuklash
  saveMessage(sender, text) {
    try {
      const history = JSON.parse(localStorage.getItem('muvozanat_ai_history') || '[]');
      history.push({ sender, text, time: new Date().toISOString() });
      // Oxirgi 30 ta xabarni saqlash
      if (history.length > 30) history.shift();
      localStorage.setItem('muvozanat_ai_history', JSON.stringify(history));
    } catch (e) {}
  },

  renderChatHistory() {
    const messagesEl = document.getElementById('aiChatMessages');
    if (!messagesEl) return;

    try {
      const history = JSON.parse(localStorage.getItem('muvozanat_ai_history') || '[]');
      if (history.length > 0) {
        messagesEl.innerHTML = '';
        history.forEach(item => {
          this.appendMessage(item.sender, item.text);
        });
      } else {
        // Boshlang'ich iliq kutib olish xabari
        messagesEl.innerHTML = `
          <div class="ai-msg-row bot">
            <div class="ai-avatar-tiny">🥗</div>
            <div class="ai-bubble bot">
              👋 <b>Assalomu alaykum!</b> Men sizning shaxsiy <b>AI-Nutrisiologingizman</b>.<br><br>
              Milliy taomlar, vazn yo'qotish, kaloriya hisobi va shaxsiy menyuingiz yuzasidan 24/7 savollaringizga javob beraman.<br><br>
              <i>Quyidagi tayyor savollardan birini tanlang yoki savolingizni yozing:</i>
            </div>
          </div>
        `;
      }
    } catch (e) {}
  },

  clearHistory() {
    localStorage.removeItem('muvozanat_ai_history');
    const messagesEl = document.getElementById('aiChatMessages');
    if (messagesEl) {
      this.renderChatHistory();
    }
    if (typeof App !== 'undefined' && App.showToast) {
      App.showToast("Chat tarixi tozalandi");
    }
  },

  bindEvents() {
    const input = document.getElementById('aiChatInput');
    const form = document.getElementById('aiChatForm');

    if (form) {
      form.addEventListener('submit', (e) => this.handleUserSubmit(e));
    }

    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleUserSubmit();
        }
      });
    }
  }
};

// Sahifa to'liq yuklanganda initsializatsiya
document.addEventListener('DOMContentLoaded', () => {
  AINutritionist.init();
});
