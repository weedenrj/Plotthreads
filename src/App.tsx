import { ReloadPrompt } from './components/ReloadPrompt'
import { Button } from './components/ui/button'

function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-shadow-grey-950 px-6 text-ivory-100">
      <img src="/Logo.png" alt="Plotthreads" className="h-24 w-24" />
      <h1 className="mt-6 text-3xl font-bold text-ivory-50">Plotthreads</h1>
      <p className="mt-4 text-center text-tan-300">
        Getting started...
      </p>
      <Button className="mt-8">
        Get Started
      </Button>
      <ReloadPrompt />
    </div>
  )
}

export default App
