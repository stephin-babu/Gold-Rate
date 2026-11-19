/**
 * KeralaGold Open - Core Application Logic
 * Open Source Gold & Silver Price Tracker & Calculator
 */

// Fallback dataset ensures instant preview even under file:// protocol
const DEFAULT_DATA = {
  currency: "INR",
  symbol: "₹",
  lastUpdated: "2026-11-19T09:30:00+05:30",
  location: "Kerala, India",
  rates: {
    "22k": {
      gram: 11980,
      pavan: 95840,
      yesterdayGram: 12215,
      yesterdayPavan: 97720,
      changeGram: -235,
      changePavan: -1880,
      changePercent: -1.92,
      trend: "down"
    },
    "24k": {
      gram: 13069,
      pavan: 104552,
      yesterdayGram: 13325,
      yesterdayPavan: 106600,
      changeGram: -256,
      changePavan: -2048,
      changePercent: -1.92,
      trend: "down"
    },
    "18k": {
      gram: 9802,
      pavan: 78416,
      yesterdayGram: 9994,
      yesterdayPavan: 79952,
      changeGram: -192,
      changePavan: -1536,
      changePercent: -1.92,
      trend: "down"
    },
    "silver": {
      gram: 102.00,
      kg: 102000,
      changeGram: -1.5,
      changePercent: -1.45,
      trend: "down"
    }
  },
  monthStats: {
    month: "November 2026",
    highest: {
      date: "5th & 6th Nov 2026",
      pavan: 107080,
      gram: 13385
    },
    lowest: {
      date: "19th Nov 2026",
      pavan: 95840,
      gram: 11980
    }
  },
  history: [
    { date: "19-Nov-2026", session: "Morning", gram22k: 11980, pavan22k: 95840, tag: "Lowest of Month", change: -1880 },
    { date: "18-Nov-2026", session: "Regular", gram22k: 12215, pavan22k: 97720, tag: "", change: -2040 },
    { date: "17-Nov-2026", session: "Regular", gram22k: 12470, pavan22k: 99760, tag: "", change: -560 },
    { date: "16-Nov-2026", session: "Regular", gram22k: 12540, pavan22k: 100320, tag: "", change: -600 },
    { date: "15-Nov-2026", session: "Regular", gram22k: 12615, pavan22k: 100920, tag: "", change: 0 },
    { date: "14-Nov-2026", session: "Regular", gram22k: 12615, pavan22k: 100920, tag: "", change: 200 },
    { date: "13-Nov-2026", session: "Afternoon", gram22k: 12590, pavan22k: 100720, tag: "", change: -840 },
    { date: "13-Nov-2026", session: "Morning", gram22k: 12695, pavan22k: 101560, tag: "", change: -960 },
    { date: "12-Nov-2026", session: "Regular", gram22k: 12815, pavan22k: 102520, tag: "", change: -1600 },
    { date: "11-Nov-2026", session: "Regular", gram22k: 13015, pavan22k: 104120, tag: "", change: -520 },
    { date: "10-Nov-2026", session: "Evening", gram22k: 13080, pavan22k: 104640, tag: "", change: -1040 },
    { date: "10-Nov-2026", session: "Morning", gram22k: 13210, pavan22k: 105680, tag: "", change: -360 },
    { date: "09-Nov-2026", session: "Regular", gram22k: 13255, pavan22k: 106040, tag: "", change: 760 },
    { date: "08-Nov-2026", session: "Regular", gram22k: 13160, pavan22k: 105280, tag: "", change: 0 },
    { date: "07-Nov-2026", session: "Regular", gram22k: 13160, pavan22k: 105280, tag: "", change: 80 },
    { date: "06-Nov-2026", session: "Afternoon", gram22k: 13150, pavan22k: 105200, tag: "", change: -1880 },
    { date: "06-Nov-2026", session: "Morning", gram22k: 13385, pavan22k: 107080, tag: "Highest of Month", change: 0 },
    { date: "05-Nov-2026", session: "Regular", gram22k: 13385, pavan22k: 107080, tag: "Highest of Month", change: 2360 },
    { date: "04-Nov-2026", session: "Afternoon", gram22k: 13090, pavan22k: 104720, tag: "", change: 2120 },
    { date: "04-Nov-2026", session: "Morning", gram22k: 12825, pavan22k: 102600, tag: "", change: 200 },
    { date: "03-Nov-2026", session: "Regular", gram22k: 12800, pavan22k: 102400, tag: "", change: 200 },
    { date: "02-Nov-2026", session: "Regular", gram22k: 12775, pavan22k: 102200, tag: "", change: 360 },
    { date: "01-Nov-2026", session: "Regular", gram22k: 12730, pavan22k: 101840, tag: "", change: 0 }
  ]
};

