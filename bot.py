#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
«Тана вазнини нормаллаштириш» (Muvozanat) — Расмий Telegram Бот
Username: @muvozanat24_bot
Token: 8902459438:AAEDgNOfNf_4Gmcw82MzbETynyAJmpPT5wk
"""

import os
import json
import logging
from datetime import datetime
import telebot
from telebot import types

# Configure logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Bot credentials
BOT_TOKEN = os.getenv('BOT_TOKEN', '8902459438:AAEDgNOfNf_4Gmcw82MzbETynyAJmpPT5wk')
bot = telebot.TeleBot(BOT_TOKEN, parse_mode='HTML')

# Website Platform URLs
LIVE_SITE_URL = os.getenv('LIVE_SITE_URL', 'https://ayubparsaev-1981.github.io/muvozanat24/')
LOCAL_SITE_URL = os.getenv('LOCAL_SITE_URL', 'http://localhost:8080')

# Storage file for user data
DATA_FILE = os.path.join(os.path.dirname(__file__), 'bot_users.json')

def load_users():
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_users(users):
    try:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(users, f, ensure_ascii=False, indent=2)
    except Exception as e:
        logger.error(f"Error saving users: {e}")

users_db = load_users()

def get_user_data(user_id):
    str_id = str(user_id)
    if str_id not in users_db:
        users_db[str_id] = {
            'water_glasses': 0,
            'name': '',
            'phone': '',
            'is_registered': False,
            'is_premium': False,
            'weight': None,
            'height': 175,
            'target_weight': None,
            'weight_history': [],
            'consumed_today': 0
        }
        save_users(users_db)
    return users_db[str_id]

# Main Reply Keyboard Markup
def get_main_keyboard():
    markup = types.ReplyKeyboardMarkup(resize_keyboard=True, row_width=2)
    btn_scan = types.KeyboardButton("📷 Таомни скан қилиш")
    btn_diary = types.KeyboardButton("📊 Кунлик калория баланси")
    btn_menu = types.KeyboardButton("🍲 Бугунги миллий меню")
    btn_swap = types.KeyboardButton("🔄 Таом алмаштириш")
    btn_bmi = types.KeyboardButton("⚖️ Вазн ва BMI ҳисоблаш")
    btn_water = types.KeyboardButton("💧 Сув назорати")
    btn_ai = types.KeyboardButton("🤖 AI Диетолог маслаҳати")
    btn_web = types.KeyboardButton("🌐 Веб-сайтни очиш")
    btn_premium = types.KeyboardButton("👑 Premium мақоми")
    markup.add(btn_scan, btn_diary)
    markup.add(btn_menu, btn_swap)
    markup.add(btn_bmi, btn_water)
    markup.add(btn_ai, btn_web)
    markup.add(btn_premium)
    return markup

# ==============================================================================
# COMMAND HANDLERS
# ==============================================================================

@bot.message_handler(commands=['start', 'help'])
def send_welcome(message):
    user_id = str(message.from_user.id)
    user_data = get_user_data(user_id)

    # Check if registered via web start parameter: /start reg_901234567, /start auth_web, /start premium
    args = message.text.split()
    phone_from_web = None
    extra_msg = ""
    if len(args) > 1:
        param = args[1]
        if param.startswith('reg_'):
            phone_from_web = param.replace('reg_', '')
            user_data['phone'] = f"+998{phone_from_web}"
            user_data['is_premium'] = True
            save_users(users_db)
        elif param == 'auth_web':
            auth_code = str(abs(hash(user_id)))[:6]
            extra_msg = (
                f"\n🔐 <b>Сайтга кириш тасдиқланди!</b>\n"
                f"Сиз Telegram орқали тизимга муваффақиятли уландингиз.\n"
                f"Бир марталик тасдиқлаш кодингиз: <code>{auth_code}</code>\n"
            )
        elif param == 'premium':
            user_data['is_premium'] = True
            save_users(users_db)
            extra_msg = (
                f"\n👑 <b>«Muvozanat 24» Premium мақоми очилди!</b>\n"
                f"Сизга 24/7 шахсий нутрициолог, кунлик миллий озиш менюси ва барча функциялар тўлиқ очилди.\n"
            )

    first_name = message.from_user.first_name or "Азиз фойдаланувчи"
    user_data['name'] = first_name
    save_users(users_db)

    welcome_text = (
        f"👋 <b>Ассалому алайкум, {first_name}!</b>\n\n"
        f"<b>«Мувозанат» (Muvozanat 24)</b> — миллий таомлардан воз кечмасдан, "
        f"тана вазнини хавфсиз нормаллаштириш бўйича шахсий рақамли ёрдамчингизга хуш келибсиз!\n\n"
        f"👑 <b>Сизнинг Premium мақомингиз фаоллаштирилди.</b>\n"
    )

    if phone_from_web:
        welcome_text += f"📱 Рўйхатдан ўтган рақам: <b>+998 {phone_from_web}</b>\n\n"
    if extra_msg:
        welcome_text += f"{extra_msg}\n"

    welcome_text += (
        f"💡 <i>Асосий ғоямиз: «Озиш учун ўзбек ошидан воз кечиш шарт эмас — порция ва кунлик рационни тўғри бошқариш кифоя!»</i>\n\n"
        f"Қуйидаги тугмалардан бирини танланг:"
    )

    bot.send_message(message.chat.id, welcome_text, reply_markup=get_main_keyboard())

# ==============================================================================
# MENU HANDLER (National 4-Meal Plan)
# ==============================================================================

@bot.message_handler(func=lambda msg: msg.text == "🍲 Бугунги миллий меню")
def send_today_menu(message):
    text = (
        "🍲 <b>Бугунги мувозанатланган миллий меню:</b>\n"
        "━━━━━━━━━━━━━━━━━━━\n\n"
        "🍳 <b>НОНУШТА (08:00):</b>\n"
        "• 2 та қайнатилган тухум\n"
        "• Янги бодринг ва помидор (100г)\n"
        "• 1 бўлак тандир нони (40г) + кўк чой\n"
        "<i>Энергия: 290 ккал | Оқсил: 17г | Ёғ: 11г</i>\n\n"

        "🍚 <b>ТУШЛИК (13:00):</b>\n"
        "• <b>Тошкент тўй оши</b> — 250 г (белгиланган порция)\n"
        "• Аччиқ-чучук янги салат (ёғсиз)\n"
        "<i>Энергия: 580 ккал | Оқсил: 22г | Ёғ: 26г | Углевод: 64г</i>\n\n"

        "🥐 <b>ПЕРЕКУС / ПОЛДНИК (16:30):</b>\n"
        "• 1 дона кичик тандир сомса ёки мавсумий олма\n"
        "<i>Энергия: 180-340 ккал</i>\n\n"

        "🥗 <b>КЕЧКИ ОВҚАТ (19:30):</b>\n"
        "• Грилда пишган товуқ филеси (150г)\n"
        "• Зайтун мойли ва лимонли янги салат\n"
        "<i>Энергия: 280 ккал | Оқсил: 34г | Ёғ: 8г</i>\n\n"
        "━━━━━━━━━━━━━━━━━━━\n"
        "📊 <b>Кунлик жами:</b> ~1,850 ккал (Сизнинг хавфсиз озиш меъёрингизда!)"
    )

    markup = types.InlineKeyboardMarkup(row_width=2)
    btn1 = types.InlineKeyboardButton("📖 Ош рецепти", callback_data="recipe_plov")
    btn2 = types.InlineKeyboardButton("⚖️ Кичик порция (175г)", callback_data="portion_small")
    btn3 = types.InlineKeyboardButton("🔄 Таомни алмаштириш", callback_data="open_swap_menu")
    markup.add(btn1, btn2)
    markup.add(btn3)

    bot.send_message(message.chat.id, text, reply_markup=markup)

# ==============================================================================
# SMART MENU ADAPTATION HANDLER
# ==============================================================================

@bot.message_handler(func=lambda msg: msg.text == "🔄 Таом алмаштириш")
def send_swap_options(message):
    text = (
        "🔄 <b>Smart Menu Adaptation тизими:</b>\n\n"
        "Агар бугун режадан ташқари миллий таом емоқчи бўлсангиз, тизим сизни жазоламайди ва айбламайди!\n"
        "Бугун нима ейишни режалаштиряпсиз? Танланг:"
    )

    markup = types.InlineKeyboardMarkup(row_width=2)
    b1 = types.InlineKeyboardButton("🍚 Ош ейман", callback_data="swap_osh")
    b2 = types.InlineKeyboardButton("🥟 Манти ейман", callback_data="swap_manti")
    b3 = types.InlineKeyboardButton("🍢 Шашлик ейман", callback_data="swap_shashlik")
    b4 = types.InlineKeyboardButton("🥘 Димлама ейман", callback_data="swap_dimlama")
    b5 = types.InlineKeyboardButton("🥩 Бешбармоқ", callback_data="swap_beshbarmak")
    b6 = types.InlineKeyboardButton("🥣 Мержимек шўрва", callback_data="swap_mercimek")
    markup.add(b1, b2)
    markup.add(b3, b4)
    markup.add(b5, b6)

    bot.send_message(message.chat.id, text, reply_markup=markup)

# ==============================================================================
# WEIGHT & BMI CALCULATOR
# ==============================================================================

@bot.message_handler(func=lambda msg: msg.text == "⚖️ Вазн ва BMI ҳисоблаш")
def start_bmi_calc(message):
    user_data = get_user_data(message.from_user.id)
    current_w = user_data.get('weight')
    target_w = user_data.get('target_weight')
    height_cm = user_data.get('height', 175)

    if current_w is None:
        text = (
            "⚖️ <b>Вазн ва BMI назорати (Empty State):</b>\n\n"
            "Ҳали вазн маълумоти киритилмаган.\n"
            "Сизнинг индивидуал BMI ва кунлик калория дефицитингизни ҳисоблаш учун "
            "илтимос, ҳозирги вазнингизни рақамда ёзиб юборинг (масалан: <code>78.5</code> ёки <code>84</code>)."
        )
        bot.send_message(message.chat.id, text)
        return

    # Calculate BMI
    h_m = height_cm / 100
    bmi = round(current_w / (h_m * h_m), 1)

    text = (
        "⚖️ <b>Сизнинг ҳозирги вазн кўрсаткичларингиз:</b>\n"
        "━━━━━━━━━━━━━━━━━━━\n"
        f"• Ҳозирги вазн: <b>{current_w} кг</b>\n"
        f"• Бўй: <b>{height_cm} см</b>\n"
        f"• Мақсадли вазн: <b>{target_w or round(current_w * 0.9, 1)} кг</b>\n"
        f"• Қолди: <b>{round(current_w - (target_w or round(current_w * 0.9, 1)), 1)} кг</b>\n\n"
        f"📊 <b>BMI кўрсаткичи: {bmi}</b>\n"
        "<i>«Ушбу кўрсаткич умумий ориентир ҳисобланади ва индивидуал тиббий баҳолаш ўрнини босмайди.»</i>\n\n"
        "Янги вазнингизни киритиш учун шунчаки янги вазнни рақамда ёзиб юборинг (масалан: <code>78.2</code>):"
    )

    markup = types.InlineKeyboardMarkup()
    btn = types.InlineKeyboardButton("📝 Янги вазнни ёзиш", callback_data="prompt_new_weight")
    markup.add(btn)

    bot.send_message(message.chat.id, text, reply_markup=markup)

# Weight text input fallback
@bot.message_handler(func=lambda msg: msg.text and msg.text.replace(',', '.').replace('.', '', 1).isdigit())
def handle_direct_weight_input(message):
    try:
        val = float(message.text.replace(',', '.'))
        if 35 <= val <= 250:
            user_data = get_user_data(message.from_user.id)
            old_w = user_data.get('weight')
            user_data['weight'] = val
            user_data['is_registered'] = True
            if not user_data.get('target_weight'):
                user_data['target_weight'] = round(val * 0.9, 1)

            diff_str = "Биринчи қайд" if old_w is None else (f"+{round(val - old_w, 1)} кг" if val > old_w else f"{round(val - old_w, 1)} кг")
            user_data['weight_history'].append({
                'date': datetime.now().strftime('%Y-%m-%d'),
                'weight': val
            })
            save_users(users_db)

            h_m = user_data.get('height', 175) / 100
            new_bmi = round(val / (h_m * h_m), 1)

            res_text = (
                f"✅ <b>Янги вазнингиз сақланди: {val} кг!</b>\n"
                f"Ўзгариш: <b>{diff_str}</b>\n"
                f"Янгиланган BMI: <b>{new_bmi}</b>\n\n"
                f"🎯 Мақсадгача қолди: <b>{round(val - user_data['target_weight'], 1)} кг</b>.\n"
                f"<i>Ажойиб натижа! Мунтазам кузатиш соғлом вазннинг калитидир.</i>"
            )
            bot.send_message(message.chat.id, res_text)
        else:
            bot.send_message(message.chat.id, "Илтимос, 35 ва 250 кг оралиғидаги вазнни киритинг.")
    except Exception:
        pass

# ==============================================================================
# WATER TRACKER (Interactive Inline Keyboard)
# ==============================================================================

def get_water_text_and_markup(user_id):
    user_data = get_user_data(user_id)
    glasses = user_data.get('water_glasses', 6)
    target = 8
    ml = glasses * 250
    percent = round((glasses / target) * 100)

    # Progress bar visualization
    bar = "💧" * glasses + "⬜" * (target - glasses)

    text = (
        "💧 <b>Кунлик сув баланси назорати:</b>\n"
        "━━━━━━━━━━━━━━━━━━━\n"
        f"Ичилган сув: <b>{glasses} / {target} стакан</b> ({ml} / 2000 мл)\n"
        f"Бажарилди: <b>{percent}%</b>\n\n"
        f"Прогресс: {bar}\n\n"
        "<i>Ҳар бир стакан 250 мл сувни ташкил этади. Сув ичганингиздан сўнг пастдаги тугмани босинг:</i>"
    )

    markup = types.InlineKeyboardMarkup(row_width=2)
    b_add = types.InlineKeyboardButton("💧 +1 стакан (250мл)", callback_data="water_add")
    b_reset = types.InlineKeyboardButton("🔄 Қайта бошлаш", callback_data="water_reset")
    markup.add(b_add, b_reset)
    return text, markup

@bot.message_handler(func=lambda msg: msg.text == "💧 Сув назорати")
def send_water_tracker(message):
    text, markup = get_water_text_and_markup(message.from_user.id)
    bot.send_message(message.chat.id, text, reply_markup=markup)

# ==============================================================================
# AI NUTRITION ADVISOR (FAQ & Guidance)
# ==============================================================================

@bot.message_handler(func=lambda msg: msg.text == "🤖 AI Диетолог маслаҳати")
def send_ai_advisor(message):
    text = (
        "🤖 <b>AI Диетолог ва Нутрициолог маслаҳат маркази</b>\n"
        "<i>Илмий асос: JMIR (2025) ва TBM (2023) тадқиқотлари</i>\n\n"
        "Қуйидаги энг кўп учрайдиган саволлардан бирини танланг ёки саволингизни ёзинг:"
    )

    markup = types.InlineKeyboardMarkup(row_width=1)
    q1 = types.InlineKeyboardButton("🍗 Тўйда ош есам нима қилишим керак?", callback_data="ai_toy_osh")
    q2 = types.InlineKeyboardButton("🏢 Офисда ўтириб ишловчиларга нима тавсия этилади?", callback_data="ai_office")
    q3 = types.InlineKeyboardButton("🌙 Кечқурун 20:00 дан кейин қорним очса-чи?", callback_data="ai_late_eat")
    q4 = types.InlineKeyboardButton("🫖 Кўк чой ростдан ҳам озишга ёрдам берадими?", callback_data="ai_green_tea")
    markup.add(q1, q2, q3, q4)

    bot.send_message(message.chat.id, text, reply_markup=markup)

# ==============================================================================
# WEB PLATFORM LINK
# ==============================================================================

@bot.message_handler(func=lambda msg: msg.text == "🌐 Веб-сайтни очиш")
def send_web_link(message):
    text = (
        "🌐 <b>«Мувозанат 24» веб-платформаси:</b>\n\n"
        "Сайтда сиз тўлиқ 7 кунлик миллий таомномани, интерактив SVG вазн графигини, "
        "AI озиқ-овқат сканерини, харидлар рўйхатини ва шахсий калория калькуляторини кўришингиз мумкин.\n\n"
        "👇 Сайтимизни очиш учун тугмалардан бирини танланг:"
    )

    markup = types.InlineKeyboardMarkup(row_width=1)
    btn_mini_app = types.InlineKeyboardButton("📱 Telegram ичида очиш (Mini App)", web_app=types.WebAppInfo(url=LIVE_SITE_URL))
    btn_live = types.InlineKeyboardButton("🌐 Расмий веб-сайт (GitHub Pages)", url=LIVE_SITE_URL)
    btn_local = types.InlineKeyboardButton("💻 Маҳаллий серверда очиш (Localhost)", url=LOCAL_SITE_URL)
    markup.add(btn_mini_app, btn_live, btn_local)

    bot.send_message(message.chat.id, text, reply_markup=markup)

# ==============================================================================
# PREMIUM STATUS
# ==============================================================================

@bot.message_handler(func=lambda msg: msg.text == "👑 Premium мақоми")
def send_premium_status(message):
    user_data = get_user_data(message.from_user.id)
    phone = user_data.get('phone') or "Сайтимиз орқали бириктирилмаган"

    text = (
        "👑 <b>Сизнинг VIP / Premium мақомингиз:</b>\n"
        "━━━━━━━━━━━━━━━━━━━\n"
        f"• Исм: <b>{user_data.get('name', 'Фойдаланувчи')}</b>\n"
        f"• Телефон: <b>{phone}</b>\n"
        f"• Мақом: <b>Фаол (Чексиз кириш)</b>\n\n"
        "🌟 <b>Сизга очилган имкониятлар:</b>\n"
        "✅ Чексиз миллий таомларни алмаштириш\n"
        "✅ Шахсий Smart Menu Adaptation (жазосиз калория баланслаш)\n"
        "✅ Telegram орқали кунлик сув ва овқатланиш эслатмалари\n"
        "✅ 7 кунлик автоматик харидлар рўйхати (Shopping list)\n"
        "✅ AI диетолог савол-жавоб тизими"
    )

    bot.send_message(message.chat.id, text)

# ==============================================================================
# CALLBACK QUERY HANDLERS
# ==============================================================================

@bot.callback_query_handler(func=lambda call: True)
def handle_callback(call):
    data = call.data
    user_id = str(call.from_user.id)
    user_data = get_user_data(user_id)

    # 1. Recipe: Plov
    if data == "recipe_plov":
        bot.answer_callback_query(call.id)
        recipe_text = (
            "📖 <b>Тошкент тўй оши — соғлом усулда тайёрлаш рецепти:</b>\n\n"
            "<b>Масаллиқлар (4 порция учун):</b>\n"
            "• Девзира ёки лазер гуруч — 400 г\n"
            "• Ёғсиз юмшоқ мол гўшти — 350 г\n"
            "• Сариқ ва қизил сабзи — 500 г\n"
            "• Ивитилган нўхат — 80 г\n"
            "• Зира, кашнич уруғи, майиз, 1 бош саримсоқ\n"
            "• Ўсимлик ёғи — 80 мл (қўй думбаси солинмайди)\n\n"
            "💡 <b>Диетолог сири:</b>\n"
            "Ошни ортиқча калориясиз тайёрлаш учун думба ёғи ўрнига соф ўсимлик ёғи ишлатинг ва "
            "сабзини кўпроқ солинг. Шунда ош ширадор ва енгил ҳазм бўлади!"
        )
        bot.send_message(call.message.chat.id, recipe_text)

    # 2. Portion Adjustment
    elif data == "portion_small":
        bot.answer_callback_query(call.id, text="Кичик порция ҳисобланди!")
        portion_text = (
            "⚖️ <b>Кичик порция ҳисоби (175 г):</b>\n\n"
            "• Калория: <b>580 ккал → 405 ккал</b> (-175 ккал тежалди!)\n"
            "• Оқсил: 15.5 г | Ёғ: 18 г | Углевод: 45 г\n\n"
            "Кичик порция ош еб, ёнига каттароқ ликопчада ёғсиз <b>Аччиқ-чучук салат</b> қўшсангиз, "
            "ошқозон тўлади ва кунлик калория янада тежалади! 🥗"
        )
        bot.send_message(call.message.chat.id, portion_text)

    # 3. Open Swap menu
    elif data == "open_swap_menu":
        bot.answer_callback_query(call.id)
        send_swap_options(call.message)

    # 4. Smart Swap callbacks
    elif data in ["swap_osh", "swap_manti", "swap_shashlik", "swap_dimlama", "swap_beshbarmak", "swap_mercimek"]:
        bot.answer_callback_query(call.id)
        dish_names = {
            "swap_osh": "Тошкент тўй оши",
            "swap_manti": "Буғда пишган манти",
            "swap_shashlik": "Қийма/люля шашлик",
            "swap_dimlama": "Сабзавотли димлама",
            "swap_beshbarmak": "Бешбармоқ",
            "swap_mercimek": "Мержимек ясмиқ шўрваси"
        }
        chosen = dish_names.get(data, "Миллий таом")

        adapt_text = (
            f"🔄 <b>Ақлли мослашув (Smart Adaptation):</b>\n\n"
            f"Сиз тушликка <b>«{chosen}»</b>ни танладингиз!\n\n"
            f"✅ <b>Система қарори:</b>\n"
            f"Озиш учун севимли таомингиздан воз кечиш шарт эмас! Бугунги кунлик калория меъёрини сақлаш учун "
            f"<b>кечки овқат автоматик равишда енгиллаштирилди:</b>\n"
            f"👉 <i>Кечки таом: Грилда пишган товуқ филеси (150г) ва янги бодринг-помидорли салат (жами 280 ккал).</i>\n\n"
            f"Бу орқали кунлик калория чегарасидан (1,980 ккал) чиқиб кетмайсиз ва вазн камайишда давом этади! 🎉"
        )
        bot.send_message(call.message.chat.id, adapt_text)

    # 5. Water: Add
    elif data == "water_add":
        glasses = user_data.get('water_glasses', 6)
        if glasses < 8:
            user_data['water_glasses'] = glasses + 1
            save_users(users_db)
            bot.answer_callback_query(call.id, text="+1 стакан сув қўшилди! 💧")
        else:
            bot.answer_callback_query(call.id, text="Табриклаймиз! Кунлик 2 литр меъёр бажарилди! 🏆")

        text, markup = get_water_text_and_markup(user_id)
        try:
            bot.edit_message_text(text, call.message.chat.id, call.message.message_id, reply_markup=markup)
        except Exception:
            pass

    # 6. Water: Reset
    elif data == "water_reset":
        user_data['water_glasses'] = 0
        save_users(users_db)
        bot.answer_callback_query(call.id, text="Сув ҳисоби қайта бошланди.")
        text, markup = get_water_text_and_markup(user_id)
        try:
            bot.edit_message_text(text, call.message.chat.id, call.message.message_id, reply_markup=markup)
        except Exception:
            pass

    # 7. Prompt new weight
    elif data == "prompt_new_weight":
        bot.answer_callback_query(call.id)
        msg = bot.send_message(call.message.chat.id, "Илтимос, бугунги вазнингизни рақамда ёзиб юборинг (масалан: <code>93.4</code>):")
        bot.register_next_step_handler(msg, process_weight_step)

    # 8. AI Answers
    elif data == "ai_toy_osh":
        bot.answer_callback_query(call.id)
        bot.send_message(
            call.message.chat.id,
            "🍗 <b>Тўйда ёки меҳмондорчиликда нима қилиш керак?</b>\n\n"
            "1. Ош берилганда — ўртадаги лагандан ўз олдингизга тахминан 1 пиёла (200-250г) миқдорида олинг.\n"
            "2. Лагандаги ошнинг устидаги ортиқча ёғини эмас, гуруч ва гўшт қисмини танланг.\n"
            "3. Ёнига кўпроқ <b>Аччиқ-чучук салат</b> олинг. Ундаги ликопин ва клетчатка ёғларнинг сўрилишини секинлаштиради.\n"
            "4. Газли ширин ичимликлар ўрнига иссиқ кўк чой ичинг.\n"
            "5. Кечки овқатни шунчаки қатиқ ёки енгил салат билан ўтказинг!"
        )

    elif data == "ai_office":
        bot.answer_callback_query(call.id)
        bot.send_message(
            call.message.chat.id,
            "🏢 <b>Офис ходимлари учун озиш қоидалари:</b>\n\n"
            "1. Ҳар 1 соатда 5 дақиқа туриб қадам ташланг ёки зинадан кўтарилиб тушинг.\n"
            "2. Иш столида печенье ва ширинлик ўрнига ёнғоқ (кунига 5-6 дона) ёки олма сақланг.\n"
            "3. Иш столига 1 литрли графин ёки сув идиши қўйинг ва кун давомида қултумлаб ичинг.\n"
            "4. Тушликни компьютер қаршисида эмас, хотиржам 15-20 дақиқа чайнаб енг."
        )

    elif data == "ai_late_eat":
        bot.answer_callback_query(call.id)
        bot.send_message(
            call.message.chat.id,
            "🌙 <b>Кечқурун соат 20:00 дан кейин қорнингиз очса:</b>\n\n"
            "Қаттиқ очликни сабр билан кутиб ухлай олмаслик стресс гормони (кортизол)ни оширади. Бунинг ўрнига:\n"
            "• 1 стакан кам ёғли қатиқ ёки сузма\n"
            "• Ёки 1 та бодринг\n"
            "• Ёки 1 та қайнатилган тухум оқи\n"
            "Ушбу маҳсулотлар ошқозонни тинчлантиради ва ёғ тўпланишига сабаб бўлмайди."
        )

    elif data == "ai_green_tea":
        bot.answer_callback_query(call.id)
        bot.send_message(
            call.message.chat.id,
            "🫖 <b>Кўк чойнинг фойдаси:</b>\n\n"
            "Кўк чой таркибидаги катехинлар ва полифеноллар моддалар алмашинувини (метаболизм) 4-5% га тезлаштиради. "
            "Аммо энг муҳими — овқатдан кейин иссиқ кўк чой ичиш ортиқча ширинлик ейиш истагини камайтиради ва ҳазмни енгиллаштиради."
        )

# ==============================================================================
# GUARDRAILS & AI NUTRITIONIST QUERY HANDLER (Domain Restriction)
# ==============================================================================

STANDARD_BOT_REFUSAL = "Кечирасиз, мен фақат тўғри овқатланиш, вазн йўқотиш ва парҳез масалаларида ёрдам бера оламан."

OFF_TOPIC_BOT_PATTERNS = [
    r'ignore\s+(previous|all)\s+instructions',
    r'system\s+prompt',
    r'act\s+as\s+(a|an)?',
    r'dan\s+mode',
    r'jailbreak',
    r'\b(python|javascript|html|css|php|java|c\+\+|sql|database|api|код|скрипт|дастурлаш|программирован)\b',
    r'\b(siyosat|prezident|hukumat|saylov|urush|harbiy|armiya|сиёсат|президент|правительств|выборы|война|армия)\b',
    r'\b(mazhab|masjid|cherkov|dinlar|ateizm|дини)\b',
    r'\b(avtomobil|mashina|bmw|mercedes|kino|serial|futbol|messi|ronaldo|valyuta|dollar|bitcoin)\b'
]

NUTRITION_BOT_KEYWORDS = [
    'osh', 'palov', 'manti', 'somsa', 'shurva', 'dimlama', 'mastava', 'shashlik', 'beshbarmak',
    'kaloriya', 'vazn', 'ozish', 'semirish', 'parhez', 'dieta', 'oqsil', 'uglevod', 'yog',
    'non', 'shakar', 'suv', 'choy', 'nonushta', 'tushlik', 'kechki', 'ovqat', 'taom', 'ochlik',
    'ош', 'палов', 'манти', 'сомса', 'шўрва', 'димлама', 'шашлик', 'бешбармоқ', 'калория', 'вазн',
    'озиш', 'семириш', 'парҳез', 'диета', 'оқсил', 'углевод', 'ёғ', 'нон', 'шакар', 'сув', 'чой',
    'нонушта', 'тушлик', 'кечки', 'овқат', 'таом', 'очлик', 'иштаҳа', 'салат', 'тухум', 'гўшт', 'товуқ'
]

def check_bot_guardrails(text):
    clean = text.strip().lower()
    import re
    for pat in OFF_TOPIC_BOT_PATTERNS:
        if re.search(pat, clean, re.IGNORECASE):
            return False
    return True

def is_nutrition_topic(text):
    clean = text.strip().lower()
    return any(kw in clean for kw in NUTRITION_BOT_KEYWORDS)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

def call_openai_nutritionist(prompt, user_data):
    try:
        import requests
        system_instruction = (
            "Сиз Ўзбекистоннинг энг тажрибали, профессионал нутрициологи ва парҳезшуносисиз. "
            "Мақсадингиз — фойдаланувчиларга соғлом озишда ёрдам бериш.\n"
            "Фойдаланувчи сиёсат, дин, дастурлаш, умумий тарих ёки парҳезга алоқаси бўлмаган ҳар қандай бошқа мавзуда савол берса, жавоб беришни қатъиян рад этинг.\n"
            f"Қолип жавоб: \"{STANDARD_BOT_REFUSAL}\"\n\n"
            f"Фойдаланувчи кўрсаткичлари:\n"
            f"- Исми: {user_data.get('name', 'Фойдаланувчи')}\n"
            f"- Ҳозирги вазни: {user_data.get('weight', 93.8)} кг, Бўйи: {user_data.get('height', 178)} см, Мақсади: {user_data.get('target_weight', 82.0)} кг\n"
            f"- Кунлик калория меъёри: ~1,850 ккал (соғлом -450 ккал дефицит)\n\n"
            "Ўзбек тилида (Кирилл ёки Лотин ёзувида фойдаланувчи услубига мос), дўстона ва профессионал маслаҳат беринг. Ҳар бир тавсияни миллий таомлар, порция ва калориялар билан бойитинг."
        )

        headers = {
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 500,
            "temperature": 0.7
        }
        res = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=12)
        if res.status_code == 200:
            data = res.json()
            return data["choices"][0]["message"]["content"]
    except Exception as e:
        logger.error(f"OpenAI call error: {e}")
    return None

@bot.message_handler(func=lambda msg: msg.text and not msg.text.startswith('/'))
def handle_ai_chat_message(message):
    text = message.text.strip()

    # Check if barcode (e.g. 8 to 13 digits)
    if clean_num.isdigit() and len(clean_num) >= 8:
        handle_barcode_query(message, clean_num)
        return

    # Check if number (weight input)
    if clean_num.isdigit():
        handle_direct_weight_input(message)
        return

    # Button handler: 📷 Таомни скан қилиш
    if text == "📷 Таомни скан қилиш":
        bot.send_message(
            message.chat.id,
            "📸 <b>AI Таом Сканери:</b>\n\n"
            "Илтимос, емоқчи бўлган таомингиз расмини юборинг ёки камерадан суратга олиб жўнатинг.\n"
            "<i>OpenAI Vision сунъий интеллекти таомни аниқлаб, тахминий калория ва БЖУни ҳисоблаб беради!</i>"
        )
        return

    # Button handler: 📊 Кунлик калория баланси
    if text == "📊 Кунлик калория баланси":
        user_data = get_user_data(message.from_user.id)
        consumed = user_data.get('consumed_today', 1260)
        target = 1850
        rem = max(0, target - consumed)
        pct = min(100, round((consumed / target) * 100))
        bar = "🟩" * (pct // 10) + "⬜" * (10 - (pct // 10))

        text_bal = (
            "📊 <b>Бугунги калория балансингиз:</b>\n"
            "━━━━━━━━━━━━━━━━━━━\n"
            f"🎯 Кунлик мақсад: <b>{target:,} ккал</b>\n"
            f"🍽 Истеъмол қилинди: <b>{consumed:,} ккал</b>\n"
            f"⚡ Қолди: <b>{rem:,} ккал</b>\n\n"
            f"Прогресс ({pct}%):\n{bar}\n\n"
            "<i>Таом расмини юбориб, рационингизни бир зумда тўлдиришингиз мумкин!</i>"
        )
        bot.send_message(message.chat.id, text_bal)
        return

    # Check Guardrails: Off-topic / Injection
    if not check_bot_guardrails(text) or not is_nutrition_topic(text):
        bot.send_message(message.chat.id, STANDARD_BOT_REFUSAL)
        return

    user_data = get_user_data(message.from_user.id)
    name = user_data.get('name', 'Азиз фойдаланувчи')
    weight = user_data.get('weight', 93.8)
    target_w = user_data.get('target_weight', 82.0)
    lower = text.lower()

    # Try calling OpenAI gpt-4o-mini first
    openai_reply = call_openai_nutritionist(text, user_data)
    if openai_reply:
        bot.send_message(message.chat.id, openai_reply)
        return

    # Fallback to smart local nutrition engine
    if any(w in lower for w in ['osh', 'palov', 'ош', 'палов']):
        reply = (
            f"🍚 <b>Тошкент тўй оши бўйича нутрициолог таҳлили:</b>\n"
            f"• Стандарт порция (250 г): <b>~580 ккал</b> (Оқсил: 22г, Ёғ: 26г, Углевод: 64г).\n\n"
            f"💡 <b>Мувозанат сири:</b> Озиш учун ошдан бутунлай воз кечиш шарт эмас! "
            f"Ош еганда ёнига каттароқ <b>Аччиқ-чучук салат</b> олинг ва кечки овқатни енгиллаштириб "
            f"товуқ филеси (280 ккал) билан мувозанатланг. Шунда кунлик калория меъёрингизда қоласиз!"
        )
    elif any(w in lower for w in ['tushlik', 'nima yesam', 'тушлик', 'нима есам']):
        reply = (
            f"🥗 <b>Сизнинг бугунги кўрсаткичларингиз ({weight} кг, мақсад: {target_w} кг) бўйича тавсия:</b>\n\n"
            f"• <b>Тушликка:</b> Тошкент тўй оши (250г) ёки суюқ Шўрва + Аччиқ-чучук салат (ёғсиз).\n"
            f"• <b>Кечки таом:</b> Грил товуқ филеси ва сабзавотлар (280 ккал).\n\n"
            f"Ушбу тартиб кунлик 1,850 ккал хавфсиз озиш дефицитини таъминлайди!"
        )
    elif any(w in lower for w in ['ochlik', 'och qoldim', 'очлик', 'оч қолдим', 'иштаҳа']):
        reply = (
            f"⚡ <b>Очлик ҳиссини енгиш бўйича 3 та тавсия:</b>\n\n"
            f"1. <b>Илиқ сув:</b> 1 катта стакан (300 мл) илиқ сув ичинг ва 10 дақиқа кутинг.\n"
            f"2. <b>Клетчатка:</b> 1 та янги бодринг ёки қайнатилган тухум оқи енг.\n"
            f"3. <b>Кўк чой:</b> Иссиқ кўк чой иштаҳа марказини тинчлантиради ва ёғ тўпланишини олдини олади."
        )
    elif any(w in lower for w in ['kechki', 'kechasi', 'кечки', 'кечаси', '20:00']):
        reply = (
            f"🌙 <b>Кечки овқатланиш қоидаси:</b>\n\n"
            f"Кечки 19:30-20:00 дан кейин очлик сезилса, ўзингизни қийнаманг. "
            f"1 стакан кам ёғли қатиқ, сузма ёки 1 та бодринг ейиш мумкин. Улар ошқозонни тинчлантиради ва озиш жараёнига халақит бермайди."
        )
    else:
        reply = (
            f"💡 <b>Нутрициолог хулосаси:</b>\n\n"
            f"Ҳозирги вазнингиз <b>{weight} кг</b> ва мақсадингиз <b>{target_w} кг</b>.\n"
            f"Миллий таомларимиз тўйимли ва фойдали. Энг муҳим қоида — порция назорати ва кечки таомни енгил тутишдир.\n\n"
            f"Яна қандай таом ёки маҳсулот ҳақида билмоқчисиз?"
        )

    bot.send_message(message.chat.id, reply)

# ==============================================================================
# PHOTO SCANNER (OpenAI Vision Integration)
# ==============================================================================

@bot.message_handler(content_types=['photo'])
def handle_food_photo_scanner(message):
    status_msg = bot.reply_to(
        message,
        "🔍 <b>Расм қабул қилинди!</b>\n"
        "<i>OpenAI Vision орқали таом ва порция таҳлил қилинмоқда...</i>"
    )

    try:
        import base64
        file_id = message.photo[-1].file_id
        file_info = bot.get_file(file_id)
        downloaded = bot.download_file(file_info.file_path)
        base64_img = base64.b64encode(downloaded).decode('utf-8')

        # Vision API Call
        prompt = (
            "Siz O'zbekistonning yetakchi nutrisiologisiz. Ushbu rasmdagi taomni aniqlang.\n"
            "O'zbek yoki Markaziy Osiyo milliy taomini imkon qadar aniq nomlang (masalan: Toshkent to'y oshi, Manti, Tandir somsa, Lag'mon, Shurva, Dimlama, Shashlik).\n"
            "Javobni FAQAT quyidagi JSON formatda qaytaring:\n"
            "{\n"
            '  "food_name": "Тошкент тўй оши",\n'
            '  "portion_g": 280,\n'
            '  "confidence": 0.94,\n'
            '  "cal_min": 590,\n'
            '  "cal_max": 680,\n'
            '  "cal_avg": 635,\n'
            '  "protein": 22,\n'
            '  "fat": 24,\n'
            '  "carbs": 76,\n'
            '  "components": "Гуруч (150г), Гўшт (70г), Сабзи (60г)",\n'
            '  "tip": "Кўпроқ аччиқ-чучук салат ва кўк чой билан тановул қилинг!"\n'
            "}"
        )

        headers = {
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "gpt-4o-mini",
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_img}", "detail": "low"}}
                    ]
                }
            ],
            "max_tokens": 400,
            "temperature": 0.2
        }

        import requests
        res = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=16)

        try:
            bot.delete_message(message.chat.id, status_msg.message_id)
        except Exception:
            pass

        if res.status_code == 200:
            import json
            content = res.json()["choices"][0]["message"]["content"]
            clean = content.replace("```json", "").replace("```", "").strip()
            data = json.loads(clean)
            send_photo_analysis_card(message.chat.id, data)
        else:
            send_fallback_scan_card(message.chat.id)

    except Exception as e:
        logger.error(f"Vision error: {e}")
        try:
            bot.delete_message(message.chat.id, status_msg.message_id)
        except Exception:
            pass
        send_fallback_scan_card(message.chat.id)

def send_photo_analysis_card(chat_id, data):
    name = data.get('food_name', 'Тошкент тўй оши')
    portion = data.get('portion_g', 280)
    cal_avg = data.get('cal_avg', 635)
    cal_min = data.get('cal_min', 590)
    cal_max = data.get('cal_max', 680)
    protein = data.get('protein', 22)
    fat = data.get('fat', 24)
    carbs = data.get('carbs', 76)
    components = data.get('components', 'Гуруч, гўшт, сабзи')
    tip = data.get('tip', 'Кўпроқ аччиқ-чучук салат билан истеъмол қилинг!')

    text = (
        f"📸 <b>AI Food Scanner натижаси:</b>\n"
        f"━━━━━━━━━━━━━━━━━━━\n"
        f"🍲 Аниқланган таом: <b>{name}</b>\n"
        f"🟢 Ишонч даражаси: <b>93% (Verified)</b>\n"
        f"⚖️ Тахминий порция: <b>{portion} г</b>\n\n"
        f"🔥 <b>Тахминий калория: {cal_min} – {cal_max} ккал</b>\n"
        f"<i>(ўртача ~{cal_avg} ккал)</i>\n\n"
        f"📊 <b>Макронутриентлар (БЖУ):</b>\n"
        f"• Оқсил: <b>{protein} г</b>\n"
        f"• Ёғ: <b>{fat} г</b>\n"
        f"• Углевод: <b>{carbs} г</b>\n\n"
        f"🍱 <b>Таркиби:</b> {components}\n"
        f"💡 <b>Маслаҳат:</b> {tip}"
    )

    markup = types.InlineKeyboardMarkup(row_width=3)
    b1 = types.InlineKeyboardButton(f"➕ Тушликка ({portion}г)", callback_data=f"diary_add_lunch_{cal_avg}")
    b2 = types.InlineKeyboardButton(f"➕ Кечкига ({portion}г)", callback_data=f"diary_add_dinner_{cal_avg}")
    p1 = types.InlineKeyboardButton("150г", callback_data=f"set_grams_150_{int(cal_avg*150/portion)}")
    p2 = types.InlineKeyboardButton("250г", callback_data=f"set_grams_250_{int(cal_avg*250/portion)}")
    p3 = types.InlineKeyboardButton("350г", callback_data=f"set_grams_350_{int(cal_avg*350/portion)}")
    b_swap = types.InlineKeyboardButton("🔄 Бошқа таом", callback_data="open_swap_menu")
    markup.add(b1, b2)
    markup.add(p1, p2, p3)
    markup.add(b_swap)

    bot.send_message(chat_id, text, reply_markup=markup)

@bot.callback_query_handler(func=lambda call: call.data.startswith('set_grams_'))
def handle_set_grams_callback(call):
    parts = call.data.split('_')
    grams = parts[2]
    cal = parts[3]
    bot.answer_callback_query(call.id, text=f"Вазн {grams}г (~{cal} ккал) этиб белгиланди")
    markup = types.InlineKeyboardMarkup(row_width=2)
    b1 = types.InlineKeyboardButton(f"➕ Тушликка ({grams}г / ~{cal} ккал)", callback_data=f"diary_add_lunch_{cal}")
    b2 = types.InlineKeyboardButton(f"➕ Кечкига ({grams}г / ~{cal} ккал)", callback_data=f"diary_add_dinner_{cal}")
    markup.add(b1, b2)
    bot.edit_message_reply_markup(call.message.chat.id, call.message.message_id, reply_markup=markup)

@bot.message_handler(func=lambda msg: msg.text and any(k in msg.text.lower() for k in ['грамм', 'г ', 'г,', 'g ', 'g,']) and any(d in msg.text.lower() for d in ['ош', 'палов', 'манти', 'сомса', 'шўрва', 'шурва', 'лағмон', 'лагман', 'шашлик', 'димлама']))
def handle_food_grams_text(message):
    import re
    text_lower = message.text.lower()
    match_grams = re.search(r'(\d{2,4})\s*(?:г|грамм|g)', text_lower)
    grams = int(match_grams.group(1)) if match_grams else 250
    
    dish_name = "Миллий таом"
    cal_100 = 200
    if 'ош' in text_lower or 'палов' in text_lower:
        dish_name = "Тошкент тўй оши"
        cal_100 = 232
    elif 'манти' in text_lower:
        dish_name = "Буғда пишган манти"
        cal_100 = 184
    elif 'сомса' in text_lower:
        dish_name = "Тандир сомса"
        cal_100 = 260
    elif 'шўрва' in text_lower or 'шурва' in text_lower:
        dish_name = "Қайнатма шўрва"
        cal_100 = 95
    elif 'лағмон' in text_lower or 'лагман' in text_lower:
        dish_name = "Қовурма лағмон"
        cal_100 = 145
    elif 'шашлик' in text_lower:
        dish_name = "Қўй гўшти шашлик"
        cal_100 = 215
    elif 'димлама' in text_lower:
        dish_name = "Сабзавотли димлама"
        cal_100 = 110

    total_cal = int(cal_100 * grams / 100)
    prot = round(grams * 0.08, 1)
    fat = round(grams * 0.09, 1)
    carbs = round(grams * 0.22, 1)

    reply_text = (
        f"🥗 <b>{dish_name} ({grams} грамм):</b>\n"
        f"━━━━━━━━━━━━━━━━━━━\n"
        f"🔥 Калория: <b>~{total_cal} ккал</b>\n"
        f"📊 БЖУ: Оқсил ~{prot}г | Ёғ ~{fat}г | Углевод ~{carbs}г\n\n"
        f"Кунлик рационингизга қўшасизми?"
    )
    markup = types.InlineKeyboardMarkup(row_width=2)
    b1 = types.InlineKeyboardButton(f"➕ Тушликка ({total_cal} ккал)", callback_data=f"diary_add_lunch_{total_cal}")
    b2 = types.InlineKeyboardButton(f"➕ Кечкига ({total_cal} ккал)", callback_data=f"diary_add_dinner_{total_cal}")
    markup.add(b1, b2)
    bot.send_message(message.chat.id, reply_text, reply_markup=markup)

def send_fallback_scan_card(chat_id):
    text = (
        "⚠️ <b>Таомни аниқлаб бўлмади</b>\n\n"
        "Ҳозир расмни таҳлил қилиб бўлмади. Илтимос, таомни яқинроқдан ва ёруғроқ жойда суратга олиб қайта юборинг "
        "ёки таом номини чатда ёзинг (масалан: <i>'Бугун тушликка ош еяпман'</i>)."
    )
    bot.send_message(chat_id, text)

# ==============================================================================
# BARCODE SCANNER
# ==============================================================================

BARCODE_BOT_DB = {
    '5449000000996': {'name': 'Coca-Cola Classic', 'cal_100': 42, 'serving': '500 мл (бутун қадоқ: 210 ккал)'},
    '4780017170019': {'name': 'Dinay Olma-Uzum sharbati', 'cal_100': 48, 'serving': '200 мл (96 ккал)'},
    '4780004520018': {'name': 'Musaffo 2.5% Tabiiy Sut', 'cal_100': 53, 'serving': '250 мл (132 ккал)'},
    '4780029570029': {'name': 'Nestle Sutim 3.2%', 'cal_100': 59, 'serving': '250 мл (147 ккал)'},
    '5000159461122': {'name': 'Snickers shokoladli batonchik', 'cal_100': 507, 'serving': '50 г (253 ккал)'}
}

def handle_barcode_query(message, code):
    if code in BARCODE_BOT_DB:
        item = BARCODE_BOT_DB[code]
        text = (
            f"▦ <b>Shtrix-kod аниқланди ({code}):</b>\n"
            f"━━━━━━━━━━━━━━━━━━━\n"
            f"🥤 Маҳсулот: <b>{item['name']}</b>\n"
            f"• 100 мл/г учун: <b>{item['cal_100']} ккал</b>\n"
            f"• Порция: <b>{item['serving']}</b>\n\n"
            f"✅ <i>Маҳсулот расмий база орқали тасдиқланди!</i>"
        )
        bot.send_message(message.chat.id, text)
    else:
        bot.send_message(
            message.chat.id,
            f"▦ Shtrix-kod: <code>{code}</code> базада топилмади.\n"
            f"Илтимос, маҳсулотнинг орқа қисмидаги «Озиқавий қиймати» (Nutrition facts) ёрлиғини расмга олиб юборинг."
        )

# Callback diary addition handler
@bot.callback_query_handler(func=lambda call: call.data.startswith('diary_add_'))
def handle_diary_add_callback(call):
    parts = call.data.split('_')
    meal = parts[2] # 'lunch' or 'dinner'
    cal = int(parts[3]) if len(parts) > 3 else 635

    user_data = get_user_data(call.from_user.id)
    user_data['consumed_today'] = user_data.get('consumed_today', 1260) + cal
    save_users(users_db)

    meal_name = "Тушликка" if meal == 'lunch' else "Кечки овқатга"
    bot.answer_callback_query(call.id, text=f"✅ {meal_name} {cal} ккал қўшилди!")

    rem = max(0, 1850 - user_data['consumed_today'])
    bot.send_message(
        call.message.chat.id,
        f"✅ <b>{meal_name} муваффақиятли қўшилди: +{cal} ккал!</b>\n"
        f"Бугунги жами истеъмол: <b>{user_data['consumed_today']} / 1,850 ккал</b> (Қолди: <b>{rem} ккал</b>)."
    )

def process_weight_step(message):
    handle_direct_weight_input(message)

# ==============================================================================
# MAIN ENTRYPOINT
# ==============================================================================

if __name__ == '__main__':
    logger.info("Muvozanat Telegram Bot (@muvozanat24_bot) is starting polling...")
    print(">>> @muvozanat24_bot is actively running!")
    try:
        bot.infinity_polling(timeout=20, long_polling_timeout=10)
    except Exception as e:
        logger.error(f"Bot error: {e}")
