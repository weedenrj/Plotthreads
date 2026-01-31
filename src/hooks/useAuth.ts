import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTRPC } from '@/lib/trpc'

export function useAuth() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const { data: user, isLoading } = useQuery(trpc.auth.me.queryOptions())

  const logoutMutation = useMutation({
    ...trpc.auth.logout.mutationOptions(),
    onSuccess: () => {
      queryClient.setQueryData(trpc.auth.me.queryKey(), null)
    },
  })

  const login = async () => {
    const { url } = await queryClient.fetchQuery(trpc.auth.getAuthUrl.queryOptions())
    window.location.href = url
  }

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout: () => logoutMutation.mutate(),
    isLoggingOut: logoutMutation.isPending,
  }
}