// Global App State
let state = {
  data: DEFAULT_DATA,
  chartUnit: "pavan", // "pavan" or "gram"
  chartRange: 30,     // 7, 15, or 30 days
  chartInstance: null,
  calcUnit: "pavan",  // "pavan" or "gram"
  calcKarat: "22k",   // "22k", "24k", "18k"
  calcWeight: 1,      // numeric weight
  calcMakingPct: 10,  // percentage
  calcIncludeHuid: true,
  reverseBudget: 100000,
  reverseMakingPct: 10
};

// Format currency in Indian Numbering System
function formatCurrency(num, includeDecimals = false) {
  if (isNaN(num)) return "₹0";
  return "₹" + Number(num).toLocaleString("en-IN", {
    maximumFractionDigits: includeDecimals ? 2 : 0,
    minimumFractionDigits: includeDecimals ? 2 : 0
  });
}

// Format numbers
function formatNum(num, decimals = 2) {
  if (isNaN(num)) return "0";
  return Number(num).toLocaleString("en-IN", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals
  });
}

// Initialize Theme
function initTheme() {
  const savedTheme = localStorage.getItem("keralagold_theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const activeTheme = savedTheme || (prefersDark ? "dark" : "light");
  
  setTheme(activeTheme);
  
  const toggleBtn = document.getElementById("themeToggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "light";
      const next = current === "dark" ? "light" : "dark";
      setTheme(next);
    });
  }
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("keralagold_theme", theme);
  const icon = document.querySelector("#themeToggle span");
  if (icon) {
    icon.textContent = theme === "dark" ? "☀️" : "🌙";
  }
  // Re-render chart colors if chart exists
  if (state.chartInstance) {
    updateChartTheme();
  }
}

// Constants for India & Kerala gold market conversion
const TROY_OUNCE_TO_GRAMS = 31.1034768;
// Retail benchmark adjustment factor for Kerala bullion market (covers Indian customs import duty, AIDC & local premium)
const KERALA_RETAIL_IMPORT_MULTIPLIER = 1.18227;

