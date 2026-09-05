// Core Data Layer
// Implements Food Database Schema (Section 25) & Default User Profile / Logs

const DEFAULT_FOODS = [
  {
    id: 'food_plov_01',
    country: 'Uzbekistan',
    cuisine: 'uzbek',
    name: {
      'uz-Latn': 'Toshkent to\'y oshi (Plov)',
      'uz-Cyrl': 'Тошкент тўй оши (Плов)',
      'ru': 'Ташкентский свадебный плов'
    },
    altNames: ['Osh', 'Palov', 'Pilaf'],
    image: 'assets/images/plov.jpg',
    servingSize: '250 g',
    servingGrams: 250,
    smallServingGrams: 175,
    calories: 580,
    protein: 22,
    fat: 26,
    carbs: 64,
    fiber: 4.5,
    category: 'lunch',
    dietCategory: 'traditional',
    allergens: [],
    halalStatus: true,
    ingredients: {
      'uz-Latn': ['Devzira yoki lazer guruch (100g)', 'Yumshoq mol go\'shti (90g)', 'Sariq va qizil sabzi (120g)', 'No\'xat (20g)', 'Zira, kashnich, sarimsoq', 'O\'simlik yog\'i (20ml)'],
      'uz-Cyrl': ['Девзира ёки лазер гуруч (100г)', 'Юмшоқ мол гўшти (90г)', 'Сариқ ва қизил сабзи (120г)', 'Нўхат (20г)', 'Зира, кашнич, саримсоқ', 'Ўсимлик ёғи (20мл)'],
      'ru': ['Рис лазер или девзира (100г)', 'Нежная говядина (90г)', 'Желтая и красная морковь (120г)', 'Нут (20г)', 'Зира, кориандр, чеснок', 'Растительное масло (20мл)']
    },
    recipe: {
      'uz-Latn': '1. Qozonda go\'shtni minimal yog\'da qovurib oling.\n2. Sabzini solib yumshaguncha dimlang, no\'xat va ziravorlarni qo\'shing.\n3. Suv solib 35 daqiqa past olovda zirvak qaynating.\n4. Guruchni ehtiyotkorlik bilan yoyib, damlang. Maslahat: Yog\' miqdorini kamaytirish uchun dumba o\'rniga zaytun/o\'simlik yog\'i ishlating.',
      'uz-Cyrl': '1. Қозонда гўштни минимал ёғда қовуриб олинг.\n2. Сабзини солиб юмшагунча димланг, нўхат ва зираворларни қўшинг.\n3. Сув солиб 35 дақиқа паст оловда зирвак қайнатинг.\n4. Гуручни эҳтиёткорлик билан ёйиб, дамланг. Маслаҳат: Ёғ миқдорини камайтириш учун думба ўрнига зайтун/ўсимлик ёғи ишлатинг.',
      'ru': '1. Обжарьте мясо в казане с минимальным количеством масла.\n2. Добавьте морковь, тушите до мягкости, добавьте нут и специи.\n3. Влейте воду и варите зирвак на медленном огне 35 минут.\n4. Ровно выложите рис и закройте на пар. Совет: используйте растительное масло вместо курдюка для снижения калорийности.'
    }
  },
  {
    id: 'food_manti_01',
    country: 'Uzbekistan',
    cuisine: 'uzbek',
    name: {
      'uz-Latn': 'Bug\'da pishirilgan manti',
      'uz-Cyrl': 'Буғда пиширилган манти',
      'ru': 'Узбекские манты на пару'
    },
    altNames: ['Manti', 'Mantı'],
    image: 'assets/images/manti.jpg',
    servingSize: '250 g (4 dona)',
    servingGrams: 250,
    smallServingGrams: 150,
    calories: 460,
    protein: 24,
    fat: 18,
    carbs: 52,
    fiber: 3.2,
    category: 'lunch',
    dietCategory: 'traditional',
    allergens: ['Gluten'],
    halalStatus: true,
    ingredients: {
      'uz-Latn': ['Oliy navli un (120g)', 'Yog\'sizroq mol go\'shti (120g)', 'Piyoz (100g)', 'Zira, murch, tuz', 'Qatiq (30g)'],
      'uz-Cyrl': ['Олий навли ун (120г)', 'Ёғсизроқ мол гўшти (120г)', 'Пиёз (100г)', 'Зира, мурч, туз', 'Қатиқ (30г)'],
      'ru': ['Мука пшеничная (120г)', 'Нежирная говядина (120г)', 'Лук репчатый (100г)', 'Зира, перец, соль', 'Катык или нежирная сметана (30г)']
    },
    recipe: {
      'uz-Latn': '1. Xamirni yupqa qilib yoying.\n2. Qiyma uchun mol go\'shti va ko\'p piyozni mayda to\'g\'rang (yog\'siz go\'sht shirador bo\'lishi uchun piyoz ko\'proq solinadi).\n3. Mantiqosqonda bug\'da 40-45 daqiqa pishiring.\n4. Qatiq va ko\'katlar bilan birga tanovul qiling.',
      'uz-Cyrl': '1. Хамирни юпқа қилиб ёйинг.\n2. Қийма учун мол гўшти ва кўп пиёзни майда тўғранг (ёғсиз гўшт ширадор бўлиши учун пиёз кўпроқ солинади).\n3. Мантиқосқонда буғда 40-45 дақиқа пиширинг.\n4. Қатиқ ва кўкатлар билан бирга тановул қилинг.',
      'ru': '1. Тонко раскатайте тесто.\n2. Для сочности используйте больше лука с нежирной говядиной.\n3. Варите в мантоварке на пару 40-45 минут.\n4. Подавайте с катыком и свежей зеленью.'
    }
  },
  {
    id: 'food_somsa_01',
    country: 'Uzbekistan',
    cuisine: 'uzbek',
    name: {
      'uz-Latn': 'Tandir somsa (yengil usulda)',
      'uz-Cyrl': 'Тандир сомса (енгил усулда)',
      'ru': 'Самса с мясом (печеная)'
    },
    altNames: ['Somsa', 'Samsa'],
    image: 'assets/images/somsa.jpg',
    servingSize: '160 g (1 dona)',
    servingGrams: 160,
    smallServingGrams: 100,
    calories: 340,
    protein: 16,
    fat: 14,
    carbs: 38,
    fiber: 2.1,
    category: 'snack',
    dietCategory: 'traditional',
    allergens: ['Gluten', 'Kunjut'],
    halalStatus: true,
    ingredients: {
      'uz-Latn': ['Qatlama xamir (80g)', 'Mol go\'shti qiymasi (70g)', 'Piyoz (50g)', 'Kunjut, zira, murch'],
      'uz-Cyrl': ['Қатлама хамир (80г)', 'Мол гўшти қиймаси (70г)', 'Пиёз (50г)', 'Кунжут, зира, мурч'],
      'ru': ['Слоеное тесто (80г)', 'Фарш из говядины (70г)', 'Лук (50г)', 'Кунжут, зира, перец']
    },
    recipe: {
      'uz-Latn': '1. Yupqa qatlama xamir tayyorlang.\n2. Qiymani ziravorlar bilan aralashtirib, tuging.\n3. Duxovkada yoki tandirda 200°C da 25-30 daqiqa qizarguncha pishiring.',
      'uz-Cyrl': '1. Юпқа қатлама хамир тайёрланг.\n2. Қиймани зираворлар билан аралаштириб, тугинг.\n3. Духовкада ёки тандирда 200°C да 25-30 дақиқа қизаргунча пиширинг.',
      'ru': '1. Тонко раскатайте слоеное тесто.\n2. Заверните начинку из мяса и лука в треугольники.\n3. Запекайте при 200°C 25-30 минут до золотистой корочки.'
    }
  },
  {
    id: 'food_chicken_salad_01',
    country: 'International',
    cuisine: 'healthy',
    name: {
      'uz-Latn': 'Grilda pishgan tovuq filesi va sabzavotli salat',
      'uz-Cyrl': 'Грилда пишган товуқ филеси ва сабзавотли салат',
      'ru': 'Куриное филе гриль со свежим салатом'
    },
    altNames: ['Chicken salad', 'Tovuq salat'],
    image: 'assets/images/chicken_salad.jpg',
    servingSize: '300 g',
    servingGrams: 300,
    smallServingGrams: 200,
    calories: 280,
    protein: 34,
    fat: 8,
    carbs: 14,
    fiber: 5.2,
    category: 'dinner',
    dietCategory: 'light',
    allergens: [],
    halalStatus: true,
    ingredients: {
      'uz-Latn': ['Tovuq ko\'krak filesi (150g)', 'Bodring (60g)', 'Cherri pomidor (70g)', 'Avokado bo\'laklari (30g)', 'Rukkola yoki ismaloq (40g)', 'Zaytun yog\'i (5ml)', 'Limon sharbati'],
      'uz-Cyrl': ['Товуқ кўкрак филеси (150г)', 'Бодринг (60г)', 'Черри помидор (70г)', 'Авокадо бўлаклари (30г)', 'Руккола ёки исмалоқ (40г)', 'Зайтун ёғи (5мл)', 'Лимон шарбати'],
      'ru': ['Куриное филе (150г)', 'Огурец (60г)', 'Помидоры черри (70г)', 'Авокадо (30г)', 'Руккола или шпинат (40г)', 'Оливковое масло (5мл)', 'Лимонный сок']
    },
    recipe: {
      'uz-Latn': '1. Tovuq filesini quruq grilda yoki tovada yog\'siz pishirib oling.\n2. Yangi sabzavot va ko\'katlarni to\'g\'rang.\n3. Zaytun yog\'i va limon sharbati bilan aralashtirib, ustiga tovuq bo\'laklarini tering.',
      'uz-Cyrl': '1. Товуқ филесини қуруқ грилда ёки товада ёғсиз пишириб олинг.\n2. Янги сабзавот ва кўкатларни тўғранг.\n3. Зайтун ёғи ва лимон шарбати билан аралаштириб, устига товуқ бўлакларини теринг.',
      'ru': '1. Обжарьте куриное филе на гриле без масла.\n2. Нарежьте свежие овощи и зелень.\n3. Заправьте оливковым маслом с соком лимона и выложите ломтики филе.'
    }
  },
  {
    id: 'food_shurva_01',
    country: 'Uzbekistan',
    cuisine: 'uzbek',
    name: {
      'uz-Latn': 'Qo\'zichoq go\'shtli xushbo\'y sho\'rva',
      'uz-Cyrl': 'Қўзичоқ гўштли хушбўй шўрва',
      'ru': 'Узбекская ароматная шурпа'
    },
    altNames: ['Shurva', 'Shorba'],
    image: 'assets/images/shurva.jpg',
    servingSize: '350 ml',
    servingGrams: 350,
    smallServingGrams: 220,
    calories: 320,
    protein: 26,
    fat: 14,
    carbs: 22,
    fiber: 3.8,
    category: 'lunch',
    dietCategory: 'traditional',
    allergens: [],
    halalStatus: true,
    ingredients: {
      'uz-Latn': ['Yog\'siz qo\'y yoki buzoq go\'shti (100g)', 'Katta bo\'laklangan kartoshka (60g)', 'Sabzi (50g)', 'Bulg\'or qalampiri (40g)', 'Piyoz, kashnich, rayhon'],
      'uz-Cyrl': ['Ёғсиз қўй ёки бузоқ гўшти (100г)', 'Катта бўлакланган картошка (60г)', 'Сабзи (50г)', 'Булғор қалампири (40г)', 'Пиёз, кашнич, райҳон'],
      'ru': ['Нежирная баранина или телятина (100г)', 'Картофель (60г)', 'Морковь (50г)', 'Болгарский перец (40г)', 'Лук, кинза, базилик']
    },
    recipe: {
      'uz-Latn': 'Go\'shtni sovuq suvda past olovda 1 soat qaynating, ko\'pigini oling. Sabzavotlarni yirik to\'g\'rab soling va yana 30 daqiqa dimlab pishiring. Ko\'katlar seping.',
      'uz-Cyrl': 'Гўштни совуқ сувда паст оловда 1 соат қайнатинг, кўпигини олинг. Сабзавотларни йирик тўғраб солинг ва яна 30 дақиқа димлаб пиширинг. Кўкатлар сепинг.',
      'ru': 'Варите мясо на медленном огне 1 час, снимая пену. Добавьте крупные овощи и варите еще 30 минут. Посыпьте свежей зеленью.'
    }
  },
  {
    id: 'food_dimlama_01',
    country: 'Uzbekistan',
    cuisine: 'uzbek',
    name: {
      'uz-Latn': 'Sabzavotli dimlama',
      'uz-Cyrl': 'Сабзавотли димлама',
      'ru': 'Димляма с овощами и мясом'
    },
    altNames: ['Dimlama', 'Dumlama'],
    image: 'assets/images/dimlama.jpg',
    servingSize: '300 g',
    servingGrams: 300,
    smallServingGrams: 200,
    calories: 340,
    protein: 25,
    fat: 12,
    carbs: 32,
    fiber: 6.0,
    category: 'dinner',
    dietCategory: 'traditional',
    allergens: [],
    halalStatus: true,
    ingredients: {
      'uz-Latn': ['Mol go\'shti (100g)', 'Karam barglari (80g)', 'Kartoshka (50g)', 'Sabzi (40g)', 'Pomidor (50g)', 'Baqlajon va bulg\'or qalampiri'],
      'uz-Cyrl': ['Мол гўшти (100г)', 'Карам барглари (80г)', 'Картошка (50г)', 'Сабзи (40г)', 'Помидор (50г)', 'Бақлажон ва булғор қалампири'],
      'ru': ['Говядина (100г)', 'Капуста (80г)', 'Картофель (50г)', 'Морковь (40г)', 'Помидоры (50г)', 'Баклажан и сладкий перец']
    },
    recipe: {
      'uz-Latn': 'Qozon tubiga go\'sht va sabzavotlarni qatlam-qatlam terib chiqing, ustini karam barglari bilan mahkam yopib, o\'z sharbatida 1.5 soat past olovda dimlang.',
      'uz-Cyrl': 'Қозон тубига гўшт ва сабзавотларни қатлам-қатлам териб чиқинг, устини карам барглари билан маҳкам ёпиб, ўз шарбатида 1.5 соат паст оловда димланг.',
      'ru': 'Выложите слоями мясо и овощи в казан, плотно накройте капустными листьями и томите в собственном соку на минимальном огне 1.5 часа.'
    }
  },
  {
    id: 'food_breakfast_eggs_01',
    country: 'International',
    cuisine: 'healthy',
    name: {
      'uz-Latn': 'Qaynatilgan tuxum, yangi sabzavot va tandir noni',
      'uz-Cyrl': 'Қайнатилган тухум, янги сабзавот ва тандир нони',
      'ru': 'Отварные яйца со свежими овощами и лепешкой'
    },
    altNames: ['Eggs breakfast'],
    image: 'assets/images/eggs_breakfast.jpg',
    servingSize: '220 g',
    servingGrams: 220,
    smallServingGrams: 160,
    calories: 290,
    protein: 17,
    fat: 11,
    carbs: 28,
    fiber: 3.1,
    category: 'breakfast',
    dietCategory: 'light',
    allergens: ['Tuxum', 'Gluten'],
    halalStatus: true,
    ingredients: {
      'uz-Latn': ['2 dona qaynatilgan tuxum', '1 bo\'lak tandir non (40g)', 'Bodring va pomidor (100g)', 'Yashil choy'],
      'uz-Cyrl': ['2 дона қайнатилган тухум', '1 бўлак тандир нон (40г)', 'Бодринг ва помидор (100г)', 'Яшил чой'],
      'ru': ['2 отварных яйца', '1 ломтик узбекской лепешки (40г)', 'Огурцы и помидоры (100г)', 'Зеленый чай']
    },
    recipe: {
      'uz-Latn': 'Tuxumni 7 daqiqa qaynatib oling. Yangi sabzavotlar bilan birga taqdim eting.',
      'uz-Cyrl': 'Тухумни 7 дақиқа қайнатиб олинг. Янги сабзавотлар билан бирга тақдим этинг.',
      'ru': 'Сварите яйца всмятку или вкрутую (7 мин). Подавайте с хрустящими овощами.'
    }
  },
  {
    id: 'food_oatmeal_berries_01',
    country: 'International',
    cuisine: 'healthy',
    name: {
      'uz-Latn': 'Suli bo\'tqasi mevalar va yong\'oq bilan',
      'uz-Cyrl': 'Сули бўтқаси мевалар ва ёнғоқ билан',
      'ru': 'Овсяная каша с ягодами и орехами'
    },
    altNames: ['Oatmeal'],
    image: 'assets/images/oatmeal_berries.jpg',
    servingSize: '250 g',
    servingGrams: 250,
    smallServingGrams: 180,
    calories: 270,
    protein: 9,
    fat: 7,
    carbs: 45,
    fiber: 5.5,
    category: 'breakfast',
    dietCategory: 'light',
    allergens: ['Yong\'oq'],
    halalStatus: true,
    ingredients: {
      'uz-Latn': ['Suli yormasi (50g)', 'Suv yoki kam yog\'li sut (150ml)', 'Yong\'oq (10g)', 'Olma yoki mevalar (50g)'],
      'uz-Cyrl': ['Сули ёрмаси (50г)', 'Сув ёки кам ёғли сут (150мл)', 'Ёнғоқ (10г)', 'Олма ёки мевалар (50г)'],
      'ru': ['Овсяные хлопья (50г)', 'Вода или нежирное молоко (150мл)', 'Грецкий орех (10г)', 'Яблоко или ягоды (50г)']
    },
    recipe: {
      'uz-Latn': 'Suli yormasini suvda 5 daqiqa pishirib, ustiga meva va maydalangan yong\'oq qo\'shing.',
      'uz-Cyrl': 'Сули ёрмасини сувда 5 дақиқа пишириб, устига мева ва майдаланган ёнғоқ қўшинг.',
      'ru': 'Сварите овсянку на воде за 5 минут, добавьте ломтики яблок и грецкие орехи.'
    }
  },
  {
    id: 'food_achchiq_chuchuk_01',
    country: 'Uzbekistan',
    cuisine: 'uzbek',
    name: {
      'uz-Latn': 'Achchiq-chuchuk yangi salati',
      'uz-Cyrl': 'Аччиқ-чучук янги салати',
      'ru': 'Салат Ачик-чучук'
    },
    altNames: ['Achichuk', 'Shakarob'],
    image: 'assets/images/achichuk.jpg',
    servingSize: '150 g',
    servingGrams: 150,
    smallServingGrams: 100,
    calories: 45,
    protein: 1.5,
    fat: 0.3,
    carbs: 8.5,
    fiber: 2.2,
    category: 'snack',
    dietCategory: 'light',
    allergens: [],
    halalStatus: true,
    ingredients: {
      'uz-Latn': ['Yupqa to\'g\'ralgan pishgan pomidor (100g)', 'Yuvilgan oq piyoz (40g)', 'Rayhon va ko\'katlar', 'Achchiq qalampir ta\'bga ko\'ra'],
      'uz-Cyrl': ['Юпқа тўғралган пишган помидор (100г)', 'Ювилган оқ пиёз (40г)', 'Райҳон ва кўкатлар', 'Аччиқ қалампир таъбга кўра'],
      'ru': ['Тонко нарезанные спелые помидоры (100г)', 'Промытый лук (40г)', 'Базилик и зелень', 'Острый перец по вкусу']
    },
    recipe: {
      'uz-Latn': 'Pomidor va piyozni juda yupqa tilim qilib to\'g\'rang, rayhon qo\'shing. Yog\'siz tayyorlanadi, vitaminlarga boy.',
      'uz-Cyrl': 'Помидор ва пиёзни жуда юпқа тилим қилиб тўғранг, райҳон қўшинг. Ёғсиз тайёрланади, витаминларга бой.',
      'ru': 'Нарежьте томаты и лук тончайшими лепестками, добавьте базилик. Идеально без масла к плову.'
    }
  },
  {
    id: 'food_kazakh_beshbarmak_01',
    country: 'Kazakhstan',
    cuisine: 'kazakh',
    name: {
      'uz-Latn': 'Beshbarmoq (parhezbop porsiyada)',
      'uz-Cyrl': 'Бешбармоқ (парҳезбоп порцияда)',
      'ru': 'Бешбармак (сбалансированная порция)'
    },
    altNames: ['Beshbarmak', 'Et'],
    image: 'assets/images/beshbarmak.jpg',
    servingSize: '250 g',
    servingGrams: 250,
    smallServingGrams: 170,
    calories: 510,
    protein: 30,
    fat: 19,
    carbs: 48,
    fiber: 2.5,
    category: 'lunch',
    dietCategory: 'traditional',
    allergens: ['Gluten'],
    halalStatus: true,
    ingredients: {
      'uz-Latn': ['Qaynatilgan mol/ot go\'shti (120g)', 'Yupqa xamir barglari (80g)', 'Piyozli sho\'rva (tuzdyq, 50ml)'],
      'uz-Cyrl': ['Қайнатилган мол/от гўшти (120г)', 'Юпқа хамир барглари (80г)', 'Пиёзли шўрва (туздық, 50мл)'],
      'ru': ['Отварная говядина или конина (120г)', 'Листы тонкого теста (80г)', 'Луковая подлива с бульоном (50мл)']
    },
    recipe: {
      'uz-Latn': 'Go\'shtni xushbo\'y qilib pishiring. Xamirni go\'sht suvida pishirib, likopchaga yoying, ustiga go\'sht va dimlangan piyoz soling.',
      'uz-Cyrl': 'Гўштни хушбўй қилиб пиширинг. Хамирни гўшт сувида пишириб, ликопчага ёйинг, устига гўшт ва димланган пиёз солинг.',
      'ru': 'Отварите мясо до мягкости, сварите тонкие сочни в бульоне, выложите мясо и припущенный лук сверху.'
    }
  },
  {
    id: 'food_turkish_mercimek_01',
    country: 'Turkey',
    cuisine: 'turkish',
    name: {
      'uz-Latn': 'Turkcha qizil yasmiq sho\'rvasi (Mercimek)',
      'uz-Cyrl': 'Туркча қизил ясмиқ шўрваси (Mercimek)',
      'ru': 'Турецкий чечевичный суп (Мерджимек)'
    },
    altNames: ['Mercimek', 'Lentil soup'],
    image: 'assets/images/mercimek.jpg',
    servingSize: '300 ml',
    servingGrams: 300,
    smallServingGrams: 200,
    calories: 220,
    protein: 14,
    fat: 5,
    carbs: 32,
    fiber: 8.0,
    category: 'lunch',
    dietCategory: 'light',
    allergens: [],
    halalStatus: true,
    ingredients: {
      'uz-Latn': ['Qizil yasmiq (60g)', 'Sabzi va piyoz (50g)', 'Zaytun yog\'i (5ml)', 'Quritilgan yalpiz va limon'],
      'uz-Cyrl': ['Қизил ясмиқ (60г)', 'Сабзи ва пиёз (50г)', 'Зайтун ёғи (5мл)', 'Қуритилган ялпиз ва лимон'],
      'ru': ['Красная чечевица (60г)', 'Морковь и лук (50г)', 'Оливковое масло (5мл)', 'Сушеная мята и долька лимона']
    },
    recipe: {
      'uz-Latn': 'Yasmiq va sabzavotlarni qaynatib, blenderda pyure holiga keltiring. Limon sharbati va yalpiz bilan ichiladi.',
      'uz-Cyrl': 'Ясмиқ ва сабзавотларни қайнатиб, блендерда пюре ҳолига келтиринг. Лимон шарбати ва ялпиз билан ичилади.',
      'ru': 'Сварите чечевицу с овощами, пюрируйте блендером. Подавайте с лимоном и мятой.'
    }
  },
  {
    id: 'food_turkish_menemen_01',
    country: 'Turkey',
    cuisine: 'turkish',
    name: {
      'uz-Latn': 'Menemen (Turkcha sabzavotli tuxum)',
      'uz-Cyrl': 'Менемен (Туркча сабзавотли тухум)',
      'ru': 'Менемен (турецкая яичница с томатами)'
    },
    altNames: ['Menemen'],
    image: 'assets/images/menemen.jpg',
    servingSize: '240 g',
    servingGrams: 240,
    smallServingGrams: 160,
    calories: 280,
    protein: 15,
    fat: 16,
    carbs: 14,
    fiber: 3.5,
    category: 'breakfast',
    dietCategory: 'traditional',
    allergens: ['Tuxum'],
    halalStatus: true,
    ingredients: {
      'uz-Latn': ['2 ta tuxum', 'Yumshoq pomidor (120g)', 'Yashil shirin qalampir (40g)', 'Zaytun yog\'i (5ml)', 'Ziravorlar'],
      'uz-Cyrl': ['2 та тухум', 'Юмшоқ помидор (120г)', 'Яшил ширин қалампир (40г)', 'Зайтун ёғи (5мл)', 'Зираворлар'],
      'ru': ['2 яйца', 'Спелые помидоры (120г)', 'Зеленый перец (40г)', 'Оливковое масло (5мл)', 'Специи']
    },
    recipe: {
      'uz-Latn': 'Qalampir va pomidorni zaytun yog\'ida dimlang, tuxumlarni chaqib, past olovda aralashtirib pishiring.',
      'uz-Cyrl': 'Қалампир ва помидорни зайтун ёғида димланг, тухумларни чақиб, паст оловда аралаштириб пиширинг.',
      'ru': 'Обжарьте перец и томаты на оливковом масле, добавьте яйца и непрерывно помешивайте до кремовой текстуры.'
    }
  }
];

