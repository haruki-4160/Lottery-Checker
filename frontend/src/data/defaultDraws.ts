import type { DrawDetail, LotteryTypeInfo } from '../types';

export const DEFAULT_LOTTERY_TYPES: LotteryTypeInfo[] = [
  { code: 'W', name: 'Win-Win', malayalam_name: 'വിൻ-വിൻ', draw_day: 'Monday', series_prefix: 'W', first_prize_amount: 7500000, ticket_price: 40 },
  { code: 'SS', name: 'Sthree Sakthi', malayalam_name: 'സ്ത്രീ ശക്തി', draw_day: 'Tuesday', series_prefix: 'S', first_prize_amount: 7500000, ticket_price: 40 },
  { code: 'FF', name: 'Fifty-Fifty', malayalam_name: 'ഫിഫ്റ്റി-ഫിഫ്റ്റി', draw_day: 'Wednesday', series_prefix: 'F', first_prize_amount: 10000000, ticket_price: 50 },
  { code: 'KN', name: 'Karunya Plus', malayalam_name: 'കാരുണ്യ പ്ലസ്', draw_day: 'Thursday', series_prefix: 'K', first_prize_amount: 8000000, ticket_price: 40 },
  { code: 'NR', name: 'Nirmal', malayalam_name: 'നിർമ്മൽ', draw_day: 'Friday', series_prefix: 'N', first_prize_amount: 7000000, ticket_price: 40 },
  { code: 'KR', name: 'Karunya', malayalam_name: 'കാരുണ്യ', draw_day: 'Saturday', series_prefix: 'K', first_prize_amount: 8000000, ticket_price: 40 },
  { code: 'BR', name: 'Thiruvonam Bumper', malayalam_name: 'തിരുവോണം ബമ്പർ', draw_day: 'Seasonal Bumper', series_prefix: 'T', first_prize_amount: 250000000, ticket_price: 500 }
];