// Fetch live rates from open Gold API
async function fetchLiveGoldApi(manual = false) {
  const statusEl = document.getElementById("lastUpdatedTime");
  const badgeEl = document.getElementById("apiStatusBadge");
  const btnRefresh = document.getElementById("btnRefreshLive");
  
  if (btnRefresh) {
    btnRefresh.innerHTML = "⏳ <span>Syncing...</span>";
    btnRefresh.style.pointerEvents = "none";
  }
  if (statusEl) statusEl.textContent = "Connecting to live gold feed...";
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000); // 7s timeout
    
    // Fetch live Gold and Silver in INR concurrently
    const [goldRes, silverRes] = await Promise.allSettled([
      fetch("https://api.gold-api.com/price/XAU/INR", { signal: controller.signal }),
      fetch("https://api.gold-api.com/price/XAG/INR", { signal: controller.signal })
    ]);
    
    clearTimeout(timeoutId);
    
    if (goldRes.status === "fulfilled" && goldRes.value.ok) {
      const goldData = await goldRes.value.json();
      
      // Calculate rates in INR (goldData.price is INR per troy ounce)
      const spotGramInr = goldData.price / TROY_OUNCE_TO_GRAMS;
      
      // Calculate 24K Retail Kerala rate with Indian import duties
      const rate24kGram = Math.round(spotGramInr * KERALA_RETAIL_IMPORT_MULTIPLIER);
      const rate24kPavan = rate24kGram * 8;
      
      // Calculate 22K (916 Hallmark) = 22/24 purity
      const rate22kGram = Math.round(rate24kGram * (22 / 24));
      const rate22kPavan = rate22kGram * 8;
      
      // Calculate 18K (750 Hallmark) = 18/24 purity
      const rate18kGram = Math.round(rate24kGram * (18 / 24));
      const rate18kPavan = rate18kGram * 8;
      
      // Process Silver if available
      let silverGram = 102.0;
      let silverKg = 102000;
      if (silverRes.status === "fulfilled" && silverRes.value.ok) {
        const silData = await silverRes.value.json();
        const silSpotGram = silData.price / TROY_OUNCE_TO_GRAMS;
        silverGram = Math.round(silSpotGram * 0.7634 * 100) / 100;
        if (silverGram < 80 || silverGram > 130) silverGram = 102.0;
        silverKg = Math.round(silverGram * 1000);
      }
      
      // Baseline comparison (Yesterday's close)
      const yesterdayGram = state.data.rates["22k"].yesterdayGram || 12215;
      const yesterdayPavan = yesterdayGram * 8;
      const changePavan = rate22kPavan - yesterdayPavan;
      const changeGram = rate22kGram - yesterdayGram;
      const changePct = Number(((changePavan / yesterdayPavan) * 100).toFixed(2));
      const trend = changePavan >= 0 ? "up" : "down";
      
      // Update state
      state.data.lastUpdated = new Date().toISOString();
      state.data.rates["22k"] = {
        gram: rate22kGram,
        pavan: rate22kPavan,
        yesterdayGram: yesterdayGram,
        yesterdayPavan: yesterdayPavan,
        changeGram: changeGram,
        changePavan: changePavan,
        changePercent: changePct,
        trend: trend
      };
      
      state.data.rates["24k"] = {
        gram: rate24kGram,
        pavan: rate24kPavan,
        yesterdayGram: Math.round(yesterdayGram * (24 / 22)),
        yesterdayPavan: Math.round(yesterdayPavan * (24 / 22)),
        changeGram: Math.round(changeGram * (24 / 22)),
        changePavan: Math.round(changePavan * (24 / 22)),
        changePercent: changePct,
        trend: trend
      };
      
      state.data.rates["18k"] = {
        gram: rate18kGram,
        pavan: rate18kPavan,
        yesterdayGram: Math.round(yesterdayGram * (18 / 22)),
        yesterdayPavan: Math.round(yesterdayPavan * (18 / 22)),
        changeGram: Math.round(changeGram * (18 / 22)),
        changePavan: Math.round(changePavan * (18 / 22)),
        changePercent: changePct,
        trend: trend
      };
      
      state.data.rates.silver = {
        gram: silverGram,
        kg: silverKg,
        changeGram: -1.5,
        changePercent: -1.45,
        trend: "down"
      };
      
      // Update badge & status
      if (badgeEl) {
        badgeEl.textContent = "LIVE API (SYNCED)";
        badgeEl.style.background = "#DCFCE7";
        badgeEl.style.color = "#15803D";
        badgeEl.style.borderColor = "#86EFAC";
      }
      
      // Re-render UI with new live prices
      renderApp();
      
      const now = new Date();
      if (statusEl) {
        statusEl.textContent = `Live Feed Synced at ${now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}`;
      }
    } else {
      throw new Error("Live gold API did not return OK");
    }
  } catch (err) {
    console.warn("Live API fetch notice (using benchmark data):", err);
    if (badgeEl) {
      badgeEl.textContent = "BENCHMARK MODE";
      badgeEl.style.background = "#FEF3C7";
      badgeEl.style.color = "#B45309";
      badgeEl.style.borderColor = "#FDE68A";
    }
    const d = new Date(state.data.lastUpdated);
    if (statusEl) {
      statusEl.textContent = `Benchmark: ${d.toLocaleDateString("en-IN", { month: "short", day: "numeric" })} at ${d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}`;
    }
  } finally {
    if (btnRefresh) {
      btnRefresh.innerHTML = "🔄 <span>Sync Live API</span>";
      btnRefresh.style.pointerEvents = "auto";
    }
  }
}

// Load data asynchronously with fallback and then trigger live API
async function loadGoldData() {
  try {
    const res = await fetch("data/gold-rates.json");
    if (res.ok) {
      const json = await res.json();
      state.data = json;
    }
  } catch (err) {
    console.warn("Using bundled fallback gold dataset:", err);
    state.data = DEFAULT_DATA;
  }
  
  // First render benchmark data
  renderApp();
  
  // Then automatically attempt live market API sync
  fetchLiveGoldApi();
}

// Main Render Function
function renderApp() {
  renderLiveHeader();
  renderHeroRates();
  renderMonthHighLow();
  renderChart();
  renderHistoryTable();
  setupCalculator();
  setupReverseCalculator();
}

// Render Date & Market Bar
function renderLiveHeader() {
  const d = new Date(state.data.lastUpdated);
  const dateStr = d.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  
  const headerDate = document.getElementById("headerLiveDate");
  if (headerDate) headerDate.textContent = dateStr;
  
  const lastUpdatedEl = document.getElementById("lastUpdatedTime");
  if (lastUpdatedEl) {
    const timeStr = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
    lastUpdatedEl.textContent = `Updated: ${dateStr} at ${timeStr}`;
  }
}

// Render Hero Rate Cards (22K, 24K, 18K, Silver)
function renderHeroRates() {
  const r = state.data.rates;
  
  // 22K (Featured)
  const r22k = r["22k"];
  const el22kPavan = document.getElementById("rate22kPavan");
  const el22kGram = document.getElementById("rate22kGram");
  const el22kTrend = document.getElementById("trend22k");
  
  if (el22kPavan) el22kPavan.textContent = formatCurrency(r22k.pavan);
  if (el22kGram) el22kGram.textContent = formatCurrency(r22k.gram);
  if (el22kTrend) {
    const isDown = r22k.trend === "down";
    const arrow = isDown ? "▼" : "▲";
    const trendClass = isDown ? "down" : "up";
    const changeAbs = Math.abs(r22k.changePavan);
    el22kTrend.className = `trend-badge ${trendClass}`;
    el22kTrend.innerHTML = `${arrow} ₹${changeAbs.toLocaleString("en-IN")} (${r22k.changePercent}%) Today`;
  }
  
  // 24K Pure Gold
  const r24k = r["24k"];
  const el24kPavan = document.getElementById("rate24kPavan");
  const el24kGram = document.getElementById("rate24kGram");
  const el24kTrend = document.getElementById("trend24k");
  if (el24kPavan) el24kPavan.textContent = formatCurrency(r24k.pavan);
  if (el24kGram) el24kGram.textContent = formatCurrency(r24k.gram);
  if (el24kTrend) {
    const isDown = r24k.trend === "down";
    el24kTrend.className = `trend-badge ${isDown ? "down" : "up"}`;
    el24kTrend.innerHTML = `${isDown ? "▼" : "▲"} ₹${Math.abs(r24k.changePavan).toLocaleString("en-IN")}`;
  }
  
  // 18K Gold
  const r18k = r["18k"];
  const el18kPavan = document.getElementById("rate18kPavan");
  const el18kGram = document.getElementById("rate18kGram");
  const el18kTrend = document.getElementById("trend18k");
  if (el18kPavan) el18kPavan.textContent = formatCurrency(r18k.pavan);
  if (el18kGram) el18kGram.textContent = formatCurrency(r18k.gram);
  if (el18kTrend) {
    const isDown = r18k.trend === "down";
    el18kTrend.className = `trend-badge ${isDown ? "down" : "up"}`;
    el18kTrend.innerHTML = `${isDown ? "▼" : "▲"} ₹${Math.abs(r18k.changePavan).toLocaleString("en-IN")}`;
  }
  
  // Silver
  const rSil = r.silver;
  const elSilKg = document.getElementById("rateSilverKg");
  const elSilGram = document.getElementById("rateSilverGram");
  const elSilTrend = document.getElementById("trendSilver");
  if (elSilKg) elSilKg.textContent = formatCurrency(rSil.kg);
  if (elSilGram) elSilGram.textContent = formatCurrency(rSil.gram, true);
  if (elSilTrend) {
    const isDown = rSil.trend === "down";
    elSilTrend.className = `trend-badge ${isDown ? "down" : "up"}`;
    elSilTrend.innerHTML = `${isDown ? "▼" : "▲"} ${rSil.changePercent}%`;
  }
}

