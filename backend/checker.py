from datetime import datetime
from typing import Optional, List, Tuple
from .models import DrawDetail, TicketCheckResponse, WinningTierMatch


def normalize_ticket(series: str, number: str) -> Tuple[str, str]:
    """Cleans and standardizes series code and 6-digit number."""
    norm_series = series.strip().upper()
    # Strip any non-digit from number
    norm_num = "".join(ch for ch in number if ch.isdigit())
    if len(norm_num) < 6:
        norm_num = norm_num.zfill(6)
    return norm_series, norm_num


def get_claim_instructions(total_prize: int) -> str:
    """Returns official Kerala Lottery prize claim instructions based on prize tier."""
    if total_prize == 0:
        return "Not a winning ticket. Better luck in the next draw!"
    elif total_prize <= 5000:
        return (
            "Congratulations! Prizes up to ₹5,000 can be claimed directly from "
            "any authorized Kerala lottery agency or ticket seller in Kerala."
        )
    elif total_prize <= 100000:
        return (
            "Congratulations! Prizes between ₹5,001 and ₹1,00,000 can be claimed at "
            "any District Lottery Office (DLO) or Sub-Treasury in Kerala with valid photo ID and original ticket."
        )
    else:
        return (
            "Jackpot! For prizes exceeding ₹1,00,000, submit the original ticket with "
            "PAN Card, Aadhaar Card, Passport-size photos, and bank passbook directly to "
            "the Director of State Lotteries, Vikas Bhavan, Thiruvananthapuram within 30 days of the draw."
        )


def verify_ticket(
    draw: DrawDetail,
    series: str,
    number: str
) -> TicketCheckResponse:
    """
    Evaluates a user's ticket against all prize tiers of a specific draw.
    """
    norm_series, norm_num = normalize_ticket(series, number)
    full_ticket = f"{norm_series} {norm_num}"
    
    matches: List[WinningTierMatch] = []
    total_amount = 0

    # 1. Check 1st Prize
    first_prize_winner = draw.first_prize_winner or ""
    first_prize_tier = next((p for p in draw.prizes if p.tier_id == 1), None)
    
    first_prize_won = False
    if first_prize_tier:
        for win_code in first_prize_tier.numbers:
            # win_code could be "WA 123456"
            win_parts = win_code.strip().split()
            if len(win_parts) == 2:
                w_series, w_num = win_parts[0].upper(), win_parts[1]
                if norm_series == w_series and norm_num == w_num:
                    first_prize_won = True
                    matches.append(WinningTierMatch(
                        tier_name=first_prize_tier.tier_name,
                        prize_amount=first_prize_tier.amount,
                        matched_pattern=win_code,
                        match_reason="Exact match for Series and all 6 Digits"
                    ))
                    total_amount += first_prize_tier.amount
                    break
            elif len(win_parts) == 1 and norm_num == win_parts[0]:
                first_prize_won = True
                matches.append(WinningTierMatch(
                    tier_name=first_prize_tier.tier_name,
                    prize_amount=first_prize_tier.amount,
                    matched_pattern=win_code,
                    match_reason="Exact 6-digit match for 1st Prize"
                ))
                total_amount += first_prize_tier.amount
                break

    # 2. Check Consolation Prize (Only if not already 1st prize winner)
    consolation_tier = next((p for p in draw.prizes if p.match_type == "consolation"), None)
    consolation_number = draw.consolation_number
    
    # If not explicitly specified, consolation number is the 1st prize 6 digits
    if not consolation_number and first_prize_winner:
        fp_parts = first_prize_winner.split()
        if len(fp_parts) == 2:
            consolation_number = fp_parts[1]

    if not first_prize_won and consolation_tier and consolation_number:
        if norm_num == consolation_number:
            matches.append(WinningTierMatch(
                tier_name=consolation_tier.tier_name,
                prize_amount=consolation_tier.amount,
                matched_pattern=norm_num,
                match_reason=f"Matched all 6 digits ({norm_num}) of 1st Prize with participating series {norm_series}"
            ))
            total_amount += consolation_tier.amount

    # 3. Check remaining prize tiers (2nd, 3rd, 4th, 5th, 6th, 7th, 8th, etc.)
    for tier in draw.prizes:
        if tier.tier_id == 1 or tier.match_type == "consolation":
            continue

        tier_won = False
        for pattern in tier.numbers:
            p_clean = pattern.strip()
            
            # Sub-case A: Exact full match (series + number)
            if " " in p_clean:
                p_series, p_num = p_clean.split(maxsplit=1)
                if norm_series == p_series.upper() and norm_num == p_num:
                    tier_won = True
                    matches.append(WinningTierMatch(
                        tier_name=tier.tier_name,
                        prize_amount=tier.amount,
                        matched_pattern=p_clean,
                        match_reason=f"Exact match for series and 6 digits in {tier.tier_name}"
                    ))
                    total_amount += tier.amount
                    break
            
            # Sub-case B: 6-digit exact match any series
            elif len(p_clean) == 6:
                if norm_num == p_clean:
                    tier_won = True
                    matches.append(WinningTierMatch(
                        tier_name=tier.tier_name,
                        prize_amount=tier.amount,
                        matched_pattern=p_clean,
                        match_reason=f"Matched all 6 digits in {tier.tier_name}"
                    ))
                    total_amount += tier.amount
                    break
            
            # Sub-case C: Suffix match (last 4, 3, or 2 digits)
            elif len(p_clean) < 6 and len(p_clean) >= 2:
                if norm_num.endswith(p_clean):
                    tier_won = True
                    matches.append(WinningTierMatch(
                        tier_name=tier.tier_name,
                        prize_amount=tier.amount,
                        matched_pattern=p_clean,
                        match_reason=f"Last {len(p_clean)} digits ({p_clean}) match in {tier.tier_name}"
                    ))
                    total_amount += tier.amount
                    break

    is_winner = len(matches) > 0

    return TicketCheckResponse(
        is_winner=is_winner,
        ticket_full=full_ticket,
        draw_id=draw.draw_id,
        lottery_name=draw.lottery_name,
        draw_date=draw.draw_date,
        total_prize_amount=total_amount,
        winning_tiers=matches,
        claim_instructions=get_claim_instructions(total_amount),
        pdf_url=draw.pdf_url,
        source_url=draw.source_url,
        checked_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )
