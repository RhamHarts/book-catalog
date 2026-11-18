
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  getBookDetail,
  type BookDetail as BookDetailType,
} from '../services/bookService'

function BookDetail() {
  const { id } = useParams()

  const [book, setBook] = useState<BookDetailType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchBook() {
      if (!id) {
        setError('ID buku tidak ditemukan')
        setLoading(false)
        return
      }

      try {
        const data = await getBookDetail(id)
        setBook(data)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Gagal mengambil detail buku'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchBook()
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen bg-secondary p-8">
        <p className="text-center text-gray-500">
          Sedang mengambil detail buku...
        </p>
      </main>
    )
  }

  if (error || !book) {
    return (
      <main className="min-h-screen bg-secondary p-8">
        <p className="text-center text-red-600">
          {error || 'Buku tidak ditemukan'}
        </p>

  <div className="mb-6 text-left">
  <Link
    to="/"
    className="inline-flex items-center gap-2 text-base font-semibold text-gray-800 transition hover:text-blue-700"
  >
    <h3 className="text-xl">←</h3>
    Kembali ke katalog
  </Link>
</div>
      </main>
    )
  }

  return (
<main className="min-h-screen bg-secondary p-3 sm:p-6">
  <div className="mx-auto max-w-[1440px] bg-white p-5 shadow-sm sm:p-8 lg:p-12">

      <div className="mt-6 text-left">
  <Link
    to="/"
    className="inline-flex items-center  gap-2 text-xl font-semibold text-gray-800 transition hover:text-blue-700"
  >
    <span className="text-xl">←</span>
    Kembali ke katalog
  </Link>
</div>

        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[280px_1fr] lg:gap-16">

          {/* COVER */}
          <div>
            <div className="aspect-[3/4] overflow-hidden bg-secondary shadow-md">
              {book.coverUrl ? (
                <img
                  src={book.coverUrl}
                  alt={`Sampul ${book.title}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-gray-500">
                  Sampul tidak tersedia
                </div>
              )}
            </div>
          </div>

          {/* BOOK INFORMATION */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              Indonesian Book Collection
            </p>

            <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight text-gray-900 sm:text-4xl">
              {book.title}
            </h1>

            {book.subtitle && (
              <p className="mt-3 text-lg text-gray-600">
                {book.subtitle}
              </p>
            )}

            <p className="mt-5 text-sm text-gray-600">
              Oleh {book.authors.join(', ') || 'Penulis tidak diketahui'}
            </p>

            <div className="mt-8 border-t border-gray-200">
              <div className="grid grid-cols-1 gap-5 py-6 sm:grid-cols-2">

                <div>
                  <p className="text-xs text-gray-500">Penerbit</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {book.publisher || '-'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Tahun Terbit</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {book.year ?? '-'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">ISBN</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {book.isbn13 || '-'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Jumlah Halaman</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {book.pages ?? '-'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Bahasa</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {book.language || '-'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Kategori</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {book.categories.join(', ') || '-'}
                  </p>
                </div>

              </div>
            </div>

            {book.openLibraryUrl && (
              <a
                href={book.openLibraryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm text-blue-700 hover:underline"
              >
                Lihat di Open Library ↗
              </a>
            )}
          </div>
        </div>

      </div>
    </main>
  )
}

export default BookDetail
