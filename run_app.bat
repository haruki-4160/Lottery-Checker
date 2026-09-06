@echo off
echo ========================================================
echo   BhagyaCheck - Kerala Lottery Checker & Scanner
echo ========================================================
echo Starting Backend API (FastAPI) on http://localhost:8000 ...
start "BhagyaCheck Backend" cmd /k ".\venv\Scripts\python.exe -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload"

echo Starting Frontend (Vite React) on http://localhost:5173 ...
start "BhagyaCheck Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Application started!
echo Open your browser at: http://localhost:5173
echo ========================================================
