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
      className="fixed bottom-4 right-4 z-50 max-w-xs rounded-lg border border-shadow-grey-700 bg-shadow-grey-800 p-4 shadow-lg"
      role="alert"
    >
      <div className="flex flex-col gap-3">
        <span className="text-sm text-ivory-100">
          New content available, click reload to update.
        </span>
        <div className="flex gap-2">
          <button
            className="rounded bg-brandy-500 px-4 py-2 text-sm font-medium text-ivory-50 transition-colors hover:bg-brandy-400"
            onClick={() => updateServiceWorker(true)}
          >
            Reload
          </button>
          <button
            className="rounded bg-shadow-grey-700 px-4 py-2 text-sm font-medium text-tan-200 transition-colors hover:bg-shadow-grey-600"
            onClick={close}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
