const Input = ({ as, className = '', ...rest }) => {
  const base =
    'border rounded px-3 py-2 w-full bg-white dark:bg-gray-800 ' +
    'text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ' +
    'focus:outline-none focus:ring-2 focus:ring-primary'

  if (as === 'textarea') {
    return <textarea rows={4} className={`${base} ${className}`} {...rest} />
  }
  return <input className={`${base} ${className}`} {...rest} />
}

export default Input
