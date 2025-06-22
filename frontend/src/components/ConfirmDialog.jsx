const ConfirmDialog = ({
  open,
  title = 'Confirm',
  message = 'Are you sure?',
  onConfirm,
  onCancel,
}) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/60 grid place-items-center z-50">
      <div
        className="relative bg-white dark:bg-gray-900/90
                      p-6 rounded-xl shadow max-w-sm w-full"
      >
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <p className="mb-6">{message}</p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm()
              onCancel()
            }}
            className="px-4 py-2 rounded bg-red-600 text-white"
          >
            Delete
          </button>
        </div>

        <button
          onClick={onCancel}
          className="absolute top-2 right-3 text-2xl font-semibold"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default ConfirmDialog
