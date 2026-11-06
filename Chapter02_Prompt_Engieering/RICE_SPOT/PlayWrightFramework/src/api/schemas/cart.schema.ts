import { z } from 'zod';

export const CartSnapshotSchema = z.object({
  products: z.array(z.object({ product_id: z.string().optional() }).passthrough()),
  vouchers: z.array(z.unknown()),
  totals: z.array(
    z.object({
      title: z.string(),
      text: z.string(),
    }),
  ),
});

export type CartSnapshot = z.infer<typeof CartSnapshotSchema>;
