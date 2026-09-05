// Admin CMS Module
// Content Management & Product KPI Analytics (Section 24 & 32)

const AdminCMS = {
  renderFoodsTable(containerId, foodsList) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let rowsHtml = '';
    foodsList.forEach(food => {
      const name = food.name[currentLanguage] || food.name['uz-Latn'];
      rowsHtml += `
        <tr>
          <td><img src="${food.image}" alt="${name}" class="admin-dish-thumb" onerror="this.src='assets/images/plov.jpg'"/></td>
          <td>
            <strong>${name}</strong><br>
            <span class="badge-cuisine">${food.country} (${food.cuisine})</span>
          </td>
          <td><span class="badge-category">${food.category}</span></td>
          <td>${food.servingSize}</td>
          <td><strong>${food.calories}</strong> kkal</td>
          <td>${food.protein}g / ${food.fat}g / ${food.carbs}g</td>
          <td>
            <button class="btn-action-sm btn-delete-food" data-id="${food.id}" title="O'chirish">🗑️</button>
          </td>
        </tr>
      `;
    });

    container.innerHTML = `
      <div class="admin-table-wrapper">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Rasm</th>
              <th>Nomi va Oshxona</th>
              <th>Vaqt</th>
              <th>Porsiya</th>
              <th>Kaloriya</th>
              <th>B / J / U</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;

    // Attach delete handlers
    container.querySelectorAll('.btn-delete-food').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Ushbu taomni bazadan o\'chirishni tasdiqlaysizmi?')) {
          App.deleteFoodItem(id);
        }
      });
    });
  },

  renderKPIMetrics(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Data corresponding to Section 32
    const metrics = [
      { label: t('kpi_reg_completion'), target: '≥80%', actual: '84.2%', status: 'success' },
      { label: t('kpi_onboard_completion'), target: '≥70%', actual: '76.8%', status: 'success' },
      { label: t('kpi_first_weight'), target: '≥60%', actual: '68.5%', status: 'success' },
      { label: t('kpi_retention_7'), target: '≥30%', actual: '33.1%', status: 'success' },
      { label: 'Month-1 retention', target: '≥20%', actual: '22.4%', status: 'success' },
      { label: t('kpi_crash_free'), target: '≥99.5%', actual: '99.9%', status: 'success' }
    ];

    let cardsHtml = '';
    metrics.forEach(m => {
      cardsHtml += `
        <div class="kpi-card">
          <div class="kpi-card-header">
            <span class="kpi-label">${m.label}</span>
            <span class="kpi-target-tag">Target: ${m.target}</span>
          </div>
          <div class="kpi-value ${m.status}">${m.actual}</div>
          <div class="kpi-progress-bar">
            <div class="kpi-progress-fill" style="width: ${Math.min(parseFloat(m.actual), 100)}%;"></div>
          </div>
        </div>
      `;
    });

    const currentBot = localStorage.getItem('muvozanat_telegram_bot') || 'muvozanat24_bot';
    const currentApiKey = localStorage.getItem('muvozanat_ai_api_key') || '';
    const currentProvider = localStorage.getItem('muvozanat_ai_provider') || 'openai';
    const currentLimit = localStorage.getItem('muvozanat_ai_limit') || '10';

    container.innerHTML = `
      <div class="kpi-grid">${cardsHtml}</div>

      <!-- Telegram Bot Setting -->
      <div style="margin-top: 18px; padding: 14px; background: #FFFBEB; border: 1px solid #FDE68A; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
        <div>
          <strong style="color: #92400E;">🤖 Premium Telegram Bot:</strong>
          <span style="font-size: 0.85rem; color: #78350F; display: block;">Foydalanuvchilar Premium tugmasini bosganda ushbu botga o'tadi</span>
        </div>
        <div style="display: flex; gap: 8px;">
          <input type="text" id="adminBotInput" class="form-control" value="${currentBot}" style="padding: 6px 12px; font-size: 0.88rem; width: 180px;">
          <button class="btn-primary" style="padding: 6px 14px; font-size: 0.85rem;" onclick="
            const val = document.getElementById('adminBotInput').value.trim().replace(/^@/, '');
            if (val) {
              localStorage.setItem('muvozanat_telegram_bot', val);
              App.showToast('Telegram bot @' + val + ' saqlandi!');
            }
          ">Saqlash</button>
        </div>
      </div>

      <!-- AI-Nutrisiolog LLM Settings -->
      <div style="margin-top: 14px; padding: 16px; background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: var(--radius-md);">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
          <div>
            <strong style="color: #166534; font-size: 0.95rem;">🧠 AI-Nutrisiolog Moduli Sozlamalari (Guardrails & LLM):</strong>
            <span style="font-size: 0.82rem; color: #15803D; display: block;">Domain Restriction: Faqat parhez va vazn yo'qotish mavzulari ruxsat etilgan</span>
          </div>
          <button class="btn-secondary" style="padding: 4px 10px; font-size: 0.78rem;" onclick="AINutritionist.clearHistory()">
            🗑 Chat tarixini tozalash
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
          <div>
            <label style="font-size: 0.8rem; font-weight: 600; color: #166534; display: block; margin-bottom: 4px;">LLM Provider:</label>
            <select id="adminAiProvider" class="form-control" style="padding: 6px 10px; font-size: 0.85rem;">
              <option value="gemini" ${currentProvider === 'gemini' ? 'selected' : ''}>Google Gemini (1.5 Flash)</option>
              <option value="openai" ${currentProvider === 'openai' ? 'selected' : ''}>OpenAI (GPT-4o mini)</option>
              <option value="local" ${currentProvider === 'local' ? 'selected' : ''}>Smart Local NLP (Avtonom rejim)</option>
            </select>
          </div>

          <div>
            <label style="font-size: 0.8rem; font-weight: 600; color: #166534; display: block; margin-bottom: 4px;">API Kaliti (Ixtiyoriy):</label>
            <input type="password" id="adminAiApiKey" class="form-control" value="${currentApiKey}" placeholder="AIza... yoki sk-..." style="padding: 6px 10px; font-size: 0.85rem;">
          </div>

          <div>
            <label style="font-size: 0.8rem; font-weight: 600; color: #166534; display: block; margin-bottom: 4px;">Kunlik savollar limiti (Bepul):</label>
            <input type="number" id="adminAiLimit" class="form-control" value="${currentLimit}" min="1" max="100" style="padding: 6px 10px; font-size: 0.85rem;">
          </div>
        </div>

        <div style="margin-top: 12px; text-align: right;">
          <button class="btn-primary" style="padding: 6px 16px; font-size: 0.85rem;" onclick="
            const prov = document.getElementById('adminAiProvider').value;
            const key = document.getElementById('adminAiApiKey').value.trim();
            const lim = parseInt(document.getElementById('adminAiLimit').value) || 10;
            localStorage.setItem('muvozanat_ai_provider', prov);
            localStorage.setItem('muvozanat_ai_api_key', key);
            localStorage.setItem('muvozanat_ai_limit', lim);
            if (typeof AINutritionist !== 'undefined') {
              AINutritionist.dailyLimit = lim;
              AINutritionist.updateQueriesBadge();
            }
            App.showToast('AI-Nutrisiolog sozlamalari saqlandi!');
          ">Sozlamalarni saqlash</button>
        </div>
      </div>

      <!-- Section 27: Barcode Database & User Corrections Management -->
      <div style="margin-top: 14px; padding: 16px; background: #FEF3C7; border: 1px solid #FDE68A; border-radius: var(--radius-md);">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 8px;">
          <div>
            <strong style="color: #92400E; font-size: 0.95rem;">▦ Shtrix-kodlar va Foydalanuvchi Tuzatishlari (Admin CMS):</strong>
            <span style="font-size: 0.82rem; color: #B45309; display: block;">Shtrix-kod bazasiga yangi mahsulot qo'shish va AI tuzatishlarini ko'rish</span>
          </div>
          <button class="btn-primary" style="padding: 4px 12px; font-size: 0.8rem; background: #D97706;" onclick="
            const code = prompt('Shtrix-kod (EAN-13):', '4780000000000');
            if (code) {
              const name = prompt('Mahsulot nomi va brendi:', 'Yangi sharbat');
              const cal = parseInt(prompt('100g/ml uchun kaloriya:', '45')) || 45;
              if (typeof FoodScanner !== 'undefined') {
                FoodScanner.BARCODE_DB[code] = { name: name, brand: 'Lokal', cal_100: cal, protein_100: 1, fat_100: 0, carbs_100: 10, serving_size: '250 ml', serving_multiplier: 2.5, verified: true };
                App.showToast('Yangi shtrix-kod ' + code + ' bazaga qo\'shildi!');
              }
            }
          ">➕ Yangi shtrix-kod qo'shish</button>
        </div>
        <div style="font-size: 0.82rem; color: #78350F; background: #FFFBEB; padding: 8px 12px; border-radius: 6px; margin-top: 6px;">
          <b>Foydalanuvchi tuzatishlari (User Corrections Loop):</b> 
          <span id="adminCorrectionsCount">
            ${(JSON.parse(localStorage.getItem('muvozanat_corrections') || '[]')).length} ta qayd mavjud
          </span>
        </div>
      </div>
    `;
  }
};