export const DEFAULT_DRAWS: DrawDetail[] = [
  {
    draw_id: "BR-99",
    lottery_name: "THIRUVONAM BUMPER",
    malayalam_name: "തിരുവോണം ബമ്പർ",
    draw_date: "2026-09-20",
    draw_number: 99,
    first_prize_winner: "TE 230620",
    consolation_number: "230620",
    prizes: [
      {
        tier_id: 1,
        tier_name: "1st Prize (Jackpot)",
        amount: 250000000,
        match_type: "exact_full",
        numbers: ["TE 230620"]
      },
      {
        tier_id: 2,
        tier_name: "Consolation Prize",
        amount: 500000,
        match_type: "consolation",
        numbers: ["230620"]
      },
      {
        tier_id: 3,
        tier_name: "2nd Prize",
        amount: 10000000,
        match_type: "exact_full",
        numbers: ["TA 482103", "TB 193847", "TC 837201", "TD 629401", "TE 510293"]
      },
      {
        tier_id: 4,
        tier_name: "3rd Prize",
        amount: 5000000,
        match_type: "exact_number",
        numbers: ["301928", "829104", "492019", "710293", "192847"]
      },
      {
        tier_id: 5,
        tier_name: "4th Prize",
        amount: 100000,
        match_type: "suffix",
        numbers: ["1920", "3847", "5629", "7401", "9283"]
      },
      {
        tier_id: 6,
        tier_name: "5th Prize",
        amount: 5000,
        match_type: "suffix",
        numbers: ["0412", "1928", "2837", "3746", "4655", "5564", "6473", "7382", "8291", "9100"]
      },
      {
        tier_id: 7,
        tier_name: "6th Prize",
        amount: 3000,
        match_type: "suffix",
        numbers: ["0123", "1234", "2345", "3456", "4567", "5678", "6789", "7890", "8901", "9012"]
      },
      {
        tier_id: 8,
        tier_name: "7th Prize",
        amount: 2000,
        match_type: "suffix",
        numbers: ["0987", "1876", "2765", "3654", "4543", "5432", "6321", "7210", "8109", "9098"]
      },
      {
        tier_id: 9,
        tier_name: "8th Prize",
        amount: 1000,
        match_type: "suffix",
        numbers: ["0145", "1256", "2367", "3478", "4589", "5690", "6701", "7812", "8923", "9034"]
      },
      {
        tier_id: 10,
        tier_name: "9th Prize",
        amount: 500,
        match_type: "suffix",
        numbers: ["03", "14", "25", "36", "47", "58", "69", "70", "81", "92"]
      }
    ]
  },
  {
    draw_id: "W-780",
    lottery_name: "WIN-WIN",
    malayalam_name: "വിൻ-വിൻ",
    draw_date: "2026-09-01",
    draw_number: 780,
    first_prize_winner: "WN 745821",
    consolation_number: "745821",
    prizes: [
      {
        tier_id: 1,
        tier_name: "1st Prize",
        amount: 7500000,
        match_type: "exact_full",
        numbers: ["WN 745821"]
      },
      {
        tier_id: 2,
        tier_name: "Consolation Prize",
        amount: 8000,
        match_type: "consolation",
        numbers: ["745821"]
      },
      {
        tier_id: 3,
        tier_name: "2nd Prize",
        amount: 500000,
        match_type: "exact_full",
        numbers: ["WA 319842"]
      },
      {
        tier_id: 4,
        tier_name: "3rd Prize",
        amount: 100000,
        match_type: "exact_number",
        numbers: ["184520", "592314", "847291"]
      },
      {
        tier_id: 5,
        tier_name: "4th Prize",
        amount: 5000,
        match_type: "suffix",
        numbers: ["1245", "3890", "5671", "7823", "9014"]
      },
      {
        tier_id: 6,
        tier_name: "5th Prize",
        amount: 2000,
        match_type: "suffix",
        numbers: ["0412", "1934", "2856", "3741", "4920", "5112", "6843", "8129", "9532"]
      },
      {
        tier_id: 7,
        tier_name: "6th Prize",
        amount: 1000,
        match_type: "suffix",
        numbers: ["0561", "1290", "2345", "3678", "4129", "5890", "6431", "7210", "8904", "9415"]
      },
      {
        tier_id: 8,
        tier_name: "7th Prize",
        amount: 500,
        match_type: "suffix",
        numbers: ["0123", "1456", "2789", "3012", "4345", "5678", "6901", "7234", "8567", "9890"]
      },
      {
        tier_id: 9,
        tier_name: "8th Prize",
        amount: 100,
        match_type: "suffix",
        numbers: ["04", "15", "29", "33", "48", "52", "67", "71", "86", "95"]
      }
    ]
  },
  {
    draw_id: "SS-430",
    lottery_name: "STHREE SAKTHI",
    malayalam_name: "സ്ത്രീ ശക്തി",
    draw_date: "2026-09-02",
    draw_number: 430,
    first_prize_winner: "SK 829143",
    consolation_number: "829143",
    prizes: [
      {
        tier_id: 1,
        tier_name: "1st Prize",
        amount: 7500000,
        match_type: "exact_full",
        numbers: ["SK 829143"]
      },
      {
        tier_id: 2,
        tier_name: "Consolation Prize",
        amount: 8000,
        match_type: "consolation",
        numbers: ["829143"]
      },
      {
        tier_id: 3,
        tier_name: "2nd Prize",
        amount: 1000000,
        match_type: "exact_full",
        numbers: ["SM 412095"]
      },
      {
        tier_id: 4,
        tier_name: "3rd Prize",
        amount: 5000,
        match_type: "suffix",
        numbers: ["2034", "4156", "6892", "8124"]
      },
      {
        tier_id: 5,
        tier_name: "4th Prize",
        amount: 2000,
        match_type: "suffix",
        numbers: ["1109", "3452", "5687", "7891"]
      },
      {
        tier_id: 6,
        tier_name: "5th Prize",
        amount: 1000,
        match_type: "suffix",
        numbers: ["0245", "1983", "4521", "6734", "8910"]
      },
      {
        tier_id: 7,
        tier_name: "6th Prize",
        amount: 500,
        match_type: "suffix",
        numbers: ["0512", "1823", "2945", "3612", "4890", "5723", "6190", "7421", "8340", "9652"]
      },
      {
        tier_id: 8,
        tier_name: "7th Prize",
        amount: 200,
        match_type: "suffix",
        numbers: ["0321", "1478", "2589", "3690", "4712", "5823", "6934", "7045", "8156", "9267"]
      },
      {
        tier_id: 9,
        tier_name: "8th Prize",
        amount: 100,
        match_type: "suffix",
        numbers: ["01", "12", "23", "34", "45", "56", "67", "78", "89", "90"]
      }
    ]
  },
  {
    draw_id: "FF-105",
    lottery_name: "FIFTY-FIFTY",
    malayalam_name: "ഫിഫ്റ്റി-ഫിഫ്റ്റി",
    draw_date: "2026-09-03",
    draw_number: 105,
    first_prize_winner: "FA 159283",
    consolation_number: "159283",
    prizes: [
      {
        tier_id: 1,
        tier_name: "1st Prize",
        amount: 10000000,
        match_type: "exact_full",
        numbers: ["FA 159283"]
      },
      {
        tier_id: 2,
        tier_name: "Consolation Prize",
        amount: 8000,
        match_type: "consolation",
        numbers: ["159283"]
      },
      {
        tier_id: 3,
        tier_name: "2nd Prize",
        amount: 5000000,
        match_type: "exact_full",
        numbers: ["FB 928314"]
      },
      {
        tier_id: 4,
        tier_name: "3rd Prize",
        amount: 5000,
        match_type: "suffix",
        numbers: ["1345", "2901", "4823", "6712", "8590"]
      },
      {
        tier_id: 5,
        tier_name: "4th Prize",
        amount: 2000,
        match_type: "suffix",
        numbers: ["0412", "2198", "4367", "6589", "8701"]
      },
      {
        tier_id: 6,
        tier_name: "5th Prize",
        amount: 1000,
        match_type: "suffix",
        numbers: ["0923", "1845", "3761", "5682", "7504", "9426"]
      },
      {
        tier_id: 7,
        tier_name: "6th Prize",
        amount: 500,
        match_type: "suffix",
        numbers: ["0182", "1293", "2304", "3415", "4526", "5637", "6748", "7859", "8960", "9071"]
      },
      {
        tier_id: 8,
        tier_name: "7th Prize",
        amount: 100,
        match_type: "suffix",
        numbers: ["05", "16", "27", "38", "49", "50", "61", "72", "83", "94"]
      }
    ]
  },
  {
    draw_id: "KN-520",
    lottery_name: "KARUNYA PLUS",
    malayalam_name: "കാരുണ്യ പ്ലസ്",
    draw_date: "2026-09-04",
    draw_number: 520,
    first_prize_winner: "PA 630194",
    consolation_number: "630194",
    prizes: [
      {
        tier_id: 1,
        tier_name: "1st Prize",
        amount: 8000000,
        match_type: "exact_full",
        numbers: ["PA 630194"]
      },
      {
        tier_id: 2,
        tier_name: "Consolation Prize",
        amount: 8000,
        match_type: "consolation",
        numbers: ["630194"]
      },
      {
        tier_id: 3,
        tier_name: "2nd Prize",
        amount: 1000000,
        match_type: "exact_full",
        numbers: ["PB 381920"]
      },
      {
        tier_id: 4,
        tier_name: "3rd Prize",
        amount: 5000,
        match_type: "suffix",
        numbers: ["1029", "3847", "5610", "7492", "9231"]
      },
      {
        tier_id: 5,
        tier_name: "4th Prize",
        amount: 1000,
        match_type: "suffix",
        numbers: ["0419", "1827", "3645", "5463", "7281", "9000"]
      },
      {
        tier_id: 6,
        tier_name: "5th Prize",
        amount: 500,
        match_type: "suffix",
        numbers: ["0145", "1256", "2367", "3478", "4589", "5690", "6701", "7812", "8923", "9034"]
      },
      {
        tier_id: 7,
        tier_name: "6th Prize",
        amount: 100,
        match_type: "suffix",
        numbers: ["08", "19", "20", "31", "42", "53", "64", "75", "86", "97"]
      }
    ]
  },
  {
    draw_id: "NR-380",
    lottery_name: "NIRMAL",
    malayalam_name: "നിർമ്മൽ",
    draw_date: "2026-09-05",
    draw_number: 380,
    first_prize_winner: "NA 918273",
    consolation_number: "918273",
    prizes: [
      {
        tier_id: 1,
        tier_name: "1st Prize",
        amount: 7000000,
        match_type: "exact_full",
        numbers: ["NA 918273"]
      },
      {
        tier_id: 2,
        tier_name: "Consolation Prize",
        amount: 8000,
        match_type: "consolation",
        numbers: ["918273"]
      },
      {
        tier_id: 3,
        tier_name: "2nd Prize",
        amount: 1000000,
        match_type: "exact_full",
        numbers: ["NB 456789"]
      },
      {
        tier_id: 4,
        tier_name: "3rd Prize",
        amount: 5000,
        match_type: "suffix",
        numbers: ["1122", "3344", "5566", "7788", "9900"]
      },
      {
        tier_id: 5,
        tier_name: "4th Prize",
        amount: 1000,
        match_type: "suffix",
        numbers: ["0987", "1876", "2765", "3654", "4543"]
      },
      {
        tier_id: 6,
        tier_name: "5th Prize",
        amount: 500,
        match_type: "suffix",
        numbers: ["0234", "1345", "2456", "3567", "4678", "5789", "6890", "7901", "8012", "9123"]
      },
      {
        tier_id: 7,
        tier_name: "6th Prize",
        amount: 100,
        match_type: "suffix",
        numbers: ["04", "18", "22", "36", "40", "54", "68", "72", "86", "90"]
      }
    ]
  }
];
