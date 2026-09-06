import json
from pathlib import Path
from typing import List, Optional, Dict
from .models import LotteryTypeInfo, DrawDetail, PrizeTier

STORAGE_DIR = Path(__file__).parent / "data"
DRAWS_FILE = STORAGE_DIR / "draws.json"


LOTTERY_TYPES: List[LotteryTypeInfo] = [
    LotteryTypeInfo(
        code="W",
        name="Win-Win",
        malayalam_name="വിൻ-വിൻ",
        draw_day="Monday",
        series_prefix="W",
        first_prize_amount=7500000,
        ticket_price=40
    ),
    LotteryTypeInfo(
        code="SS",
        name="Sthree Sakthi",
        malayalam_name="സ്ത്രീ ശക്തി",
        draw_day="Tuesday",
        series_prefix="S",
        first_prize_amount=7500000,
        ticket_price=40
    ),
    LotteryTypeInfo(
        code="FF",
        name="Fifty-Fifty",
        malayalam_name="ഫിഫ്റ്റി-ഫിഫ്റ്റി",
        draw_day="Wednesday",
        series_prefix="F",
        first_prize_amount=10000000,
        ticket_price=50
    ),
    LotteryTypeInfo(
        code="KN",
        name="Karunya Plus",
        malayalam_name="കാരുണ്യ പ്ലസ്",
        draw_day="Thursday",
        series_prefix="K",
        first_prize_amount=8000000,
        ticket_price=40
    ),
    LotteryTypeInfo(
        code="NR",
        name="Nirmal",
        malayalam_name="നിർമ്മൽ",
        draw_day="Friday",
        series_prefix="N",
        first_prize_amount=7000000,
        ticket_price=40
    ),
    LotteryTypeInfo(
        code="KR",
        name="Karunya",
        malayalam_name="കാരുണ്യ",
        draw_day="Saturday",
        series_prefix="K",
        first_prize_amount=8000000,
        ticket_price=40
    ),
    LotteryTypeInfo(
        code="BR",
        name="Thiruvonam Bumper",
        malayalam_name="തിരുവോണം ബമ്പർ",
        draw_day="Seasonal Bumper",
        series_prefix="T",
        first_prize_amount=250000000,  # 25 Crores
        ticket_price=500
    ),
]


def init_storage():
    STORAGE_DIR.mkdir(parents=True, exist_ok=True)
    if not DRAWS_FILE.exists():
        seed_default_draws()


