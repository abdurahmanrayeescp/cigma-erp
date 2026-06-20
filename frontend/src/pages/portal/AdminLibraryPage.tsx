import { useState, useEffect } from 'react'
import { Book, Plus, Search, BookOpen, CheckCircle2, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { get, post } from '@/lib/api'

export default function AdminLibraryPage() {
  const [books, setBooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  
  const [newBook, setNewBook] = useState({ title: '', author: '', isbn: '', category: '' })

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const res = await get('/api/library')
      if (res.success) setBooks(res.data)
    } catch (err) {
      toast.error('Failed to load library catalog')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await post('/api/library', newBook)
      if (res.success) {
        toast.success('Book added successfully')
        setIsAdding(false)
        setNewBook({ title: '', author: '', isbn: '', category: '' })
        fetchBooks()
      }
    } catch (error) {
      toast.error('Failed to add book')
    }
  }

  const handleIssue = async (id: string) => {
    const studentId = prompt("Enter Student ID to issue this book to:")
    if (!studentId) return

    try {
      const res = await post(`/api/library/${id}/issue`, { studentId })
      if (res.success) {
        toast.success('Book issued successfully')
        fetchBooks()
      }
    } catch (error) {
      toast.error('Failed to issue book')
    }
  }

  const handleReturn = async (id: string) => {
    if (!confirm('Mark this book as returned?')) return
    try {
      const res = await post(`/api/library/${id}/return`, {})
      if (res.success) {
        toast.success('Book returned successfully')
        fetchBooks()
      }
    } catch (error) {
      toast.error('Failed to return book')
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-maroon-600" />
            Library Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage the school library catalog and book issuing.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-maroon-600 hover:bg-maroon-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          {isAdding ? <AlertCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAdding ? 'Cancel' : 'Add Book'}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddBook}
            className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 space-y-4"
          >
            <h3 className="font-bold dark:text-white">Add New Book</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input type="text" required placeholder="Title" value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} className="w-full rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500 focus:border-maroon-500" />
              <input type="text" required placeholder="Author" value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} className="w-full rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500 focus:border-maroon-500" />
              <input type="text" required placeholder="ISBN" value={newBook.isbn} onChange={e => setNewBook({...newBook, isbn: e.target.value})} className="w-full rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500 focus:border-maroon-500" />
              <input type="text" placeholder="Category" value={newBook.category} onChange={e => setNewBook({...newBook, category: e.target.value})} className="w-full rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500 focus:border-maroon-500" />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">Save Book</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
            <thead className="bg-gray-50 dark:bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/10">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">Loading catalog...</td></tr>
              ) : books.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">No books found in the library.</td></tr>
              ) : (
                books.map((book: any) => (
                  <tr key={book._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {book.title}<br/><span className="text-xs text-gray-500 font-normal">ISBN: {book.isbn}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{book.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{book.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${book.status === 'available' ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400'}`}>
                        {book.status.toUpperCase()}
                      </span>
                      {book.status === 'issued' && book.issuedTo && (
                        <div className="text-xs text-gray-500 mt-1">
                          to: {book.issuedTo.name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {book.status === 'available' ? (
                        <button onClick={() => handleIssue(book._id)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">Issue</button>
                      ) : (
                        <button onClick={() => handleReturn(book._id)} className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300">Return</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
