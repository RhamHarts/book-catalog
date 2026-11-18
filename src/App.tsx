
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import BookDetail from './pages/BookDetail'
import Category from './pages/Category'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/book/:id" element={<BookDetail />} />
      <Route path="/category/:category" element={<Category />} />
    </Routes>
  )
}

export default App
