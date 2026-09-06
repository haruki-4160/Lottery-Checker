from typing import List, Optional
from pydantic import BaseModel, Field


class LotteryTypeInfo(BaseModel):
    code: str
    name: str
    malayalam_name: str
    draw_day: str  # Monday, Tuesday, etc.
    series_prefix: str
    first_prize_amount: int
    ticket_price: int


class PrizeTier(BaseModel):
    tier_id: int
    tier_name: str  # e.g., "1st Prize", "Consolation Prize", "2nd Prize", "8th Prize"
    amount: int  # e.g., 7500000, 8000, 100
    match_type: str  # "exact_full" (series+number), "consolation" (diff series, same number), "suffix" (last 4/3 digits), "exact_number" (6 digits any series)
    numbers: List[str] = Field(default_factory=list)  # e.g., ["WA 123456"] or ["4567", "8912"]


class DrawDetail(BaseModel):
    draw_id: str  # e.g. "W-780"
    lottery_name: str  # "WIN-WIN"
    malayalam_name: str  # "വിൻ-വിൻ"
    draw_date: str  # "2026-09-01" (YYYY-MM-DD)
    draw_number: int  # 780
    first_prize_winner: Optional[str] = None  # "WA 654321"
    consolation_number: Optional[str] = None  # "654321"
    prizes: List[PrizeTier] = Field(default_factory=list)
    source_url: Optional[str] = None
    pdf_url: Optional[str] = None


class TicketCheckRequest(BaseModel):
    draw_id: Optional[str] = None  # If None, checks against the latest draw
    lottery_name: Optional[str] = None
    draw_date: Optional[str] = None
    series: str = Field(..., min_length=1, max_length=3, description="2-letter series code, e.g. 'WA'")
    number: str = Field(..., min_length=4, max_length=6, description="6-digit ticket number, e.g. '654321'")


class WinningTierMatch(BaseModel):
    tier_name: str
    prize_amount: int
    matched_pattern: str
    match_reason: str


class TicketCheckResponse(BaseModel):
    is_winner: bool
    ticket_full: str  # e.g. "WA 654321"
    draw_id: str
    lottery_name: str
    draw_date: str
    total_prize_amount: int
    winning_tiers: List[WinningTierMatch] = Field(default_factory=list)
    claim_instructions: str
    pdf_url: Optional[str] = None
    source_url: Optional[str] = None
    checked_at: str
