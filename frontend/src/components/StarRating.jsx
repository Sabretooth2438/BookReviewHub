const StarRating = ({ value = 0 }) => {
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < Math.round(value) ? '★' : '☆'
  ).join('')
  return <span className="text-yellow-500">{stars}</span>
}

export default StarRating