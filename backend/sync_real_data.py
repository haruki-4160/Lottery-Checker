import re
import sys
import json
import io
import requests
from bs4 import BeautifulSoup
from pypdf import PdfReader
from pathlib import Path

BASE_DIR = Path(__file__).parent
DATA_FILE = BASE_DIR / "data" / "draws.json"
FRONTEND_DATA_FILE = BASE_DIR.parent / "frontend" / "src" / "data" / "defaultDraws.ts"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

OFFICIAL_LIST_URL = "https://statelottery.kerala.gov.in/index.php/lottery-result-view"


def fetch_official_draw_list():
    """Scrapes the live official table from statelottery.kerala.gov.in."""
    print("Fetching live draws list from statelottery.kerala.gov.in...")
    res = requests.get(OFFICIAL_LIST_URL, headers=HEADERS, timeout=15)
    res.raise_for_status()

    soup = BeautifulSoup(res.text, "html.parser")
    table = soup.find("table")
    if not table:
        print("No table found on official portal.")
        return []

    draw_items = []
    rows = table.find_all("tr")[1:]  # skip header
    for row in rows:
        cols = [c.get_text(strip=True) for c in row.find_all("td")]
        link = row.find("a")
        if len(cols) >= 2 and link and link.has_attr("href"):
            raw_name = cols[0]
            raw_date = cols[1]  # DD/MM/YYYY
            pdf_url = link["href"]

            # e.g. SAMRUDHI(SM-71), KARUNYA(KR-767)
            match = re.match(r"^(.*?)\s*\((.*?)\)$", raw_name)
            if match:
                name = match.group(1).strip()
                draw_id = match.group(2).strip()
            else:
                name = raw_name
                draw_id = raw_name

            # Format date as YYYY-MM-DD
            date_parts = raw_date.split("/")
            if len(date_parts) == 3:
                std_date = f"{date_parts[2]}-{date_parts[1]}-{date_parts[0]}"
            else:
                std_date = raw_date

            draw_items.append({
                "lottery_name": name,
                "draw_id": draw_id,
                "draw_date": std_date,
                "raw_date": raw_date,
                "pdf_url": pdf_url,
                "source_url": "https://statelottery.kerala.gov.in"
            })

    print(f"Found {len(draw_items)} official draws.")
    return draw_items


def parse_pdf_gazette(pdf_url: str):
    """
    Downloads and extracts authentic winning numbers from official Kerala Lottery PDF gazette.
    """
    print(f"Downloading and parsing official gazette PDF: {pdf_url}")
    try:
        r = requests.get(pdf_url, headers=HEADERS, timeout=15)
        if r.status_code != 200 or len(r.content) < 1000:
            print(f"Failed to download PDF from {pdf_url}")
            return None

        reader = PdfReader(io.BytesIO(r.content))
        full_text = ""
        for page in reader.pages:
            t = page.extract_text()
            if t:
                full_text += t + "\n"

        prizes = []

        # 1st Prize
        # 1st Prize Rs :10000000/- 1) MG 555248 (PATTAMBI)
        fp_match = re.search(r"1st\s*Prize\s*Rs\s*:?(\d+)/-.*?(?:1\)\s*)?([A-Z]{2}\s*\d{6})", full_text, re.IGNORECASE)
        first_prize_winner = None
        first_prize_amount = 7500000
        consolation_number = None

        if fp_match:
            first_prize_amount = int(fp_match.group(1))
            first_prize_winner = fp_match.group(2).strip()
            # Consolation number is 6 digits of 1st prize
            parts = first_prize_winner.split()
            if len(parts) == 2:
                consolation_number = parts[1]

            prizes.append({
                "tier_id": 1,
                "tier_name": "1st Prize",
                "amount": first_prize_amount,
                "match_type": "exact_full",
                "numbers": [first_prize_winner]
            })

        # Consolation Prize
        # Cons Prize-Rs :5000/- MA 555248 MB 555248 ...
        cp_match = re.search(r"Cons(?:\s*Prize|\.Prize)[-\s]*Rs\s*:?(\d+)/-", full_text, re.IGNORECASE)
        if cp_match:
            cp_amount = int(cp_match.group(1))
            prizes.append({
                "tier_id": 2,
                "tier_name": "Consolation Prize",
                "amount": cp_amount,
                "match_type": "consolation",
                "numbers": [consolation_number] if consolation_number else []
            })

        # 2nd Prize
        # 2nd Prize Rs :2500000/- 1) MB 562200 (KOZHIKKODE)
        sp_match = re.search(r"2nd\s*Prize\s*Rs\s*:?(\d+)/-.*?(?:1\)\s*)?([A-Z]{2}\s*\d{6})", full_text, re.IGNORECASE)
        if sp_match:
            sp_amount = int(sp_match.group(1))
            sp_num = sp_match.group(2).strip()
            prizes.append({
                "tier_id": 3,
                "tier_name": "2nd Prize",
                "amount": sp_amount,
                "match_type": "exact_full",
                "numbers": [sp_num]
            })

        # 3rd Prize
        # 3rd Prize Rs :500000/- 1) MD 196675 (ERNAKULAM)
        tp_match = re.search(r"3rd\s*Prize\s*Rs\s*:?(\d+)/-.*?(?:1\)\s*)?([A-Z]{2}\s*\d{6})", full_text, re.IGNORECASE)
        if tp_match:
            tp_amount = int(tp_match.group(1))
            tp_num = tp_match.group(2).strip()
            prizes.append({
                "tier_id": 4,
                "tier_name": "3rd Prize",
                "amount": tp_amount,
                "match_type": "exact_full",
                "numbers": [tp_num]
            })

        # Parse numbered tiers (4th Prize, 5th Prize, 6th Prize, 7th Prize, 8th Prize, etc.)
        # e.g., 4th Prize-Rs :5000/- 0140 0694 1186 ...
        tier_pattern = re.compile(r"(\d+)(?:th|st|nd|rd)\s*Prize[- ]*Rs\s*:?(\d+)/-(.*?)(?=(?:\d+(?:th|st|nd|rd)\s*Prize)|$)", re.DOTALL | re.IGNORECASE)
        for m in tier_pattern.finditer(full_text):
            tier_num = int(m.group(1))
            if tier_num in [1, 2, 3]:
                continue
            tier_amount = int(m.group(2))
            block_text = m.group(3)

            # Lower tier winning numbers in Kerala State Lotteries are STRICTLY 4 digits
            numbers = re.findall(r"\b\d{4}\b", block_text)
            # Filter out year occurrences
            numbers = [n for n in numbers if len(n) == 4 and n not in ["2026", "2025", "2024", "2023", "2022"]]

            if numbers:
                prizes.append({
                    "tier_id": tier_num + 1,
                    "tier_name": f"{tier_num}th Prize",
                    "amount": tier_amount,
                    "match_type": "suffix",
                    "numbers": numbers
                })

        return {
            "first_prize_winner": first_prize_winner,
            "consolation_number": consolation_number,
            "prizes": prizes
        }
    except Exception as e:
        print(f"Error parsing PDF: {e}")
        return None