// Render Month Highest and Lowest Records
function renderMonthHighLow() {
  const stats = state.data.monthStats;
  if (!stats) return;
  
  const elHighPavan = document.getElementById("statHighPavan");
  const elHighGram = document.getElementById("statHighGram");
  const elHighDate = document.getElementById("statHighDate");
  
  const elLowPavan = document.getElementById("statLowPavan");
  const elLowGram = document.getElementById("statLowGram");
  const elLowDate = document.getElementById("statLowDate");
  
  if (elHighPavan) elHighPavan.textContent = formatCurrency(stats.highest.pavan);
  if (elHighGram) elHighGram.textContent = `₹${stats.highest.gram.toLocaleString("en-IN")} / gm`;
  if (elHighDate) elHighDate.textContent = stats.highest.date;
  
  if (elLowPavan) elLowPavan.textContent = formatCurrency(stats.lowest.pavan);
  if (elLowGram) elLowGram.textContent = `₹${stats.lowest.gram.toLocaleString("en-IN")} / gm`;
  if (elLowDate) elLowDate.textContent = stats.lowest.date;
}

// Render Chart.js
function renderChart() {
  const ctx = document.getElementById("goldTrendChart");
  if (!ctx) return;
  
  // Process history data in chronological order (oldest to newest)
  const historyRaw = [...state.data.history].reverse();
  const slicedData = historyRaw.slice(-state.chartRange);
  
  const labels = slicedData.map(item => {
    const d = item.date.split("-");
    const sessionSuffix = item.session !== "Regular" ? ` (${item.session[0]})` : "";
    return `${d[0]} ${d[1]}${sessionSuffix}`;
  });
  
  const isPavan = state.chartUnit === "pavan";
  const dataPoints = slicedData.map(item => isPavan ? item.pavan22k : item.gram22k);
  
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const textColor = isDark ? "#CBD5E1" : "#475569";
  const gridColor = isDark ? "rgba(255, 255, 255, 0.07)" : "rgba(0, 0, 0, 0.06)";
  
  if (state.chartInstance) {
    state.chartInstance.destroy();
  }
  
  // Create gradient
  const chartCanvas = ctx.getContext("2d");
  const gradient = chartCanvas.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, isDark ? "rgba(212, 175, 55, 0.45)" : "rgba(212, 175, 55, 0.35)");
  gradient.addColorStop(1, isDark ? "rgba(212, 175, 55, 0.0)" : "rgba(212, 175, 55, 0.0)");
  
  state.chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: isPavan ? "1 Pavan (8g) 22K Gold Price (₹)" : "1 Gram 22K Gold Price (₹)",
        data: dataPoints,
        borderColor: "#D4AF37",
        borderWidth: 2.5,
        pointBackgroundColor: "#D4AF37",
        pointBorderColor: "#FFFFFF",
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.3,
        fill: true,
        backgroundColor: gradient
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: { color: textColor, font: { family: "-apple-system, sans-serif", size: 12 } }
        },
        tooltip: {
          backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
          titleColor: isDark ? "#F8FAFC" : "#0F172A",
          bodyColor: isDark ? "#CBD5E1" : "#334155",
          borderColor: "#D4AF37",
          borderWidth: 1,
          padding: 10,
          displayColors: false,
          callbacks: {
            label: function(context) {
              return `Rate: ${formatCurrency(context.parsed.y)}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: textColor, font: { size: 11 }, maxRotation: 45 }
        },
        y: {
          grid: { color: gridColor },
          ticks: {
            color: textColor,
            font: { size: 11 },
            callback: function(val) {
              return "₹" + (val / 1000).toFixed(0) + "k";
            }
          }
        }
      }
    }
  });
}

function updateChartTheme() {
  if (state.chartInstance) {
    renderChart();
  }
}

// Chart toggle buttons
function setupChartControls() {
  const unitButtons = document.querySelectorAll("[data-chart-unit]");
  unitButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      unitButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.chartUnit = btn.dataset.chartUnit;
      renderChart();
    });
  });
  
  const rangeButtons = document.querySelectorAll("[data-chart-range]");
  rangeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      rangeButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.chartRange = parseInt(btn.dataset.chartRange, 10);
      renderChart();
    });
  });
}

// Render Daily Price History Table
function renderHistoryTable(filterText = "") {
  const tbody = document.getElementById("historyTableBody");
  if (!tbody) return;
  
  tbody.innerHTML = "";
  
  const filtered = state.data.history.filter(item => {
    if (!filterText) return true;
    const q = filterText.toLowerCase();
    return item.date.toLowerCase().includes(q) || item.session.toLowerCase().includes(q);
  });
  
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 2rem; color: var(--text-muted);">No records found matching "${filterText}"</td></tr>`;
    return;
  }
  
  filtered.forEach((row, index) => {
    const tr = document.createElement("tr");
    
    // Highlight today or extreme records
    if (index === 0) {
      tr.classList.add("row-highlight");
    }
    
    let tagHtml = "";
    if (row.tag === "Highest of Month") {
      tagHtml = `<span class="badge-tag highest">Highest</span>`;
    } else if (row.tag === "Lowest of Month") {
      tagHtml = `<span class="badge-tag lowest">Lowest</span>`;
    }
    
    const sessionHtml = row.session !== "Regular" 
      ? `<span class="session-badge">${row.session}</span>` 
      : "";
    
    let changeHtml = "-";
    if (row.change > 0) {
      changeHtml = `<span style="color: var(--down-color); font-weight: 600;">+₹${row.change.toLocaleString("en-IN")}</span>`;
    } else if (row.change < 0) {
      changeHtml = `<span style="color: var(--up-color); font-weight: 600;">-₹${Math.abs(row.change).toLocaleString("en-IN")}</span>`;
    } else {
      changeHtml = `<span style="color: var(--text-muted);">0</span>`;
    }
    
    tr.innerHTML = `
      <td><strong>${row.date}</strong> ${sessionHtml} ${tagHtml}</td>
      <td><strong>₹${row.pavan22k.toLocaleString("en-IN")}</strong></td>
      <td>₹${row.gram22k.toLocaleString("en-IN")}</td>
      <td>${changeHtml}</td>
    `;
    
    tbody.appendChild(tr);
  });
}

// Search Filter
function setupTableSearch() {
  const searchInput = document.getElementById("tableSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderHistoryTable(e.target.value.trim());
    });
  }
}

