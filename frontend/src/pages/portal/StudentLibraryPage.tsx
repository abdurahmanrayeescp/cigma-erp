import { useState, useEffect } from 'react'
import { BookOpen, Search, BookMarked, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'
import { get } from '@/lib/api'

export default function StudentLibraryPage() {
  const { user } = useAuth()
  const [books, setBooks] = useState<any[]>([])
  const [myBooks, setMyBooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true)
      // All catalog
      const catalogRes = await get('/api/library')
      if (catalogRes.success) setBooks(catalogRes.data)

      // My issued books
      if (user?.role === 'STUDENT' && user.referenceId) {
        const myBooksRes = await get(`/api/library/student/${user.referenceId}`)
        if (myBooksRes.success) setMyBooks(myBooksRes.data)
      }
    } catch (err) {
      toast.error('Failed to load library data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-maroon-600" />
          Library Catalog
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Browse books and view your issued items.</p>
      </div>

      {myBooks.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-2xl p-6 shadow-sm border border-indigo-100 dark:border-indigo-500/20">
          <h3 className="font-bold text-lg dark:text-white mb-4 flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            My Issued Books
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myBooks.map(book => (
              <div key={book._id} className="bg-white/80 dark:bg-navy-950/50 backdrop-blur p-4 rounded-xl border border-white/20 dark:border-white/10 flex items-start gap-4">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg">
                  <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{book.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">By {book.author}</p>
                  <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-400 rounded-md">
                    <Calendar className="w-3 h-3" /> Due: {new Date(book.dueDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <h3 className="font-bold dark:text-white mb-4">Complete Catalog</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {loading ? (
            <p className="text-sm text-gray-500">Loading catalog...</p>
          ) : (
            books.map((book: any, idx) => (
              <motion.div 
                key={book._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border border-gray-200 dark:border-white/10 rounded-xl p-4 hover:shadow-md transition-shadow dark:hover:border-white/20"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold px-2 py-1 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded-md">
                    {book.category || 'General'}
                  </span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    book.status === 'available' ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400' 
                    : 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400'
                  }`}>
                    {book.status === 'available' ? 'Available' : 'Issued'}
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white">{book.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">by {book.author}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">ISBN: {book.isbn}</p>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
