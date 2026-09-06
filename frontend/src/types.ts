export interface LotteryTypeInfo {
  code: string;
  name: string;
  malayalam_name: string;
  draw_day: string;
  series_prefix: string;
  first_prize_amount: number;
  ticket_price: number;
}

export interface PrizeTier {
  tier_id: number;
  tier_name: string;
  amount: number;
  match_type: string;
  numbers: string[];
}

export interface DrawDetail {
  draw_id: string;
  lottery_name: string;
  malayalam_name: string;
  draw_date: string;
  draw_number: number;
  first_prize_winner?: string;
  consolation_number?: string;
  prizes: PrizeTier[];
  source_url?: string;
  pdf_url?: string;
}

export interface TicketCheckRequest {
  draw_id?: string;
  lottery_name?: string;
  draw_date?: string;
  series: string;
  number: string;
}

export interface WinningTierMatch {
  tier_name: string;
  prize_amount: number;
  matched_pattern: string;
  match_reason: string;
}

export interface TicketCheckResponse {
  is_winner: boolean;
  ticket_full: string;
  draw_id: string;
  lottery_name: string;
  draw_date: string;
  total_prize_amount: number;
  winning_tiers: WinningTierMatch[];
  claim_instructions: string;
  checked_at: string;
}
