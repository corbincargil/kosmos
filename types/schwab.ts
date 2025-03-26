import { z } from "zod";

const BalancesSchema = z.object({
  accruedInterest: z.number(),
  accountValue: z.number(),
  cashBalance: z.number(),
  liquidationValue: z.number(),
  moneyMarketFund: z.number(),
  mutualFundValue: z.number(),
  pendingDeposits: z.number(),
});

const SecuritiesAccountSchema = z.object({
  accountNumber: z.string(),
  initialBalances: BalancesSchema,
});

export const SchwabAccountSchema = z.object({
    securitiesAccount: SecuritiesAccountSchema,
});

export const SchwabAccountsResponseSchema = z.array(SchwabAccountSchema);

export type SchwabAccount = z.infer<typeof SchwabAccountSchema>;
export type SchwabAccountsResponse = z.infer<typeof SchwabAccountsResponseSchema>; 