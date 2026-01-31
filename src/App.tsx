import { ReloadPrompt } from './components/ReloadPrompt'
import { Notes } from './components/features/Notes'

function App() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-shadow-grey-950 px-6 py-12 text-ivory-100">
      <img src="/Logo.png" alt="Plotthreads" className="h-16 w-16" />
      <h1 className="mt-4 text-2xl font-bold text-ivory-50">Plotthreads</h1>
      <p className="mt-2 text-tan-300">Notes CRUD Demo</p>
      <div className="mt-8 w-full max-w-2xl">
        <Notes />
      </div>
      <ReloadPrompt />
    </div>
  )
}

export default App
