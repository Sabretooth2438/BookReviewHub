import { Link } from 'react-router-dom'
import Header from '../components/layout/Header'
import StarRating from '../components/StarRating'
import useFetch from '../hooks/useFetch'
import { fetchBooks } from '../services/books'

const Home = () => {
  const { data, isLoading } = useFetch(['books'], fetchBooks)

  return (
    <>
      <Header />

      <main
        className="pt-24 px-6 grid gap-6
                sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6"
      >
        {isLoading && (
          <p className="col-span-full text-center animate-pulse">Loading…</p>
        )}

        {data?.data?.map((b) => (
          <Link
            key={b.id}
            to={`/book/${b.id}`}
            className="rounded-xl overflow-hidden shadow
                        bg-white dark:bg-gray-900/80
                        hover:shadow-lg dark:hover:shadow
                        border border-gray-200 dark:border-gray-700
                        backdrop-blur"
          >
            {b.imageUrl && (
              <img
                src={b.imageUrl}
                alt={b.title}
                className="w-full aspect-[3/4] object-contain
                              bg-gray-800/20 dark:bg-gray-700/20"
              />
            )}

            <div className="p-4 space-y-1">
              <h3 className="font-semibold">{b.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {b.author}
              </p>
              <StarRating value={b.rating} />
            </div>
          </Link>
        ))}
      </main>
    </>
  )
}

export default Home
