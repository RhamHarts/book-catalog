
import { useEffect, useMemo, useState } from 'react'
import {
  getBooks,
  getBooksWithDetails,
  type BookDetail,
} from '../services/bookService'
import { Link } from 'react-router-dom'


function App() {
  const [books, setBooks] = useState<BookDetail[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Semua')

  
  useEffect(() => {
    async function fetchBooks() {
      try {
        const data = await getBooks()
        const detailedBooks = await getBooksWithDetails(data)

        setBooks(detailedBooks)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Terjadi kesalahan'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  const [categoryIndex, setCategoryIndex] = useState(0)

const categories = useMemo(
  () => [
    'Semua',
    ...new Set(books.flatMap((book) => book.categories)),
  ],
  [books]
)

const visibleCategories = categories.slice(
  categoryIndex,
  categoryIndex + 10
)

const maxCategoryIndex = Math.max(0, categories.length - 10)

  const filteredBooks = useMemo(() => {
    const keyword = search.toLowerCase().trim()

    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(keyword) ||
        book.authors.join(' ').toLowerCase().includes(keyword)

      const matchesCategory =
        selectedCategory === 'Semua' ||
        book.categories.includes(selectedCategory)

      return matchesSearch && matchesCategory
    })
  }, [books, search, selectedCategory])

  return (
    <main className="min-h-screen bg-secondary p-4 sm:p-8">
      <div className="mx-auto max-w-[1440px] overflow-hidden bg-white shadow-sm">

        {/* HEADER */}
        <header className="px-6 py-7 sm:px-12 lg:px-20">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

            <div>
              <a href="/" className="inline-flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center border-2 border-black text-xl font-serif font-bold">
                  BK
                </div>

                <div>
                  <h1 className="font-serif text-xl font-semibold tracking-tight text-black">
                    Buku Indonesia
                  </h1>
                  <p className="text-xs text-gray-500">
                    Digital Book Catalog
                  </p>
                </div>
              </a>

              <p className="mt-5 font-serif text-lg italic text-blue-900">
                Temukan cerita dan pengetahuan.
              </p>
            </div>

            <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-semibold uppercase tracking-wide text-gray-800">
              <a href="#catalog" className="transition hover:text-blue-700">
                Katalog
              </a>
              <a href="#catalog" className="transition hover:text-blue-700">
                Koleksi
              </a>
              <a href="#about" className="transition hover:text-blue-700">
                Tentang
              </a>
            </nav>

          </div>
        </header>

        {/* SEARCH & FILTER */}
        <section className="border-b border-gray-100 px-6 pb-7 pt-8 sm:px-12 lg:px-20">

          <div className="mx-auto flex max-w-5xl items-center gap-5">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-7 w-7 shrink-0 text-gray-900"
              aria-hidden="true"
            >
              <circle cx="10.8" cy="10.8" r="7" />
              <path d="m16 16 5 5" />
            </svg>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari judul buku atau nama penulis..."
              className="w-full border-b border-gray-900 bg-transparent px-0 py-3 text-base text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-700 sm:text-lg"
            />
          </div>

      

<div className="mt-9 flex min-w-0 items-center gap-5">
  <span className="shrink-0 text-sm font-semibold text-gray-500">
    Filter:
  </span>

  {/* Previous */}
  <button
    onClick={() => {
      setCategoryIndex((prev) => Math.max(0, prev - 1))
    }}
    disabled={categoryIndex === 0}
    className="shrink-0 text-xl text-gray-700 transition hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-20"
    aria-label="Kategori sebelumnya"
  >
    &#8592;
  </button>

  {/* Category Carousel */}
  <div className="flex min-w-0 flex-1 flex-nowrap items-center gap-8 overflow-hidden">

{visibleCategories.map((category) => (
  <Link
    key={category}
    to={
      category === 'Semua'
        ? '/'
        : `/category/${encodeURIComponent(category)}`
    }
    className="shrink-0 whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-gray-800 transition hover:text-blue-700"
  >
    {category}
  </Link>
))}

  </div>

  {/* Next */}
  <button
    onClick={() => {
      setCategoryIndex((prev) =>
        Math.min(maxCategoryIndex, prev + 1)
      )
    }}
    disabled={categoryIndex >= maxCategoryIndex}
    className="shrink-0 text-xl text-gray-700 transition hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-20"
    aria-label="Kategori berikutnya"
  >
    &#8594;
  </button>
</div>



        </section>

        {/* CATALOG */}
        <section id="catalog" className="min-h-[500px] bg-primary px-6 py-12 sm:px-12 sm:py-16 lg:px-20">

          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Indonesian Book Collection
              </p>

              <h2 className="font-serif text-2xl font-semibold text-gray-900 sm:text-3xl">
                Jelajahi Katalog
              </h2>
            </div>

            <p className="text-xs text-gray-500 sm:text-sm">
              {filteredBooks.length} buku
            </p>
          </div>

          {loading && (
            <p className="py-16 text-center text-gray-500">
              Sedang mengambil data buku...
            </p>
          )}

          {error && (
            <p className="py-16 text-center text-red-600">
              {error}
            </p>
          )}

          {!loading && !error && (
            <>
              {filteredBooks.length === 0 ? (
                <p className="py-16 text-center text-gray-500">
                  Buku tidak ditemukan.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">

                  {filteredBooks.map((book) => (
       <article key={book.id} className="min-w-0">
  <Link
    to={`/book/${book.id}`}
    className="group block cursor-pointer"
  >
    

                      <div className="aspect-[3/4] overflow-hidden bg-secondary shadow-md">
                        {book.coverUrl ? (
                          <img
                            src={book.coverUrl}
                            alt={`Sampul ${book.title}`}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-500 hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center px-3 text-center text-xs text-gray-500">
                            Sampul tidak tersedia
                          </div>
                        )}
                      </div>

                      <div className="mt-4">
                        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900">
                          {book.title}
                        </h3>

                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-600">
                          {book.authors.join(', ') || 'Penulis tidak diketahui'}
                        </p>

                        <p className="mt-2 text-xs text-gray-500">
                          {book.year ?? 'Tahun tidak diketahui'}
                        </p>
                        
                      </div>

              </Link>
</article>
                    
                  ))}

                </div>
              )}
            </>
          )}

        </section>

        {/* FOOTER */}
        <footer id="about" className="bg-white px-6 py-8 text-center sm:px-12">
          <p className="font-serif text-sm text-gray-700">
            Buku Indonesia — Digital Book Catalog
          </p>
          <p className="mt-2 text-xs text-gray-400">
            Jelajahi informasi dan koleksi buku Indonesia.
          </p>
        </footer>

      </div>
    </main>
  )
}

export default App