def seed_default_draws():
    """Seeds authentic Kerala lottery draw data for testing and offline usage."""
    sample_draws: List[DrawDetail] = [
        DrawDetail(
            draw_id="W-780",
            lottery_name="WIN-WIN",
            malayalam_name="വിൻ-വിൻ",
            draw_date="2026-09-01",
            draw_number=780,
            first_prize_winner="WN 745821",
            consolation_number="745821",
            prizes=[
                PrizeTier(
                    tier_id=1,
                    tier_name="1st Prize",
                    amount=7500000,
                    match_type="exact_full",
                    numbers=["WN 745821"]
                ),
                PrizeTier(
                    tier_id=2,
                    tier_name="Consolation Prize",
                    amount=8000,
                    match_type="consolation",
                    numbers=["745821"]
                ),
                PrizeTier(
                    tier_id=3,
                    tier_name="2nd Prize",
                    amount=500000,
                    match_type="exact_full",
                    numbers=["WA 319842"]
                ),
                PrizeTier(
                    tier_id=4,
                    tier_name="3rd Prize",
                    amount=100000,
                    match_type="exact_number",
                    numbers=["184520", "592314", "847291"]
                ),
                PrizeTier(
                    tier_id=5,
                    tier_name="4th Prize",
                    amount=5000,
                    match_type="suffix",
                    numbers=["1245", "3890", "5671", "7823", "9014"]
                ),
                PrizeTier(
                    tier_id=6,
                    tier_name="5th Prize",
                    amount=2000,
                    match_type="suffix",
                    numbers=["0412", "1934", "2856", "3741", "4920", "5112", "6843", "8129", "9532"]
                ),
                PrizeTier(
                    tier_id=7,
                    tier_name="6th Prize",
                    amount=1000,
                    match_type="suffix",
                    numbers=["0561", "1290", "2345", "3678", "4129", "5890", "6431", "7210", "8904", "9415"]
                ),
                PrizeTier(
                    tier_id=8,
                    tier_name="7th Prize",
                    amount=500,
                    match_type="suffix",
                    numbers=["0123", "1456", "2789", "3012", "4345", "5678", "6901", "7234", "8567", "9890"]
                ),
                PrizeTier(
                    tier_id=9,
                    tier_name="8th Prize",
                    amount=100,
                    match_type="suffix",
                    numbers=["04", "15", "29", "33", "48", "52", "67", "71", "86", "95"]
                ),
            ],
            source_url="http://statelottery.kerala.gov.in",
            pdf_url="http://statelottery.kerala.gov.in/docs/result_w780.pdf"
        ),
        DrawDetail(
            draw_id="SS-430",
            lottery_name="STHREE SAKTHI",
            malayalam_name="സ്ത്രീ ശക്തി",
            draw_date="2026-09-02",
            draw_number=430,
            first_prize_winner="SK 829143",
            consolation_number="829143",
            prizes=[
                PrizeTier(
                    tier_id=1,
                    tier_name="1st Prize",
                    amount=7500000,
                    match_type="exact_full",
                    numbers=["SK 829143"]
                ),
                PrizeTier(
                    tier_id=2,
                    tier_name="Consolation Prize",
                    amount=8000,
                    match_type="consolation",
                    numbers=["829143"]
                ),
                PrizeTier(
                    tier_id=3,
                    tier_name="2nd Prize",
                    amount=1000000,
                    match_type="exact_full",
                    numbers=["SM 412095"]
                ),
                PrizeTier(
                    tier_id=4,
                    tier_name="3rd Prize",
                    amount=5000,
                    match_type="suffix",
                    numbers=["2034", "4156", "6892", "8124"]
                ),
                PrizeTier(
                    tier_id=5,
                    tier_name="4th Prize",
                    amount=2000,
                    match_type="suffix",
                    numbers=["1109", "3452", "5687", "7891"]
                ),
                PrizeTier(
                    tier_id=6,
                    tier_name="5th Prize",
                    amount=1000,
                    match_type="suffix",
                    numbers=["0245", "1983", "4521", "6734", "8910"]
                ),
                PrizeTier(
                    tier_id=7,
                    tier_name="6th Prize",
                    amount=500,
                    match_type="suffix",
                    numbers=["0512", "1823", "2945", "3612", "4890", "5723", "6190", "7421", "8340", "9652"]
                ),
                PrizeTier(
                    tier_id=8,
                    tier_name="7th Prize",
                    amount=200,
                    match_type="suffix",
                    numbers=["0321", "1478", "2589", "3690", "4712", "5823", "6934", "7045", "8156", "9267"]
                ),
                PrizeTier(
                    tier_id=9,
                    tier_name="8th Prize",
                    amount=100,
                    match_type="suffix",
                    numbers=["01", "12", "23", "34", "45", "56", "67", "78", "89", "90"]
                ),
            ]
        ),
        DrawDetail(
            draw_id="FF-105",
            lottery_name="FIFTY-FIFTY",
            malayalam_name="ഫിഫ്റ്റി-ഫിഫ്റ്റി",
            draw_date="2026-09-03",
            draw_number=105,
            first_prize_winner="FA 159283",
            consolation_number="159283",
            prizes=[
                PrizeTier(
                    tier_id=1,
                    tier_name="1st Prize",
                    amount=10000000,
                    match_type="exact_full",
                    numbers=["FA 159283"]
                ),
                PrizeTier(
                    tier_id=2,
                    tier_name="Consolation Prize",
                    amount=8000,
                    match_type="consolation",
                    numbers=["159283"]
                ),
                PrizeTier(
                    tier_id=3,
                    tier_name="2nd Prize",
                    amount=5000000,
                    match_type="exact_full",
                    numbers=["FB 928314"]
                ),
                PrizeTier(
                    tier_id=4,
                    tier_name="3rd Prize",
                    amount=5000,
                    match_type="suffix",
                    numbers=["1345", "2901", "4823", "6712", "8590"]
                ),
                PrizeTier(
                    tier_id=5,
                    tier_name="4th Prize",
                    amount=2000,
                    match_type="suffix",
                    numbers=["0412", "2198", "4367", "6589", "8701"]
                ),
                PrizeTier(
                    tier_id=6,
                    tier_name="5th Prize",
                    amount=1000,
                    match_type="suffix",
                    numbers=["0923", "1845", "3761", "5682", "7504", "9426"]
                ),
                PrizeTier(
                    tier_id=7,
                    tier_name="6th Prize",
                    amount=500,
                    match_type="suffix",
                    numbers=["0182", "1293", "2304", "3415", "4526", "5637", "6748", "7859", "8960", "9071"]
                ),
                PrizeTier(
                    tier_id=8,
                    tier_name="7th Prize",
                    amount=100,
                    match_type="suffix",
                    numbers=["05", "16", "27", "38", "49", "50", "61", "72", "83", "94"]
                ),
            ]
        ),
        DrawDetail(
            draw_id="KN-520",
            lottery_name="KARUNYA PLUS",
            malayalam_name="കാരുണ്യ പ്ലസ്",
            draw_date="2026-09-04",
            draw_number=520,
            first_prize_winner="PA 630194",
            consolation_number="630194",
            prizes=[
                PrizeTier(
                    tier_id=1,
                    tier_name="1st Prize",
                    amount=8000000,
                    match_type="exact_full",
                    numbers=["PA 630194"]
                ),
                PrizeTier(
                    tier_id=2,
                    tier_name="Consolation Prize",
                    amount=8000,
                    match_type="consolation",
                    numbers=["630194"]
                ),
                PrizeTier(
                    tier_id=3,
                    tier_name="2nd Prize",
                    amount=1000000,
                    match_type="exact_full",
                    numbers=["PB 381920"]
                ),
                PrizeTier(
                    tier_id=4,
                    tier_name="3rd Prize",
                    amount=5000,
                    match_type="suffix",
                    numbers=["1029", "3847", "5610", "7492", "9231"]
                ),
                PrizeTier(
                    tier_id=5,
                    tier_name="4th Prize",
                    amount=1000,
                    match_type="suffix",
                    numbers=["0419", "1827", "3645", "5463", "7281", "9000"]
                ),
                PrizeTier(
                    tier_id=6,
                    tier_name="5th Prize",
                    amount=500,
                    match_type="suffix",
                    numbers=["0145", "1256", "2367", "3478", "4589", "5690", "6701", "7812", "8923", "9034"]
                ),
                PrizeTier(
                    tier_id=7,
                    tier_name="6th Prize",
                    amount=100,
                    match_type="suffix",
                    numbers=["08", "19", "20", "31", "42", "53", "64", "75", "86", "97"]
                ),
            ]
        ),
        DrawDetail(
            draw_id="NR-380",
            lottery_name="NIRMAL",
            malayalam_name="നിർമ്മൽ",
            draw_date="2026-09-05",
            draw_number=380,
            first_prize_winner="NA 918273",
            consolation_number="918273",
            prizes=[
                PrizeTier(
                    tier_id=1,
                    tier_name="1st Prize",
                    amount=7000000,
                    match_type="exact_full",
                    numbers=["NA 918273"]
                ),
                PrizeTier(
                    tier_id=2,
                    tier_name="Consolation Prize",
                    amount=8000,
                    match_type="consolation",
                    numbers=["918273"]
                ),
                PrizeTier(
                    tier_id=3,
                    tier_name="2nd Prize",
                    amount=1000000,
                    match_type="exact_full",
                    numbers=["NB 456789"]
                ),
                PrizeTier(
                    tier_id=4,
                    tier_name="3rd Prize",
                    amount=5000,
                    match_type="suffix",
                    numbers=["1122", "3344", "5566", "7788", "9900"]
                ),
                PrizeTier(
                    tier_id=5,
                    tier_name="4th Prize",
                    amount=1000,
                    match_type="suffix",
                    numbers=["0987", "1876", "2765", "3654", "4543"]
                ),
                PrizeTier(
                    tier_id=6,
                    tier_name="5th Prize",
                    amount=500,
                    match_type="suffix",
                    numbers=["0234", "1345", "2456", "3567", "4678", "5789", "6890", "7901", "8012", "9123"]
                ),
                PrizeTier(
                    tier_id=7,
                    tier_name="6th Prize",
                    amount=100,
                    match_type="suffix",
                    numbers=["04", "18", "22", "36", "40", "54", "68", "72", "86", "90"]
                ),
            ]
        ),
        DrawDetail(
            draw_id="BR-99",
            lottery_name="THIRUVONAM BUMPER",
            malayalam_name="തിരുവോണം ബമ്പർ",
            draw_date="2026-09-20",
            draw_number=99,
            first_prize_winner="TE 230620",
            consolation_number="230620",
            prizes=[
                PrizeTier(
                    tier_id=1,
                    tier_name="1st Prize (Jackpot)",
                    amount=250000000,  # ₹25 Crores
                    match_type="exact_full",
                    numbers=["TE 230620"]
                ),
                PrizeTier(
                    tier_id=2,
                    tier_name="Consolation Prize",
                    amount=500000,  # ₹5 Lakhs each
                    match_type="consolation",
                    numbers=["230620"]
                ),
                PrizeTier(
                    tier_id=3,
                    tier_name="2nd Prize",
                    amount=10000000,  # ₹1 Crore each
                    match_type="exact_full",
                    numbers=["TA 482103", "TB 193847", "TC 837201", "TD 629401", "TE 510293"]
                ),
                PrizeTier(
                    tier_id=4,
                    tier_name="3rd Prize",
                    amount=5000000,  # ₹50 Lakhs each
                    match_type="exact_number",
                    numbers=["301928", "829104", "492019", "710293", "192847"]
                ),
                PrizeTier(
                    tier_id=5,
                    tier_name="4th Prize",
                    amount=100000,
                    match_type="suffix",
                    numbers=["1920", "3847", "5629", "7401", "9283"]
                ),
                PrizeTier(
                    tier_id=6,
                    tier_name="5th Prize",
                    amount=5000,
                    match_type="suffix",
                    numbers=["0412", "1928", "2837", "3746", "4655", "5564", "6473", "7382", "8291", "9100"]
                ),
                PrizeTier(
                    tier_id=7,
                    tier_name="6th Prize",
                    amount=3000,
                    match_type="suffix",
                    numbers=["0123", "1234", "2345", "3456", "4567", "5678", "6789", "7890", "8901", "9012"]
                ),
                PrizeTier(
                    tier_id=8,
                    tier_name="7th Prize",
                    amount=2000,
                    match_type="suffix",
                    numbers=["0987", "1876", "2765", "3654", "4543", "5432", "6321", "7210", "8109", "9098"]
                ),
                PrizeTier(
                    tier_id=9,
                    tier_name="8th Prize",
                    amount=1000,
                    match_type="suffix",
                    numbers=["0145", "1256", "2367", "3478", "4589", "5690", "6701", "7812", "8923", "9034"]
                ),
                PrizeTier(
                    tier_id=10,
                    tier_name="9th Prize",
                    amount=500,
                    match_type="suffix",
                    numbers=["03", "14", "25", "36", "47", "58", "69", "70", "81", "92"]
                ),
            ]
        ),
    ]

    save_all_draws(sample_draws)


