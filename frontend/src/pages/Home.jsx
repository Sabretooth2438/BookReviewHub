import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/layout/Header'
import StarRating from '../components/StarRating'
import useFetch from '../hooks/useFetch'
import { fetchBooks } from '../services/books'

const CARD_WIDTH = 180

const Home = () => {
  const { data, isLoading } = useFetch(['books'], fetchBooks)
  const books = data?.data ?? []

  /* search */
  const [q, setQ] = useState('')
  const qLower = q.toLowerCase()
  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(qLower) ||
      b.author.toLowerCase().includes(qLower)
  )

  return (
    <>
      <Header />

      <main className="pt-24 px-6 space-y-6">
        {/* search box */}
        <input
          type="search"
          placeholder="Search books…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="block mx-auto w-full max-w-sm border rounded px-3 py-2
                      bg-white dark:bg-gray-800
                      text-gray-900 dark:text-gray-100
                      placeholder-gray-500 dark:placeholder-gray-400
                      focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {/* cards — flex so last row stays centred */}
        <section className="flex flex-wrap justify-center gap-6">
          {isLoading && (
            <p className="w-full text-center animate-pulse">Loading…</p>
          )}

          {filtered.map((b) => (
            <Link
              key={b.id}
              to={`/book/${b.id}`}
              style={{ width: CARD_WIDTH }}
              className="rounded-xl overflow-hidden
                          bg-white dark:bg-gray-900/80
                          border border-black dark:border-white
                          shadow hover:shadow-lg transition-shadow"
            >
              <div className="aspect-[3/4] w-full overflow-hidden">
                {b.imageUrl && (
                  <img
                    src={b.imageUrl}
                    alt={b.title}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.style.opacity = 0)}
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
        </section>
      </main>
    </>
  )
}

export default Home
