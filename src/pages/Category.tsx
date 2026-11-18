
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  getBooks,
  getBooksWithDetails,
  type BookDetail,
} from '../services/bookService'

function Category() {
  const { category } = useParams()

  const [books, setBooks] = useState<BookDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sortBy, setSortBy] = useState('newest')

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

  const categories = useMemo(
    () => [
      ...new Set(books.flatMap((book) => book.categories)),
    ],
    [books]
  )

  const filteredBooks = useMemo(() => {
    const result = books.filter((book) =>
      book.categories.includes(category ?? '')
    )

    return [...result].sort((a, b) => {
      if (sortBy === 'newest') {
        return (b.year ?? 0) - (a.year ?? 0)
      }

      if (sortBy === 'oldest') {
        return (a.year ?? 0) - (b.year ?? 0)
      }

      if (sortBy === 'title') {
        return a.title.localeCompare(b.title)
      }

      return 0
    })
  }, [books, category, sortBy])

  return (
    <main className="min-h-screen bg-secondary p-4 sm:p-8">
      <div className="mx-auto max-w-[1440px] overflow-hidden bg-white shadow-sm">

        {/* HEADER */}
        <header className="flex items-center justify-between border-b border-gray-100 px-6 py-7 sm:px-12 lg:px-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center border-2 border-black font-serif text-xl font-bold">
              BK
            </div>

            <div>
              <h1 className="font-serif text-xl font-semibold text-black">
                Buku Indonesia
              </h1>
              <p className="text-xs text-gray-500">
                Digital Book Catalog
              </p>
            </div>
          </Link>

          <Link
            to="/"
            className="text-xs font-semibold uppercase tracking-wide text-gray-700 transition hover:text-blue-700"
          >
            Kembali ke katalog
          </Link>
        </header>

        {/* CATEGORY INTRODUCTION */}
        <section className="px-6 pb-10 pt-12 sm:px-12 sm:pt-16 lg:px-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
            Jelajahi koleksi buku
          </p>

          <h2 className="mt-3 font-serif text-4xl font-semibold text-gray-900 sm:text-5xl">
            {category}
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-500">
            Temukan berbagai koleksi buku pilihan dalam kategori {category}.
          </p>
        </section>

        {/* CATEGORY NAVIGATION */}
        <section className="border-b border-gray-100 px-6 pb-8 sm:px-12 lg:px-20">
          <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-gray-500">
            Jelajahi kategori lainnya
          </p>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((item) => (
              <Link
                key={item}
                to={`/category/${encodeURIComponent(item)}`}
                className={`shrink-0 border px-5 py-3 text-xs font-semibold transition ${
                  item === category
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 text-gray-700 hover:border-gray-900'
                }`}
              >
                {item}
              </Link>
            ))}
          </div>
        </section>

        {/* CATALOG */}
        <section className="bg-primary px-6 py-10 sm:px-12 sm:py-14 lg:px-20">

          {/* FILTER & SORT */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                Koleksi kategori
              </p>

              <h3 className="mt-2 font-serif text-2xl font-semibold text-gray-900">
                Buku {category}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">
                Filter & Sort
              </span>

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="border border-gray-300 bg-white px-3 py-2 text-xs text-gray-800 outline-none focus:border-gray-900"
                aria-label="Urutkan buku"
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="title">Judul A-Z</option>
              </select>
            </div>
          </div>

          {/* BOOK COUNT */}
          <div className="mb-7 border-b border-gray-300 pb-4">
            <p className="text-xs text-gray-600">
              Menampilkan <span className="font-semibold">{filteredBooks.length}</span> buku
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
                  Belum ada buku dalam kategori ini.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 md:grid-cols-4">

                  {filteredBooks.map((book) => (
                    <article key={book.id} className="min-w-0">
                      <Link
                        to={`/book/${book.id}`}
                        className="group block"
                      >
                        <div className="aspect-[3/4] overflow-hidden bg-secondary shadow-sm">
                          {book.coverUrl ? (
                            <img
                              src={book.coverUrl}
                              alt={`Sampul ${book.title}`}
                              loading="lazy"
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center px-3 text-center text-xs text-gray-500">
                              Sampul tidak tersedia
                            </div>
                          )}
                        </div>

                        <div className="mt-4">
                          <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900">
                            {book.title}
                          </h4>

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
        <footer className="bg-white px-6 py-8 text-center sm:px-12">
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

export default Category
