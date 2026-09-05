// Weight Tracking & Dynamic SVG Chart Module
// Pure zero-dependency SVG renderer with interactive tooltips, target line, and forecast trajectory

const WeightChart = {
  render(containerId, weightLogs, targetWeight, startWeight) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!weightLogs || weightLogs.length === 0) {
      container.innerHTML = `<div class="chart-empty-state">Ma'lumotlar mavjud emas</div>`;
      return;
    }

    const width = container.clientWidth || 680;
    const height = 280;
    const padding = { top: 30, right: 35, bottom: 45, left: 55 };

    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    // Determine min/max values
    const weights = weightLogs.map(l => Number(l.weight));
    const allVals = [...weights, Number(targetWeight)];
    const minVal = Math.floor(Math.min(...allVals) - 2);
    const maxVal = Math.ceil(Math.max(...allVals) + 2);
    const rangeY = Math.max(maxVal - minVal, 5);

    // Coordinate mapping functions
    const getX = (index, total) => padding.left + (index / Math.max(total - 1, 1)) * chartW;
    const getY = (val) => padding.top + chartH - ((val - minVal) / rangeY) * chartH;

    // Generate points
    const points = weightLogs.map((log, idx) => ({
      x: getX(idx, weightLogs.length),
      y: getY(log.weight),
      weight: log.weight,
      date: log.date
    }));

    // Generate SVG path for actual weight line
    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      // Smooth cubic curve
      const prev = points[i - 1];
      const curr = points[i];
      const cpX = (prev.x + curr.x) / 2;
      pathD += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    // Area fill path for smooth gradient
    const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

    // Target reference line Y coordinate
    const targetY = getY(targetWeight);

    // Y Axis grid lines (4-5 horizontal divisions)
    let gridLinesHtml = '';
    const stepY = rangeY > 15 ? 5 : 2;
    for (let w = Math.ceil(minVal); w <= maxVal; w += stepY) {
      const y = getY(w);
      gridLinesHtml += `
        <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="#E5E7EB" stroke-width="1" stroke-dasharray="3 3"/>
        <text x="${padding.left - 12}" y="${y + 4}" font-size="11" fill="#6B7280" text-anchor="end" font-family="Inter, sans-serif">${w} kg</text>
      `;
    }

    // X Axis labels
    let xLabelsHtml = '';
    points.forEach((pt) => {
      // format date (MM/DD or DD.MM)
      const d = new Date(pt.date);
      const formatted = isNaN(d.getTime()) ? pt.date : `${d.getDate()}.${d.getMonth() + 1}`;
      xLabelsHtml += `
        <text x="${pt.x}" y="${height - 15}" font-size="11" fill="#6B7280" text-anchor="middle" font-family="Inter, sans-serif">${formatted}</text>
      `;
    });

    // Forecast projected line from last point toward target
    const lastPt = points[points.length - 1];
    const forecastX = Math.min(width - padding.right, lastPt.x + (chartW / weightLogs.length) * 2);
    const forecastD = `M ${lastPt.x} ${lastPt.y} Q ${(lastPt.x + forecastX) / 2} ${lastPt.y - 10}, ${forecastX} ${getY(lastPt.weight - 1.5)}`;

    // Interactive circles and tooltips
    let circlesHtml = '';
    points.forEach((pt, idx) => {
      const isLatest = idx === points.length - 1;
      circlesHtml += `
        <g class="chart-point-group" tabindex="0" role="button" aria-label="${pt.date}: ${pt.weight} kg">
          <circle cx="${pt.x}" cy="${pt.y}" r="${isLatest ? 6 : 4.5}" fill="${isLatest ? '#10B981' : '#FFFFFF'}" stroke="#10B981" stroke-width="${isLatest ? 3 : 2.5}" class="chart-point" />
          <circle cx="${pt.x}" cy="${pt.y}" r="14" fill="transparent" class="chart-point-hover-target" data-date="${pt.date}" data-weight="${pt.weight}"/>
          <text x="${pt.x}" y="${pt.y - 12}" font-size="11" font-weight="600" fill="#047857" text-anchor="middle">${pt.weight}</text>
        </g>
      `;
    });

    const svgHtml = `
      <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" class="weight-svg-canvas">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#10B981" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#10B981" stop-opacity="0.0"/>
          </linearGradient>
        </defs>

        <!-- Grid lines -->
        ${gridLinesHtml}

        <!-- Target Weight Line -->
        <line x1="${padding.left}" y1="${targetY}" x2="${width - padding.right}" y2="${targetY}" stroke="#E07A5F" stroke-width="2" stroke-dasharray="6 4"/>
        <text x="${width - padding.right - 5}" y="${targetY - 8}" font-size="11" font-weight="600" fill="#E07A5F" text-anchor="end">${t('dash_target_weight')}: ${targetWeight} kg</text>

        <!-- Area Fill -->
        <path d="${areaD}" fill="url(#chartGradient)" />

        <!-- Projected Trend Line -->
        <path d="${forecastD}" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-dasharray="4 4"/>
        <text x="${forecastX}" y="${getY(lastPt.weight - 1.5) - 6}" font-size="10" fill="#9CA3AF" text-anchor="end">Prognoz</text>

        <!-- Actual Weight Line -->
        <path d="${pathD}" fill="none" stroke="#10B981" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>

        <!-- Data circles -->
        ${circlesHtml}

        <!-- X Axis labels -->
        ${xLabelsHtml}
      </svg>
      <div id="chartTooltip" class="chart-tooltip" style="display: none;"></div>
    `;

    container.innerHTML = svgHtml;

    // Attach hover listeners for tooltips
    const tooltip = document.getElementById('chartTooltip');
    container.querySelectorAll('.chart-point-hover-target').forEach(el => {
      el.addEventListener('mouseenter', (e) => {
        const date = el.getAttribute('data-date');
        const weight = el.getAttribute('data-weight');
        const bbox = e.target.getBoundingClientRect();
        const parentBbox = container.getBoundingClientRect();

        tooltip.innerHTML = `<strong>${weight} kg</strong><br><span style="font-size:11px;color:#9CA3AF">${date}</span>`;
        tooltip.style.left = `${bbox.left - parentBbox.left + 10}px`;
        tooltip.style.top = `${bbox.top - parentBbox.top - 40}px`;
        tooltip.style.display = 'block';
      });

      el.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });
    });
  }
};
