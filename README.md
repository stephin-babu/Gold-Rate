# 🪙 KeralaGold Open

> An open-source, mobile-first, lightweight web application for tracking Kerala gold and silver rates, interactive price trends, and calculating real-world jewellery purchase costs. Inspired by [KeralaGold.com](https://www.keralagold.com/daily-gold-prices.htm).

---

## 🌟 Highlights

- **Real-Time Live Gold API Integration**:
  - Automatically fetches real-time gold and silver spot rates in INR from CORS-enabled free public Gold API endpoints upon page visit.
  - Automatically calculates Indian retail benchmark rates (including import duties and margins) for Kerala 22K (916), 24K, 18K, and Silver.
  - Features a manual **🔄 Sync Live API** button with instant sync timestamp and status badge.
  - Graceful dual-mode architecture: seamlessly falls back to local benchmark data if offline or disconnected.
- **Live Kerala Benchmark Rates**:
  - **22 Karat (916 Hallmark)**: 1 Pavan (8 Grams) and per 1 Gram rates with daily trend indicators.
  - **24 Karat (999 Pure Bullion)** & **18 Karat (750 Modern/Studded)**.
  - **Silver Benchmark Rate**: 1 Kilogram and 1 Gram.
  - **Monthly High & Low Snapshot**: Instant peak and trough visibility for the current month.
- **Interactive Daily Trend Chart**:
  - Powered by Chart.js with period switching (7 Days, 15 Days, Full Month).
  - Toggle between 1 Pavan and 1 Gram trend curves.
- **Kerala Jewellery Tax & Making Charge Calculator**:
  - Replicates and enhances KeralaGold's real-world jewellery store calculator.
  - Base gold cost + Making charges / Wastage (VA: 3% to 25%) + 3% GST + HUID Hallmarking fee.
  - **Reverse Calculator**: Enter your budget (e.g. ₹1 Lakh) to see exact Pavan and Gram yield.
- **Searchable Daily Price History Table**:
  - Includes morning and afternoon session records and daily ₹ variations.
- **Mobile-Responsive & Modern UI**:
  - Engineered mobile-first to ensure 100% responsiveness on smartphones, tablets, and desktops.
  - Light and Dark mode toggle with persistent state.
- **Pure Open Source & Zero Server Dependencies**:
  - Can be opened directly in any web browser without Node.js or a web server.
  - Ready for 1-click free deployment to GitHub Pages, Netlify, or Vercel.

---

## 🚀 Quick Start / How to Run

### Method 1: Double-Click (Local Browser)
Simply double-click `index.html` to open it in Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari. Everything functions instantly with bundled data.

### Method 2: Free 1-Click Hosting on GitHub Pages
1. Push this directory to a new repository on GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of KeralaGold Open"
   git branch -M main
   git remote add origin https://github.com/<your-username>/kerala-gold-open.git
   git push -u origin main
   ```
2. In your GitHub repository, navigate to **Settings > Pages**.
3. Under **Build and deployment**, select `Deploy from a branch` and choose `main` / `/ (root)`.
4. Click **Save**. Your site is now live at `https://<your-username>.github.io/kerala-gold-open/`!

### Method 3: Local HTTP Server (Optional)
If you have Python installed:
```bash
python -m http.server 8080
```
Or with Node.js:
```bash
npx serve .
```
Then visit `http://localhost:8080`.

---

## 📊 How to Update Daily Rates

Daily rates are defined in clean JSON format inside [`data/gold-rates.json`](data/gold-rates.json):

```json
{
  "currency": "INR",
  "lastUpdated": "2026-11-19T09:30:00+05:30",
  "rates": {
    "22k": {
      "gram": 11980,
      "pavan": 95840,
      "yesterdayPavan": 97720,
      "changePavan": -1880,
      "changePercent": -1.92,
      "trend": "down"
    }
  },
  "history": [
    {
      "date": "19-Nov-2026",
      "session": "Morning",
      "gram22k": 11980,
      "pavan22k": 95840,
      "tag": "Lowest of Month",
      "change": -1880
    }
  ]
}
```

You can update this file manually every day or set up a simple GitHub Action scheduled scraper to commit the new numbers automatically.

---

## 🧮 Kerala Jewellery Calculation Formula Explained

When purchasing gold ornaments in Kerala, the billing follows this standardized formula:

$$\text{Base Cost} = \text{Weight in Grams} \times \text{22K Rate per Gram}$$
$$\text{Making Charges (VA)} = \text{Base Cost} \times \left(\frac{\text{Making \%}}{100}\right)$$
$$\text{Taxable Amount} = \text{Base Cost} + \text{Making Charges}$$
$$\text{GST (3\%)} = \text{Taxable Amount} \times 0.03$$
$$\text{Total Invoice Price} = \text{Taxable Amount} + \text{GST} + \text{BIS Hallmarking Fee (₹53.10)}$$

---

## 📄 License

This project is licensed under the **MIT License** - free for personal, educational, or commercial use.