// Clean User State Template (Zero fake data - Section 2 & 3)
const DEFAULT_USER_PROFILE = {
  name: '',
  gender: '',
  age: null,
  height: null,
  currentWeight: null,
  startWeight: null,
  targetWeight: null,
  country: 'Uzbekistan',
  city: '',
  activityLevel: 'medium',
  jobType: 'office',
  goal: 'lose',
  cuisineStyle: 'traditional',
  restrictions: [],
  allergies: [],
  isPregnantOrLactating: false,
  hasSevereChronicIllness: false,
  dailyWaterTargetGlasses: 8,
  currentWaterGlasses: 0,
  dailyStepsTarget: 10000,
  currentSteps: 0,
  onboardingCompleted: false
};

// Initial weight log history (Zero fake entries - Section 2)
const DEFAULT_WEIGHT_LOGS = [];

// Default 7-day Meal Plan schedule (Section 8)
const DEFAULT_WEEK_PLAN = {
  mon: {
    breakfast: 'food_breakfast_eggs_01',
    lunch: 'food_plov_01',
    snack: 'food_somsa_01',
    dinner: 'food_chicken_salad_01',
    waterGlasses: 6,
    steps: 9100,
    weightLogged: true
  },
  tue: {
    breakfast: 'food_oatmeal_berries_01',
    lunch: 'food_shurva_01',
    snack: 'food_achchiq_chuchuk_01',
    dinner: 'food_dimlama_01',
    waterGlasses: 7,
    steps: 8500,
    weightLogged: false
  },
  wed: {
    breakfast: 'food_breakfast_eggs_01',
    lunch: 'food_manti_01',
    snack: 'food_achchiq_chuchuk_01',
    dinner: 'food_chicken_salad_01',
    waterGlasses: 8,
    steps: 10200,
    weightLogged: true
  },
  thu: {
    breakfast: 'food_oatmeal_berries_01',
    lunch: 'food_plov_01',
    snack: 'food_achchiq_chuchuk_01',
    dinner: 'food_chicken_salad_01',
    waterGlasses: 6,
    steps: 7800,
    weightLogged: false
  },
  fri: {
    breakfast: 'food_turkish_menemen_01',
    lunch: 'food_plov_01',
    snack: 'food_somsa_01',
    dinner: 'food_chicken_salad_01',
    waterGlasses: 7,
    steps: 9500,
    weightLogged: true
  },
  sat: {
    breakfast: 'food_breakfast_eggs_01',
    lunch: 'food_shurva_01',
    snack: 'food_achchiq_chuchuk_01',
    dinner: 'food_dimlama_01',
    waterGlasses: 8,
    steps: 11000,
    weightLogged: true
  },
  sun: {
    breakfast: 'food_oatmeal_berries_01',
    lunch: 'food_manti_01',
    snack: 'food_somsa_01',
    dinner: 'food_chicken_salad_01',
    waterGlasses: 6,
    steps: 6400,
    weightLogged: false
  }
};