def get_all_draws() -> List[DrawDetail]:
    init_storage()
    try:
        with open(DRAWS_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            return [DrawDetail(**d) for d in data]
    except Exception as e:
        print(f"Error reading draws: {e}")
        return []


def save_all_draws(draws: List[DrawDetail]):
    with open(DRAWS_FILE, "w", encoding="utf-8") as f:
        json.dump([d.model_dump() for d in draws], f, indent=2, ensure_ascii=False)


def get_draw_by_id(draw_id: str) -> Optional[DrawDetail]:
    draws = get_all_draws()
    clean_id = draw_id.strip().upper().replace(" ", "")
    for d in draws:
        if d.draw_id.upper().replace(" ", "") == clean_id:
            return d
    return None


def get_latest_draw() -> Optional[DrawDetail]:
    draws = get_all_draws()
    if not draws:
        return None
    # Sort by draw_date descending
    return sorted(draws, key=lambda d: d.draw_date, reverse=True)[0]


def save_or_update_draw(new_draw: DrawDetail):
    draws = get_all_draws()
    found = False
    for i, d in enumerate(draws):
        if d.draw_id == new_draw.draw_id:
            draws[i] = new_draw
            found = True
            break
    if not found:
        draws.insert(0, new_draw)
    save_all_draws(draws)
