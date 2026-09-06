import type { DrawDetail, LotteryTypeInfo, TicketCheckRequest, TicketCheckResponse, WinningTierMatch } from './types';
import { DEFAULT_DRAWS, DEFAULT_LOTTERY_TYPES } from './data/defaultDraws';

const API_BASE = '/api';

export async function fetchLotteries(): Promise<LotteryTypeInfo[]> {
  try {
    const res = await fetch(`${API_BASE}/lotteries`);
    if (!res.ok) throw new Error('Failed to fetch lottery types');
    return await res.json();
  } catch (err) {
    console.info('Using local data for lottery types:', err);
    return DEFAULT_LOTTERY_TYPES;
  }
}

export async function fetchDraws(): Promise<DrawDetail[]> {
  try {
    const res = await fetch(`${API_BASE}/draws`);
    if (!res.ok) throw new Error('Failed to fetch draws');
    return await res.json();
  } catch (err) {
    console.info('Using local data for draws:', err);
    return DEFAULT_DRAWS;
  }
}

export async function fetchLatestDraw(): Promise<DrawDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/draws/latest`);
    if (!res.ok) throw new Error('Failed to fetch latest draw');
    return await res.json();
  } catch (err) {
    console.info('Using local data for latest draw:', err);
    return DEFAULT_DRAWS[0] || null;
  }
}

/**
 * Client-side lottery verification fallback for static Vercel hosting.
 */
function verifyTicketClient(draw: DrawDetail, rawSeries: string, rawNumber: string): TicketCheckResponse {
  const normSeries = rawSeries.trim().toUpperCase();
  let normNum = rawNumber.replace(/[^0-9]/g, '');
  if (normNum.length < 6) {
    normNum = normNum.padStart(6, '0');
  }

  const matches: WinningTierMatch[] = [];
  let totalAmount = 0;
  let firstPrizeWon = false;

  const firstTier = draw.prizes.find((p) => p.tier_id === 1);
  if (firstTier) {
    for (const winCode of firstTier.numbers) {
      const parts = winCode.trim().split(/\s+/);
      if (parts.length === 2) {
        if (normSeries === parts[0].toUpperCase() && normNum === parts[1]) {
          firstPrizeWon = true;
          matches.push({
            tier_name: firstTier.tier_name,
            prize_amount: firstTier.amount,
            matched_pattern: winCode,
            match_reason: 'Exact match for Series and all 6 Digits',
          });
          totalAmount += firstTier.amount;
          break;
        }
      } else if (parts.length === 1 && normNum === parts[0]) {
        firstPrizeWon = true;
        matches.push({
          tier_name: firstTier.tier_name,
          prize_amount: firstTier.amount,
          matched_pattern: winCode,
          match_reason: 'Exact 6-digit match for 1st Prize',
        });
        totalAmount += firstTier.amount;
        break;
      }
    }
  }

  // Consolation prize
  const consolationTier = draw.prizes.find((p) => p.match_type === 'consolation');
  let consolationNum = draw.consolation_number;
  if (!consolationNum && draw.first_prize_winner) {
    const fpParts = draw.first_prize_winner.split(/\s+/);
    if (fpParts.length === 2) consolationNum = fpParts[1];
  }

  if (!firstPrizeWon && consolationTier && consolationNum && normNum === consolationNum) {
    matches.push({
      tier_name: consolationTier.tier_name,
      prize_amount: consolationTier.amount,
      matched_pattern: normNum,
      match_reason: `Matched all 6 digits (${normNum}) of 1st Prize with participating series ${normSeries}`,
    });
    totalAmount += consolationTier.amount;
  }

  // Lower prize tiers
  for (const tier of draw.prizes) {
    if (tier.tier_id === 1 || tier.match_type === 'consolation') continue;

    for (const pattern of tier.numbers) {
      const pClean = pattern.trim();
      if (pClean.includes(' ')) {
        const [pSer, pNum] = pClean.split(/\s+/, 2);
        if (normSeries === pSer.toUpperCase() && normNum === pNum) {
          matches.push({
            tier_name: tier.tier_name,
            prize_amount: tier.amount,
            matched_pattern: pClean,
            match_reason: `Exact match for series and 6 digits in ${tier.tier_name}`,
          });
          totalAmount += tier.amount;
          break;
        }
      } else if (pClean.length === 6 && normNum === pClean) {
        matches.push({
          tier_name: tier.tier_name,
          prize_amount: tier.amount,
          matched_pattern: pClean,
          match_reason: `Matched all 6 digits in ${tier.tier_name}`,
        });
        totalAmount += tier.amount;
        break;
      } else if (pClean.length >= 2 && pClean.length < 6 && normNum.endsWith(pClean)) {
        matches.push({
          tier_name: tier.tier_name,
          prize_amount: tier.amount,
          matched_pattern: pClean,
          match_reason: `Last ${pClean.length} digits (${pClean}) match in ${tier.tier_name}`,
        });
        totalAmount += tier.amount;
        break;
      }
    }
  }

  const isWinner = matches.length > 0;
  let claimInstructions = 'Not a winning ticket. Better luck in the next draw!';
  if (totalAmount > 100000) {
    claimInstructions =
      'Jackpot! For prizes exceeding ₹1,00,000, submit the original ticket with PAN Card, Aadhaar Card, Passport-size photos, and bank passbook directly to the Director of State Lotteries, Vikas Bhavan, Thiruvananthapuram within 30 days of the draw.';
  } else if (totalAmount > 5000) {
    claimInstructions =
      'Congratulations! Prizes between ₹5,001 and ₹1,00,000 can be claimed at any District Lottery Office (DLO) or Sub-Treasury in Kerala with valid photo ID and original ticket.';
  } else if (totalAmount > 0) {
    claimInstructions =
      'Congratulations! Prizes up to ₹5,000 can be claimed directly from any authorized Kerala lottery agency or ticket seller in Kerala.';
  }

  return {
    is_winner: isWinner,
    ticket_full: `${normSeries} ${normNum}`,
    draw_id: draw.draw_id,
    lottery_name: draw.lottery_name,
    draw_date: draw.draw_date,
    total_prize_amount: totalAmount,
    winning_tiers: matches,
    claim_instructions: claimInstructions,
    pdf_url: draw.pdf_url,
    source_url: draw.source_url,
    checked_at: new Date().toLocaleString(),
  };
}

export async function checkTicketAPI(req: TicketCheckRequest): Promise<TicketCheckResponse> {
  try {
    const res = await fetch(`${API_BASE}/check-ticket`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.info('Backend API unavailable, evaluating on client-side engine:', e);
  }

  // Fallback to client-side verification engine
  const targetDraw =
    DEFAULT_DRAWS.find((d) => d.draw_id.toUpperCase() === req.draw_id?.toUpperCase()) ||
    DEFAULT_DRAWS[0];

  return verifyTicketClient(targetDraw, req.series, req.number);
}
