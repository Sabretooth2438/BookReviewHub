const Button = ({ children, className = '', ...rest }) => (
  <button
    className={`px-4 py-2 rounded
                bg-primary hover:bg-primary/90
                dark:bg-primary-dark dark:hover:bg-primary-dark/90
                text-white dark:text-gray-900
                ${className}`}
    {...rest}
  >
    {children}
  </button>
)

export default Button
