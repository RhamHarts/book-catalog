
const API_BASE_URL =
  'https://khrlanamm.github.io/buku-indonesia/api/v1'

export interface Book {
  i: string
  t: string
  s: string | null
  a: string[]
  p: string | null
  y: number | null
  b: string | null
  c: string[]
  r: boolean
  v: number
}

export interface BookDetail {
  id: string
  title: string
  subtitle: string | null
  authors: string[]
  publisher: string | null
  year: number | null
  isbn13: string | null
  pages: number | null
  language: string | null
  categories: string[]
  reviewed: boolean
  needsCheck: string[]
  sources: string[]
  openLibrary: {
    work: string | null
    edition: string | null
    coverId: number | null
    isbn10: string | null
  }
  coverUrl: string | null
  openLibraryUrl: string | null
}

export async function getBooks(): Promise<Book[]> {
  const response = await fetch(`${API_BASE_URL}/search-index.json`)

  if (!response.ok) {
    throw new Error('Gagal mengambil data buku')
  }

  return response.json()
}

export async function getBookDetail(id: string): Promise<BookDetail> {
  const response = await fetch(`${API_BASE_URL}/books/${id}.json`)

  if (!response.ok) {
    throw new Error('Gagal mengambil detail buku')
  }

  return response.json()
}


export async function getBooksWithDetails(books: Book[]): Promise<BookDetail[]> {
  const selectedBooks = books.slice(0, 24)

  const details = await Promise.all(
    selectedBooks.map(async (book) => {
      try {
        return await getBookDetail(book.i)
      } catch {
        return null
      }
    })
  )

  return details.filter(
    (book): book is BookDetail => book !== null
  )
}
