import pytest
from backend.models import DrawDetail, PrizeTier
from backend.checker import verify_ticket, normalize_ticket


@pytest.fixture
def sample_draw():
    return DrawDetail(
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
                numbers=["184520"]
            ),
            PrizeTier(
                tier_id=5,
                tier_name="4th Prize",
                amount=5000,
                match_type="suffix",
                numbers=["1245", "5671"]
            ),
            PrizeTier(
                tier_id=9,
                tier_name="8th Prize",
                amount=100,
                match_type="suffix",
                numbers=["04", "15"]
            ),
        ]
    )


def test_normalize_ticket():
    s, n = normalize_ticket("  wn ", " 745821 ")
    assert s == "WN"
    assert n == "745821"

    s2, n2 = normalize_ticket("ab", "456")
    assert s2 == "AB"
    assert n2 == "000456"


def test_exact_first_prize_winner(sample_draw):
    res = verify_ticket(sample_draw, "WN", "745821")
    assert res.is_winner is True
    assert res.total_prize_amount >= 7500000
    assert any(w.tier_name == "1st Prize" for w in res.winning_tiers)
    # Ensure 1st prize winner does NOT also get consolation prize
    assert not any(w.tier_name == "Consolation Prize" for w in res.winning_tiers)


def test_consolation_prize_winner(sample_draw):
    # Same 6 digits 745821, but different series "WB"
    res = verify_ticket(sample_draw, "WB", "745821")
    assert res.is_winner is True
    assert any(w.tier_name == "Consolation Prize" for w in res.winning_tiers)
    assert not any(w.tier_name == "1st Prize" for w in res.winning_tiers)


def test_suffix_match(sample_draw):
    # Ticket ending in 1245 -> 4th prize
    res = verify_ticket(sample_draw, "WA", "991245")
    assert res.is_winner is True
    assert any(w.tier_name == "4th Prize" for w in res.winning_tiers)


def test_no_match(sample_draw):
    # Completely unmatched ticket
    res = verify_ticket(sample_draw, "WA", "888888")
    assert res.is_winner is False
    assert res.total_prize_amount == 0
    assert len(res.winning_tiers) == 0
