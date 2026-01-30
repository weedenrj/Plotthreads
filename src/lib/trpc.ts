import { createTRPCContext } from '@trpc/tanstack-react-query'
import type { AppRouter } from '../../packages/api/src/router'

export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>()
