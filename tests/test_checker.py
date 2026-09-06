import pytest
from backend.models import DrawDetail, PrizeTier
from backend.checker import verify_ticket, normalize_ticket


@pytest.fixture
def sample_draw():
    return DrawDetail(
        draw_id="SM-71",
        lottery_name="SAMRUDHI",
        malayalam_name="സമൃദ്ധി",
        draw_date="2026-09-06",
        draw_number=71,
        first_prize_winner="MG 555248",
        consolation_number="555248",
        prizes=[
            PrizeTier(
                tier_id=1,
                tier_name="1st Prize",
                amount=10000000,
                match_type="exact_full",
                numbers=["MG 555248"]
            ),
            PrizeTier(
                tier_id=2,
                tier_name="Consolation Prize",
                amount=5000,
                match_type="consolation",
                numbers=["555248"]
            ),
            PrizeTier(
                tier_id=3,
                tier_name="2nd Prize",
                amount=2500000,
                match_type="exact_full",
                numbers=["MB 562200"]
            ),
            PrizeTier(
                tier_id=4,
                tier_name="3rd Prize",
                amount=500000,
                match_type="exact_full",
                numbers=["MD 196675"]
            ),
            PrizeTier(
                tier_id=5,
                tier_name="4th Prize",
                amount=5000,
                match_type="suffix",
                numbers=["0140", "0694", "1186"]
            ),
            PrizeTier(
                tier_id=8,
                tier_name="8th Prize",
                amount=200,
                match_type="suffix",
                numbers=["0107", "0167", "0295", "9057"]
            ),
        ]
    )


def test_normalize_ticket():
    s, n = normalize_ticket("  mg ", " 555248 ")
    assert s == "MG"
    assert n == "555248"

    s2, n2 = normalize_ticket("ab", "456")
    assert s2 == "AB"
    assert n2 == "000456"


def test_exact_first_prize_winner(sample_draw):
    res = verify_ticket(sample_draw, "MG", "555248")
    assert res.is_winner is True
    assert res.total_prize_amount >= 10000000
    assert any(w.tier_name == "1st Prize" for w in res.winning_tiers)
    # Ensure 1st prize winner does NOT also get consolation prize
    assert not any(w.tier_name == "Consolation Prize" for w in res.winning_tiers)


def test_consolation_prize_winner(sample_draw):
    # Same 6 digits 555248, but different series "MA"
    res = verify_ticket(sample_draw, "MA", "555248")
    assert res.is_winner is True
    assert any(w.tier_name == "Consolation Prize" for w in res.winning_tiers)
    assert not any(w.tier_name == "1st Prize" for w in res.winning_tiers)


def test_strict_four_digit_suffix_match(sample_draw):
    # Ticket ending in 0140 -> 4th prize
    res = verify_ticket(sample_draw, "WA", "990140")
    assert res.is_winner is True
    assert any(w.tier_name == "4th Prize" for w in res.winning_tiers)
    assert res.winning_tiers[0].match_reason == "Last 4 digits (0140) match in 4th Prize"


def test_two_digit_suffix_never_matches(sample_draw):
    # Ticket ending in 40 or 57 or 90 must NOT match unless all 4 digits match
    res1 = verify_ticket(sample_draw, "WA", "999940")
    assert res1.is_winner is False

    res2 = verify_ticket(sample_draw, "WA", "999957")
    assert res2.is_winner is False

    res3 = verify_ticket(sample_draw, "WA", "999990")
    assert res3.is_winner is False


def test_no_match(sample_draw):
    # Completely unmatched ticket
    res = verify_ticket(sample_draw, "WA", "888888")
    assert res.is_winner is False
    assert res.total_prize_amount == 0
    assert len(res.winning_tiers) == 0
