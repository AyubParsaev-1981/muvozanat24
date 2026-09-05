# Muvozanat 24 — Raqamli Salomatlik va Milliy Taomlar Portali

> **«Muvozanat»** — milliy taomlardan (osh, manti, somsa, sho'rva) voz kechmasdan, vaznni xavfsiz boshqarish, kaloriya va porsiyalarni hisoblash hamda sog'lom turmush tarzini shakllantirish bo'yicha shaxsiy raqamli platforma.

---

## 🌟 Asosiy Imkoniyatlar

1. **5-Sekundlik Interaktiv Dashboard**:
   - Vazn dinamikasi, BMI ko'rsatkichi, kunlik qolgan kaloriya defitsiti va bosqichli progress.
2. **AI Food Scanner (Multimodal Vision & Barcode)**:
   - OpenAI Vision orqali taom fotosuratidan milliy taomlarni aniqlash, porsiyani grammlarda baholash va ozuqaviy qiymatini hisoblash.
   - 20 dan ortiq o'zbek milliy taomlari va ichimliklar shtrix-kodlari bazasi.
3. **Taomlar Kutubxonasi va Grammlarda Kiritish (Grams Calculator)**:
   - Aniq grammlar bo'yicha kaloriya va BJU (oqsil, yog', uglevod) hisob-kitobi.
   - Maxsus taom yaratish va bazaga saqlash imkoniyati.
4. **Qat'iy Autentifikatsiya va Ma'lumotlar Izolyatsiyasi**:
   - Har bir foydalanuvchi hisobi va vazn tarixi shaxsiy `user_id` bilan ajratilgan.
   - GDPR talablari asosida ma'lumotlarni eksport qilish va tozalash.
5. **Telegram Bot Integratsiyasi (@muvozanat24_bot)**:
   - Rasmlar orqali taomlarni aniqlash, suv balansi nazorati va shaxsiy tavsiyalar.

---

## 🚀 Ishga Tushirish

### Veb-sayt:
Mahalliy serverda ishga tushirish:
```bash
python -m http.server 8080
```
Brauzerda: `http://localhost:8080`

### Telegram Bot:
```bash
python bot.py
```