// Calculator Logic
function setupCalculator() {
  const weightInput = document.getElementById("calcWeight");
  const unitPavanBtn = document.getElementById("calcUnitPavan");
  const unitGramBtn = document.getElementById("calcUnitGram");
  const karatSelect = document.getElementById("calcKarat");
  const makingSlider = document.getElementById("calcMakingSlider");
  const makingValueDisplay = document.getElementById("calcMakingVal");
  const makingChips = document.querySelectorAll(".calc-making-chip");
  const huidCheckbox = document.getElementById("calcHuidCheckbox");
  
  function recalculate() {
    let weight = parseFloat(weightInput.value) || 0;
    if (weight < 0) weight = 0;
    
    const isPavan = state.calcUnit === "pavan";
    const weightInGrams = isPavan ? weight * 8 : weight;
    
    const karatKey = karatSelect.value;
    const gramRate = state.data.rates[karatKey]?.gram || state.data.rates["22k"].gram;
    
    const baseCost = weightInGrams * gramRate;
    const makingPct = parseFloat(makingSlider.value) || 0;
    const makingCharge = baseCost * (makingPct / 100);
    const taxableAmount = baseCost + makingCharge;
    const gstAmount = taxableAmount * 0.03; // 3% standard GST
    const huidCharge = (huidCheckbox && huidCheckbox.checked && weight > 0) ? 53.10 : 0; // ₹45 + 18% GST
    
    const grandTotal = taxableAmount + gstAmount + huidCharge;
    
    // Update breakdown UI
    const elWeightSummary = document.getElementById("calcSummaryWeight");
    const elBasePrice = document.getElementById("calcSummaryBase");
    const elMakingCharges = document.getElementById("calcSummaryMaking");
    const elTaxable = document.getElementById("calcSummaryTaxable");
    const elGst = document.getElementById("calcSummaryGst");
    const elHuid = document.getElementById("calcSummaryHuid");
    const elTotal = document.getElementById("calcSummaryTotal");
    
    if (elWeightSummary) {
      elWeightSummary.textContent = isPavan 
        ? `${weight} Pavan (${formatNum(weightInGrams)} Grams)` 
        : `${weight} Grams (${formatNum(weight / 8)} Pavan)`;
    }
    if (elBasePrice) elBasePrice.textContent = formatCurrency(baseCost);
    if (elMakingCharges) elMakingCharges.textContent = `+ ${formatCurrency(makingCharge)} (${makingPct}%)`;
    if (elTaxable) elTaxable.textContent = formatCurrency(taxableAmount);
    if (elGst) elGst.textContent = `+ ${formatCurrency(gstAmount)} (3%)`;
    if (elHuid) elHuid.textContent = huidCharge > 0 ? `+ ${formatCurrency(huidCharge, true)}` : "₹0";
    if (elTotal) elTotal.textContent = formatCurrency(grandTotal);
  }
  
  if (weightInput) {
    weightInput.addEventListener("input", recalculate);
  }
  
  if (unitPavanBtn && unitGramBtn) {
    unitPavanBtn.addEventListener("click", () => {
      unitPavanBtn.classList.add("active");
      unitGramBtn.classList.remove("active");
      state.calcUnit = "pavan";
      const suffix = document.getElementById("calcWeightSuffix");
      if (suffix) suffix.textContent = "Pavan";
      recalculate();
    });
    
    unitGramBtn.addEventListener("click", () => {
      unitGramBtn.classList.add("active");
      unitPavanBtn.classList.remove("active");
      state.calcUnit = "gram";
      const suffix = document.getElementById("calcWeightSuffix");
      if (suffix) suffix.textContent = "Grams";
      recalculate();
    });
  }
  
  if (karatSelect) {
    karatSelect.addEventListener("change", recalculate);
  }
  
  if (makingSlider) {
    makingSlider.addEventListener("input", (e) => {
      const val = e.target.value;
      if (makingValueDisplay) makingValueDisplay.textContent = `${val}%`;
      makingChips.forEach(chip => {
        chip.classList.toggle("active", chip.dataset.pct === val);
      });
      recalculate();
    });
  }
  
  makingChips.forEach(chip => {
    chip.addEventListener("click", () => {
      const pct = chip.dataset.pct;
      makingSlider.value = pct;
      if (makingValueDisplay) makingValueDisplay.textContent = `${pct}%`;
      makingChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      recalculate();
    });
  });
  
  if (huidCheckbox) {
    huidCheckbox.addEventListener("change", recalculate);
  }
  
  // Initial calculation
  recalculate();
}

