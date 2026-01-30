import { Icon } from './components/Icon'
import { ReloadPrompt } from './components/ReloadPrompt'

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-xl border border-shadow-grey-800 bg-shadow-grey-950 p-6 transition-colors hover:border-shadow-grey-700">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brandy-500/10 text-brandy-400">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-ivory-50">{title}</h3>
      <p className="mt-2 text-tan-300">{description}</p>
    </div>
  )
}

interface StepCardProps {
  number: string
  title: string
  description: string
}

function StepCard({ number, title, description }: StepCardProps) {
  return (
    <div className="relative">
      <div className="text-6xl font-bold text-brandy-500/20">{number}</div>
      <h3 className="mt-2 text-xl font-semibold text-ivory-50">{title}</h3>
      <p className="mt-3 text-tan-300">{description}</p>
    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-shadow-grey-950 text-ivory-100">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-brandy-950/20 to-transparent" />
        <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <img src="/Logo.png" alt="Plotthreads" className="h-10 w-10" />
            <span className="text-xl font-semibold text-ivory-50">Plotthreads</span>
          </div>
          <button className="rounded-lg bg-brandy-500 px-5 py-2.5 text-sm font-medium text-ivory-50 transition-colors hover:bg-brandy-400">
            Get Started
          </button>
        </nav>

        <div className="relative mx-auto max-w-4xl px-6 pb-24 pt-20 text-center">
          <h1 className="text-5xl font-bold leading-tight tracking-tight text-ivory-50 sm:text-6xl">
            Weave your stories
            <span className="block text-brandy-400">thread by thread</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-tan-200">
            Plotthreads helps writers organize complex narratives. Track character arcs,
            plot lines, and story connections in one beautiful workspace.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <button className="w-full rounded-lg bg-brandy-500 px-8 py-3.5 text-base font-semibold text-ivory-50 transition-all hover:bg-brandy-400 hover:shadow-lg hover:shadow-brandy-500/25 sm:w-auto">
              Start Writing Free
            </button>
            <button className="w-full rounded-lg border border-shadow-grey-700 bg-shadow-grey-900 px-8 py-3.5 text-base font-semibold text-ivory-100 transition-colors hover:border-shadow-grey-600 hover:bg-shadow-grey-800 sm:w-auto">
              See How It Works
            </button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="border-t border-shadow-grey-800 bg-shadow-grey-900 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-ivory-50 sm:text-4xl">
              Everything you need to craft complex stories
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-tan-300">
              From sprawling epics to intricate mysteries, keep every thread organized and connected.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Icon name="thread" />}
              title="Thread Management"
              description="Create and organize narrative threads. Track subplots, character arcs, and thematic elements with ease."
            />
            <FeatureCard
              icon={<Icon name="connection" />}
              title="Visual Connections"
              description="See how your threads interweave. Visualize relationships between characters, events, and story beats."
            />
            <FeatureCard
              icon={<Icon name="timeline" />}
              title="Timeline View"
              description="Arrange events chronologically. Ensure continuity and spot gaps in your narrative flow."
            />
            <FeatureCard
              icon={<Icon name="offline" />}
              title="Works Offline"
              description="Write anywhere, anytime. Your work syncs automatically when you're back online."
            />
            <FeatureCard
              icon={<Icon name="export" />}
              title="Export Anywhere"
              description="Export your threads to Markdown, JSON, or integrate with your favorite writing tools."
            />
            <FeatureCard
              icon={<Icon name="secure" />}
              title="Private & Secure"
              description="Your stories stay yours. Data is stored locally with optional encrypted cloud backup."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-t border-shadow-grey-800 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-ivory-50 sm:text-4xl">
              Simple yet powerful
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-tan-300">
              Start with a single thread and expand into a rich tapestry of interconnected narratives.
            </p>
          </div>

          <div className="mt-16 grid gap-12 lg:grid-cols-3">
            <StepCard
              number="01"
              title="Create Threads"
              description="Start with your main plot, then add subplots, character arcs, and thematic threads as your story grows."
            />
            <StepCard
              number="02"
              title="Connect & Organize"
              description="Link related threads together. Tag, color-code, and group them to match your mental model of the story."
            />
            <StepCard
              number="03"
              title="Write & Refine"
              description="Use your thread map as a guide while writing. Update and evolve your threads as the story takes shape."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-shadow-grey-800 bg-linear-to-b from-shadow-grey-900 to-shadow-grey-950 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-ivory-50 sm:text-4xl">
            Ready to untangle your narrative?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-tan-300">
            Join writers who use Plotthreads to bring order to their creative chaos.
          </p>
          <button className="mt-10 rounded-lg bg-brandy-500 px-10 py-4 text-lg font-semibold text-ivory-50 transition-all hover:bg-brandy-400 hover:shadow-lg hover:shadow-brandy-500/25">
            Start Your First Thread
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-shadow-grey-800 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <img src="/Logo.png" alt="Plotthreads" className="h-8 w-8" />
              <span className="font-medium text-ivory-100">Plotthreads</span>
            </div>
            <p className="text-sm text-tan-400">
              Crafted for storytellers, by storytellers.
            </p>
          </div>
        </div>
      </footer>

      <ReloadPrompt />
    </div>
  )
}

export default App
