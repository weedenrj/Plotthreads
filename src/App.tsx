import { ReloadPrompt } from './components/ReloadPrompt'
import { Notes } from './components/features/Notes'
import { Button } from './components/ui/button'
import { useAuth } from './hooks/useAuth'

function App() {
  const { user, isLoading, isAuthenticated, login, logout } = useAuth()

  return (
    <div className="flex min-h-screen flex-col bg-shadow-grey-950 text-ivory-100">
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <img src="/Logo.png" alt="Plotthreads" className="h-8 w-8" />
          <span className="font-semibold text-ivory-50">Plotthreads</span>
        </div>
        <div className="flex items-center gap-3">
          {isLoading ? (
            <span className="text-sm text-tan-400">Loading...</span>
          ) : isAuthenticated ? (
            <>
              <img
                src={user?.picture}
                alt={user?.name}
                referrerPolicy="no-referrer"
                className="h-8 w-8 rounded-full"
              />
              <span className="text-sm text-tan-300">{user?.name}</span>
              <Button variant="ghost" size="sm" onClick={logout}>
                Sign out
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={login}>
              Sign in with Google
            </Button>
          )}
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center px-6 py-12">
        <h1 className="text-2xl font-bold text-ivory-50">Notes CRUD Demo</h1>
        <p className="mt-2 text-tan-300">Testing tRPC + Postgres</p>
        <div className="mt-8 w-full max-w-2xl">
          <Notes />
        </div>
      </main>
      <ReloadPrompt />
    </div>
  )
}

export default App
