from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from .models import (
    LotteryTypeInfo,
    DrawDetail,
    TicketCheckRequest,
    TicketCheckResponse
)
from .storage import (
    LOTTERY_TYPES,
    get_all_draws,
    get_draw_by_id,
    get_latest_draw,
    init_storage
)
from .checker import verify_ticket, normalize_ticket
from .scraper import fetch_latest_official_draw

app = FastAPI(
    title="Kerala Lottery Checker API",
    description="API for checking Kerala lottery tickets, draw results, and live OCR/Barcode scanning integration",
    version="1.0.0"
)

# Enable CORS for frontend Vite dev server (usually localhost:5173) and any origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    init_storage()


@app.get("/")
def read_root():
    return {
        "service": "Kerala Lottery Checker API",
        "status": "online",
        "endpoints": [
            "/api/lotteries",
            "/api/draws",
            "/api/draws/latest",
            "/api/draws/{draw_id}",
            "/api/check-ticket"
        ]
    }


@app.get("/api/lotteries", response_model=List[LotteryTypeInfo])
def list_lotteries():
    """Returns list of weekly lottery types, bumper lotteries, schedules and ticket prices."""
    return LOTTERY_TYPES


@app.get("/api/draws", response_model=List[DrawDetail])
def list_draws(limit: int = Query(20, ge=1, le=100)):
    """Lists recent lottery draws."""
    draws = get_all_draws()
    return draws[:limit]


@app.get("/api/draws/latest", response_model=DrawDetail)
def latest_draw():
    """Returns the most recent lottery draw results."""
    draw = get_latest_draw()
    if not draw:
        raise HTTPException(status_code=404, detail="No lottery draws found.")
    return draw


@app.get("/api/draws/{draw_id}", response_model=DrawDetail)
def draw_by_id(draw_id: str):
    """Fetches details and winning numbers for a specific draw code (e.g. W-780, SS-430)."""
    draw = get_draw_by_id(draw_id)
    if not draw:
        raise HTTPException(status_code=404, detail=f"Draw '{draw_id}' not found.")
    return draw


@app.post("/api/check-ticket", response_model=TicketCheckResponse)
def check_ticket(req: TicketCheckRequest):
    """
    Checks a ticket series (e.g. 'WA') and 6-digit number (e.g. '123456')
    against the requested draw (or defaults to the latest draw).
    """
    draw: Optional[DrawDetail] = None

    if req.draw_id:
        draw = get_draw_by_id(req.draw_id)
        if not draw:
            # Try searching by lottery name and date if draw_id failed
            all_draws = get_all_draws()
            for d in all_draws:
                if req.draw_id.lower() in d.draw_id.lower():
                    draw = d
                    break
    
    if not draw and req.lottery_name:
        all_draws = get_all_draws()
        for d in all_draws:
            if req.lottery_name.lower() in d.lottery_name.lower():
                draw = d
                break

    if not draw:
        draw = get_latest_draw()

    if not draw:
        raise HTTPException(status_code=404, detail="No matching lottery draw found to check against.")

    # Validate number format
    norm_series, norm_num = normalize_ticket(req.series, req.number)
    if len(norm_num) != 6:
        raise HTTPException(status_code=400, detail="Ticket number must contain 6 numeric digits.")

    result = verify_ticket(draw, norm_series, norm_num)
    return result


@app.post("/api/sync-results")
def sync_results():
    """Trigger background scraper to fetch fresh official results."""
    fetched = fetch_latest_official_draw()
    return {
        "status": "sync_completed",
        "new_draw_added": fetched is not None,
        "detail": fetched.draw_id if fetched else "No new draw or portal offline"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
