import { useRegisterSW } from 'virtual:pwa-register/react'

export function ReloadPrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  const close = () => {
    setNeedRefresh(false)
  }

  if (!needRefresh) return null

  return (
    <div
      className="fixed bottom-4 right-4 z-50 max-w-xs rounded-lg border border-ink-dusk bg-ink-midnight p-4 shadow-lg"
      role="alert"
    >
      <div className="flex flex-col gap-3">
        <span className="text-sm text-oatmeal-parchment">
          New content available, click reload to update.
        </span>
        <div className="flex gap-2">
          <button
            className="rounded bg-terracotta-burnt px-4 py-2 text-sm font-medium text-oatmeal-parchment transition-colors hover:bg-terracotta-spool"
            onClick={() => updateServiceWorker(true)}
          >
            Reload
          </button>
          <button
            className="rounded bg-ink-dusk px-4 py-2 text-sm font-medium text-oatmeal-grain transition-colors hover:bg-ink-dusk/80"
            onClick={close}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
