import { useState } from 'react'
import { Star } from 'lucide-react'

const StarRating = ({ value = 0, onChange = null, showNumber = false }) => {
  const [hover, setHover] = useState(null)
  const displayValue = hover ?? value

  return (
    <div className="flex items-center space-x-1 text-yellow-500">
      {Array.from({ length: 5 }).map((_, i) => {
        const full = i + 1 <= displayValue
        const half = !full && i + 0.5 <= displayValue

        return (
          <button
            key={i}
            type="button"
            className={
              onChange
                ? 'cursor-pointer relative w-5 h-5'
                : 'cursor-default relative w-5 h-5'
            }
            onClick={() => onChange?.(i + 1)}
            onMouseEnter={() => onChange && setHover(i + 1)}
            onMouseLeave={() => onChange && setHover(null)}
          >
            {full && (
              <Star
                fill="currentColor"
                stroke="none"
                className="w-full h-full"
              />
            )}
            {half && (
              <Star
                className="w-full h-full"
                fill="url(#half-grad)"
                stroke="currentColor"
              />
            )}
            {!full && !half && <Star className="w-full h-full" />}
          </button>
        )
      })}
      {showNumber && (
        <span className="ml-2 text-sm text-gray-300">({value.toFixed(1)})</span>
      )}

      {/* SVG gradient for half-fill */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="half-grad">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

export default StarRating
