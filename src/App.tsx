import { ReloadPrompt } from './components/ReloadPrompt'
import { Notes } from './components/features/Notes'
import { Button } from './components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './components/ui/popover'
import { useAuth } from './hooks/useAuth'

function App() {
  const { user, isLoading, isAuthenticated, login, logout } = useAuth()

  return (
    <div
      className="flex min-h-screen min-h-[100dvh] flex-col bg-shadow-grey-950 text-ivory-100 [padding:env(safe-area-inset-top)_env(safe-area-inset-right)_env(safe-area-inset-bottom)_env(safe-area-inset-left)]"
    >
      <header
        className="flex min-h-14 flex-shrink-0 items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4"
        role="banner"
      >
        <div className="flex min-w-0 items-center gap-3">
          <img src="/Logo.png" alt="Plotthreads" className="h-8 w-8 shrink-0 sm:h-9 sm:w-9" width={36} height={36} decoding="async" />
          <span className="truncate font-semibold text-ivory-50">Plotthreads</span>
        </div>
        {isLoading ? (
          <div
            className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-shadow-grey-800"
            aria-busy="true"
            aria-label="Loading account"
          />
        ) : isAuthenticated && user ? (
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-shadow-grey-800 transition-opacity duration-150 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brandy-400 focus-visible:ring-offset-2 focus-visible:ring-offset-shadow-grey-950 active:opacity-80"
                aria-label="Open user menu"
              >
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                    width={32}
                    height={32}
                    decoding="async"
                  />
                ) : (
                  <span className="text-xs font-medium text-ivory-100">
                    {user.name.slice(0, 2).toUpperCase() || '?'}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" sideOffset={8} className="w-56 max-w-[calc(100vw-2rem)] p-2">
              <p className="truncate px-2 py-1 text-sm font-medium text-ivory-50">{user.name}</p>
              <p className="truncate px-2 pb-2 text-xs text-tan-400">{user.email}</p>
              <Button
                variant="ghost"
                size="sm"
                className="min-h-11 w-full justify-start py-3 text-left"
                onClick={logout}
              >
                Sign out
              </Button>
            </PopoverContent>
          </Popover>
        ) : (
          <Button
            size="default"
            className="min-h-11 shrink-0"
            onClick={login}
            aria-label="Sign in with Google"
          >
            Sign in
          </Button>
        )}
      </header>
      <main
        className="flex min-w-0 flex-1 flex-col items-center px-4 py-8 sm:px-6 sm:py-12"
        id="main-content"
        role="main"
      >
        <h1 className="text-xl font-bold text-ivory-50 sm:text-2xl">Notes CRUD Demo</h1>
        <p className="mt-2 text-sm text-tan-300 sm:text-base">Testing tRPC + Postgres</p>
        <div className="mt-6 w-full max-w-2xl sm:mt-8">
          <Notes />
        </div>
      </main>
      <ReloadPrompt />
    </div>
  )
}

export default App