def sync_real_lottery_data(max_detailed=6):
    """
    Fetches real draws from official Kerala Lotteries portal and parses recent official PDF gazettes.
    """
    draw_list = fetch_official_draw_list()
    if not draw_list:
        print("Could not fetch draw list from official portal.")
        return

    full_draws = []
    
    # Process up to max_detailed recent draws by downloading their real PDFs
    for idx, d in enumerate(draw_list[:max_detailed]):
        print(f"\nProcessing [{idx+1}/{max_detailed}] {d['draw_id']} ({d['lottery_name']})...")
        parsed = parse_pdf_gazette(d["pdf_url"])
        
        # Extract numeric draw number
        dn_match = re.search(r"\d+", d["draw_id"])
        draw_number = int(dn_match.group(0)) if dn_match else idx + 100

        draw_obj = {
            "draw_id": d["draw_id"],
            "lottery_name": d["lottery_name"],
            "malayalam_name": "",
            "draw_date": d["draw_date"],
            "draw_number": draw_number,
            "first_prize_winner": parsed["first_prize_winner"] if parsed else None,
            "consolation_number": parsed["consolation_number"] if parsed else None,
            "prizes": parsed["prizes"] if parsed else [],
            "source_url": d["source_url"],
            "pdf_url": d["pdf_url"]
        }
        full_draws.append(draw_obj)

    # Save to backend data file
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(full_draws, f, indent=2, ensure_ascii=False)
    print(f"\nSaved {len(full_draws)} authentic draws to {DATA_FILE}")

    # Also update frontend defaultDraws.ts so static Vercel hosting uses 100% real data!
    ts_code = f"""import type {{ DrawDetail, LotteryTypeInfo }} from '../types';

export const OFFICIAL_GOVT_PORTAL = "https://statelottery.kerala.gov.in";

export const DEFAULT_LOTTERY_TYPES: LotteryTypeInfo[] = [
  {{ code: 'W', name: 'Win-Win', malayalam_name: 'വിൻ-വിൻ', draw_day: 'Monday', series_prefix: 'W', first_prize_amount: 7500000, ticket_price: 40 }},
  {{ code: 'SS', name: 'Sthree Sakthi', malayalam_name: 'സ്ത്രീ ശക്തി', draw_day: 'Tuesday', series_prefix: 'S', first_prize_amount: 7500000, ticket_price: 40 }},
  {{ code: 'FF', name: 'Fifty-Fifty', malayalam_name: 'ഫിഫ്റ്റി-ഫിഫ്റ്റി', draw_day: 'Wednesday', series_prefix: 'F', first_prize_amount: 10000000, ticket_price: 50 }},
  {{ code: 'KN', name: 'Karunya Plus', malayalam_name: 'കാരുണ്യ പ്ലസ്', draw_day: 'Thursday', series_prefix: 'K', first_prize_amount: 8000000, ticket_price: 40 }},
  {{ code: 'SK', name: 'Suvarna Keralam', malayalam_name: 'സുവർണ്ണ കേരളം', draw_day: 'Friday', series_prefix: 'S', first_prize_amount: 7000000, ticket_price: 40 }},
  {{ code: 'KR', name: 'Karunya', malayalam_name: 'കാരുണ്യ', draw_day: 'Saturday', series_prefix: 'K', first_prize_amount: 8000000, ticket_price: 40 }},
  {{ code: 'SM', name: 'Samrudhi', malayalam_name: 'സമൃദ്ധി', draw_day: 'Sunday', series_prefix: 'M', first_prize_amount: 10000000, ticket_price: 50 }},
  {{ code: 'BR', name: 'Thiruvonam Bumper', malayalam_name: 'തിരുവോണം ബമ്പർ', draw_day: 'Seasonal Bumper', series_prefix: 'T', first_prize_amount: 250000000, ticket_price: 500 }}
];

export const DEFAULT_DRAWS: DrawDetail[] = {json.dumps(full_draws, indent=2, ensure_ascii=False)};
"""
    with open(FRONTEND_DATA_FILE, "w", encoding="utf-8") as f:
        f.write(ts_code)
    print(f"Updated {FRONTEND_DATA_FILE} for instant static Vercel hosting!")


if __name__ == "__main__":
    sync_real_lottery_data(max_detailed=6)
