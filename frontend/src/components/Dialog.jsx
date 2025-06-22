const Dialog = ({ open, onClose, children }) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/60 grid place-items-center z-50">
      <div
        className="relative bg-white dark:bg-gray-900/90
                    p-6 rounded-xl shadow w-full max-w-md"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-2xl font-semibold hover:opacity-70"
          aria-label="Close"
        >
          ×
        </button>

        {children}
      </div>
    </div>
  )
}

export default Dialog
