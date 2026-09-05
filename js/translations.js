// Multilingual Translations Dictionary
// Supports: O'zbekcha (Lotin), Ўзбекча (Кирилл), Русский

const translations = {
  'uz-Latn': {
    // App Branding & General
    app_name: 'Muvozanat',
    app_tagline: 'Tanangizga va milliy taomingizga mos sog\'lom vazn',
    nav_home: 'Bosh sahifa',
    nav_menu: 'Menyu',
    nav_progress: 'Natijalar',
    nav_recipes: 'Retseptlar',
    nav_shopping: 'Xaridlar',
    nav_profile: 'Profil',
    nav_admin: 'Admin CMS',
    btn_start_free: 'Bepul boshlash',
    btn_how_it_works: 'Qanday ishlaydi?',
    btn_save: 'Saqlash',
    btn_cancel: 'Bekor qilish',
    btn_close: 'Yopish',
    btn_next: 'Keyingisi',
    btn_prev: 'Orqaga',
    btn_finish: 'Rejani boshlash',
    btn_add_weight: 'Vazn kiritish',
    btn_quick_add: '+ Tezkor',
    btn_view_recipe: 'Retsept',
    btn_swap_food: 'Almashtirish',
    btn_small_portion: 'Kichik porsiya',
    btn_normal_portion: 'Oddiy porsiya',
    btn_add_to_menu: 'Menyuga qo\'shish',
    btn_export_data: 'Ma\'lumotlarni yuklab olish (JSON)',
    btn_delete_account: 'Barcha ma\'lumotlarimni o\'chirish',

    // Hero Section
    hero_title: 'O\'z milliy oshxonangizdan voz kechmasdan sog\'lom vaznga erishing',
    hero_subtitle: 'Osh, manti va somsani taqiqlamaymiz! Ilmiy asoslangan raqamli balans, aqlli porsiya va shaxsiy tavsiyalar orqali vazningizni xavfsiz boshqaring.',
    hero_badge_science: 'JMIR & TBM ilmiy tadqiqotlari asosida',
    hero_stat_1_val: '100%',
    hero_stat_1_lbl: 'Milliy taomlarga moslashgan',
    hero_stat_2_val: '-0.5-0.7 kg',
    hero_stat_2_lbl: 'Haftalik xavfsiz sur\'at',
    hero_stat_3_val: '0 taqiq',
    hero_stat_3_lbl: 'Qat\'iy stressli parhezsiz',

    // The 3 Pillars
    pillar_title: 'Nega aynan Muvozanat?',
    pillar_1_title: 'Milliy oshxona integratsiyasi',
    pillar_1_desc: 'O\'zbekiston, Qozog\'iston, Turkiya taomlari ro\'yxati. O\'zbek oshidan voz kechmasdan kaloriyani boshqarasiz.',
    pillar_2_title: 'Smart Menu Adaptation',
    pillar_2_desc: '«Bugun osh yedim» desangiz, tizim sizni jazolamaydi — kechki ovqatni avtomatik ravishda yengilroq qilib muvozanatlaydi.',
    pillar_3_title: '5 soniyalik sodda progress',
    pillar_3_desc: '«Hozir qayerdaman? Maqsadim qayerda? Bugun nima qilishim kerak?» — murakkab jadvallarsiz aniq javob.',

    // 5-Second Dashboard
    dash_greeting: 'Salom, {name}!',
    dash_subgreeting: 'Siz maqsadingizga {percent}% yaqinlashdingiz.',
    dash_current_weight: 'Hozirgi vazn',
    dash_target_weight: 'Maqsad',
    dash_remaining: 'Qoldi',
    dash_progress_bar: 'maqsadga erishildi',
    dash_today_checklist: 'Bugungi nazorat',
    dash_meal_plan: 'Ovqatlanish rejasi',
    dash_water: 'Suv balansi',
    dash_steps: 'Qadamlar / Harakat',
    dash_weight_logged: 'Vazn qayd etildi',

    // BMI & Health Safety
    bmi_label: 'BMI ko\'rsatkichi',
    bmi_neutral_disclaimer: 'Ushbu ko\'rsatkich umumiy orientir hisoblanadi va individual tibbiy baholash o\'rnini bosmaydi.',
    medical_safety_notice: 'Xavfsizlik eslatmasi: Homiladorlik, emizish, juda past BMI yoki og\'ir surunkali kasalliklarda individual reja boshlashdan oldin shifokor yoki malakali diyetolog bilan maslahatlashish tavsiya etiladi.',

    // Meal Plan Section
    meal_plan_title: '7 kunlik milliy menyu',
    meal_plan_subtitle: 'Haftaning har bir kuni uchun muvozanatlangan shaxsiy taomnoma',
    meal_breakfast: 'Nonushta',
    meal_lunch: 'Tushlik',
    meal_snack: 'Poldnik (Перекус)',
    meal_dinner: 'Kechki ovqat',
    macro_kcal: 'kkal',
    macro_protein: 'Oqsil',
    macro_fat: 'Yog\'',
    macro_carbs: 'Uglevod',
    macro_fiber: 'Kletchatka',
    serving: 'Porsiya',

    // Days of week
    day_mon: 'Dushanba',
    day_tue: 'Seshanba',
    day_wed: 'Chorshanba',
    day_thu: 'Payshanba',
    day_fri: 'Juma',
    day_sat: 'Shanba',
    day_sun: 'Yakshanba',

    // Smart Food Replacement
    swap_modal_title: 'Taomni almashtirish',
    swap_modal_desc: 'Bugun nima yeyishni xohlaysiz? Qaysi milliy taomni tanlasangiz ham, tizim qolgan ovqatlarni unga moslab beradi.',
    swap_toast_adapted: 'Siz «{dish}» tanladingiz. Kunlik kaloriyani muvozanatlash uchun kechki ovqat avtomatik ravishda yengilroq variantga moslashtirildi.',
    swap_filter_all: 'Barchasi',
    swap_filter_traditional: 'Milliy / An\'anaviy',
    swap_filter_light: 'Yengil / Parhez',
    swap_filter_quick: 'Tez tayyorlanadigan',

    // Weight Tracker & Chart
    weight_chart_title: 'Vazn dinamikasi va prognoz',
    weight_chart_subtitle: 'Vaqt bo\'yicha o\'zgarish va maqsad traektoriyasi',
    weight_input_label: 'Bugungi vazningizni kiriting (kg):',
    weight_log_success: 'Bugungi vazn muvaffaqiyatli saqlandi!',
    weight_weekly_change: 'Haftalik o\'zgarish',
    weight_monthly_change: 'Oylik o\'zgarish',
    milestone_title: 'Bosqichli maqsad',
    milestone_step_1: '1-bosqich: {from} → {to} kg',
    milestone_remaining: '{target} kg ga yetishingizga atigi {rem} kg qoldi.',

    // Gamification & Nudges
    badge_7_days: '🏆 7 kunlik muntazamlik',
    badge_7_days_desc: 'Bir hafta davomida vazningizni doimiy kuzatdingiz!',
    badge_first_2kg: '🏆 Dastlabki -2 kg marrasi',
    badge_first_2kg_desc: 'Ajoyib natija! Sog\'lom odatlar o\'z samarasini bermoqda.',
    badge_water_streak: '💧 Suv me\'yori ustasi',
    badge_water_streak_desc: 'Kunlik 2 litr toza suv ichish rejasini to\'ldirdingiz.',
    supportive_nudge: 'Bugun rejadagidan biroz ko\'proq ovqatlandingizmi? Hechqisi yo\'q — ertaga odatiy sog\'lom rejimni davom ettirishingiz mumkin!',

    // Onboarding Wizard
    onboard_title: 'Shaxsiy profilingizni sozlang',
    onboard_subtitle: '2 daqiqa ichida o\'zingizga mos ovqatlanish rejasini oling',
    onboard_step1_title: 'Jismoniy parametrlar',
    onboard_step2_title: 'Mamlakat va shahar',
    onboard_step3_title: 'Faollik va turmush tarzi',
    onboard_step4_title: 'Maqsad va taom uslubi',
    onboard_step5_title: 'Sog\'liq va xavfsizlik',
    field_gender: 'Jinsingiz',
    gender_male: 'Erkak',
    gender_female: 'Ayol',
    field_age: 'Yoshingiz',
    field_height: 'Bo\'yingiz (sm)',
    field_current_weight: 'Hozirgi vazningiz (kg)',
    field_target_weight: 'Maqsaddagi vazningiz (kg)',
    field_country: 'Mamlakat',
    country_uz: 'O\'zbekiston',
    country_kz: 'Qozog\'iston',
    country_tr: 'Turkiya',
    country_other: 'Boshqa davlat',
    field_city: 'Shahar',
    field_activity: 'Jismoniy faollik',
    activity_low: 'Kam harakat (asosan o\'tirib ishlash)',
    activity_medium: 'O\'rtacha faollik (haftada 2-3 marta mashg\'ulot)',
    activity_high: 'Yuqori faollik (faol sport / og\'ir mehnat)',
    field_job: 'Ish xarakteri',
    job_office: 'Ofis / Masofaviy',
    job_active: 'Harakatdagi / Jismoniy',
    field_goal: 'Asosiy maqsad',
    goal_lose: 'Vazn tashlash (Ozish)',
    goal_maintain: 'Vaznni saqlash',
    goal_gain: 'Sog\'lom vazn to\'plash',
    field_cuisine_style: 'Afzal ko\'rgan taom uslubi',
    style_traditional: 'An\'anaviy milliy oshxona',
    style_mixed: 'Aralash (Milliy + Yevropa)',
    style_protein: 'Yuqori oqsilli',
    style_quick: 'Tez tayyorlanadigan',
    style_budget: 'Byudjet / Tejamkor',
    style_vegetarian: 'Vegetarian',

    // Shopping List
    shopping_title: '7 kunlik xaridlar ro\'yxati',
    shopping_subtitle: 'Haftalik taomnomangizga mos saralangan mahsulotlar',
    cat_vegetables: 'Sabzavotlar & Ko\'katlar',
    cat_fruits: 'Mevalar',
    cat_meat: 'Go\'sht & Parranda',
    cat_dairy: 'Tuxum & Sut mahsulotlari',
    cat_grains: 'Don, guruch & un mahsulotlari',

    // Admin & Settings
    admin_title: 'Boshqaruv Paneli (Admin CMS)',
    admin_subtitle: 'Taomlar bazasi, retseptlar va Product KPI analitikasi',
    admin_add_dish: '+ Yangi taom qo\'shish',
    kpi_reg_completion: 'Ro\'yxatdan o\'tish (KPI)',
    kpi_onboard_completion: 'Onboarding yakunlash',
    kpi_first_weight: 'Vazn qayd qilish',
    kpi_retention_7: '7 kunlik Retention',
    kpi_crash_free: 'Crash-free seanslar',
    privacy_title: 'Ma\'lumotlar xavfsizligi va Maxfiylik (GDPR)',
    privacy_notice: 'Barcha ma\'lumotlaringiz shifrlangan holda faqat sizning qurilmangizda saqlanadi. Istalgan vaqtda yuklab olishingiz yoki butunlay o\'chirib tashlashingiz mumkin.',

    // Premium & Telegram Bot
    btn_premium: '👑 Premium',
    premium_badge: 'VIP IMKONIYATLAR',
    premium_modal_title: 'Premium a\'zolik va Telegram Bot',
    premium_modal_desc: 'Telegram orqali shaxsiy diyetolog yordamchisi va eksklyuziv milliy taomnomaga ega bo\'ling',
    field_fullname: 'Familiya va Ismingiz',
    placeholder_fullname: 'Masalan: Karimov Sardor',
    field_phone_9digit: 'Telefon raqamingiz (9 xonali)',
    phone_validation_error: 'Telefon raqami aynan 9 ta raqamdan iborat bo\'lishi shart! (Masalan: 90 123 45 67)',
    fullname_validation_error: 'Iltimos, Familiya va Ismingizni to\'liq kiriting!',
    btn_continue_telegram: 'Telegram botga o\'tish 🚀',
    premium_feat_1: '🤖 Telegram bot orqali har kuni shaxsiy taomnoma va eslatmalar',
    premium_feat_2: '🍲 Restoranda yoki to\'yda nima yeyish bo\'yicha tezkor AI maslahat',
    premium_feat_3: '🔄 Cheksiz milliy taomlar almashtirish va retseptlar',
    premium_feat_4: '📉 Haftalik vazn dinamikasi va shaxsiy progress tahlili',
    telegram_redirecting: 'Ma\'lumotlar qabul qilindi! Telegram bot ochilmoqda...'
  },

  'uz-Cyrl': {
    // App Branding & General
    app_name: 'Мувозанат',
    app_tagline: 'Танангизга ва миллий таомингизга мос соғлом вазн',
    nav_home: 'Бош саҳифа',
    nav_menu: 'Меню',
    nav_progress: 'Натижалар',
    nav_recipes: 'Рецептлар',
    nav_shopping: 'Харидлар',
    nav_profile: 'Профиль',
    nav_admin: 'Admin CMS',
    btn_start_free: 'Бепул бошлаш',
    btn_how_it_works: 'Қандай ишлайди?',
    btn_save: 'Сақлаш',
    btn_cancel: 'Бекор қилиш',
    btn_close: 'Ёпиш',
    btn_next: 'Кейингиси',
    btn_prev: 'Орқага',
    btn_finish: 'Режани бошлаш',
    btn_add_weight: 'Вазн киритиш',
    btn_quick_add: '+ Тезкор',
    btn_view_recipe: 'Рецепт',
    btn_swap_food: 'Алмаштириш',
    btn_small_portion: 'Кичик порция',
    btn_normal_portion: 'Оддий порция',
    btn_add_to_menu: 'Менюга қўшиш',
    btn_export_data: 'Маълумотларни юклаб олиш (JSON)',
    btn_delete_account: 'Барча маълумотларимни ўчириш',

    // Hero Section
    hero_title: 'Ўз миллий ошхонангиздан воз кечмасдан соғлом вазнга эришинг',
    hero_subtitle: 'Ош, манти ва сомсани тақиқламаймиз! Илмий асосланган рақамли баланс, ақлли порция ва шахсий тавсиялар орқали вазнингизни хавфсиз бошқаринг.',
    hero_badge_science: 'JMIR ва TBM илмий тадқиқотлари асосида',
    hero_stat_1_val: '100%',
    hero_stat_1_lbl: 'Миллий таомларга мослашган',
    hero_stat_2_val: '-0.5-0.7 кг',
    hero_stat_2_lbl: 'Ҳафталик хавфсиз суръат',
    hero_stat_3_val: '0 тақиқ',
    hero_stat_3_lbl: 'Қатъий стрессли парҳезсиз',

    // The 3 Pillars
    pillar_title: 'Нега айнан Мувозанат?',
    pillar_1_title: 'Миллий ошхона интеграцияси',
    pillar_1_desc: 'Ўзбекистон, Қозоғистон, Туркия таомлари рўйхати. Ўзбек ошидан воз кечмасдан калорияни бошқарасиз.',
    pillar_2_title: 'Smart Menu Adaptation',
    pillar_2_desc: '«Бугун ош едим» десангиз, тизим сизни жазоламайди — кечки овқатни автоматик равишда енгилроқ қилиб мувозанатлайди.',
    pillar_3_title: '5 сониялик содда прогресс',
    pillar_3_desc: '«Ҳозир қаердаман? Мақсадим қаерда? Бугун нима қилишим керак?» — мураккаб жадвалларсиз аниқ жавоб.',

    // 5-Second Dashboard
    dash_greeting: 'Салом, {name}!',
    dash_subgreeting: 'Сиз мақсадингизга {percent}% яқинлашдингиз.',
    dash_current_weight: 'Ҳозирги вазн',
    dash_target_weight: 'Мақсад',
    dash_remaining: 'Қолди',
    dash_progress_bar: 'мақсадга эришилди',
    dash_today_checklist: 'Бугунги назорат',
    dash_meal_plan: 'Овқатланиш режаси',
    dash_water: 'Сув баланси',
    dash_steps: 'Қадамлар / Ҳаракат',
    dash_weight_logged: 'Вазн қайд этилди',

    // BMI & Health Safety
    bmi_label: 'BMI кўрсаткичи',
    bmi_neutral_disclaimer: 'Ушбу кўрсаткич умумий ориентир ҳисобланади ва индивидуал тиббий баҳолаш ўрнини босмайди.',
    medical_safety_notice: 'Хавфсизлик эслатмаси: Ҳомиладорлик, эмизиш, жуда паст BMI ёки оғир сурункали касалликларда индивидуал режа бошлашдан олдин шифокор ёки малакали диетолог билан маслаҳатлашиш тавсия этилади.',

    // Meal Plan Section
    meal_plan_title: '7 кунлик миллий меню',
    meal_plan_subtitle: 'Ҳафтанинг ҳар бир куни учун мувозанатланган шахсий таомнома',
    meal_breakfast: 'Нонушта',
    meal_lunch: 'Тушлик',
    meal_snack: 'Перекус (Полник)',
    meal_dinner: 'Кечки овқат',
    macro_kcal: 'ккал',
    macro_protein: 'Оқсил',
    macro_fat: 'Ёғ',
    macro_carbs: 'Углевод',
    macro_fiber: 'Клетчатка',
    serving: 'Порция',

    // Days of week
    day_mon: 'Душанба',
    day_tue: 'Сешанба',
    day_wed: 'Чоршанба',
    day_thu: 'Пайшанба',
    day_fri: 'Жума',
    day_sat: 'Шанба',
    day_sun: 'Якшанба',

    // Smart Food Replacement
    swap_modal_title: 'Таомни алмаштириш',
    swap_modal_desc: 'Бугун нима ейишни хоҳлайсиз? Қайси миллий таомни танласангиз ҳам, тизим қолган овқатларни унга мослаб беради.',
    swap_toast_adapted: 'Сиз «{dish}» танладингиз. Кунлик калорияни мувозанатлаш учун кечки овқат автоматик равишда енгилроқ вариантга мослаштирилди.',
    swap_filter_all: 'Барчаси',
    swap_filter_traditional: 'Миллий / Анъанавий',
    swap_filter_light: 'Енгил / Парҳез',
    swap_filter_quick: 'Тез тайёрланадиган',

    // Weight Tracker & Chart
    weight_chart_title: 'Вазн динамикаси ва прогноз',
    weight_chart_subtitle: 'Вақт бўйича ўзгариш ва мақсад траекторияси',
    weight_input_label: 'Бугунги вазнингизни киритинг (кг):',
    weight_log_success: 'Бугунги вазн муваффақиятли сақланди!',
    weight_weekly_change: 'Ҳафталик ўзгариш',
    weight_monthly_change: 'Ойлик ўзгариш',
    milestone_title: 'Босқичли мақсад',
    milestone_step_1: '1-босқич: {from} → {to} кг',
    milestone_remaining: '{target} кг га етишингизга атиги {rem} кг қолди.',

    // Gamification & Nudges
    badge_7_days: '🏆 7 кунлик мунтазамлик',
    badge_7_days_desc: 'Бир ҳафта давомида вазнингизни доимий кузатдингиз!',
    badge_first_2kg: '🏆 Дастлабки -2 кг марраси',
    badge_first_2kg_desc: 'Ажойиб натижа! Соғлом одатлар ўз самарасини бермоқда.',
    badge_water_streak: '💧 Сув меъёри устаси',
    badge_water_streak_desc: 'Кунлик 2 литр тоза сув ичиш режасини тўлдирдингиз.',
    supportive_nudge: 'Бугун режадагидан бироз кўпроқ овқатландингизми? Ҳечқиси йўқ — эртага одатий соғлом режимни давом эттиришингиз мумкин!',

    // Onboarding Wizard
    onboard_title: 'Шахсий профилингизни созланг',
    onboard_subtitle: '2 дақиқа ичида ўзингизга мос овқатланиш режасини олинг',
    onboard_step1_title: 'Жисминий параметрлар',
    onboard_step2_title: 'Мамлакат ва шаҳар',
    onboard_step3_title: 'Фаоллик ва турмуш тарзи',
    onboard_step4_title: 'Мақсад ва таом услуби',
    onboard_step5_title: 'Соғлиқ ва хавфсизлик',
    field_gender: 'Жинсингиз',
    gender_male: 'Эркак',
    gender_female: 'Аёл',
    field_age: 'Ёшингиз',
    field_height: 'Бўйингиз (см)',
    field_current_weight: 'Ҳозирги вазнингиз (кг)',
    field_target_weight: 'Мақсаддаги вазнингиз (кг)',
    field_country: 'Мамлакат',
    country_uz: 'Ўзбекистон',
    country_kz: 'Қозоғистон',
    country_tr: 'Туркия',
    country_other: 'Бошқа давлат',
    field_city: 'Шаҳар',
    field_activity: 'Жисминий фаоллик',
    activity_low: 'Кам ҳаракат (асосан ўтириб ишлаш)',
    activity_medium: 'Ўртача фаоллик (ҳафтада 2-3 марта машғулот)',
    activity_high: 'Юқори фаоллик (фаол спорт / оғир меҳнат)',
    field_job: 'Иш характери',
    job_office: 'Офис / Масофавий',
    job_active: 'Ҳаракатдаги / Жисмоний',
    field_goal: 'Асосий мақсад',
    goal_lose: 'Вазн ташлаш (Озиш)',
    goal_maintain: 'Вазнни сақлаш',
    goal_gain: 'Соғлом вазн тўплаш',
    field_cuisine_style: 'Афзал кўрган таом услуби',
    style_traditional: 'Анъанавий миллий ошхона',
    style_mixed: 'Аралаш (Миллий + Европа)',
    style_protein: 'Юқори оқсилли',
    style_quick: 'Тез тайёрланадиган',
    style_budget: 'Бюджет / Тежамкор',
    style_vegetarian: 'Вегетариан',

    // Shopping List
    shopping_title: '7 кунлик харидлар рўйхати',
    shopping_subtitle: 'Ҳафталик таомномангизга мос сараланган маҳсулотлар',
    cat_vegetables: 'Сабзавотлар & Кўкатлар',
    cat_fruits: 'Мевалар',
    cat_meat: 'Гўшт & Парранда',
    cat_dairy: 'Тухум & Сут маҳсулотлари',
    cat_grains: 'Дон, гуруч & ун маҳсулотлари',

    // Admin & Settings
    admin_title: 'Бошқарув Панели (Admin CMS)',
    admin_subtitle: 'Таомлар базаси, рецептлар ва Product KPI аналитикаси',
    admin_add_dish: '+ Янги таом қўшиш',
    kpi_reg_completion: 'Рўйхатдан ўтиш (KPI)',
    kpi_onboard_completion: 'Onboarding якунлаш',
    kpi_first_weight: 'Вазн қайд қилиш',
    kpi_retention_7: '7 кунлик Retention',
    kpi_crash_free: 'Crash-free сеанслар',
    privacy_title: 'Маълумотлар хавфсизлиги ва Махфийлик (GDPR)',
    privacy_notice: 'Барча маълумотларингиз шифрланган ҳолда фақат сизнинг қурилмангизда сақланади. Исталган вақтда юклаб олишингиз ёки бутунлай ўчириб ташлашингиз мумкин.',

    // Premium & Telegram Bot
    btn_premium: '👑 Premium',
    premium_badge: 'VIP ИМКОНИЯТЛАР',
    premium_modal_title: 'Premium аъзолик ва Telegram Бот',
    premium_modal_desc: 'Telegram орқали шахсий диетолог ёрдамчиси ва эксклюзив миллий таомномага эга бўлинг',
    field_fullname: 'Фамилия ва Исмингиз',
    placeholder_fullname: 'Масалан: Каримов Сардор',
    field_phone_9digit: 'Телефон рақамингиз (9 хонали)',
    phone_validation_error: 'Телефон рақами айнан 9 та рақамдан иборат бўлиши шарт! (Масалан: 90 123 45 67)',
    fullname_validation_error: 'Илтимос, Фамилия ва Исмингизни тўлиқ киритинг!',
    btn_continue_telegram: 'Telegram ботга ўтиш 🚀',
    premium_feat_1: '🤖 Telegram бот орқали ҳар куни шахсий таомнома ва эслатмалар',
    premium_feat_2: '🍲 Ресторанда ёки тўйда нима ейиш бўйича тезкор AI маслаҳат',
    premium_feat_3: '🔄 Чексиз миллий таомлар алмаштириш ва рецептлар',
    premium_feat_4: '📉 Ҳафталик вазн динамикаси ва шахсий прогресс таҳлили',
    telegram_redirecting: 'Маълумотлар қабул қилинди! Telegram бот очилмоқда...'
  },

  'ru': {
    // App Branding & General
    app_name: 'Мувозанат',
    app_tagline: 'Здоровый вес без отказа от любимой национальной кухни',
    nav_home: 'Главная',
    nav_menu: 'Меню',
    nav_progress: 'Результаты',
    nav_recipes: 'Рецепты',
    nav_shopping: 'Покупки',
    nav_profile: 'Профиль',
    nav_admin: 'Admin CMS',
    btn_start_free: 'Начать бесплатно',
    btn_how_it_works: 'Как это работает?',
    btn_save: 'Сохранить',
    btn_cancel: 'Отмена',
    btn_close: 'Закрыть',
    btn_next: 'Далее',
    btn_prev: 'Назад',
    btn_finish: 'Запустить план',
    btn_add_weight: 'Записать вес',
    btn_quick_add: '+ Быстрое действие',
    btn_view_recipe: 'Рецепт',
    btn_swap_food: 'Заменить блюдо',
    btn_small_portion: 'Меньшая порция',
    btn_normal_portion: 'Обычная порция',
    btn_add_to_menu: 'Добавить в меню',
    btn_export_data: 'Скачать данные (JSON)',
    btn_delete_account: 'Удалить все мои данные',

    // Hero Section
    hero_title: 'Достигайте здорового веса, не отказываясь от национальных блюд',
    hero_subtitle: 'Мы не запрещаем плов, манты и самсу! Научно доказанный баланс, контроль порций и персональные рекомендации помогут безопасно нормализовать вес.',
    hero_badge_science: 'На базе исследований JMIR и TBM',
    hero_stat_1_val: '100%',
    hero_stat_1_lbl: 'Адаптация к нац. кухне',
    hero_stat_2_val: '-0.5-0.7 кг',
    hero_stat_2_lbl: 'Безопасный темп в неделю',
    hero_stat_3_val: '0 запретов',
    hero_stat_3_lbl: 'Без стрессовых диет',

    // The 3 Pillars
    pillar_title: 'Почему именно Мувозанат?',
    pillar_1_title: 'Интеграция национальной кухни',
    pillar_1_desc: 'База блюд Узбекистана, Казахстана, Турции. Снижайте вес, не исключая любимый плов и самсу.',
    pillar_2_title: 'Smart Menu Adaptation',
    pillar_2_desc: 'Если сегодня захотелось плова, система не наказывает: она автоматически облегчит ужин для баланса калорий.',
    pillar_3_title: 'Понятный прогресс за 5 секунд',
    pillar_3_desc: '«Где я сейчас? Где моя цель? Что делать сегодня?» — лаконичные ответы без утомительных таблиц.',

    // 5-Second Dashboard
    dash_greeting: 'Здравствуйте, {name}!',
    dash_subgreeting: 'Вы приблизились к цели на {percent}%.',
    dash_current_weight: 'Текущий вес',
    dash_target_weight: 'Цель',
    dash_remaining: 'Осталось',
    dash_progress_bar: 'цели достигнуто',
    dash_today_checklist: 'Контроль на сегодня',
    dash_meal_plan: 'План питания',
    dash_water: 'Баланс воды',
    dash_steps: 'Шаги / Активность',
    dash_weight_logged: 'Вес зафиксирован',

    // BMI & Health Safety
    bmi_label: 'Показатель ИМТ (BMI)',
    bmi_neutral_disclaimer: 'Данный показатель является общим ориентиром и не заменяет индивидуальную медицинскую оценку.',
    medical_safety_notice: 'Важное предостережение: При беременности, лактации, выраженном дефиците массы тела или хронических заболеваниях перед стартом рекомендуется консультация врача или диетолога.',

    // Meal Plan Section
    meal_plan_title: '7-дневное национальное меню',
    meal_plan_subtitle: 'Сбалансированный персональный рацион на каждый день недели',
    meal_breakfast: 'Завтрак',
    meal_lunch: 'Обед',
    meal_snack: 'Полдник / Перекус',
    meal_dinner: 'Ужин',
    macro_kcal: 'ккал',
    macro_protein: 'Белки',
    macro_fat: 'Жиры',
    macro_carbs: 'Углеводы',
    macro_fiber: 'Клетчатка',
    serving: 'Порция',

    // Days of week
    day_mon: 'Понедельник',
    day_tue: 'Вторник',
    day_wed: 'Среда',
    day_thu: 'Четверг',
    day_fri: 'Пятница',
    day_sat: 'Суббота',
    day_sun: 'Воскресенье',

    // Smart Food Replacement
    swap_modal_title: 'Замена блюда',
    swap_modal_desc: 'Что вы хотите съесть сегодня? Выбирайте любимое блюдо, и система перебалансирует остальной рацион.',
    swap_toast_adapted: 'Вы выбрали «{dish}». Для баланса суточного калоража ужин был автоматически скорректирован на более легкий вариант.',
    swap_filter_all: 'Все блюда',
    swap_filter_traditional: 'Национальные / Традиционные',
    swap_filter_light: 'Легкие / Диетические',
    swap_filter_quick: 'Быстрого приготовления',

    // Weight Tracker & Chart
    weight_chart_title: 'Динамика веса и прогноз',
    weight_chart_subtitle: 'Изменение веса во времени и траектория к цели',
    weight_input_label: 'Введите сегодняшний вес (кг):',
    weight_log_success: 'Вес успешно сохранен!',
    weight_weekly_change: 'Изменение за неделю',
    weight_monthly_change: 'Изменение за месяц',
    milestone_title: 'Поэтапная цель',
    milestone_step_1: '1-й этап: {from} → {to} кг',
    milestone_remaining: 'До отметки {target} кг осталось всего {rem} кг.',

    // Gamification & Nudges
    badge_7_days: '🏆 7 дней регулярности',
    badge_7_days_desc: 'Вы вели учет веса целую неделю без пропусков!',
    badge_first_2kg: '🏆 Первые -2 кг позади',
    badge_first_2kg_desc: 'Отличный результат! Здоровые привычки работают.',
    badge_water_streak: '💧 Водный баланс',
    badge_water_streak_desc: 'Вы выполнили дневную норму в 2 литра чистой воды.',
    supportive_nudge: 'Сегодня съели чуть больше запланированного? Ничего страшного — завтра вы спокойно продолжите обычный режим без чувства вины!',

    // Onboarding Wizard
    onboard_title: 'Настройка персонального профиля',
    onboard_subtitle: 'Получите ваш индивидуальный план питания за 2 минуты',
    onboard_step1_title: 'Физические параметры',
    onboard_step2_title: 'Страна и город',
    onboard_step3_title: 'Активность и образ жизни',
    onboard_step4_title: 'Цель и стиль питания',
    onboard_step5_title: 'Безопасность и здоровье',
    field_gender: 'Ваш пол',
    gender_male: 'Мужчина',
    gender_female: 'Женщина',
    field_age: 'Возраст',
    field_height: 'Рост (см)',
    field_current_weight: 'Текущий вес (кг)',
    field_target_weight: 'Желаемый вес (кг)',
    field_country: 'Страна',
    country_uz: 'Узбекистан',
    country_kz: 'Казахстан',
    country_tr: 'Турция',
    country_other: 'Другая страна',
    field_city: 'Город',
    field_activity: 'Физическая активность',
    activity_low: 'Малоподвижный (сидячая работа)',
    activity_medium: 'Умеренная активность (тренировки 2-3 раза в неделю)',
    activity_high: 'Высокая активность (тяжелый труд / спорт)',
    field_job: 'Характер работы',
    job_office: 'Офисная / Удаленная',
    job_active: 'Подвижная / Физическая',
    field_goal: 'Главная цель',
    goal_lose: 'Снижение веса (похудение)',
    goal_maintain: 'Удержание веса',
    goal_gain: 'Здоровый набор массы',
    field_cuisine_style: 'Предпочитаемый стиль кухни',
    style_traditional: 'Традиционная национальная кухня',
    style_mixed: 'Смешанная (национальная + европейская)',
    style_protein: 'Высокобелковая',
    style_quick: 'Быстрого приготовления',
    style_budget: 'Экономная / Бюджетная',
    style_vegetarian: 'Вегетарианская',

    // Shopping List
    shopping_title: 'Список покупок на 7 дней',
    shopping_subtitle: 'Продукты, сгруппированные по категориям для удобного похода в магазин',
    cat_vegetables: 'Овощи и зелень',
    cat_fruits: 'Фрукты',
    cat_meat: 'Мясо и птица',
    cat_dairy: 'Яйца и молочные продукты',
    cat_grains: 'Крупы, рис и мучное',

    // Admin & Settings
    admin_title: 'Панель управления (Admin CMS)',
    admin_subtitle: 'Управление базой блюд, рецептами и продуктовыми метриками',
    admin_add_dish: '+ Добавить новое блюдо',
    kpi_reg_completion: 'Конверсия регистрации (KPI)',
    kpi_onboard_completion: 'Прохождение онбординга',
    kpi_first_weight: 'Первый замер веса',
    kpi_retention_7: 'Удержание 7-го дня',
    kpi_crash_free: 'Бессбойные сессии',
    privacy_title: 'Безопасность данных и приватность (GDPR)',
    privacy_notice: 'Все персональные данные хранятся локально на вашем устройстве в зашифрованном виде. Вы можете выгрузить их или удалить в один клик.',

    // Premium & Telegram Bot
    btn_premium: '👑 Premium',
    premium_badge: 'VIP ВОЗМОЖНОСТИ',
    premium_modal_title: 'Premium подписка и Telegram бот',
    premium_modal_desc: 'Получите персонального ассистента-диетолога и эксклюзивное меню в Telegram',
    field_fullname: 'Фамилия и Имя',
    placeholder_fullname: 'Например: Каримов Сардор',
    field_phone_9digit: 'Номер телефона (9 цифр)',
    phone_validation_error: 'Номер телефона должен содержать ровно 9 цифр! (Например: 90 123 45 67)',
    fullname_validation_error: 'Пожалуйста, введите Фамилию и Имя!',
    btn_continue_telegram: 'Перейти в Telegram бот 🚀',
    premium_feat_1: '🤖 Персональный Telegram бот с ежедневным меню и напоминаниями',
    premium_feat_2: '🍲 Экспресс AI-советы по питанию в ресторанах и на мероприятиях',
    premium_feat_3: '🔄 Безлимитная замена блюд и эксклюзивные рецепты',
    premium_feat_4: '📉 Продвинутая динамика снижения веса и еженедельный отчет',
    telegram_redirecting: 'Данные приняты! Открываем Telegram бот...'
  }
};

// Language helper
let currentLanguage = localStorage.getItem('muvozanat_lang') || 'uz-Latn';

function setLanguage(lang) {
  if (translations[lang]) {
    currentLanguage = lang;
    localStorage.setItem('muvozanat_lang', lang);
    applyTranslations();
  }
}

function t(key, params = {}) {
  const dict = translations[currentLanguage] || translations['uz-Latn'];
  let text = dict[key] || translations['uz-Latn'][key] || key;
  for (const [paramKey, paramVal] of Object.entries(params)) {
    text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), paramVal);
  }
  return text;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.innerHTML = t(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.setAttribute('placeholder', t(key));
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    el.setAttribute('title', t(key));
  });
  document.documentElement.lang = currentLanguage.startsWith('uz') ? 'uz' : 'ru';
  // Dispatch event for components that need dynamic re-rendering
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: currentLanguage } }));
}
