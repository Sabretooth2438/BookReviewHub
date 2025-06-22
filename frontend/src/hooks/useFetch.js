import { useQuery } from '@tanstack/react-query'

const useFetch = (queryKey, queryFn, options = {}) =>
  useQuery({
    queryKey,
    queryFn,
    ...options,
  })

export default useFetch
