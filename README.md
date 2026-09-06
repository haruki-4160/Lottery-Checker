# BhagyaCheck 🎟️ - Kerala Lottery Checker & Scanner Website

A full-stack, mobile-first web application designed to check Kerala State Lottery results using:
1. **Manual Entry**: Select draw/date and enter 2-letter series (e.g. `WA`) + 6-digit number (e.g. `745821`).
2. **Live Camera Scanner**: Real-time video scanner with barcode/QR detection and on-device OCR.
3. **Photo Upload**: Image upload with canvas pre-processing (binarization/contrast) and Tesseract.js OCR.
4. **Instant Test Samples**: One-click test buttons for 1st Prize Jackpot (₹75L / ₹25Cr), Consolation Prize, and lower tier suffix hits.
5. **Results Explorer**: Browse all official weekly draws and search winning numbers.
6. **Bilingual Support**: English & Malayalam (മലയാളം) toggle.
7. **Prize Claim Guide**: Official requirements for claims across agencies, District Lottery Offices, and the Directorate.

---

## 🚀 Quick Start

### 1. One-Click Launch (Windows)
Double-click `run_app.bat` or execute in terminal:
```cmd
.\run_app.bat
```
This launches:
- **FastAPI Backend**: `http://localhost:8000` (API Docs: `http://localhost:8000/docs`)
- **Vite Frontend**: `http://localhost:5173`

---

### 2. Manual Startup

#### Backend (FastAPI):
```bash
# Activate virtual environment
.\venv\Scripts\activate

# Run FastAPI server
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

#### Frontend (React + Vite + Tailwind CSS):
```bash
cd frontend
npm install
npm run dev
```
Visit `http://localhost:5173` in your browser.

---

## 🧪 Running Automated Tests

Run the test suite for the lottery verification engine:
```bash
.\venv\Scripts\python.exe -m pytest -v
```

---

## 📐 Architecture & Verification Rules

- **1st Prize**: Match both series and 6 digits (e.g., `WN 745821` $\to$ ₹75,00,000).
- **Consolation Prize**: Same 6 digits (`745821`), but different series (e.g., `WA 745821` $\to$ ₹8,000).
- **2nd / 3rd Prize**: Match specific numbers or series.
- **4th to 8th Prizes**: Suffix match (last 4, 3, or 2 digits).
- **Claim Guidance**:
  - Up to ₹5,000: Any authorized retail agency in Kerala.
  - ₹5,001 to ₹1 Lakh: District Lottery Office (DLO) / Sub-Treasury.
  - Above ₹1 Lakh: Director of State Lotteries, Thiruvananthapuram.
