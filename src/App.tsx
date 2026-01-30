import { ReloadPrompt } from './components/ReloadPrompt'

function App() {
  return (
    <div className="min-h-screen bg-ink-deep text-oatmeal-parchment">
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold text-terracotta-burnt">
          Plotthreads
        </h1>
        <p className="mt-2 text-oatmeal-grain">
          Narrative thread management
        </p>
      </main>
      <ReloadPrompt />
    </div>
  )
}

export default App
