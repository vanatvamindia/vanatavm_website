import NextLink from "next/link";
import type { ComponentProps } from "react";
import { PREFETCH_LINKS } from "@/lib/hosting";

/**
 * Drop-in replacement for `next/link` used by the marketing pages. Identical API; the only
 * difference is that background prefetching follows the hosting setting in `@/lib/hosting`
 * (off on Zoho Catalyst, where prefetch requests 404). An explicit `prefetch` prop still wins.
 */
export default function Link({ prefetch, ...props }: ComponentProps<typeof NextLink>) {
  return <NextLink prefetch={prefetch ?? (PREFETCH_LINKS ? undefined : false)} {...props} />;
}
