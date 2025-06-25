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
            className="rounded-xl overflow-hidden
                        bg-white dark:bg-gray-900/80
                        border border-black dark:border-white   /* ← new */
                        shadow hover:shadow-lg
                        transition-shadow"
          >
            <div className="aspect-[3/4] w-full overflow-hidden">
              {b.imageUrl && (
                <img
                  src={b.imageUrl}
                  alt={b.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="p-4 space-y-1">
              <h3 className="font-semibold line-clamp-2">{b.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
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