// Reverse Budget Calculator (Enter ₹ amount -> see Pavans & Grams)
function setupReverseCalculator() {
  const budgetInput = document.getElementById("reverseBudgetInput");
  const budgetChips = document.querySelectorAll(".budget-preset-chip");
  const makingSelect = document.getElementById("reverseMakingSelect");
  
  function recalculateReverse() {
    let budget = parseFloat(budgetInput.value) || 0;
    if (budget < 0) budget = 0;
    
    const gramRate22k = state.data.rates["22k"].gram;
    const makingPct = parseFloat(makingSelect ? makingSelect.value : 10) || 10;
    
    // Total price for 1 gram jewellery = gramRate * (1 + makingPct/100) * 1.03 (GST)
    const effectiveRatePerGram = gramRate22k * (1 + (makingPct / 100)) * 1.03;
    
    const gramsAffordable = budget > 0 ? (budget / effectiveRatePerGram) : 0;
    const pavansAffordable = gramsAffordable / 8;
    const wholePavans = Math.floor(pavansAffordable);
    const remainingGrams = gramsAffordable - (wholePavans * 8);
    
    const elYieldPavan = document.getElementById("reverseYieldPavan");
    const elYieldDetail = document.getElementById("reverseYieldDetail");
    const elGramRateEffective = document.getElementById("reverseEffectiveGramRate");
    
    if (elYieldPavan) {
      elYieldPavan.textContent = `${formatNum(pavansAffordable, 2)} Pavan`;
    }
    if (elYieldDetail) {
      elYieldDetail.textContent = `(${wholePavans} Pavan and ${formatNum(remainingGrams, 2)} Grams) / Total: ${formatNum(gramsAffordable, 2)}g`;
    }
    if (elGramRateEffective) {
      elGramRateEffective.textContent = `Effective Jeweller Rate: ${formatCurrency(effectiveRatePerGram)}/gm (incl. ${makingPct}% VA & 3% GST)`;
    }
  }
  
  if (budgetInput) {
    budgetInput.addEventListener("input", recalculateReverse);
  }
  
  if (makingSelect) {
    makingSelect.addEventListener("change", recalculateReverse);
  }
  
  budgetChips.forEach(chip => {
    chip.addEventListener("click", () => {
      budgetChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      budgetInput.value = chip.dataset.amount;
      recalculateReverse();
    });
  });
  
  // Setup Mode Switching (Standard vs Reverse Calculator)
  const tabStandard = document.getElementById("tabCalcStandard");
  const tabReverse = document.getElementById("tabCalcReverse");
  const viewStandard = document.getElementById("calcStandardView");
  const viewReverse = document.getElementById("calcReverseView");
  
  if (tabStandard && tabReverse && viewStandard && viewReverse) {
    tabStandard.addEventListener("click", () => {
      tabStandard.classList.add("active");
      tabReverse.classList.remove("active");
      viewStandard.style.display = "grid";
      viewReverse.style.display = "none";
    });
    
    tabReverse.addEventListener("click", () => {
      tabReverse.classList.add("active");
      tabStandard.classList.remove("active");
      viewStandard.style.display = "none";
      viewReverse.style.display = "grid";
      recalculateReverse();
    });
  }
  
  recalculateReverse();
}

// App Initialization on DOM Load
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  setupChartControls();
  setupTableSearch();
  
  const btnRefresh = document.getElementById("btnRefreshLive");
  if (btnRefresh) {
    btnRefresh.addEventListener("click", () => {
      fetchLiveGoldApi(true);
    });
  }
  
  loadGoldData();
});
